<template>
  <div class="goodsPackagesDetail">

    <el-form ref="form" :model="form" label-width="150px" :rules='rules'>
      <code>基本信息</code>
      <el-form-item label='代金券名称' prop='package_name'>
        <el-input v-model="form.package_name" placeholder='请输入代金券名称' :maxlength='50'></el-input>
      </el-form-item>
      <el-form-item label='代金券标签'>
        <el-input v-model="form.package_tag" placeholder='请输入代金券标签' :maxlength='30'></el-input>
      </el-form-item>
      <el-form-item label='结算方式' prop='transfer_type'>
        <el-radio v-model="form.transfer_type" :label="0">价格结算</el-radio>
        <el-radio v-model="form.transfer_type" :label="1">比例结算</el-radio>
      </el-form-item>
      <el-form-item label='代金券结算价' prop='transfer_cash' v-if='form.transfer_type === 0'>
        <el-input v-model="form.transfer_cash" placeholder='请输入代金券结算价' :maxlength='20'></el-input>
      </el-form-item>
      <el-form-item label='代金券结算比例' prop='transfer_ratio' v-else-if='form.transfer_type === 1'>
        <el-input v-model="form.transfer_ratio" placeholder='请输入代金券结算比例' :maxlength='20'></el-input>
      </el-form-item>
      <el-form-item label='代金券售价' prop='price'>
        <el-input v-model="form.price" placeholder='请输入代金券售价'></el-input>
      </el-form-item>
      <el-form-item label='可用时间'>
        <el-input type='textarea' v-model="form.enable_time" placeholder='请输入可用时间'></el-input>
      </el-form-item>
      <el-form-item label='购买截至时间' prop='expire_time'>
        <el-date-picker
          v-model="form.expire_time"
          type="date" :picker-options="pickerOptions0" @change='expire_timeChange'
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label='使用截至时间' prop='use_time'>
        <el-date-picker
          v-model="form.use_time"
          type="date" :picker-options="pickerOptions1"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label='库存' prop='num'>
        <el-input v-model="form.num" placeholder='请输入套餐库存'></el-input>
      </el-form-item>
      <el-form-item label='不可用时间' prop='unable_time'>
        <el-input type='textarea' v-model="form.unable_time" placeholder='请输入不可用时间'></el-input>
      </el-form-item>
      <el-form-item label='温馨提示' prop='package_desc'>
        <el-input type='textarea' v-model="form.package_desc" :maxlength='500' placeholder='请输入温馨提示'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">保存并上架</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        form: {
          package_name: '',
          package_tag: '',
          transfer_type: '',
          transfer_cash: '',
          transfer_ratio: '',
          price: '',
          enable_time: '',
          expire_time: '',
          use_time: '',
          num: '',
          unable_time: '',
          package_desc: ''
        },
        rules: {
          package_name: [{ required: true, message: '请输入代金券名称', trigger: 'blur' }],
          transfer_type: [{ required: true, message: '请选择结算方式', trigger: 'blur' }],
          transfer_cash: [{ required: true, message: '请输入结算价', trigger: 'blur' }],
          transfer_ratio: [{ required: true, message: '请输入结算比例', trigger: 'blur' }],
          price: [{ required: true, message: '请输入售价', trigger: 'blur' }],
          expire_time: [{ required: true, message: '请选择日期', trigger: 'blur' }],
          use_time: [{ required: true, message: '请选择日期', trigger: 'blur' }],
          num: [{ required: true, message: '请输入库存', trigger: 'blur' }],
          unable_time: [{ required: true, message: '请输入不可用时间', trigger: 'blur' }],
          package_desc: [{ required: true, message: '请输入温馨提示', trigger: 'blur' }]
        },
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now();
          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            if (this.form.expire_time) {
              return time.getTime() < this.form.expire_time.getTime()
            }
            return time.getTime() < Date.now()
          }
        }
      }
    },
    created () {
      
    },
    methods: {
      expire_timeChange () {
        this.form.use_time = ""
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
  .goodsPackagesDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .goodsPackagesDetail>.el-form .el-input{
    max-width: 400px;
  }
  .goodsPackagesDetail>.el-form .el-textarea{
    max-width: 400px;
  }
</style>
