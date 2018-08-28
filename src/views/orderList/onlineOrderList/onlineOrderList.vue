<template>
  <div class="onlineOrderList">
    <el-button @click="changeStatus('all')" :type="type == 'all' ? 'primary' : ''">全部订单</el-button>
    <el-button @click="changeStatus('dp')" :type="type == 'dp' ? 'primary' : ''">待付款</el-button>
    <el-button @click="changeStatus('df')" :type="type == 'df' ? 'primary' : ''">待发货</el-button>
    <el-button @click="changeStatus('yf')" :type="type == 'yf' ? 'primary' : ''">已发货</el-button>
    <el-button @click="changeStatus('yd')" :type="type == 'yd' ? 'primary' : ''">已完成</el-button>
    <el-button @click="changeStatus('applyrefund ')" :type="type == 'applyrefund ' ? 'primary' : ''">退款申请</el-button>
    <el-button @click="changeStatus('waitrefund')" :type="type == 'waitrefund' ? 'primary' : ''">等待退款</el-button>
    <el-button @click="changeStatus('seccussrefund')" :type="type == 'seccussrefund' ? 'primary' : ''">退款成功</el-button>
    
    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.key_a" placeholder="订单编号/商品货号"></el-input>
        </el-form-item>
        <el-form-item label="收货人">
          <el-input v-model="formInline.key_b" placeholder="收货人姓名/手机号"></el-input>
        </el-form-item>
        <el-form-item label="购买人">
          <el-input v-model="formInline.key_c" placeholder="购买人"></el-input>
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker
            v-model="formInline.key_time"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="primary" @click="downloadExcell">导出Excell</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
    :data="tableData" :span-method="objectSpanMethod"
    style="width: 100%">
      <el-table-column
        label="管理组列表">
        <el-table-column
          prop="order_id"
          label="订单编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="create_at"
          label="订单生成时间"
          min-width="160" align='center'>
        </el-table-column>
        <el-table-column
          prop="name"
          label="商家名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="business_id"
          label="商家编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="g_name"
          label="商品名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="nickname"
          label="购买人ID"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="pay_way"
          label="支付方式"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>现金支付：{{scope.row.cash / 100}},余额支付：{{scope.row.balance / 100}},银贝支付：{{scope.row.silver}},金贝支付：{{scope.row.gold}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="total_amount"
          label="订单金额"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span>{{scope.row.total_amount / 100}}元</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="pay_status"
          label="订单状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.pay_status == 1'>未支付</span>
            <span v-else>已支付</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="g_name"
          label="配送状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-for='item in ginfo_deliver_statusArr' v-if='item.value == scope.row.deliver_status'>{{item.label}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="g_name"
          label="异常状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-for='item in ginfo_except_statusArr' v-if='item.value == scope.row.except_status'>{{item.label}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_prorate"
          label="分账"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.is_prorate == 0'>未分账</span>
            <span v-else>分账</span>
          </template>
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
          key_b: '',
          key_c: '',
          key_time: ''
        },
        order_type: [
          {value: 1, label: '金贝支付'},
          {value: 2, label: '银贝支付'},
          {value: 3, label: '现金支付'},
          {value: 4, label: '现金+金贝支付'},
          {value: 5, label: '金贝+铜贝支付'},
          {value: 6, label: '银贝+铜贝支付'},
          {value: 7, label: '现金+铜贝支付'},
          {value: 8, label: '金贝+余额'},
          {value: 9, label: '金贝+余额+现金'},
          {value: 10, label: '余额+现金'}
        ],
        ginfo_deliver_statusArr: [
          {value: 1, label: '等待出库'},
          {value: 2, label: '配送中'},
          {value: 3, label: '已签收'}
        ],
        ginfo_except_statusArr: [
          {value: 0, label: '正常订单'},
          {value: 1, label: '申请退款'},
          {value: 2, label: '退款中'},
          {value: 3, label: '退款成功'},
          {value: 4, label: '驳回'},
          {value: 5, label: '退款失败'},
        ],
        type: 'all',
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
      changeStatus (type) {
        this.type = type
        this.start = 1
        this.getTableData()
      },
      getTableData () {
        this.$axios({
          type: 'post',
          url: '/Order/orderlistbyadmin',
          data: {type: this.type, page: this.start, ...this.formInline},
          fuc: (res) => {
            if (res.code !== 200) {
              return
            }
            let _tableData = JSON.parse(JSON.stringify(res.data.order_list))
            let arr = []
            for (let val of _tableData) { // 订单
              let num = 0
              
              // 取总商品数量
              for (let n = 0; n < val.ginfo.length; n++) { // 商家
                num += val.ginfo[n].ginfo.length
              }
              val.num = num
              
              //重组数据
              for (let n = 0; n < val.ginfo.length; n++) { // 商家
                let goodsLength = val.ginfo[n].ginfo.length
                
                for (let i = 0; i < val.ginfo[n].ginfo.length; i++) { // 商品
                  if (n == 0 && i == 0) {
                    
                  } else {
                    val.num = 0
                  }
                  
                  if (i == 0) {
                    val.goodsNum = val.ginfo[n].ginfo.length
                  } else {
                    val.goodsNum = 0
                  }
                  let obj = {...val, ...val.ginfo[n].ginfo[i]}
                  arr.push(obj)
                }
              }
            }
            this.tableData = arr
            console.log(this.tableData)
            this.total = res.data.all_num
          }
        })
      },
      handleCurrentChange (val) {
        this.start = val 
        this.getTableData()
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0 || (columnIndex !== 2 && columnIndex !== 3 && columnIndex !== 4 && columnIndex !== 5 && columnIndex !== 6)) {
          if (row.num !== 0) {
            return {
              rowspan: row.num,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
        if (columnIndex == 2 || columnIndex == 3) {
          if (row.goodsNum !== 0) {
//            if (row.goodsNum == 1) {
//              return {
//                rowspan: row.num,
//                colspan: 1
//              };
//            }
            return {
              rowspan: row.goodsNum,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      },
      detail (row) {
        if (row.except_status && row.except_status > 0) {
          this.$router.push({path: '/orderList/onlineOrderDetail',query: {oid: row.oid, info_id: row.info_id}})
        } else {
          this.$router.push({path: '/orderList/onlineOrderDetail',query: {oid: row.oid}})
        }
      },
      downloadExcell () {
        this.$downloadExcell({
          url: '/order/export', type: this.type,
          ...this.formInline
        })
      },
      onSubmit () {
        this.start = 1
        this.getTableData()
      }
    }
  }
</script>
<style scoped="true">
  .onlineOrderList{
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