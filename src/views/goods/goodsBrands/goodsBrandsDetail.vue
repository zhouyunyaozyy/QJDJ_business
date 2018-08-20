<template>
  <div class="goodsBrandsDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label="品牌名称" prop='brand_name'>
        <el-input v-model="form.brand_name" placeholder='请填写品牌名称'></el-input>
      </el-form-item>
      <el-form-item label="品牌首字母" prop='initial'>
        <el-input v-model="form.initial" placeholder='请填写品牌首字母'></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" prop='logo_url'>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeAvatarUploadLogo">
          <img v-if="form.logo_url" :src="form.logo_url" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        form: {
          brand_name: '',
          initial: '',
          logo_url: ''
        },
        rules: {
          brand_name: [{ required: true, message: '请填写品牌名称', trigger: 'blur' }],
          initial: [{ required: true, message: '请填写品牌首字母', trigger: 'blur' }],
          logo_url: [{ required: true, message: '请上传品牌LOGO', trigger: 'blur' }]
        },
      }
    },
    created () {
      if (this.$route.query.bid) {
        this.$axios({
          type: 'post',
          url: '/goods/brand/editinfo',
          data: {bid: this.$route.query.bid},
          fuc: (res) => {
            this.form = res.data
            this.form.logo_url = this.form.logo_path + this.form.logo_url
          }
        })
      }
    },
    methods: {
      onSubmit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let _form = JSON.parse(JSON.stringify(this.form))
            
            if (_form.logo_path && _form.logo_url.indexOf(_form.logo_path) > -1) {
              _form.logo_url = _form.logo_url.split(_form.logo_path)[1]
            }
            this.$axios({
              type: 'post',
              url: _form.bid ? '/goods/brand/edit' : '/goods/brand/insert',
              data: _form,
              fuc: (res) => {
                this.$deleteOneTag('/goods/goodsBrandsList')
              }
            })
          }
        })
      },
      beforeAvatarUploadLogo (file) {
        let _this = this
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){ 
          _this.form.logo_url = this.result // 这个就是base64编码了
        }
        return false
      }
    }
  }
</script>
<style scoped="true">
  .goodsBrandsDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .goodsBrandsDetail>.el-form{
    width: 400px;
    margin: 20px;
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