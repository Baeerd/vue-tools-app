<template>
  <div class="app-container">
    <el-form ref="form" label-width="120px">
      <el-form-item label="源模板">
        <el-input v-model="beforeTmp" type="textarea" />
      </el-form-item>
      <el-form-item label="目标模板">
        <el-input v-model="afterTmp" type="textarea" />
      </el-form-item>
      <el-form-item label="内容" class="formatArea">
        <el-input v-model="content" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">转换</el-button>
        <el-button @click="onCancel">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {formatText} from '../../store/formatTxt/format.js';
export default {
  data() {
    return {
      beforeTmp: '',
      afterTmp: '',
      content: ''
    }
  },
  methods: {
    onSubmit() {
      if (!this.beforeTmp || !this.afterTmp || !this.content) return
      this.content = formatText(this.content, this.beforeTmp, this.afterTmp);
      this.$message({
        message: '生成成功',
        type: 'success'
      })
    },
    onCancel() {
      this.content = '';
      this.beforeTmp = '';
      this.afterTmp = '';
      this.$message({
        message: '清空成功',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.line{
  text-align: center;
}
</style>

