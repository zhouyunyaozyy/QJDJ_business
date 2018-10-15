<template>
  <div class="indexSlideshowDetail">
    <el-form ref="form" :model="form" label-width="140px" :rules='rules'>
      <el-form-item label='商品编码' prop='goods_no'>
        <el-input placeholder='请输入商品编码' v-model='form.goods_no' :disabled="editBool"></el-input>
        <p>{{name}}</p>
        <el-button @click='goods_noSure' :disabled='editBool'>确认</el-button>
      </el-form-item>
      <el-form-item label='选择类别' prop='game_category_id' v-if='businessSureBool'>
        <el-select v-model='form.game_category_id' placeholder="请选择" clearable>
          <el-option
            v-for='item in businesscategories'
            :label="item.name"
            :value="item.id + ''"
            :key="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='排序' prop='game_sort' v-if='businessSureBool'>
        <el-input placeholder='请输入排序' v-model='form.game_sort'></el-input>
      </el-form-item>
      <el-form-item label='数字区间' prop='game_num_section' v-if='businessSureBool'>
        <el-input placeholder='请输入数字区间' v-model='form.game_num_section'></el-input>
        <span>此处发起者摇中的数字，数字区间以,为区分</span>
      </el-form-item>
      <el-form-item label='参与者概率（赢）' prop='pk_win_chance' v-if='businessSureBool'>
        <el-input placeholder='请输入1-100整数' v-model='form.pk_win_chance'></el-input>
        <span>此处为参与PK者赢的概率</span>
      </el-form-item>
      <el-form-item :label="item.name" v-for="item in form.benefit_data" :key="item.benefit_level" v-if='businessSureBool' required>
        <el-radio-group v-model="item.benefit_type" @change="item.benefit_value = ''">
          <el-radio :label="1">优惠</el-radio>
          <el-radio :label="2">金贝</el-radio>
        </el-radio-group>
        <el-input v-model='item.benefit_value' style="width: 100px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click='submit' v-if='businessSureBool'>保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        form: {
          game_category_id: '',
          game_sort: '',
          game_num_section: '',
          pk_win_chance: '',
          goods_no: '',
          benefit_data: [
            {"benefit_level" : 1,
              "benefit_type" : 1,
              "benefit_value" : '',
              "name" : "优惠策略一"},
            {"benefit_level" : 2,
              "benefit_type" : 1,
              "benefit_value" : '',
              "name" : "优惠策略二"},
            {"benefit_level" : 3,
              "benefit_type" : 1,
              "benefit_value" : '',
              "name" : "优惠策略三"},
            {"benefit_level" : 4,
              "benefit_type" : 1,
              "benefit_value" : '',
              "name" : "优惠策略四"},
            {"benefit_level" : 5,
              "benefit_type" : 1,
              "benefit_value" : '',
              "name" : "优惠策略五"}
          ]
        },
        name: '',
        businesscategories: [],
        businessSureBool: false,
        editBool: false,
        rules: {
          game_category_id: [{ required: true, message: '请选择', trigger: 'blur' }],
          goods_no: [{ required: true, message: '请输入', trigger: 'blur' }],
          game_sort: [{ required: true, message: '请输入', trigger: 'blur' }],
          game_num_section: [{ required: true, message: '请输入', trigger: 'blur' }],
          pk_win_chance: [{ required: true, message: '请输入', trigger: 'blur' }],
        }
      }
    },
    created () {
      this.getOperation_area_category_idArr()
      if (this.$route.query.id) {
        this.editBool = true
        this.$axios({
            type: 'post',
            url: '/game/goodsdetail',
            data: {goods_id: this.$route.query.id},
            fuc: (res) => {
            for (let val in this.form) {
          if (val != 'benefit_data') {
            this.form[val] = res.data[val] + ''
          } else {
            this.form.benefit_data = res.data.benefit_info
          }
        }
        this.businessSureBool = true
        this.form.goods_id = this.$route.query.id
        console.log(this.form)
      }
      })
      }
    },
    methods: {
      getOperation_area_category_idArr () {
        this.$axios({
          type: 'post',
          url: '/game/categorylist',
          data: {is_page: 0},
          fuc: (res) => {
          this.businesscategories = res.data
      }
      })
      },
      goods_noSure () {
        if (this.form.goods_no == '') {
          this.$message.warning('请先输入商品编码')
          return
        }
        this.$axios({
          type: 'post',
          url: '/game/goodsconfirm',
          data: {goods_no: this.form.goods_no},
          fuc: (res) => {
          this.businessSureBool = true
          this.name = res.data
      }
      })
      },
      submit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let _form = JSON.parse(JSON.stringify(this.form))
            for (let val of _form) {
              if (val.benefit_value == '') {
                this.$message.warning('每项策略为必填')
                return
              }
            }
            _form.game_num_section.replace(/，/g, ',')
            this.$axios({
                type: 'post',
                url: this.$route.query.id ? '/game/goodsedit' : '/game/goodsinsert',
                data: _form,
                fuc: (res) => {
                if (res.code == 200) {
              this.$message.success('操作成功')
              this.$deleteOneTag('/yaoyao/yaoGoodsList')
            }
          }
          })
          }
        })
      }
    }
  }
</script>

<style scoped="true">
  .indexSlideshowDetail{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .indexSlideshowDetail>.el-form .el-input{
    max-width: 400px;
  }
  .indexSlideshowDetail>.el-form .el-textarea{
    max-width: 400px;
  }
</style>
