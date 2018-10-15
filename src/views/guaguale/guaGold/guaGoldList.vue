<template>
  <div class="goodsList">
    <div class="searchForm">
      <p @click='showFormBool = !showFormBool'>筛选查询<i v-if='showFormBool' class="el-icon-arrow-down"></i><i v-else class="el-icon-arrow-up"></i></p>
      <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if='showFormBool'>
        <el-form-item label="">
          <el-date-picker
            v-model="formInline.key_time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
            value-format="timestamp">
          </el-date-picker>
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
          prop="start_time"
          label="开始时间"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            {{$formatTime(scope.row.start_time)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="end_time"
          label="结束时间"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            {{$formatTime(scope.row.end_time)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="currency_num"
          label="总发放金贝"
          min-width="140" align='center'>
        </el-table-column>
        <el-table-column
          prop="perosn"
          label="总发放人数"
          min-width="120" align='center'>
        </el-table-column>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  export default {
    name: 'goodsList',
    data () {
      return {
        tableData: [],
        formInline: {
          key_time: []
        },
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
            url: '/game/gameCurrencyGrant',
            data: {start_time: this.formInline.key_time[0] ? this.formInline.key_time[0] / 1000 : '', end_time: this.formInline.key_time[1] ? this.formInline.key_time[1] / 1000 : ''},
          fuc: (res) => {
          if (res.code == 200) {
            this.tableData = [res.data]
          }
        }
      })
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
