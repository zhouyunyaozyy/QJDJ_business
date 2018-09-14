<template>
  <div class="pgcPagesDetail">

    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label='标题' prop='title'>
        <el-input v-model="form.title" placeholder='请输入' :maxlength='50'></el-input>
      </el-form-item>
      <el-form-item label='副标题' prop='title_sub'>
        <el-input v-model="form.title_sub" placeholder='请输入' :maxlength='40'></el-input>
      </el-form-item>
      <el-form-item label='创建人id' prop='user_id'>
        <el-input v-model="form.user_id" placeholder='请输入' :maxlength='40'></el-input>
      </el-form-item>
      <el-form-item label='备注'>
        <el-input type='textarea' v-model="form.remark" placeholder='备注'></el-input>
      </el-form-item>
      <el-form-item label='顶部图片'>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeAvatarUploadLogo">
          <img v-if="form.top_img" :src="form.top_img" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button @click='submit'>保存</el-button>
      </el-form-item>
    </el-form>

  </div>

</template>
<script>
  export default {
    data () {
      return {
        form: {
          title: '',
          title_sub: '',
          user_id: '',
          remark: '',
          top_img: '',
          body: ''
        },
        rules: {
          title: [{ required: true, message: '请输入', trigger: 'blur' }],
          user_id: [{ required: true, message: '请输入', trigger: 'blur' }]
        }
      }
    },
    created () {

    },
    methods: {
      beforeAvatarUploadLogo (file) {
        let _this = this
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
          _this.form.top_img = this.result // 这个就是base64编码了
        }
        return false
      },
      submit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {

          }
        })
      }
    }
  }

</script>
<style scoped="true">
  .pgcPagesDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .pgcPagesDetail>.el-form .el-input{
    max-width: 400px;
  }
  .pgcPagesDetail>.el-form .el-textarea{
    max-width: 400px;
  }
</style>
<style>
.avatar-uploader .el-upload {
border: 1px dashed #d9d9d9;
border-radius: 6px;
cursor: pointer;
position: relative;
overflow: hidden;
}
.avatar-uploader .el-upload:hover {
border-color: #409EFF;
}
.avatar-uploader-icon {
font-size: 28px;
color: #8c939d;
width: 178px;
height: 178px;
line-height: 178px;
text-align: center;
}
.avatar {
width: 178px;
height: 178px;
display: block;
}
</style>
