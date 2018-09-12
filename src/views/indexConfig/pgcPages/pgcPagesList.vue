<template>
  <div>
    <el-button @click="addPgc">添加pgc</el-button>

  </div>

</template>
<script>
  export default {
    data () {
      return {

      }
    },
    methods: {
      addPgc () {
        this.$router.push('/indexConfig/pgcPagesDetail')
      }
    }
  }

</script>
