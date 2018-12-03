<template>
  <div class="indexSlideshowList">
    
    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.clientName" placeholder="客户名"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model='formInline.stateFlag' placeholder='请选择对应状态' clearable>
            <el-option v-for='item in categoryList' :label='item.label' :key='item.value' :value='item.value'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onsubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <el-table
    :data="tableData"
    style="width: 100%" border>
      <el-table-column
        prop="updateTime"
        label="下单时间"
        min-width="120" align='center'>
      </el-table-column>
      <el-table-column
        prop="clientName"
        label="客户名"
        min-width="120" align='center'>
      </el-table-column>
      <el-table-column
        prop="clientPhone"
        label="联系方式"
        min-width="120" align='center'>
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        min-width="120" align='center'>
      </el-table-column>
      <el-table-column
        prop="productSize"
        label="产品平方数"
        min-width="120" align='center'>
      </el-table-column>
      <el-table-column
        prop="productInfo"
        label="所有商品信息"
        min-width="120" align='center'>
      </el-table-column>
      <el-table-column
        prop="logisticsNumber"
        label="物流单号"
        min-width="120" align='center'>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        min-width="120" align='center'>
      </el-table-column>
      <el-table-column
        prop="productPics"
        label="商品图片"
        min-width="120" align='center'>
        <template slot-scope="scope">
          <img :src="scope.row.productPics" width="50px" height="50px">
        </template>
      </el-table-column>
      <el-table-column
        prop="stateVal"
        label="订单状态"
        min-width="120" align='center'>
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
    name: 'unlineBusinessList',
    data () {
      return {
        form: {},
        tableData: [],
        formInline: {
          clientName: '',
          stateFlag: '-1'
        },
        form: {},
//        -1-全部 1-未接单，2-未预约，3-已预约，4-已开工，5-已完工，6-未审核，7-已审核，8-已失效，9-已撤回
        categoryList: [{
          value: '-1',
          label: "全部"
        },{
          value: 1,
          label: "未接单"
        },{
          value: 2,
          label: "未预约"
        },{
          value: 3,
          label: "已预约"
        },{
          value: 4,
          label: "已开工"
        },{
          value: 5,
          label: "已完工"
        },{
          value: 6,
          label: "未审核退单"
        },{
          value: 7,
          label: "已审核退单"
        },{
          value: 8,
          label: "已失效"
        },{
          value: 9,
          label: "已撤回订单"
        }],
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
      onsubmit () {
        this.form = {}
        for (let val in this.formInline) {
          if (this.formInline[val] !== '') {
            this.form[val] = this.formInline[val]
          }
        }
        console.log(this.form)
        this.getTableData()
      },
      handleCurrentChange (val) {
        this.start = val 
        this.getTableData()
      },
      getTableData () {
        this.$axios({
          type: 'post',
          url: '/shop-order/list',
          data: {current: this.start, size: 20, ...this.form},
          fuc: (res) => {
            this.tableData = res.records
            this.total = res.total
          }
        })
      }
    }
  }
</script>
<style scoped="true">
  .indexSlideshowList{
    margin: 10px 20px 0;
    overflow: hidden;
  }
</style>