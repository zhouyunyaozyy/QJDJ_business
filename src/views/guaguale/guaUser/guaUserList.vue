<template>
  <div class="goodsList">
    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="输入搜索">
          <el-input v-model="formInline.search" placeholder="用户ID/用户名称"></el-input>
        </el-form-item>
        <el-form-item label="选择">
          <el-select v-model='formInline.reward_type' placeholder="请选择" clearable>
            <el-option
              label="商品"
              value="1">
            </el-option>
            <el-option
              label="金贝"
              value="2">
            </el-option>
          </el-select>
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
        label="列表">
        <el-table-column
          prop="create_at"
          label="参与时间"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            {{$formatTime(scope.row.create_at)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="user_id"
          label="ID"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名称"
          min-width="140" align='center'>
        </el-table-column>
        <el-table-column
          prop="times"
          label="参与次数"
          min-width="120" align='center'>
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="120" align='center'>
          <template slot-scope="scope">
            <el-button @click="checkUser(scope.row.user_id)">查看</el-button>
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
    name: 'goodsList',
    data () {
      return {
        tableData: [],
        formInline: {
          search: '',
          reward_type: ''
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
            url: '/game/gameUserFunction',
            data: {page: this.start, page_size: 20, ...this.formInline},
            fuc: (res) => {
            if (res.code == 200) {
          this.tableData = res.data.data
          this.total = res.data.total
        }
      }
      })
      },
      handleCurrentChange (val) {
        this.start = val
        this.getTableData()
      },
      checkUser (id) {
        this.$router.push({path: '/guaguale/guaUserDetail', query: {user_id: id}})
      },
      onSubmit () {
        this.getTableData()
      }
    }
  }
</script>
<style scoped="true">
  .goodsList{
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
