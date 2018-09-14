<template>
  <div class="indexSlideshowList">
    <el-select v-model='selectData' placeholder="请选择" clearable>
      <el-option
        v-for='item in selectArr'
        :label="item.label"
        :value="item.value"
        :key="item.value">
      </el-option>
    </el-select>

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="附近">
        <el-table-column
          prop="goods_activity_carousel_id"
          label="编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="business_offline_id"
          label="缩略图"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <img style="width: 60px;height: 60px;" :src="scope.row.image_path + scope.row.image"/>
          </template>
        </el-table-column>
        <el-table-column
          prop="url"
          label="跳转类型"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="name"
          label="跳转后的页面名称或url"
          min-width="120" align='center'>
          <template slot-scope='scope'>商城轮播图</template>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="位置"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="remark"
          label="顺序"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="status"
          label="显示状态"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if='scope.row.status == -1'>不显示</span>
            <span v-else>显示</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="200" align='center'>
          <template slot-scope='scope'>
            <el-button @click="editSlideShow(scope.row)">编辑</el-button>
            <el-button @click='removeSlideShow(scope.row)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  export default {
    name: 'unlineBusinessList',
    data () {
      return {
        tableData: [],
        selectData: '',
        selectArr: [
          {label: '全部', value: 1},
          {label: '轮播图', value: 2},
          {label: '全部', value: 3},
        ],
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
          url: '/goods/activitycarouselgetlist',
          data: {goods_activity_category_id: 2},
          fuc: (res) => {
            this.tableData = res.data
          }
        })
      },
      editSlideShow (row) {
        this.$router.push({path: '/indexConfig/nearbyDetail', query: {goods_activity_carousel_id: row.goods_activity_carousel_id}})
      },
      removeSlideShow (row) {
        this.$axios({
            type: 'post',
            url: '/goods/activitycarouseldelete',
            data: {goods_activity_carousel_id: row.goods_activity_carousel_id},
            fuc: (res) => {
            if (res.code == 200) {
          this.$message.success('删除成功')
          this.getTableData()
        }
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
