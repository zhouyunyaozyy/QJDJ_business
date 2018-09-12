<template>
  <div class="onlineOrderDetail">
    <p v-if='formData[0] && formData[0].ginfo_except_status == 0 && formData[0].onorder_pay_status == 1'>当前订单状态： <span>未支付</span></p>
    
    <p v-else-if='formData[0] && formData[0].ginfo_except_status == 0 && formData[0].onorder_pay_status == 2'>当前订单状态： <span v-for='item in ginfo_deliver_statusArr' v-if='item.value == formData[0].ginfo_deliver_status'>{{item.label}}</span></p>
    
    <p v-else-if='formData[0]'>当前订单状态： <span v-for='item in ginfo_except_statusArr' v-if='item.value == formData[0].ginfo_except_status'>{{item.label}}</span></p>
    <h5>基本信息</h5>
    <el-table
    :data="formData" border
    style="width: 100%">
      <el-table-column label='订单编号' prop='onorder_order_id' min-width="120" align='center'></el-table-column>
      <el-table-column label='订单创建时间' prop='onorder_create_at' min-width="120" align='center'></el-table-column>
      <el-table-column label='订单付款时间' prop='onorder_payment_at' min-width="120" align='center'>
      </el-table-column>
      <el-table-column label='订单收货时间' prop='onorder_take_at' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.onorder_take_at'>{{scope.row.onorder_take_at}}</span>
          <span v-else>-</span>
        </template></el-table-column>
      <el-table-column label='订单完成时间' prop='onorder_finish_at' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.onorder_finish_at'>{{scope.row.onorder_finish_at}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label='订单关闭时间' prop='onorder_close_at' min-width="120" align='center'>
      
        <template slot-scope='scope'>
          <span v-if='scope.row.onorder_close_at'>{{scope.row.onorder_close_at}}</span>
          <span v-else>-</span>
        </template></el-table-column>
      <el-table-column label='订单关闭原因' prop='onorder_close_reason' min-width="120" align='center'>
      
        <template slot-scope='scope'>
          <span v-if='scope.row.onorder_close_reason'>{{scope.row.onorder_close_reason}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label='流水号' prop='onorder_flow_num' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.onorder_flow_num'>{{scope.row.onorder_flow_num}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
    <el-table
    :data="formData" border
    style="width: 100%">
      <el-table-column label='商家名称' prop='ginfo_business_name' min-width="120" align='center'></el-table-column>
      <el-table-column label='购买人ID' prop='onorder_buyer_id' min-width="120" align='center'></el-table-column>
      <el-table-column label='购买人电话' prop='onorder_buyer_phone' min-width="120" align='center'></el-table-column>
      <el-table-column label='支付方式' prop='onorder_pay_way' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>现金支付：{{scope.row.onorder_cash / 100}},余额支付：{{scope.row.onorder_balance / 100}},银贝支付：{{scope.row.onorder_silver}},金贝支付：{{scope.row.onorder_gold}},铜贝支付：{{scope.row.onorder_copper}}</span>
        </template>
      </el-table-column>
      <el-table-column label='物流服务商' prop='ginfo_logistics' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.ginfo_logistics'>{{scope.row.ginfo_logistics}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label='物流单号' prop='ginfo_logistics_id' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.ginfo_logistics_id'>{{scope.row.ginfo_logistics_id}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label='留言信息' prop='onorder_leave_word' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.onorder_leave_word'>{{scope.row.onorder_leave_word}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label='异常信息' prop='onorder_except_info' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.onorder_except_info'>{{scope.row.onorder_except_info}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
    <h5>收货人信息</h5>
    <el-table
    :data="formData" border
    style="width: 100%">
      <el-table-column label='收货人' prop='receiver_receiver_name' min-width="160" align='center'></el-table-column>
      <el-table-column label='手机号码' prop='receiver_receiver_phone' min-width="160" align='center'></el-table-column>
      <el-table-column label='收货地址' prop='receiver_receiver_address' min-width="400" align='center'></el-table-column>
    </el-table>
    <h5>商品信息</h5>
    <el-table
    :data="tableData" border
    style="width: 100%">
      <el-table-column label='商品图片' prop='ginfo_g_pic' min-width="120" align='center'>
        <template slot-scope='scope'>
          <img :src='url + scope.row.ginfo_g_pic'>
        </template>
      </el-table-column>
      <el-table-column label='商家名称' prop='ginfo_business_name' min-width="120" align='center'></el-table-column>
      <el-table-column label='商品名称' prop='ginfo_g_name' min-width="120" align='center'></el-table-column>
      <el-table-column label='货号' prop='ginfo_goods_id' min-width="120" align='center'></el-table-column>
      <el-table-column label='商品规格' prop='ginfo_g_format' min-width="120" align='center'></el-table-column>
      <el-table-column label='单价' prop='ginfo_g_price' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>{{scope.row.ginfo_g_price / 100}}</span>
        </template>
      </el-table-column>
      <el-table-column label='运费' prop='ginfo_freight' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.ginfo_freight'>{{scope.row.ginfo_freight / 100}}</span>
        </template>
      </el-table-column>
      <el-table-column label='数量' prop='ginfo_g_num' min-width="120" align='center'></el-table-column>
      <el-table-column label='小计' prop='ginfo_subtotal' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>{{(scope.row.ginfo_subtotal + scope.row.ginfo_freight) / 100}}</span>
        </template>
      </el-table-column>
    </el-table>
    <h5>费用信息</h5>
    <el-table
    :data="formData" border
    style="width: 100%">
      <el-table-column label='运费' prop='ginfo_g_num' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.consume_freight'>{{scope.row.consume_freight / 100}}</span>
        </template>
      </el-table-column>
      <el-table-column label='银贝兑换' prop='consume_silvershell_change' min-width="120" align='center'></el-table-column>
      <el-table-column label='金贝抵扣' prop='consume_goldshell_deduct' min-width="120" align='center'></el-table-column>
      <el-table-column label='余额抵扣' prop='onorder_payment_at' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span>-</span>
        </template>
      </el-table-column>
    </el-table>
    <el-table
    :data="formData" border
    style="width: 100%">
      <el-table-column label='活动优惠' prop='consume_activity' min-width="120" align='center'></el-table-column>
      <el-table-column label='折扣金额' prop='consume_discount' min-width="120" align='center'></el-table-column>
      <el-table-column label='订单总金额' prop='consume_total_amount' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.consume_total_amount'>{{scope.row.consume_total_amount / 100}}</span>
        </template>
      </el-table-column>
      <el-table-column label='应付款金额' prop='consume_amount_payable' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.consume_amount_payable'>{{scope.row.consume_amount_payable / 100}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="width: 100%;height: 44px;border: 1px solid #ebeef5;background: #f5f7fa;">
      <p style="text-align: right;" v-if='formData[0]'>合计：￥<span>{{formData[0].consume_amount_payable / 100}}</span></p>
    </div>
    <h5 v-if='tableData[0] && tableData[0].ginfo_except_status != 0'>异常信息</h5>
    <el-table
    :data="tableData" border v-if='tableData[0] && tableData[0].ginfo_except_status != 0'
    style="width: 100%">
      <el-table-column label='异常类型' prop='exception_info_exc_type' min-width="120" align='center'>
        <template slot-scope='scope'>
          <span v-if='scope.row.except_status == 1'>换货</span>
          <span v-else>退货</span>
        </template>
      </el-table-column>
      <el-table-column label='申请时间' prop='exception_info_create_at' min-width="120" align='center'></el-table-column>
      <el-table-column label='退款编号' prop='exception_info_goods_id' min-width="120" align='center'></el-table-column>
      <el-table-column label='异常原因' prop='exception_info_exc_resason' min-width="120" align='center'></el-table-column>
    </el-table>
    <el-table
    :data="tableData" border v-if='tableData[0] && tableData[0].ginfo_except_status != 0'
    style="width: 100%">
      <el-table-column label='异常说明' prop='exception_info_exc_desc' min-width="120" align='center'></el-table-column>
      <el-table-column label='退款金额' prop='' min-width="120" align='center'></el-table-column>
      <el-table-column label='退款状态' prop='' min-width="120" align='center'></el-table-column>
      <el-table-column label='' prop='' min-width="120" align='center'></el-table-column>
    </el-table>
    <div v-if='tableData[0] && tableData[0].ginfo_except_status != 0'>
      用户凭证：
      <img v-for='item in JSON.parse(tableData[0].exception_info_p_url)' :src='item.url' style="width: 50px;height: 50px; margin: 6px;" @click='showBigImg(item.url)'>
      <el-dialog :visible.sync="imgDialog">
        <img :src='imgUrl'>
      </el-dialog>
    </div>
    <el-button style='margin: 15px;' v-if='tableData[0] && tableData[0].ginfo_except_status != 0 && tableData[0].ginfo_except_status < 3' type='success' @click='dialogSuccess = true'>审核通过</el-button>
    <el-button style='margin: 15px;' v-if='tableData[0] && tableData[0].ginfo_except_status != 0 && tableData[0].ginfo_except_status < 3' type='danger' @click='dialogRefuse = true'>驳回</el-button>
    
    <el-dialog title="审核通过" :visible.sync="dialogSuccess">
      <el-radio v-model="successType" label="both">退货退款</el-radio>
      <el-radio v-model="successType" label="only">不退货退款</el-radio>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSuccess = false">取 消</el-button>
        <el-button type="primary" @click="orderSuccess">确 定</el-button>
      </div>
    </el-dialog>
    
    <el-dialog title="填写驳回理由" :visible.sync="dialogRefuse">
      <el-checkbox v-model="refuseType">发送短信</el-checkbox>
      <el-input type='textarea' v-model='refuseInput' placeholder='请务必填写驳回理由'></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRefuse = false">取 消</el-button>
        <el-button type="primary" @click="orderRefuse">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        tableData: [],
        formData: [],
        total: '',
        url: '',
        imgDialog: false,
        imgUrl: '',
        dialogSuccess: false,
        dialogRefuse: false,
        successType: 'both',
        refuseType: true,
        refuseInput: '',
        info_id: '',
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
        ]
      }
    },
    created () {
      let form = {
        oid: this.$route.query.oid
      }
      if (this.$route.query.info_id) {
        this.info_id = this.$route.query.info_id
        form.info_id = this.info_id
      }
      this.$axios({
        type: 'post',
        url: this.info_id ? '/Order/getExcOrderDetialByid' : '/Order/getorderdetialbyid',
//        url: '/dsb/public/',
        data: form,
//        data: {},
        fuc: (res) => {
          if (res.code !== 200) {
            return
          }
          if (this.info_id) {
            this.formData = [res.data]
            this.tableData = [res.data]
            this.total = res.data.ginfo_subtotal + res.data.consume_freight
            this.url = res.category_logo_url
          } else {
            this.formData = [res.data.order_info]
            this.tableData = res.data.ginfo
            this.total = res.data.total
            this.url = res.category_logo_url
          }
        }
      })
    },
    methods: {
      showBigImg (url) {
        this.imgUrl = url
        this.imgDialog = true
      },
      orderSuccess () {
        this.$axios({
          type: 'post',
          url: '/Order/toexamine',
          data: {
            exc_id: this.formData[0].exception_info_exc_id,
            order_id: this.formData[0].onorder_order_id,
            oid: this.formData[0].onorder_oid,
            info_id: this.formData[0].ginfo_info_id,
            type: this.successType,
          },
          fuc: (res) => {
            if (res.code == 200) {
              this.$message.success('操作成功')
              this.$deleteOneTag('/orderList/onlineOrderList')
            }
          }
        })
      },
      orderRefuse () {
        if (this.refuseInput == '') {
          this.$message.warning('驳回理由为空，请重新填写')
          return false
        }
        this.$axios({
          type: 'post',
          url: '/Order/refuserequest',
          data: {
            exc_id: this.formData[0].exception_info_exc_id,
            order_id: this.formData[0].onorder_order_id,
            info_id: this.formData[0].ginfo_info_id,
            refuse_info: this.refuseInput,
            buy_phone: this.formData[0].onorder_buyer_phone,
            is_send: this.refuseType ? 1 : -1,
          },
          fuc: (res) => {
            if (res.code == 200) {
              this.$message.success('操作成功')
              this.$deleteOneTag('/orderList/onlineOrderList')
            }
          }
        })
      }
    }
  }
</script>
<style scoped="true">
  .onlineOrderDetail{
    margin: 10px 20px 20px;
    overflow: hidden;
  }
  
</style>
<style>
  .onlineOrderDetail .el-table th {
    background: #f5f7fa;
  }
</style>
