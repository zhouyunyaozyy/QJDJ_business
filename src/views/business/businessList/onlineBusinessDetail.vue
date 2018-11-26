<template>
  <div class="onlineBusinessDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label="商家行业" prop='trade'>
        <el-input v-model="form.trade" placeholder='请输入商家行业'></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop='userName'>
        <el-input v-model="form.userName" placeholder='请输入用户名'></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop='phone'>
        <el-input v-model="form.phone" placeholder='请输入联系电话'></el-input>
      </el-form-item>
      <el-form-item label="紧急联系电话" prop='urgentPhone'>
        <el-input v-model="form.urgentPhone" placeholder='请输入紧急联系电话'></el-input>
      </el-form-item>
      <el-form-item label="QQ" prop='qq'>
        <el-input v-model="form.qq" placeholder='QQ'></el-input>
      </el-form-item>
      <el-form-item label="微信" prop='weixin'>
        <el-input v-model="form.weixin" placeholder='请输入微信'></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" placeholder='请输入邮箱'></el-input>
      </el-form-item>
      <el-form-item label="旺旺号">
        <el-input v-model="form.wangwang" placeholder='请输入旺旺号'></el-input>
      </el-form-item>
      <el-form-item label="淘宝店铺">
        <el-input v-model="form.taobao" placeholder='请输入淘宝店铺'></el-input>
      </el-form-item>
      <el-form-item label="企业名称">
        <el-input v-model="form.companyName" placeholder='请输入企业名称'></el-input>
      </el-form-item>
      <el-form-item label="服务原则">
        <el-input v-model="form.serviceContent" placeholder='请输入服务原则'></el-input>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="form.address" placeholder='请输入地址'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
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
        form: {
          trade: '',
          userName: '',
          phone: '',
          urgentPhone: '',
          weixin: '',
          email: '',
          wangwang: '',
          taobao: '',
          companyName: '',
          serviceContent: '',
          address: '',
          qq: ''
        },
        rules: {
          trade: [{ required: true, message: '请输入商家行业', trigger: 'blur' }],
          serviceContent: [{ required: true, message: '请输入收货人名称', trigger: 'blur' }],
          address: [{ required: true, message: '请输入收货人名称', trigger: 'blur' }],
          userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
          phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
          qq: [{ required: true, message: '请输入qq', trigger: 'blur' }],
          urgentPhone: [{ required: true, message: '请输入紧急联系电话', trigger: 'blur' }],
//          weixin: [{ required: true, message: '请输入银行账号', trigger: 'blur' }],
//          email: [{ required: true, message: '请输入银行名称', trigger: 'blur' }],
//          wangwang: [{ required: true, message: '请输入银行网点', trigger: 'blur' }],
//          taobao: [{ required: true, message: '请输入支付宝账号', trigger: 'blur' }],
//          companyName: [{ required: true, message: '请输入支付宝姓名', trigger: 'blur' }],
        }
      }
    },
    created () {
        this.$axios({
          type: 'get',
          url: '/shop-user/info',
          data: {},
          fuc: (res) => {
            for (let val in this.form) {
              if (res[val]) {
                this.form[val] = res[val]
              }
            }
//            this.form = res.data
//            this.form.business_id = this.$route.query.business_id
          }
        })
    },
    mounted () {
    },
    methods: {
      onSubmit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let _form = JSON.parse(JSON.stringify(this.form))
            this.$axios({
              type: 'post',
              url: '/shop-user/edit',
              data: _form,
              fuc: (res) => {
                this.$message.success('操作成功')
//                this.$deleteOneTag('/business/onlineBusinessList')
              }
            })
          }
        })
//        this.$deleteOneTag('/business/onlineBusinessList')
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