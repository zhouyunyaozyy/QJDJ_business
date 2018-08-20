<template>
  <div class="unlineOrderDetail">
    <p v-if='tableData[0]'>当前订单状态： 
      <span v-if='tableData[0].status == -1'>取消订单</span>
      <span v-if='tableData[0].status == 0'>待支付</span>
      <span v-if='tableData[0].status == 1'>已支付</span>
      <span v-if='tableData[0].status == 2'>已完成</span>
      <span v-if='tableData[0].status == 3'>已退款</span>
    </p>
    <h5>基本信息</h5>
    <el-table
    :data="tableData" border
    style="width: 100%">
      <el-table-column label='订单编号' prop='package_order_no' min-width="120" align='center'></el-table-column>
      <el-table-column label='订单时间' prop='create_at' min-width="120" align='center'></el-table-column>
      <el-table-column label='订单付款时间' prop='pay_at' min-width="120" align='center'></el-table-column>
      <el-table-column label='购买人ID' prop='nickname' min-width="120" align='center'></el-table-column>
      <el-table-column label='购买人电话' prop='user_phone' min-width="120" align='center'></el-table-column>
      <el-table-column label='支付方式' prop='onorder_pay_way' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>现金支付：{{scope.row.cash / 100}},余额支付：{{scope.row.balance / 100}},银贝支付：{{scope.row.silver}},金贝支付：{{scope.row.gold}}</span>
        </template>
      </el-table-column>
      <el-table-column label='流水号' prop='serial_number' min-width="120" align='center'></el-table-column>
    </el-table>
    <h5>费用信息</h5>
    <el-table
    :data="tableData" border
    style="width: 100%">
      <el-table-column label='订单总金额' prop='total_cost' min-width="120" align='center'></el-table-column>
      <el-table-column label='金贝抵扣' prop='gold' min-width="120" align='center'></el-table-column>
      <el-table-column label='余额抵扣' prop='balance' min-width="120" align='center'></el-table-column>
      <el-table-column label='产生银贝' prop='silver' min-width="120" align='center'></el-table-column>
      <el-table-column label='应付款金额' prop='cash' min-width="120" align='center'></el-table-column>
    </el-table>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        tableData: []
      }
    },
    created () {
      this.$axios({
        type: 'post',
        url: '/Order/downOrderDetial',
        data: {id: this.$route.query.package_order_id},
        fuc: (res) => {
          this.tableData.push(res.data)
        }
      })
    },
    methods: {
      
    }
  }
</script>
<style scoped="true">
  .unlineOrderDetail{
    margin: 10px 20px 20px;
    overflow: hidden;
  }
  
</style>
<style>
  .unlineOrderDetail .el-table th {
    background: #f5f7fa;
  }
</style>
