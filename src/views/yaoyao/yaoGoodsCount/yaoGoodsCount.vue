<template>
  <div class="goodsList">
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
        label="商品统计列表">
        <el-table-column
          prop="id"
          label="排序"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="goods_id"
          label="商品ID"
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
          label="所属商家"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
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
          prop="round"
          label="发起局数"
          min-width="120" align='center'>
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
    name: 'goodsList',
    data () {
      return {
        tableData: [],
        formInline: {
          search: ''
        },
        businesscategories: [],
        start: 1,
        total: 0,
        showFormBool: true, // 是否显示过滤框
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/game/categorylist',
        data: {is_page: 0},
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
            url: '/game/goodscontrol',
            data: {page: this.start, limit: 20, ...this.formInline},
          fuc: (res) => {
          if (res.code === 200) {
            this.tableData = res.data.data
            this.total = res.data.total
          }
        }
      })
      },
      handleCurrentChange (val) {
        this.start = val
        this.getTableData()
      },
      onSubmit () {
        this.start = 1
        this.getTableData()
      }
    }
  }
</script>
<style scoped="true">
  .goodsList{
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
