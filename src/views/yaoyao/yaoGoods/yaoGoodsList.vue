<template>
  <div class="indexOperatingGoddsList">
    <el-button @click='addSlideshow'>添加商品</el-button>
    <el-button @click='downExcell'>下载模板</el-button>
    <el-button @click="importDialogVisible = true">批量添加商品</el-button>
    <el-button @click="openCategoryDialog">分类管理</el-button>

    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="分类">
          <el-select v-model='formInline.search' placeholder="请选择" clearable>
            <el-option
              v-for='item in businesscategories'
              :label="item.name"
              :value="item.id"
              :key="item.id">
            </el-option>
          </el-select>
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
        label="商品列表">
        <el-table-column
          prop="game_sort"
          label="商品排序"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="goods_no"
          label="商品编码"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="business_name"
          label="商家"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="name"
          label="价格"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>{{scope.row.sale_price / 100}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="game_category_name"
          label="所属类别"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="game_num_section"
          label="数字区间"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          label="参与者概率（赢）"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <span>{{scope.row.pk_win_chance}}%</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="activity_goods_status"
          label="商品折扣"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <p v-for='(item, index) in scope.row.benefit_info'><span v-if="item.benefit_type == 1">{{index+1}}. {{item.benefit_value}}%</span><span v-else>{{index+1}}. {{item.benefit_value}}金贝</span></p>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="240" align='center'>
          <template slot-scope='scope'>
            <el-button @click="editGoods(scope.row.goods_id)">编辑</el-button>
            <el-button @click='deleteGoods(scope.row.id)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      :total="total" :page-size="20" @current-change="handleCurrentChange"
      :current-page.sync="start">
    </el-pagination>

    <el-dialog
      title="分类管理"
      :visible.sync="dialogVisible"
      width="550px"
      label-width="80px">
      <el-button @click="addCategory" style="margin-bottom: 6px;">添加</el-button>
      <el-form>
        <el-form-item label="" v-for="(item, index) in operation_area_category_idArrCopy" :key="index">
          <el-input v-model="item.name" style="width: 200px" :maxlength="10" placeholder="名称"></el-input>
          <el-input v-model="item.sort" style="width: 100px" :maxlength="10" placeholder="排序"></el-input>
          <el-button @click="deleteCategory(item, index)">删除</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureCategoryBtn">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="批量导入" :visible.sync="importDialogVisible" :show-close='false'>
      <el-select style='margin-bottom: 6px;' v-model='uploadFilter_category_id' placeholder="请选择" clearable>
        <el-option
          v-for='item in businesscategories'
          :label="item.name"
          :value="item.id"
          :key="item.id">
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
        dialogVisible: false,
        operation_area_category_idArrCopy: [],

        tableData: [],
        businesscategories: [],
        start: 1,
        uploadFilter_category_id: '',
        importDialogVisible: false,
        formInline: {
          search: ''
        },
        total: 0,
        showFormBool: true, // 是否显示过滤框
      }
    },
    created () {
      this.getOperation_area_category_idArr()
      this.getTableData()
    },
    mounted () {},
    methods: {

//      分类
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
      openCategoryDialog () {
        this.operation_area_category_idArrCopy = JSON.parse(JSON.stringify(this.businesscategories))
        this.dialogVisible = true
      },
      addCategory () {
        this.operation_area_category_idArrCopy.push({name: '', sort: '', id: ''})
      },
      deleteCategory (item, index) {
        if (item.id) {
          this.$axios({
            type: 'post',
            url: '/game/categorydelete',
            data: {id: item.id},
            fuc: (res) => {
              if (res.code == 200) {
                this.operation_area_category_idArrCopy.splice(index, 1)
              }
            }
          })
        } else {
          this.operation_area_category_idArrCopy.splice(index, 1)
        }
      },
      sureCategoryBtn () {
        for (let val of this.operation_area_category_idArrCopy) {
          if (val.name == '') {
            this.$message.warning('分类名称不能为空')
            return false
          }
        }
        this.$axios({
            type: 'post',
            url: '/game/categoryinsert',
            data: {data: this.operation_area_category_idArrCopy},
            fuc: (res) => {
            if (res.code == 200) {
          this.$message.success('操作成功')
          this.getOperation_area_category_idArr()
          this.dialogVisible = false
        }
      }
      })
      },

      getTableData () {
        let obj = {
          page: this.start,
          limit: 20,
          ...this.formInline
      }
        this.$axios({
          type: 'post',
          url: '/game/goodslist',
          data: obj,
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
      addSlideshow () {
        this.$router.push({path: '/yaoyao/yaoGoodsDetail'})
      },
      handleCurrentChange (val) {
        this.start = val
        this.getTableData()
      },
      editGoods (id) {
        this.$router.push({path: '/yaoyao/yaoGoodsDetail', query: {id: id}})
      },
      downExcell () {
        this.$downloadExcell({url: '/resource/game_goods.xlsx'})
      },
      beforeAvatarUpload (file) {
//        let _this = this
        if (this.uploadFilter_category_id == '') {
          this.$message.warning('请先选择分类')
          return false
        }
        let formData = new FormData()
        formData.append('excel', file)
        formData.append('category_id', this.uploadFilter_category_id)
        this.$axios({
            type: 'post',
            url: '/game/uploadgoods',
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
      deleteGoods (id) {
        this.$axios({
            type: 'post',
            url: '/game/goodsdelete',
            data: {id},
            fuc: (res) => {
            if (res.code == 200) {
          this.$message.success('操作成功')
          this.getTableData()
        }
      }
      })
      }
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
