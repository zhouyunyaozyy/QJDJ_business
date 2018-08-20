<template>
  <div class="unBusinessClassifyDetail">
    <el-form ref="form" :model="form" label-width="80px" :rules='rules'>
      <el-form-item label="类目名称" prop='name'>
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="上级分类" prop='parent_id' v-if='form.parent_id'>
        <el-select v-model="form.parent_id" placeholder="请选择" disabled>
          <el-option
            v-for="item in parent_idArr"
            :key="item.business_category_id"
            :label="item.name"
            :value="item.business_category_id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序">
        <el-input v-model="form.sort" :maxlength='2'></el-input>
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
          name: '',
          parent_id: 0,
          sort: ''
        },
        parent_idArr: [],
        rules: {
          name: [{ required: true, message: '请输入类目名称', trigger: 'blur' }],
          parent_id: [{ required: true, message: '请选择', trigger: 'blur' }]
        }
      }
    },
    created () {
      if (this.$route.query.parent_id) {
        if (this.$route.query.type) {
          this.$axios({
            type: 'post',
            url: '/business/categorygetdetailed',
            data: {business_category_id: this.$route.query.parent_id},
            fuc: (res) => {
              this.form = res.data
            }
          })
        }
        this.$axios({
          type: 'post',
          url: '/business/categorygetlist',
          data: {is_all: 1},
          fuc: (res) => {
            this.form.parent_id = parseInt(this.$route.query.parent_id)
            this.parent_idArr = res.data
          }
        })
      }
    },
    methods: {
      onSubmit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$axios({
              type: 'post',
              url: this.$route.query.type ? '/business/categoryedit' : '/business/categoryadd',
              data: this.form,
              fuc: (res) => {
                this.$deleteOneTag('/business/unlineBusinessClassifyList')
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