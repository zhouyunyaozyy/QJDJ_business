<template>
  <div class="unBusinessClassifyDetail">
    <el-form ref="form" :model="form" label-width="80px" :rules='rules'>
      <el-form-item label="type" prop='redis_type'>
        <el-select v-model="form.redis_type" placeholder="请选择">
          <el-option
            v-for="item in parent_idArr"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="key" prop='key'>
        <el-input v-model="form.key" placeholder="待删除得redis_key"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pwd">
        <el-input v-model="form.pwd" placeholder="密码"></el-input>
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
          key: '',
          redis_type: '',
          pwd: ''
        },
        parent_idArr: [{id: 1, name: '线上'}, {id: 2, name: '运营'}],
        rules: {
          key: [{ required: true, message: '请输入', trigger: 'blur' }],
          pwd: [{ required: true, message: '请输入', trigger: 'blur' }],
          redis_type: [{ required: true, message: '请选择', trigger: 'blur' }]
        }
      }
    },
    created () {
//      if (this.$route.query.parent_id) {
//        if (this.$route.query.type) {
//          this.$axios({
//            type: 'post',
//            url: '/business/categorygetdetailed',
//            data: {business_category_id: this.$route.query.parent_id},
//            fuc: (res) => {
//            this.form = res.data
//        }
//        })
//        }
//        this.$axios({
//          type: 'post',
//          url: '/business/categorygetlist',
//          data: {is_all: 1},
//          fuc: (res) => {
//          this.form.parent_id = parseInt(this.$route.query.parent_id)
//        this.parent_idArr = res.data
//      }
//      })
//      }
    },
    methods: {
      onSubmit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$axios({
                type: 'post',
                url: '/Dispatch/clearRedisByKey',
                data: this.form,
                fuc: (res) => {
                  if (res.code == 200) {
              this.$message.success('操作成功')
            }
//                this.$deleteOneTag('/business/unlineBusinessClassifyList')
          }
          })
          }
        })
      }
    }
  }
</script>
<style scoped="true">
  .unBusinessClassifyDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .unBusinessClassifyDetail>.el-form{
    width: 400px;
    margin: 20px;
  }
</style>
