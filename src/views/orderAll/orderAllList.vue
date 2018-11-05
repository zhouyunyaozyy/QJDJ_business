<template>
  <div class="indexSlideshowList">
    
    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.search" placeholder="客户名"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model='formInline.status' placeholder='请选择对应状态' clearable>
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
        prop="kehu"
        label="下单时间"
        min-width="120" align='center'>
      </el-table-column>
      <el-table-column
        prop="kehu"
        label="客户名"
        min-width="120" align='center'>
      </el-table-column>
      <el-table-column
        prop="pho"
        label="联系方式"
        min-width="120" align='center'>
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        min-width="120" align='center'>
      </el-table-column>
      <el-table-column
        prop="ping"
        label="产品平方数"
        min-width="120" align='center'>
      </el-table-column>
      <el-table-column
        prop="goods"
        label="所有商品信息"
        min-width="120" align='center'>
      </el-table-column>
      <el-table-column
        prop="id"
        label="物流单号"
        min-width="120" align='center'>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        min-width="120" align='center'>
      </el-table-column>
      <el-table-column
        prop="img"
        label="商品图片"
        min-width="120" align='center'>
        <template slot-scope="scope">
          <el-input placeholder="商品图片" v-model="scope.row.kehu"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
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
        tableData: [],
        formInline: {
          search: '',
          status: ''
        },
        form: {},
        categoryList: [{
          value: 0,
          label: "未派发"
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
          label: "已撤回订单"
        }],
        start: 1,
        total: 0,
        showFormBool: true, // 是否显示过滤框
      }
    },
    created () {
//      this.getTableData()
    },
    mounted () {},
    methods: {
      onsubmit () {
        for (let val in this.formInline) {
          if (this.formInline[val] !== '') {
            this.form[val] = this.formInline[val]
          }
        }
        console.log(this.form)
      },
      handleCurrentChange (val) {
        this.start = val 
        this.getTableData()
      },
      getTableData () {
        this.$axios({
          type: 'post',
          url: '/goods/activitycarouselgetlist',
          data: {page: this.start, ...this.form},
          fuc: (res) => {
            this.tableData = res.data
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