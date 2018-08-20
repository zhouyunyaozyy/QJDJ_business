<template>
  <div class="unlineBusinessClassifyList">
    <el-button type="primary" @click="addFirstClassify('')">添加一级类目</el-button>

    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="类目列表">
        <el-table-column
          prop="business_category_id"
          label="编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="name"
          label="类目名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="level"
          label="级别"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="id"
          label="设置"
          min-width="240" align='center'>
          <template slot-scope='scope'>
            <el-button @click='addFirstClassify(scope.row.business_category_id)'>新增下级</el-button>
            <el-button @click='detailSecondList(scope.row.business_category_id)'>查看下级</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="操作"
          min-width="270" align='center'>
          <template slot-scope='scope'>
            <el-button @click='addFirstClassify(scope.row.business_category_id,1)'>编辑</el-button>
            <el-button @click='deleteBusiness_category_id(scope.row.business_category_id)' type="danger">删除</el-button>
            <el-button @click='toTop(scope.row.business_category_id)'>置顶</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
    <el-pagination
    layout="prev, pager, next"
    :total="total" :page-size="20" @current-change="handleCurrentChange"
      :current-page.sync="start">
  </el-pagination>

  </div>
</template>

<script>
  export default {
    name: 'unlineBusinessClassifyList',
    data () {
      return {
        tableData: [],
        formInline: {
          title: ''
        },
        start: 1,
        total: 0,
        showFormBool: true, // 是否显示过滤框
      }
    },
    created () {
      this.getTableData()
    },
    mounted () {},
    methods: {
      getTableData () {
        this.$axios({
          type: 'post',
          url: '/business/categorygetlist',
          data: {},
          fuc: (res) => {
            this.tableData = res.data.data
            this.total = res.data.total
          }
        })
      },
      detailSecondList (parent_id) {
        this.$router.push({path: '/business/unBusinessClassifySecondList', query: {parent_id: parent_id}})
      },
      handleCurrentChange (val) {
        this.start = val 
        this.getTableData()
      },
      onSubmit () {
        
      },
      addFirstClassify (parent_id, type) {
        if (parent_id && type) {
          this.$router.push({path: '/business/unBusinessClassifyDetail', query: {parent_id: parent_id, type: type}})
        } else if (parent_id) {
          this.$router.push({path: '/business/unBusinessClassifyDetail', query: {parent_id: parent_id}})    
        } else {
          this.$router.push({path: '/business/unBusinessClassifyDetail'})
        }
      },
      deleteBusiness_category_id (business_category_id) {
        console.log(business_category_id)
        this.$axios({
          type: 'post',
          url: '/business/categorydelete',
          data: {business_category_id: business_category_id},
          fuc: (res) => {
            this.$message.success('删除成功')
            if (this.total % 20 === 1 && this.start > 1) {
              this.start = this.start - 1
            }
            this.getTableData()
          }
        })
      },
      toTop (business_category_id) {
        this.$axios({
          type: 'post',
          url: '/business/categorysettop',
          data: {business_category_id: business_category_id},
          fuc: (res) => {
            this.getTableData()
          }
        })
      }
    }
  }
</script>
<style scoped="true">
  .unlineBusinessClassifyList{
    margin: 10px 20px 0;
    overflow: hidden;
  }
  .unlineBusinessClassifyList>.el-table{
    margin-top: 10px;
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