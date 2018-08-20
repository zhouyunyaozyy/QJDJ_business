<template>
  <div class="goodsBrandsList">
    <el-button type='primary' @click='addBrand'>添加品牌</el-button>
    
    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.name" placeholder="品牌名称/关键词"></el-input>
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
        label="管理组列表">
        <el-table-column
          prop="bid"
          label="编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="brand_name"
          label="品牌名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="initial"
          label="品牌首字母"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="gids"
          label="相关产品"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="all_sale"
          label="销量"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.all_sale'>{{scope.row.all_sale}}</span>
            <span v-else>0</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="操作"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <el-button @click='editBrand(scope.row)'>编辑</el-button>
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
    name: 'goodsBrandsList',
    data () {
      return {
        tableData: [],
        formInline: {
          name: ''
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
          url: '/goods/brand/getinfo',
          data: {page: this.start, limit: 20, ...this.formInline},
          fuc: (res) => {
            if (res.code === 200) {
              this.tableData = res.data.data
              this.total = res.data.count
            }
          }
        })
      },
      onSubmit () {
        this.start = 1
        this.getTableData()
      },
      handleCurrentChange (val) {
        this.start = val 
        this.getTableData()
      },
      editBrand (row) {
        this.$router.push({path: '/goods/goodsBrandsDetail', query: {bid: row.bid}})
      },
      addBrand () {
        this.$router.push({path: '/goods/goodsBrandsDetail'})
      }
    }
  }
</script>
<style scoped="true">
  .goodsBrandsList{
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