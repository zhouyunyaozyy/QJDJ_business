<template>
  <div class="indexSlideshowList">
    <el-button style="margin-bottom: 10px;" @click='addSlideshow'>添加订单</el-button>
    
    <el-table
    :data="tableData"
    style="width: 100%" border>
      <el-table-column
        prop="kehu"
        label="客户名"
        min-width="120" align='center'>
        <template slot-scope="scope">
          <el-input placeholder="客户名" v-model="scope.row.kehu"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="pho"
        label="联系方式"
        min-width="120" align='center'>
        <template slot-scope="scope">
          <el-input placeholder="联系方式" v-model="scope.row.kehu"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        min-width="120" align='center'>
        <template slot-scope="scope">
          <el-input placeholder="地址" v-model="scope.row.kehu"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="ping"
        label="产品平方数"
        min-width="120" align='center'>
        <template slot-scope="scope">
          <el-input placeholder="产品平方数" v-model="scope.row.kehu"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="goods"
        label="所有商品信息"
        min-width="120" align='center'>
        <template slot-scope="scope">
          <el-input placeholder="商品信息" v-model="scope.row.kehu"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        label="物流单号"
        min-width="120" align='center'>
        <template slot-scope="scope">
          <el-input placeholder="物流单号" v-model="scope.row.kehu"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        min-width="120" align='center'>
        <template slot-scope="scope">
          <el-input placeholder="备注" v-model="scope.row.kehu"></el-input>
        </template>
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
        prop="img"
        label="操作"
        min-width="120" align='center'>
        <template slot-scope="scope">
          <el-button @click="delOrder(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-button style="margin: 10px 10px 0 10px;">上传</el-button>
    <el-button>保存到草稿箱</el-button>
  </div>
</template>

<script>
  export default {
    name: 'unlineBusinessList',
    data () {
      return {
        tableData: [],
        showFormBool: true, // 是否显示过滤框
      }
    },
    created () {
//      this.getTableData()
    },
    mounted () {},
    methods: {
      getTableData () {
        this.$axios({
          type: 'post',
          url: '/goods/activitycarouselgetlist',
          data: {goods_activity_category_id: 3},
          fuc: (res) => {
            this.tableData = res.data
          }
        })
      },
      addSlideshow () {
        this.tableData.push({
          kehu: ""
        })
      },
      delOrder (scope) {
        this.tableData.splice(scope.$index, 1)
        this.$message.success('操作成功')
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