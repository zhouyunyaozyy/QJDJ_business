<template>
  <div class="tombacDetail">
    <el-form ref="form" :model="form" label-width="200px" :rules='rules'>
      <el-form-item>
        <h3>每日用户可发起次数</h3>
      </el-form-item>
      <el-form-item label="发起者最多发起次数" prop='share_times'>
        <el-input v-model="form.share_times" placeholder='请输入' :maxlength='20' :disabled='editBool'></el-input>
      </el-form-item>
      <el-form-item>
        <h3>每日用户最多参与次数</h3>
      </el-form-item>
      <el-form-item label="参与者最多参与次数" prop='join_times'>
        <el-input v-model="form.join_times" placeholder='请输入' :maxlength='20' :disabled='editBool'></el-input>
      </el-form-item>
      <el-form-item>
        <h3>活动持续时间</h3>
      </el-form-item>
      <el-form-item label="分钟数" prop='end_time'>
        <el-input v-model="form.end_time" placeholder='请输入' :maxlength='20' :disabled='editBool'></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click='editBool = false' v-if='editBool'>编辑</el-button>
        <el-button @click='saveTombac' v-if='!editBool'>保存</el-button>
        <el-button @click='cancleEdit' v-if='!editBool'>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        form: {
          share_times: '',
          join_times: '',
          end_time: ''
        },
        rules: {
          share_times: [{ required: true, message: '请输入', trigger: 'blur' }],
          join_times: [{ required: true, message: '请输入', trigger: 'blur' }],
          end_time: [{ required: true, message: '请输入', trigger: 'blur' }]
        },
        editBool: true
      }
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.$axios({
          type: 'post',
          url: '/System/getsharetime',
          data: {},
          fuc: (res) => {
            console.log(res)
            if (res.data.length < 1) {
//              let arr = []
//              for (let val in this.form) {
//                arr.push({name: val, value: this.form[val]})
//              }
//              this.$axios({
//                type: 'post',
//                url: '/currency/copperRuleCreate',
//                data: {copper_rule: JSON.stringify(arr)},
//                fuc: (result) => {
//                  console.log('result', result)
//                }
//              })
            } else {
              for (let val of res.data) {
                this.form[val.name] = val.value
              }
            }
          }
        })
      },
      saveTombac () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$axios({
              type: 'post',
              url: '/System/setsharetime',
              data: this.form,
              fuc: (result) => {
                console.log('result', result)
                if (result.code == 200) {
                  this.$message.success('编辑成功')
                  this.editBool = true
                }
              }
            })
          }
        })
      },
      cancleEdit () {
        this.init()
        this.editBool = true
      }
    }
  }
</script>
<style scoped="true">
  .tombacDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .tombacDetail form{
    margin: 20px;
  }
  .tombacDetail form .el-input{
    width: 100px;
  }
  .tombacDetail form pre{
    width: 100%;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style>
