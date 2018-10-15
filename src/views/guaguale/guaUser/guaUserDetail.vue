<template>
  <div class="goodsList">
    <p>{{username}}  总参与数：{{times}}  总计金贝：{{gold}}</p>

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
          prop="end_time"
          label="商品名称"
          min-width="120" align='center'>
          <template slot-scope='scope'>
            <span v-if="scope.row.reward_type == 0">未中奖</span>
            <span v-if="scope.row.reward_type == 1">{{scope.row.goods_name}}</span>
            <span v-if="scope.row.reward_type == 2">{{scope.row.reward_gold}}金贝</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="是否领取"
          min-width="140" align='center'>
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">未领取</span>
            <span v-if="scope.row.status == 2">未使用</span>
            <span v-if="scope.row.status == 3">已使用</span>
          </template>
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
        times: 0,
        gold: 0,
        username: '',
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
            url: '/game/gameUserDetail',
            data: {user_id: this.$route.query.user_id},
            fuc: (res) => {
            if (res.code == 200) {
          this.tableData = res.data.data
          this.username = res.data.param.user_name
          this.times = res.data.param.times
          this.gold = res.data.param.gold
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
