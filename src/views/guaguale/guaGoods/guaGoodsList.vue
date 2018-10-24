<template>
  <div class="goodsList">
    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.search" placeholder="奖品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-button @click='addGoods' style='margin-bottom: 10px;'>添加商品</el-button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="商品列表">
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
          prop="scratchcards_goods_name"
          label="商品名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="business_name"
          label="所属商家"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="business_name"
          label="商品价格"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>{{scope.row.sale_price / 100}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="商品价值"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="scratchcards_ration"
          label="刮中概率"
          min-width="120" align='center'>
          <template slot-scope="scope">{{scope.row.scratchcards_ratio}}%</template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="操作"
          min-width="200" align='center'>
          <template slot-scope='scope'>
            <el-button @click='detailGoodsDetail(scope.row)'>编辑</el-button>
            <el-button @click='offlineGoods(scope.row)'>删除</el-button>
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
    name: 'goodsList',
    data () {
      return {
        tableData: [],
        formInline: {
          search: ''
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
            url: '/game/gglgoodslist',
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
      },
      detailGoodsDetail (row) {
        this.$router.push({path: '/guaguale/guaGoodsDetail', query: {id: row.id}})
      },
      addGoods () {
        this.$router.push({path: '/guaguale/guaGoodsDetail'})
      },
      offlineGoods (row) {
        this.$axios({
            type: 'post',
            url: '/game/goodsdelete',
            data: {id: row.id},
            fuc: (res) => {
            if (res.code === 200) {
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
