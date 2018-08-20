<template>
  <div class="goodsBrandsDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label="类目名称" prop='c_name'>
        <el-input v-model="form.c_name" placeholder='请填写品牌名称'></el-input>
      </el-form-item>
      <el-form-item label="上级分类" prop='parent_id' v-if='level == 2'>
        <el-select v-model="form.parent_id" disabled>
          <el-option v-for='item in categoryArr' :label='item.c_name' :value='item.cid' :key='item.cid'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="form.seq" placeholder='不输入则默认99' :maxlength='2'></el-input>
      </el-form-item>
      <el-form-item prop='logo' v-if='level == 2'>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeAvatarUploadLogo">
          <img v-if="form.logo" :src="form.logo" class="avatar">
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
          c_name: '',
          parent_id: '',
          seq: '',
          logo: ''
        },
        level: '',
        categoryArr: [],
        rules: {
          c_name: [{ required: true, message: '请填写类目名称', trigger: 'blur' }],
          parent_id: [{ required: true, message: '请选择', trigger: 'change' }],
          logo: [{ required: true, message: '请上传图片', trigger: 'blur' }]
        },
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/goods/category/getinfo',
        data: {},
        fuc: (res) => {
          this.categoryArr = res.data
        }
      })
      this.level = this.$route.query.level
      if (this.$route.query.parent_id) {
        this.form.parent_id = this.$route.query.parent_id
//        this.$axios({
//          type: 'post',
//          url: '/goods/brand/editinfo',
//          data: {bid: this.$route.query.bid},
//          fuc: (res) => {
//            this.form = res.data
//            this.form.logo = this.form.logo_path + this.form.logo
//          }
//        })
      }
      if (this.$route.query.cid) {
        this.$axios({
          type: 'post',
          url: '/goods/category/editinfo',
          data: {cid: this.$route.query.cid},
          fuc: (res) => {
            this.form = res.data
            this.form.logo = res.data.logo_path + res.data.logo
          }
        })
      }
    },
    methods: {
      onSubmit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let _form = JSON.parse(JSON.stringify(this.form))
            
            if (_form.logo_path && _form.logo.indexOf(_form.logo_path) > -1) {
              _form.logo = _form.logo.split(_form.logo_path)[1]
            }
            this.$axios({
              type: 'post',
              url: _form.cid ? '/goods/category/edit' : '/goods/category/insert',
              data: _form,
              fuc: (res) => {
                if (res.code == 200) {
                  this.$message.success('操作成功')
                  this.level == 1 ? this.$deleteOneTag('/goods/goodsClassifyList') : this.$deleteOneTag('/goods/goodsClassifySecondList', {parent_id: this.form.parent_id})
                }
                
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
          _this.form.logo = this.result // 这个就是base64编码了
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