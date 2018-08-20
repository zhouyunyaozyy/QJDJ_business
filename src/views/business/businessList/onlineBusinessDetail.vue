<template>
  <div class="onlineBusinessDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item>
        <span>认证信息</span>
      </el-form-item>
      <el-form-item label="营业执照" prop='license'>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload">
          <img v-if="form.license" :src="form.license" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="商家名称" prop='name'>
        <el-input v-model="form.name" placeholder='请输入商家名称'></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop='operator'>
        <el-input v-model="form.operator" placeholder='请输入联系人'></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop='mobile'>
        <el-input v-model="form.mobile" placeholder='请输入联系电话'></el-input>
      </el-form-item>
      <el-form-item label="固定电话" prop='tel'>
        <el-input v-model="form.tel" placeholder='请输入固定电话'></el-input>
      </el-form-item>
      <el-form-item label="短信通知电话" prop='sms_mobile'>
        <el-input v-model="form.sms_mobile" placeholder='短信通知电话'></el-input>
      </el-form-item>
      <el-form-item label="开户银行账户" prop='bank_account'>
        <el-input v-model="form.bank_account" placeholder='请输入开户银行账户'></el-input>
      </el-form-item>
      <el-form-item label="开户银行名称" prop='bank_name'>
        <el-input v-model="form.bank_name" placeholder='请输入开户银行名称'></el-input>
      </el-form-item>
      <el-form-item label="开户银行网点" prop='bank_network'>
        <el-input v-model="form.bank_network" placeholder='请输入开户银行网点'></el-input>
      </el-form-item>
      <el-form-item label="支付宝账号" prop='ali_account'>
        <el-input v-model="form.ali_account" placeholder='请输入支付宝账号'></el-input>
      </el-form-item>
      <el-form-item label="支付宝姓名" prop='ali_username'>
        <el-input v-model="form.ali_username" placeholder='请输入支付宝姓名'></el-input>
      </el-form-item>
      <el-form-item label="收货人姓名" prop='receiv_name'>
        <el-input v-model="form.receiv_name" placeholder='请输入支付宝姓名'></el-input>
      </el-form-item>
      <el-form-item label="收货人地址" prop='receiv_addr'>
        <el-input v-model="form.receiv_addr" placeholder='请输入支付宝姓名'></el-input>
      </el-form-item>
      <el-form-item>
        <span>线上商家</span>
      </el-form-item>
      <el-form-item label="对应类目" prop='category_id'>
        <el-select multiple v-model='form.category_id' placeholder='请选择对应类目'>
          <el-option v-for='item in categoryList' :label='item.c_name' :key='item.cid' :value='item.cid'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="logo" prop='logo'>
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
        <el-button type="danger" @click="resetBusinessPwd" v-if='form.business_id'>重置密码</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
//        center: {lng: 0, lat: 0},
//        zoom: 3,
        categoryList: [],
        form: {
          license: '',
          name: '',
          operator: '',
          mobile: '',
          tel: '',
          bank_account: '',
          bank_name: '',
          bank_network: '',
          ali_account: '',
          ali_username: '',
          category_id: [],
          logo: '',
          receiv_name: '',
          receiv_addr: '',
          sms_mobile: ''
        },
        rules: {
//          license: [{ required: true, message: '请上传营业执照', trigger: 'blur' }],
          name: [{ required: true, message: '请输入商家名称', trigger: 'blur' }],
          receiv_name: [{ required: true, message: '请输入收货人名称', trigger: 'blur' }],
          receiv_addr: [{ required: true, message: '请输入收货人名称', trigger: 'blur' }],
          operator: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
          mobile: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
          sms_mobile: [{ required: true, message: '请输入短信通知电话', trigger: 'blur' }],
          tel: [{ required: true, message: '请输入固定电话', trigger: 'blur' }],
//          bank_account: [{ required: true, message: '请输入银行账号', trigger: 'blur' }],
//          bank_name: [{ required: true, message: '请输入银行名称', trigger: 'blur' }],
//          bank_network: [{ required: true, message: '请输入银行网点', trigger: 'blur' }],
//          ali_account: [{ required: true, message: '请输入支付宝账号', trigger: 'blur' }],
//          ali_username: [{ required: true, message: '请输入支付宝姓名', trigger: 'blur' }],
          category_id: [{ required: true, message: '请输入对应类目', trigger: 'blur' }],
          logo: [{ required: true, message: '请上传logo', trigger: 'change' }]
        }
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/goods/category/getinfo',
        data: {},
        fuc: (res) => {
          this.categoryList = res.data
        }
      })
      
      if (this.$route.query.business_id) {
        this.$axios({
          type: 'post',
          url: '/business/getdetailed',
          data: {business_id: this.$route.query.business_id},
          fuc: (res) => {
            this.form = res.data
            this.form.logo = res.data.logo_path + res.data.logo
            this.form.license = res.data.license_path + res.data.license
            this.form.category_id = this.form.category_id.slice(1, this.form.category_id.length - 1).split(',')
            let arr = []
            for (let val of this.form.category_id) {
              arr.push(parseInt(val))
            }
            this.form.category_id = arr
            console.log(1, this.form)
            this.form.business_id = this.$route.query.business_id
          }
        })
      }
    },
    mounted () {
      console.log('ready')
      window.addEventListener('message', function(event) {
        // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
        var loc = event.data;
        if (loc && loc.module == 'locationPicker') {//防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
          console.log('location', loc);
        }
      }, false);
    },
    methods: {
      onSubmit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let _form = JSON.parse(JSON.stringify(this.form))
            if (_form.logo.indexOf(_form.logo_path) > -1) {
              _form.logo = _form.logo.split(_form.logo_path)[1]
            }
            if (_form.license.indexOf(_form.license_path) > -1) {
              _form.license = _form.license.split(_form.license_path)[1]
            }
            _form.category_id = ',' + _form.category_id.join(',') + ','
            this.$axios({
              type: 'post',
              url: this.$route.query.business_id ? '/business/edit' : '/business/add',
              data: _form,
              fuc: (res) => {
                this.$deleteOneTag('/business/onlineBusinessList')
              }
            })
          }
        })
//        this.$deleteOneTag('/business/onlineBusinessList')
      },
      beforeAvatarUpload (file) {
        let _this = this
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){ 
          _this.form.license = this.result // 这个就是base64编码了
        }
        return false
      },
      resetBusinessPwd () {
        this.$axios({
          type: 'post',
          url: '/business/setpassword',
          data: {
            business_id: this.form.business_id,
            password: '123456'
          },
          fuc: (res) => {
            if (res.code == 200) {
              this.$message.success('重置密码成功')
            }
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
  .onlineBusinessDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .onlineBusinessDetail>.el-form{
    width: 400px;
    margin: 20px;
  }
  .map {
    width: 100%;
    height: 300px;
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