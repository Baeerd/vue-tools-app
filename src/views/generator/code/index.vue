<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.tableName" placeholder="搜索表名..." style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" type="success" icon="el-icon-edit" @click="generatorCode()">
        生成代码
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :cell-style="cellStyle"
      ref="singleTable"
      @row-click="onRowClick"
    >
      <el-table-column label="序号" prop="id" align="center" width="80" >
        <template slot-scope="scope">
          <span> {{ scope.$index +1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.tableName }}
        </template>
      </el-table-column>
      <el-table-column label="最后修改时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.lastAnalyzed }}
        </template>
      </el-table-column>
      <el-table-column label="数据量" align="center">
        <template slot-scope="scope">
          {{ scope.row.numRows }}
        </template>
      </el-table-column>
      <el-table-column label="所属用户" align="center">
        <template slot-scope="scope">
          {{ scope.row.tablespaceName }}
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

  </div>
</template>

<script>
    import Pagination from '@/components/Pagination' // secondary package based on el-pagination
    export default {
        components: { Pagination },
        data() {
            return {
                list: null,
                total: 0,
                listLoading: true,
                selectedTableName : '',
                listQuery: {
                    page: 1,
                    limit: 15,
                    tableName: ''
                }
            }
        },
        created() {
            this.getList()
        },
        methods: {
            getList() {
                this.listLoading = true;
                let params = {
                    'pageNum' : this.listQuery.page,
                    'pageSize' : this.listQuery.limit,
                    'tableName' : this.listQuery.tableName
                };
                this.$store.dispatch('generator/getTables', params).then((data) => {
                    this.list = data.data.list;
                    this.total = data.data.total;
                    this.listLoading = false;
                }).catch(() => {
                    this.listLoading = true
                })
            },
            cellStyle(row, index) {
              return 'height: 35px;padding: 0;';
            },
            handleFilter() {
                this.listQuery.page = 1;
                this.getList()
            },
            generatorCode() {
                this.listLoading = true;
                let fileName = this.selectedTableName;
                this.$store.dispatch('generator/generatorCode', this.selectedTableName).then((res) => {
                    const content = res
                    const blob = new Blob([content],{type:"application/zip"})
                    fileName = fileName+'.zip'
                    if ('download' in document.createElement('a')) { // 非IE下载
                        const elink = document.createElement('a')
                        elink.download = fileName
                        elink.style.display = 'none'
                        elink.href = window.URL.createObjectURL(blob)
                        document.body.appendChild(elink)
                        elink.click()
                        window.URL.revokeObjectURL(elink.href) // 释放URL 对象
                        document.body.removeChild(elink)
                    } else { // IE10+下载
                        navigator.msSaveBlob(blob, fileName)
                    }
                    this.listLoading = false;
                }).catch(() => {
                    this.listLoading = true
                })
            },
            onRowClick(row, event, column) {
                this.selectedTableName = row.tableName;
            }
        }
    }
</script>
<style scoped>
  .filter-container {
    padding-bottom: 10px;
  }
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
</style>
