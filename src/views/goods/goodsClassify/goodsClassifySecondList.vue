<template>
  <div class="goodsClassifySecondList">
    <el-table
    :data="tableData"
    style="width: 100%">
      <el-table-column
        label="管理组列表">
        <el-table-column
          prop="cid"
          label="编号"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="c_name"
          label="类目名称"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="level"
          label="级别"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="goods_num"
          label="商品数量"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="seq"
          label="排序"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="id"
          label="操作"
          min-width="260" align='center'>
          <template slot-scope='scope'>
            <el-button @click='editSecondClassify(scope.row.parent_id, scope.row.cid)'>编辑</el-button>
            <el-button @click='removeSecondClassify(scope.row.cid)'>删除</el-button>
            <el-button @click='topSecondClassify(scope.row.cid)'>置顶</el-button>
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
    name: 'goodsClassifyList',
    data () {
      return {
        tableData: [],
        formInline: {
          title: ''
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
          url: '/goods/category/getinfobyadmin',
          data: {page: this.start, limit: 20, parent_id: this.$route.query.parent_id},
          fuc: (res) => {
            if (res.code === 200) {
              this.tableData = res.data.data
              this.total = res.data.count
            }
          }
        })
      },
      handleCurrentChange (val) {
        this.start = val 
        this.getTableData()
      },
      onSubmit () {
        
      },
      editSecondClassify (parent_id, cid) {
        this.$router.push({path: '/goods/goodsClassifyDetail', query: {level: 2, parent_id, cid}})
      },
      removeSecondClassify (cid) {
        this.$axios({
          type: 'post',
          url: '/goods/category/delete',
          data: {cid},
          fuc: (res) => {
            if (res.code === 200) {
              this.$message.success('删除成功')
              this.getTableData()
            }
          }
        })
      },
      topSecondClassify (cid) {
        this.$axios({
          type: 'post',
          url: '/goods/category/top',
          data: {cid},
          fuc: (res) => {
            if (res.code === 200) {
              this.$message.success('置顶成功')
              this.getTableData()
            }
          }
        })
      }
    }
  }
</script>
<style scoped="true">
  .goodsClassifySecondList{
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