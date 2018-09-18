<template>
  <div class="unlineOrderList">
    
    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.key_a" placeholder="订单编号/商家名称"></el-input>
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker
            v-model="formInline.key_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
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
          prop="package_order_no"
          label="订单编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="pay_at"
          label="付款时间"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="name"
          label="商家名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="商家电话"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="pay_way"
          label="支付方式"
          min-width="240" align='center'>
          <template slot-scope='scope'>
            <span>现金支付：{{scope.row.cash / 100}},余额支付：{{scope.row.balance / 100}},银贝支付：{{scope.row.silver}},金贝支付：{{scope.row.gold}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="total_cost"
          label="支付金额"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>{{scope.row.total_cost / 100}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="return_silver"
          label="产生银贝"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="id"
          label="操作"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <el-button @click="detail(scope.row)" type="primary" plain>查看</el-button>
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
    name: 'adminGroupDetail',
    data () {
      return {
        tableData: [],
        formInline: {
          key_a: '',
          key_time: []
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
          url: '/Order/downorderlist',
          data: {type: 2, page: this.start, ...this.formInline},
          fuc: (res) => {
            this.tableData = res.data.order_list
            this.total = res.data.all_num
          }
        })
      },
      handleCurrentChange (val) {
        this.start = val 
        this.getTableData()
      },
      detail (row) {
        this.$router.push({path: '/orderList/unlineOrderDetail',query: {package_order_id: row.package_order_id}})
      },
      onSubmit () {
        this.start = 1
        this.getTableData()
      }
    }
  }
</script>
<style scoped="true">
  .unlineOrderList{
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