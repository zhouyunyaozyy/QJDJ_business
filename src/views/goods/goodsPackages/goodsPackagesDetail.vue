<template>
  <div class="goodsPackagesDetail">

    <el-form ref="form" :model="form" label-width="150px" :rules='rules'>
      <code>基本信息</code>
      <el-form-item label='套餐编码' prop='package_no'>
        <el-input v-model="form.package_no" placeholder='请输入套餐编码' :maxlength='20'></el-input>
      </el-form-item>
      <el-form-item label='套餐类目' prop='class_category_id'>
        <el-cascader
          expand-trigger="hover"
          :options="categoryArr"
          v-model="form.class_category_id"
          @change="handleChange" disabled>
        </el-cascader>
      </el-form-item>
      <el-form-item label='套餐名称' prop='package_name'>
        <el-input v-model="form.package_name" placeholder='请输入套餐名称' :maxlength='20'></el-input>
      </el-form-item>
      <el-form-item label='套餐进价' prop='cost_price'>
        <el-input v-model="form.cost_price" placeholder='请输入套餐进价' :maxlength='20'></el-input>
      </el-form-item>
      <el-form-item label='套餐价格(银贝)' prop='silver_price'>
        <el-input v-model="form.silver_price" placeholder='请输入套餐价格' :maxlength='20'></el-input>
      </el-form-item>
      <el-form-item label='过期时间' prop='expire_time'>
        <el-input v-model="form.expire_time" placeholder='请输入过期时间' :maxlength='20' disabled></el-input>
      </el-form-item>
      <el-form-item label='套餐库存' prop='num'>
        <el-input v-model="form.num" placeholder='请输入套餐库存' :maxlength='20'></el-input>
      </el-form-item>
      <el-form-item label='套餐详情' prop='package_desc'>
        <el-input type='textarea' v-model="form.package_desc" placeholder='请输入套餐描述' :maxlength='40'></el-input>
      </el-form-item>
      <el-form-item label='不可用时间' prop='unable_time'>
        <el-input type='textarea' v-model="form.unable_time" placeholder='请输入不可用时间' :maxlength='40'></el-input>
      </el-form-item>
      <code>套餐相册</code>
      <el-form-item label='套餐列表图' required>
        <el-upload
          action="http://upload-z2.qiniu.com"
          list-type="picture-card" :file-list="form.imgs_url" :before-upload="beforeAvatarUpload" multiple
          :on-preview="handlePictureCardPreview" :limit="9"
          :on-exceed="handleExceed"
          :on-remove="handleRemoveImg_publicity">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImages" alt="形象图片">
        </el-dialog>
      </el-form-item>
      <el-form-item label='套餐展示图' >
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :before-upload="beforeAvatarUploadLogo">
          <img v-if="form.details_imgs_url" :src="form.details_imgs_url" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span>此图为套餐列表的显示图片展示，可以更真实、直观表达商品卖点。消费者决策前最后一步，快速提升成交转化。</span>
      </el-form-item>
      <el-form-item label='驳回理由' v-if='form.status == -2'>
        <span>{{form.reject_reason}}</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit(1)">完成，保存商品</el-button>
        <el-button  @click="turnDownDialogVisible = true">驳回</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="填写驳回理由" :visible.sync="turnDownDialogVisible" :show-close='false'>
      <el-form :model="turnDownForm" ref='turnDownForm' label-width="5px" >
        <el-form-item label="" prop='reason'>
          <el-input type='textarea' v-model="turnDownForm.reason" placeholder='请务必填写驳回不通过的理由' :maxlength='40'></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="turnDownDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="refuse">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import area from '@/area.json'
  export default {
    data() {
      return {
        turnDownDialogVisible: false,
        turnDownForm: {
          reason: ''
        },
        allForm: {
          supply_price: '',
          base_return: '',
          activity_direct_return: '',
          activity_indirect_return: '',
          join_nums: '',
          spread_gold_return: '',
          silver_return_ratio: ''
        },
        form: {
          imgs_url: []
        },
        firstInput: {
          type: '',
          content: ''
        },
        reject_reason: '',
        secondInput: {
          type: '',
          content: ''
        },
        area_json: [],
        categoryArr: [],
        attr_is_change: 0,
        dialogVisible: false,
        dialogImages: '',
        rules: {
          class_category_id: [{ required: true, message: '请选择类目', trigger: 'change' }],
          package_no: [{ required: true, message: '请输入套餐编码', trigger: 'blur' }],
          package_name: [{ required: true, message: '请输入套餐名称', trigger: 'blur' }],
          cost_price: [{ required: true, message: '请输入套餐进价', trigger: 'blur' }],
          silver_price: [{ required: true, message: '请输入套餐价格', trigger: 'blur' }],
          num: [{ required: true, message: '请输入套餐库存', trigger: 'blur' }],
          package_desc: [{ required: true, message: '请输入套餐详情', trigger: 'blur' }],
          unable_time: [{ required: true, message: '请输入套餐不可用时间', trigger: 'blur' }],
          type: [{ required: true, message: '请选择套餐分类', trigger: 'blur' }],
          freight_id: [{ required: true, message: '请选择运费模板', trigger: 'blur' }],
          fake_sale_nums: [{ required: true, message: '请输入虚拟销售量', trigger: 'blur' }],
        }
      }
    },
    created () {
      this.area_json = area.area_json
      this.$axios({
        type: 'post',
        url: '/package/getbusinesscategories',
        data: {},
        fuc: (res) => {
          let arr = []
          for (let val of res.data) {
            let obj = {}
            obj.label = val.name
            obj.value = val.business_category_id
            if (val.data && val.data.length > 0) {
              obj.children = []
              for (let val2 of val.data) {
                obj.children.push({
                  label: val2.s_name,
                  value: val2.s_business_category_id
                })
              }
            }
            arr.push(obj)
          }
          this.categoryArr = arr
        }
      })
      if (this.$route.query.package_id) {
        this.$axios({
          type: 'post',
          url: '/package/packagedetail',
          data: {package_id: this.$route.query.package_id},
          fuc: (res) => {
            this.form = res.data
            this.form.cost_price = parseInt(res.data.cost_price) / 100
            this.form.class_category_id = [res.data.first_category_id, res.data.second_category_id]
            let arr1 = []
            for (let val of this.form.imgs) {
              arr1.push({url: this.form.imgs_host + this.form.imgs_save_path + val})
            }
            this.$set(this.form, 'expire_time', this.$formatTime(res.data.expire_time))
            this.$set(this.form, 'imgs_url', arr1)
            this.$set(this.form, 'details_imgs_url', this.form.imgs_host + this.form.list_save_path + this.form.list_img)
//            this.form.imgs_url = arr1
//            this.form.details_imgs_url = this.form.imgs_host + this.form.list_save_path + this.form.list_img
          }
        })
      }
    },
    methods: {
      refuse () {
        this.reject_reason = this.turnDownForm.reason
        if (this.reject_reason == '') {
          this.$message.warning('请务必填写驳回理由')
          return false
        }

        this.submit(-2)
      },
      beforeAvatarUpload (file) {
        let _this = this
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
          let obj = {}
          obj.url = this.result
//          _this.form.imgs_url.push({url: this.result})  // 这个就是base64编码了
          _this.form.imgs_url.push(obj)  // 这个就是base64编码了
          if (_this.form.imgs_url.length >= 9) {
//            console.log(document.getElementsByClassName('el-upload el-upload--picture-card'))
            document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'none'
          }
        }
        return false
      },
      handlePictureCardPreview(file) {
        this.dialogImages = file.url;
        this.dialogVisible = true;
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 9 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      handleRemoveImg_publicity(file, fileList) {
//        console.log(file)
        for (let val in this.form.imgs_url) {
          if (this.form.imgs_url[val].uid === file.uid) {
            this.form.imgs_url.splice(val, 1)
          }
        }
        if (this.form.imgs_url.length < 9) {
          document.getElementsByClassName('el-upload el-upload--picture-card')[0].style.display = 'inline-block'
        }
      },
      beforeAvatarUploadLogo (file) {
        console.log(this.form)
        let _this = this
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
          _this.form.details_imgs_url = this.result // 这个就是base64编码了
        }
        return false
      },
      handleChange (val) {
        console.log(val)
      },
      submit (status) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.form.imgs_url.length == 0 || this.form.details_imgs_url == '') {
              this.$message.warning('请上传套餐图片')
              return false
            } else {
              let _form = JSON.parse(JSON.stringify(this.form))
              let arr = []
              for (let val of _form.imgs_url) {
                if (val.url.indexOf(this.form.imgs_save_path) > -1) {
                  arr.push(val.url.split(this.form.imgs_save_path)[1])
                } else {
                  arr.push(val.url)
                }
              }
              _form.imgs = arr
              if (_form.details_imgs_url.indexOf(_form.list_save_path) > -1) {
                _form.list_img = _form.details_imgs_url.split(_form.list_save_path)[1]
              } else {
                _form.list_img = _form.details_imgs_url
              }
              console.log(_form)
              _form.expire_time = new Date(_form.expire_time).getTime() / 1000
              _form.status = status // 审核状态
              
              if (status == -2) {
                _form.reject_reason = this.reject_reason
              }
              _form.package_id = this.$route.query.package_id
              this.$axios({
                type: 'post',
                url: '/package/packageedit',
                data: _form,
                fuc: (res) => {
                  console.log('res', res)
                  this.dialogVisibleInput = false
                  if (res.code == 200) {
                    this.$message.success('操作成功')
                    this.$deleteOneTag('/goods/goodsPackagesList')
                  }
                }
              })
            }
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
  .tableForm>li{
    width: 220px;
    display: inline-block;
  }
  .ulFormItem ul{
    display: inline-block;
    list-style: none;
    padding: 0;
  }
  .ulFormItem>div>ul>li{
    margin: 6px 0;
    display: block;
    overflow: hidden
  }
  .goodsPackagesDetail>.el-form .el-input{
    max-width: 400px;
  }
  .goodsPackagesDetail>.el-form .el-textarea{
    max-width: 400px;
  }
  .specUl{
    width: 100%;
    overflow: hidden;
    background-color: #f5f7fa;
  }
  .specUl>li>span{
    display: inline-block;
    float: left;
    width: 80px;
    text-align: center;
  }
  .specUl>li>ul{
    width: calc(100% - 80px);
    float: left;
  }
  .goodsPackagesDetail>.el-form .allFormClass .el-input{
    max-width: 100px;
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
