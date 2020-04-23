<template>
  <div class="app-container">

    <div class="filter-container">
      <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".ftl" @change="handleClick">
      <el-button v-if="existFile" :loading="loading" class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-edit" @click="uploadFile()">
        上传模板[{{fileName}}]
      </el-button>
      <el-button v-else class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="modifyFile()">
        修改模板
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中..."
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index +1 }}
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="scope">
          {{ scope.row.fileName }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="success" size="mini" @click="downLoad(row.fileName)">
            下载
          </el-button>
          <el-button size="mini" @click="browseFile(row,'published')">
            预览
          </el-button>
        </template>
      </el-table-column>

    </el-table>

  </div>

</template>

<script>
import $ from 'jquery'
export default {

  data() {
    return {
      list: null,
      listLoading: true,
      loading : false,
      fileName : '',
      existFile : false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      this.$store.dispatch('generator/getConfigData').then((data) => {
          this.list = data.data;
          this.listLoading = false;
      }).catch(() => {
          this.listLoading = true
      })
    },
      // 下载模板
    downLoad(fileName) {
        this.$store.dispatch('generator/downLoadTemplate', fileName).then((res) => {
            const content = res
            const blob = new Blob([content])
            if ('download' in document.createElement('a')) { // 非IE下载
                const elink = document.createElement('a')
                elink.download = fileName
                elink.style.display = 'none'
                elink.href = URL.createObjectURL(blob)
                document.body.appendChild(elink)
                elink.click()
                URL.revokeObjectURL(elink.href) // 释放URL 对象
                document.body.removeChild(elink)
            } else { // IE10+下载
                navigator.msSaveBlob(blob, fileName)
            }
        });
    },
    // 修改
    modifyFile(row) {
        this.$refs['excel-upload-input'].click();
    },
    // 预览
    browseFile(fileName) {
      alert("TODO: 预览模板");
    },
    handleClick(e) {
        console.log("11111");
        const files = e.target.files
        const rawFile = files[0];
        if (!rawFile) return;
        if(this.$refs['excel-upload-input'].value) {
            this.fileName = this.$refs['excel-upload-input'].value;
            this.existFile=true;
        }
    },
    // 上传
    uploadFile(row) {
        let file = this.$refs['excel-upload-input'].files[0];
        this.$refs['excel-upload-input'].value = null

        var formData = new FormData();
        formData.append('file', file);

        this.loading = true;
        let me = this;

        let message = this.$message;

        $.ajax({
            url: process.env.VUE_APP_BASE_API +'/generator/fileUpload',
            type: "post",
            data: formData ,
            processData: false,
            contentType: false,
            success: function(res) {
                if(res.success == true) {
                    me.loading = false;
                    me.fileName = '';
                    me.existFile = false;
                    message({
                        message: '上传成功!',
                        type: 'success'
                    })
                } else {
                    me.loading = false;
                    me.fileName = '';
                    me.existFile = false;
                    message({
                        message: res.data,
                        type: 'error'
                    })
                }
            },
            error: function(error){
                me.loading = false;
                me.fileName = '';
                me.existFile = false;
                message({
                    message: error.data,
                    type: 'success'
                })
            }
        });
    }
  }
}
</script>
<style scoped>
  .excel-upload-input{
    display: none;
    z-index: -9999;
  }
  .drop{
    border: 2px dashed #bbb;
    width: 600px;
    height: 160px;
    line-height: 160px;
    margin: 0 auto;
    font-size: 24px;
    border-radius: 5px;
    text-align: center;
    color: #bbb;
    position: relative;
  }
  .filter-container {
    padding-bottom: 10px;
  }
  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
</style>
