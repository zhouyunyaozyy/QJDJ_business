<template>
  <div class="unlineBusinessList">
    <el-button @click="addPgc('')" v-if="type != 6">添加</el-button>
    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="区域">
          <el-select v-model="formInline.operation_template_area_id" @change="selectChange">
            <el-option v-for="item in selectArr" :value='item.operation_template_area_id' :label='item.area_name' :key="item.operation_template_area_id"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item>-->
          <!--<el-button type="primary" @click="getTableData">查询</el-button>-->
        <!--</el-form-item>-->
      </el-form>
    </div>

      <el-select v-model="operation_area_category_id" style="margin: 10px;" v-if="type != 1">
        <el-option v-for="item in operation_area_category_idArr" :value='item.operation_area_category_id' :label='item.name' :key="item.operation_area_category_id"></el-option>
      </el-select>

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="数据列表">
        <el-table-column
          prop="operation_content_id"
          label="编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="img"
          label="缩略图"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <img :src="scope.row.img_path + scope.row.img" style="width: 50px;height: 50px;">
          </template>
        </el-table-column>
        <el-table-column
          prop="jump_type"
          label="跳转类型"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <span v-for="item in jumpArr" v-if="item.value == scope.row.jump_type">{{item.label}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="jump_data"
          label="跳转后的页面名称或url"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="顺序"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="is_show"
          label="显示状态"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <el-switch
              @change="switchChange(scope.row.operation_content_id, scope.row.is_show)"
              v-model="scope.row.is_show == 1">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="240" align='center'>
          <template slot-scope='scope'>
            <el-button @click='addPgc(scope.row.operation_content_id)'>编辑</el-button>
            <el-button @click='editPgc(scope.row.operation_content_id)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>

    <el-pagination
      v-if="pageShow"
      layout="prev, pager, next"
      :total="total" :page-size="20" @current-change="handleCurrentChange"
      :current-page.sync="start">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: 'unlineBusinessList',
    props: [
      'operation_pages_id', 'detailUrl'
    ],
    data () {
      return {
        tableData: [],
        operation_area_category_id: '',
        operation_area_category_idArr: [],
        type: '',
        formInline: {
          operation_template_area_id: ''
        },
        selectArr: [],
        jumpArr: [
          {label: '不跳转', value: 1},
          {label: 'h5', value: 2},
          {label: '商品', value: 3},
          {label: '区域', value: 4},
          {label: 'pgc页面', value: 5},
          {label: '商品分类', value: 6},
          {label: '运营位模板', value: 7}
        ],
        showFormBool: true, // 是否显示过滤框
        pageShow: true, // 是否显示分页
        start: 1,
        total: 0,
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/Operation/returnPagesOption',
        data: {operation_pages_id: this.operation_pages_id},
        fuc: (res) => {
          this.selectArr = res.data
          this.formInline.operation_template_area_id = res.data[0].operation_template_area_id
          if (res.data[0].is_page == 1) {
            this.pageShow = true
            this.start = 1
          } else {
            this.pageShow = false
          }
          this.type = res.data[0].type
          if (this.type != 1) {
            this.getOperation_area_category_idArr()
          } else {
            this.getTableData()
          }
        }
      })
    },
    mounted () {},
    methods: {
      handleCurrentChange (val) {
        this.start = val
        this.getTableData()
      },
      getOperation_area_category_idArr () {
        this.$axios({
            type: 'post',
            url: '/operation/getareacategorylist',
            data: {operation_pages_id: this.operation_pages_id, operation_template_area_id: this.formInline.operation_template_area_id},
            fuc: (res) => {
              this.operation_area_category_idArr = res.data
              if (res.data.length > 0) {
                this.operation_area_category_id = res.data[0].operation_area_category_id
              }
              this.getTableData()
            }
        })
      },
      selectChange (value) {
        for (let val of this.selectArr) {
          if (val.operation_template_area_id == value) {

//            分页判断
            if (val.is_page == 1) {
              this.pageShow = true
              this.start = 1
            } else {
              this.pageShow = false
            }

//            类型判断
            this.type = val.type
            if (this.type != 1) {
              this.getOperation_area_category_idArr()
            } else {
              this.getTableData()
            }
          }
        }
      },
      getTableData () {
        let searchData = {operation_pages_id: this.operation_pages_id, ...this.formInline}
        if (this.pageShow) {
          searchData.page = this.start
        }
        if (this.operation_area_category_id) {
          searchData.operation_area_category_id = this.operation_area_category_id
        }
        this.$axios({
            type: 'post',
            url: '/operation/getcontentlist',
            data: searchData,
          fuc: (res) => {
          if (this.pageShow) {
            this.tableData = res.data.data
          } else {
            this.tableData = res.data
          }
        }
      })
      },
      addPgc (operation_content_id) {
        if (operation_content_id) {
          this.$router.push({path: this.detailUrl, query: {operation_content_id: operation_content_id, operation_template_area_id: this.formInline.operation_template_area_id}})
        } else {
          this.$router.push({path: this.detailUrl, query: {operation_template_area_id: this.formInline.operation_template_area_id}})
        }
      },
      editPgc (operation_content_id) {
        this.$axios({
            type: 'post',
            url: '/operation/deletecontent',
            data: {operation_content_id},
            fuc: (res) => {
            if (res.code == 200) {
          this.$message.success('操作成功')
          this.getTableData()
        }
      }
      })
      },
      switchChange (operation_content_id, is_show) {
        this.$axios({
            type: 'post',
            url: '/operation/setcontentshow',
            data: {operation_content_id, is_show: is_show == 1 ? 0 : 1},
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
  .unlineBusinessList{
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
