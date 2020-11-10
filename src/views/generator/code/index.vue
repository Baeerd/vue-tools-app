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
      <el-dialog v-el-drag-dialog :visible.sync="tableDetailShow" :title="selectedTableName" >
        <el-button class="filter-item" type="success" icon="el-icon-edit" @click="downLoadZip()">
          生成代码
        </el-button>
        <tr>
          <td width="50%">包名：<el-input v-model="packageName"  style="width: 300px;" class="filter-item" /></td>
          <td width="50%">公共字段：
            <el-select ref="select" v-model="entityField" placeholder="请选择" style="width: 300px;">
              <el-option value="0" />
              <el-option value="1" />
              <el-option value="2" />
              <el-option value="3" />
              <el-option value="4" />
              <el-option value="5" />
              <el-option value="6" />
            </el-select>
          </td>
        </tr>
        <tr>
          <td width="50%">序列名：<el-input v-model="insertSeq"  style="width: 300px;" class="filter-item" /></td>
          <td width="50%">去除前缀：<el-input v-model="removeTop" style="width: 300px;" class="filter-item" /></td>
        </tr>

        <el-table :data="tableDetailData">
          <el-table-column property="colName" label="字段名" align="center" />
          <el-table-column property="dbType" label="字段类型" align="center" />
          <el-table-column property="remark" label="字段名称" align="center" />
        </el-table>
      </el-dialog>
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
    import elDragDialog from '@/directive/el-drag-dialog' // base on element-ui

    export default {
        components: { Pagination },
        directives: { elDragDialog },
        data() {
            return {
                tableDetailShow: false,
                tableDetailData:null,

                insertSeq:'',
                packageName:'com.sgai.demo',
                removeTop:'',
                entityField:'6',

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
                    this.list = data.data;
                    this.total = 0;
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
                let params = {
                    'tableName' : this.selectedTableName
                };
                this.$store.dispatch('generator/getTableDetail', params).then((data) => {
                    this.tableDetailData = data.data;
                    this.tableDetailShow = true;
                }).catch(() => {

                })
            },
            onRowClick(row, event, column) {
                this.selectedTableName = row.tableName;
                this.insertSeq = 'SEQ_'+row.tableName;
                this.removeTop = row.tableName.substr(0, row.tableName.indexOf('_')+1);
            },
            downLoadZip() {
                let params = {
                    'tableName' : this.selectedTableName,
                    'insertSeq' : this.insertSeq,
                    'removeTop' : this.removeTop,
                    'packageName' : this.packageName,
                    'tableNameAll' : this.selectedTableName,
                    'entityField' : this.entityField
                };

                this.$store.dispatch('generator/generatorCode', params).then((res) => {
                    const content = res;
                    const blob = new Blob([content],{type:"application/msexcel"})
                    console.log(blob);
                    if ('download' in document.createElement('a')) { // 非IE下载
                        const elink = document.createElement('a')
                        elink.download = this.selectedTableName+'.zip';
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
