<template>
  <div class="indexOperatingGoddsList">
    <el-button @click='addBusiness'>添加商家</el-button>
    <el-button @click='downExcell'>下载模板</el-button>
    <el-button @click='importDialogVisible = true'>导入商家</el-button>

    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="分类">
          <el-select v-model='formInline.filter_category_id' placeholder="请选择" clearable>
            <el-option
              v-for='item in businesscategories'
              :label="item.name"
              :value="item.goods_activity_category_id"
              :key="item.goods_activity_category_id"
              >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="显示状态">
          <el-select v-model='formInline.status' placeholder="显示状态" clearable>
            <el-option
              label="显示"
              value="1">
            </el-option>
            <el-option
              label="不显示"
              value="-1">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商家编码">
          <el-input v-model="formInline.search" placeholder="请输入商家编码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="线下模板商家列表">
        <el-table-column
          prop="goods_activity_business_id"
          label="id"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="business_offline_account"
          label="店家"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="name"
          label="分类"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="label"
          label="标签"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="status"
          label="显示状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.status == 1'>显示</span>
            <span v-else>不显示</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="顺序"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="240" align='center'>
          <template slot-scope='scope'>
            <el-button @click='goDetail(scope.row.goods_activity_business_id)'>编辑</el-button>
            <el-button @click='deleteBusiness(scope.row.goods_activity_business_id)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
    layout="prev, pager, next"
    :total="total" :page-size="20" @current-change="handleCurrentChange"
      :current-page.sync="start">
  </el-pagination>

    <el-dialog title="批量导入" :visible.sync="importDialogVisible" :show-close='false'>
      <el-select style='margin-bottom: 6px;' v-model='uploadFilter_category_id' placeholder="请选择" clearable>
        <el-option
          v-for='item in businesscategories'
          :label="item.name"
          :value="item.goods_activity_category_id"
          :key="item.goods_activity_category_id">
        </el-option>
      </el-select>
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/" :before-upload="beforeAvatarUpload">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传模板excel文件</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'unlineBusinessList',
    data () {
      return {
        tableData: [],
        businesscategories: [],
        start: 1,
        uploadFilter_category_id: '',
        importDialogVisible: false,
        formInline: {
          search: '',
          status: '',
          filter_category_id: ''
        },
        total: 0,
        showFormBool: true, // 是否显示过滤框
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/goods/activitycategorygetlist',
        data: {parent_id: this.$route.query.goods_activity_category_id, type: 4, is_fixed_od: 0},
        fuc: (res) => {
          this.businesscategories = res.data
        }
      })
      this.getTableData()
    },
    mounted () {},
    methods: {
      getTableData () {
        this.$axios({
          type: 'post',
          url: '/goods/activitybusinessgetlist',
          data: {page: this.start, goods_activity_category_id: this.$route.query.goods_activity_category_id, ...this.formInline},
          fuc: (res) => {
            this.tableData = res.data.data
            this.total = res.data.total
          }
        })
      },
      onSubmit () {
        this.start = 1
        this.getTableData()
      },
      goDetail (goods_activity_business_id) {
        this.$router.push({path: '/interConfig/indexManage/indexOperatingBusinessDetail', query: {goods_activity_category_id: this.$route.query.goods_activity_category_id, goods_activity_business_id}})
      },
      addBusiness () {
        this.$router.push({path: '/interConfig/indexManage/indexOperatingBusinessDetail', query: {goods_activity_category_id: this.$route.query.goods_activity_category_id}})
      },
      handleCurrentChange (val) {
        this.start = val
        this.getTableData()
      },
      deleteBusiness (goods_activity_business_id) {
        this.$axios({
          type: 'post',
          url: '/goods/activitybusinessdelete',
          data: {goods_activity_business_id},
          fuc: (res) => {
            if (res.code == 200) {
              this.$message.success('操作成功')
              this.getTableData()
            }
          }
        })
      },
      downExcell () {
        this.$downloadExcell({url: '/resource/activity_business_load.xlsx'})
      },
      beforeAvatarUpload (file) {
//        let _this = this
        if (this.uploadFilter_category_id == '') {
          this.$message.warning('请先选择分类')
          return false
        }
        let formData = new FormData()
        formData.append('activity_goods_excel', file)
        formData.append('goods_activity_category_id', this.uploadFilter_category_id)
        this.$axios({
          type: 'post',
          url: '/goods/activitybusinessload',
          data: formData,
          fuc: (res) => {
            console.log(res)
            if (res.code == 200) {
              this.importDialogVisible = false
              this.getTableData()
            }
          }
        }, 1)
        return false
      },
    }
  }
</script>
<style scoped="true">
  .indexOperatingGoddsList{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .searchForm{
    margin: 10px 0;
  }
  .searchForm>p{
    width: 100%;
    background-color: #f5f7fa;
    padding: 10px;
    color: #909399;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
  }
  .searchForm>p>i{
    margin-left: 20px;
  }
</style>
