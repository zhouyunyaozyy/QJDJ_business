<template>
  <div class="indexSlideshowList">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="商品分类">
        <el-select v-model='formInline.category' placeholder='请选择对应状态'>
          <el-option v-for='item in categoryList' :label='item.label' :key='item.value' :value='item.value'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="省">
        <el-select v-model='formInline.province' placeholder='请选择对应状态' @change="provinceChange">
          <el-option v-for='item in provinceList' :label='item.name' :key='item.code' :value='item.code'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="市">
        <el-select v-model='formInline.city' placeholder='请选择对应状态'  @change="cityChange">
          <el-option v-for='item in cityList' :label='item.name' :key='item.code' :value='item.code'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="区/县">
        <el-select v-model='formInline.area' placeholder='请选择对应状态'  @change="areaChange">
          <el-option v-for='item in areaList' :label='item.name' :key='item.code' :value='item.code'></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div style="margin-top: 10px;">
      <p>提示：<span style="color: red">请选择类型和区域</span></p>
      <p style="margin: 0;margin-top:10px;">
        此区域产品安装费用约： 。。。
      </p>
      <p style="margin: 0;color: red;font-size: 14px;">注意此价格仅作用户参考，实际情况需与师傅沟通才可确认！</p>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        formInline: {
          category: '',
          province: "",
          city: "",
          area: ""
        },
        categoryList: [
          {label: "集成墙板", value: 0},
          {label: "桑拿板", value: 1},
          {label: "防腐板", value: 2},
          {label: "吊顶", value: 3},
          {label: "吸音板", value: 4}
        ],
        provinceList: [],
        cityList: [],
        areaList: []
      }
    },
    created () {
      this.$axios({
        type: 'get',
        url: '/site/provinces',
        data: {},
        fuc: (res) => {
          this.provinceList = res
        }
      })
    },
    methods: {
      provinceChange (code) {
        this.$axios({
          type: 'get',
          url: '/site/cities/' + code,
          data: {},
          fuc: (res) => {
            this.cityList = res
            this.formInline.city = ""
            this.formInline.area = ""
          }
        })
      },
      cityChange (code) {
        this.$axios({
          type: 'get',
          url: '/site/areas/' + code,
          data: {},
          fuc: (res) => {
            this.areaList = res
            this.formInline.area = ""
          }
        })
      },
      areaChange (code) {},
    }
  }
</script>

<style scoped="true">
  .indexSlideshowList{
    margin: 10px 20px 0;
    overflow: hidden;
  }
</style>