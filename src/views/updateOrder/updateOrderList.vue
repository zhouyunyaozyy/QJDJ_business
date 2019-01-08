<template>
  <div class="indexSlideshowList">
    <el-button style="margin-bottom: 10px;" @click='addSlideshow'>添加订单</el-button>
    
    <el-table
    :data="tableData"
    style="width: 100%" border @row-click="handleCurrentChange">
      <el-table-column
        prop="productId"
        label="产品类型"
        min-width="140" align='center'>
        <template slot-scope="scope">
          <el-select v-model="scope.row.productId" placeholder="请选择">
            <el-option
              v-for="item in productList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="clientName"
        label="客户名"
        min-width="120" align='center'>
        <template slot-scope="scope">
          <el-input placeholder="客户名" v-model="scope.row.clientName"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="clientPhone"
        label="联系方式"
        min-width="120" align='center'>
        <template slot-scope="scope">
          <el-input placeholder="联系方式" v-model="scope.row.clientPhone"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        min-width="200" align='center'>
        <template slot-scope="scope">
<!--          <el-input placeholder="地址" v-model="scope.row.address"></el-input>-->
          <el-autocomplete
            v-model="scope.row.address"
            :fetch-suggestions="querySearchAsync"
            placeholder="地址"
            @select="handleSelect"
            :trigger-on-focus="false"
          ></el-autocomplete>
        </template>
      </el-table-column>
      <el-table-column
        prop="productSize"
        label="产品平方数"
        min-width="120" align='center'>
        <template slot-scope="scope">
          <el-input placeholder="产品平方数" v-model="scope.row.productSize"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="productInfo"
        label="所有商品信息"
        min-width="120" align='center'>
        <template slot-scope="scope">
          <el-input placeholder="商品信息" v-model="scope.row.productInfo"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="logisticsNumber"
        label="物流单号"
        min-width="120" align='center'>
        <template slot-scope="scope">
          <el-input placeholder="物流单号" v-model="scope.row.logisticsNumber"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        min-width="120" align='center'>
        <template slot-scope="scope">
          <el-input placeholder="备注" v-model="scope.row.remark"></el-input>
        </template>
      </el-table-column>
      <el-table-column
        prop="productPics"
        label="商品图片"
        min-width="120" align='center'>
        <template slot-scope="scope">
<!--          <el-input placeholder="商品图片" v-model="scope.row.kehu"></el-input>-->
          <el-upload
          class="avatar-uploader"
          action="http://192.168.100.122:5110/bhs-fileserver/file/uploadSingle"
          :before-upload="beforeUpload"
          :show-file-list="false">
          <img v-if="scope.row.productPicsUrl" :src="scope.row.productPicsUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
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

    <el-button style="margin: 10px 10px 0 10px;" @click="onsubmit">上传</el-button>
    <el-button @click="onlySave">保存到草稿箱</el-button>
  </div>
</template>

<script>
  export default {
    name: 'unlineBusinessList',
    data () {
      return {
        changeRow: {},
        tableData: [],
        productList: [],
        showFormBool: true, // 是否显示过滤框
      }
    },
    created () {
      this.$axios({
        type: 'get',
        url: '/shop-product/list',
        data: {},
        fuc: (res) => {
          this.productList = res
        }
      })
//      this.getTableData()
    },
    mounted () {},
    methods: {
      querySearchAsync(queryString, cb) {
//        var restaurants = this.restaurants;
//        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
//
//        clearTimeout(this.timeout);
//        this.timeout = setTimeout(() => {
//          cb(results);
//        }, 3000 * Math.random());
        if (queryString) {
          this.$axios({
            type: 'get',
            url: '/site/' + queryString,
            data: {},
            fuc: (res) => {
              let arr = []
              for (let val of res) {
                arr.push({value: val.name})
              }
              cb(arr)
            }
          })
          
        }
        
        console.log(queryString, cb)
      },
      handleSelect(item) {
        console.log(item);
      },
      
      
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
          clientName: "",
          clientPhone: "",
          address: "",
          productSize: "",
          productInfo: "",
          logisticsNumber: "",
          remark: "",
          productPics: "",
          productPicsUrl: "",
        })
      },
      handleCurrentChange (row, event, column) {
//        console.log(1, row, event, column)
        this.changeRow = row
      },
      beforeUpload (file) {
        let formData = new FormData()
        formData.append('pictures', file)
        this.$axios({
          type: 'post',
          url: '/shop-order/upload-picture',
          data: formData,
          fuc: (res) => {
            console.log(1, res, this.changeRow)
            this.changeRow.productPics = res.urls
            this.changeRow.productPicsUrl = res["origin-urls"]
          }
        }, 1)
        return false
      },
      delOrder (scope) {
        this.tableData.splice(scope.$index, 1)
        this.$message.success('操作成功')
      },
      onsubmit () {
        for (let val of this.tableData) {
          this.$axios({
            type: 'post',
            url: '/shop-order/save',
            data: val,
            fuc: (res) => {
              this.$deleteOneTag('/orderAll/orderAllList')
            }
          })
        }
      },
      onlySave () {
        for (let val of this.tableData) {
          this.$axios({
            type: 'post',
            url: '/shop-order/save-draft',
            data: val,
            fuc: (res) => {
              this.$deleteOneTag('/orderHistory/orderHistoryList')
            }
          })
        }
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
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 90px;
    height: 34px;
    line-height: 34px;
    text-align: center;
  }
  .avatar {
    width: 90px;
    height: 34px;
    display: block;
  }
</style>