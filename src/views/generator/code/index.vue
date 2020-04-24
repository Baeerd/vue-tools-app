<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="搜索表名..." style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" type="success" icon="el-icon-edit" @click="handleFilter">
        生成代码
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      row-style="height:35px"
      cell-style="padding:0"
    >
      <el-table-column label="序号" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
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
                tableKey: 0,
                list: null,
                total: 50,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 20,
                    importance: undefined,
                    title: '',
                    type: undefined,
                    sort: '+id'
                },
                importanceOptions: [1, 2, 3],
                // calendarTypeOptions,
                sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
                statusOptions: ['published', 'draft', 'deleted'],
                showReviewer: false,
                temp: {
                    id: undefined,
                    importance: 1,
                    remark: '',
                    timestamp: new Date(),
                    title: '',
                    type: '',
                    status: 'published'
                },
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: 'Edit',
                    create: 'Create'
                },
                dialogPvVisible: false,
                pvData: [],
                rules: {
                    type: [{ required: true, message: 'type is required', trigger: 'change' }],
                    timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
                    title: [{ required: true, message: 'title is required', trigger: 'blur' }]
                },
                downloadLoading: false
            }
        },
        created() {
            this.getList()
        },
        methods: {
            getList() {
                this.listLoading = true;
                this.$store.dispatch('generator/getTables').then((data) => {
                    this.list = data.data;
                    this.listLoading = false;
                }).catch(() => {
                    this.listLoading = true
                })
            },
            handleFilter() {
                this.listQuery.page = 1
                this.getList()
            },
            handleModifyStatus(row, status) {
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
                row.status = status
            },
            sortChange(data) {
                const { prop, order } = data
                if (prop === 'id') {
                    this.sortByID(order)
                }
            },
            sortByID(order) {
                if (order === 'ascending') {
                    this.listQuery.sort = '+id'
                } else {
                    this.listQuery.sort = '-id'
                }
                this.handleFilter()
            },
            resetTemp() {
                this.temp = {
                    id: undefined,
                    importance: 1,
                    remark: '',
                    timestamp: new Date(),
                    title: '',
                    status: 'published',
                    type: ''
                }
            },
            handleDelete(row) {
                this.$notify({
                    title: '成功',
                    message: '删除成功',
                    type: 'success',
                    duration: 2000
                })
                const index = this.list.indexOf(row)
                this.list.splice(index, 1)
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                    if (j === 'timestamp') {
                        return parseTime(v[j])
                    } else {
                        return v[j]
                    }
                }))
            },
            getSortClass: function(key) {
                const sort = this.listQuery.sort
                return sort === `+${key}`
                    ? 'ascending'
                    : sort === `-${key}`
                        ? 'descending'
                        : ''
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
