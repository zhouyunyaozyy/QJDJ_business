<template>
  <div class="indexSlideshowDetail">
    <el-form ref="form" :model="form" label-width="120px" :rules='rules'>
      <el-form-item label='商品类型' prop='scratchcards_goods_type'>
        <el-select v-model="form.scratchcards_goods_type">
          <el-option label="商品" value="1"></el-option>
          <el-option label="金贝" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='商品编码' prop='goods_no' v-if="form.scratchcards_goods_type == 1">
        <el-input placeholder='请输入商品编码' v-model='form.goods_no'></el-input>
      </el-form-item>
      <el-form-item label='金贝数量' prop='scratchcards_gold_num' v-else-if="form.scratchcards_goods_type == 2">
        <el-input placeholder='请输入金贝数量' v-model='form.scratchcards_gold_num'></el-input>
        <p>目前活动金贝总量：{{allGold}}</p>
      </el-form-item>
      <el-form-item label='商品名称' prop='scratchcards_goods_name'>
        <el-input placeholder='请输入商品名称' v-model='form.scratchcards_goods_name'></el-input>
      </el-form-item>
      <el-form-item label='商品价格' prop='price'>
        <el-input placeholder='请输入商品价格' v-model='form.price'></el-input>
      </el-form-item>
      <el-form-item label='商品封面' prop='scratchcards_img'>
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeAvatarUploadLogo">
          <img v-if="form.scratchcards_img" :src="form.scratchcards_img" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label='刮中概率' prop='scratchcards_ratio'>
        <el-input placeholder='请输入刮中概率' v-model='form.scratchcards_ratio'></el-input>
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
          scratchcards_goods_type: '',
          goods_no: '',
          price: '',
          scratchcards_goods_name: '',
          scratchcards_ratio: '',
          scratchcards_img: '',
          scratchcards_gold_num: ''
        },
        allGold: '',
        rules: {
          scratchcards_goods_name: [{ required: true, message: '请输入', trigger: 'blur' }],
          scratchcards_gold_num: [{ required: true, message: '请输入', trigger: 'blur' }],
          scratchcards_img: [{ required: true, message: '请上传', trigger: 'blur' }],
          scratchcards_ratio: [{ required: true, message: '请输入', trigger: 'blur' }],
          scratchcards_goods_type: [{ required: true, message: '请选择', trigger: 'blur' }],
          price: [{ required: true, message: '请输入', trigger: 'blur' }],
          goods_no: [{ required: true, message: '请输入', trigger: 'blur' }]
        }
      }
    },
    created () {
      this.$axios({
          type: 'post',
          url: '/game/surplusCurrency',
          data: {},
          fuc: (res) => {
          if (res.code == 200) {
            this.allGold = res.data.surplus_num
      }
        }
      })
      if (this.$route.query.id) {
        this.editBool = true
        this.$axios({
            type: 'post',
            url: '/game/gglgoodsdetail',
            data: {id: this.$route.query.id},
            fuc: (res) => {
            for (let val in this.form) {
          if (val != 'scratchcards_img') {
            this.form[val] = res.data[val] + ''
          } else {
            this.form.scratchcards_img = res.data.url + res.data.save_path + res.data.scratchcards_img
          }
        }
        this.form.id = this.$route.query.id
        this.form.save_path = res.data.save_path
        console.log(this.form)
      }
      })
      }
    },
    methods: {
      beforeAvatarUploadLogo (file) {
        let _this = this
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
          _this.form.scratchcards_img = this.result // 这个就是base64编码了
        }
        return false
      },
      submit () {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            let _form = JSON.parse(JSON.stringify(this.form))
            if (_form.scratchcards_img.indexOf(_form.save_path) > -1) {
              _form.scratchcards_img = _form.scratchcards_img.split(_form.save_path)[1]
            }
            this.$axios({
                type: 'post',
                url: this.$route.query.id ? '/game/gglgoodsedit' : '/game/gglgoodsinsert',
                data: _form,
                fuc: (res) => {
                if (res.code == 200) {
              this.$message.success('操作成功')
              this.$deleteOneTag('/guaguale/guaGoodsList')
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
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
    height: 178px;
    display: table-cell;
    vertical-align: middle;
    background-color: #fbfdff;
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
  .avatar{
    width: 178px;
    height: 178px;
  }
</style>
