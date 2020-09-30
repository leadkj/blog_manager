<template>
        <div>
          <div style="white-space: pre-wrap" ref="buildoOutputRef" v-html="output">
          </div>
          <div v-show="status"><i class="el-icon-loading"></i></div>
        </div>
</template>

<script>
export default {
  name: "BuildLog",
  data() {
    return {
      output: '',
      status: '',
      jobname:''
    }
  },
  methods: {
    getConsoleOutput() {
      this.status = true
      this.websocket = new WebSocket("ws://127.0.0.1/ws/get_build_output/")
      this.websocket.onopen = () => {
        const data = {"jobname": this.jobname}
        this.websocket.send(JSON.stringify(data))
      }
      this.websocket.onmessage = res => {
        let data = JSON.parse(res.data)
        this.output = data.output
        this.status = data.status
        console.log(JSON.parse(res.data));
        // this.$refs.buildoOutputRef
      }
    }
  },
  created() {
    this.jobname = this.$route.path.split("/").pop()
    this.getConsoleOutput()
  }
}
</script>

<style lang="less" scoped>

//.el-col {
//  padding-left: 0 !important;
//}
//
//.el-col-4 {
//  padding-left: 10px !important;
//}
.el-table-column {
  text-align: center;
}

.el-container {
  height: 100%;
}

.el-header {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-divider {
  margin: 0 0;
  height: 0.5px;
  display: block;
  background-color: #a9aaad;
}

.el-aside {
  background-color: #ffffff;
  color: #333;
  text-align: center;
  align-items: center;
  line-height: 200px;

}

.el-menu {
  background-color: #ffffff;
}

.el-main {
  background-color: #ffffff;
  color: #333;
  //text-align: center;
  //line-height: 160px;
}
.back{
  padding-left: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: #ffffff;
}
.el-form{
  padding-top: 10px;
}
</style>