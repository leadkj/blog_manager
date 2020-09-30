<template>
  <div style="height: 100%;">
    <div class="back">
      <el-page-header @back="$router.push('/jenkins/jobs')" :content="'构建 '+buildJobForm.name">
      </el-page-header>
    </div>
    <el-divider></el-divider>
    <el-container class="build-main">
      <!--      <el-header>-->

      <!--      </el-header>-->
      <el-aside width="150px">
        <el-menu
            :unique-opened="true"
        >
          <el-menu-item index="1">
            <span slot="title" @click="goto('/jenkins/createjob')">状态</span>
          </el-menu-item>
          <el-divider></el-divider>
          <el-menu-item index="2">
            <span slot="title">变更历史</span>
          </el-menu-item>
          <el-divider></el-divider>
          <el-menu-item index="3">
            <span slot="title" @click="gotobuild">立即构建</span>
          </el-menu-item>
          <el-divider></el-divider>
          <el-menu-item index="2">
            <span slot="title" @click="gotoutput">Build Log</span>
          </el-menu-item>
          <el-divider></el-divider>
          <el-menu-item index="4">
            <span slot="title" @click="gotoedit">配置项目</span>
          </el-menu-item>
          <el-divider></el-divider>
          <el-menu-item index="5">
            <span slot="title">删除Pipeline</span>
          </el-menu-item>
          <el-divider></el-divider>
          <el-menu-item index="6">
            <span slot="title">Full stage View</span>
          </el-menu-item>
          <el-divider></el-divider>
          <el-menu-item index="7">
            <span slot="title">重命名</span>
          </el-menu-item>

        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "JobInfo",
  data() {
    return {
      output: '',
      status: '',
      buildJobForm: {
        params: []
      },
      jobid: '',


    }
  },
  methods: {
    gotobuild() {
      this.$router.push('/jenkins/buildjob/' + this.jobid)
    },
    gotoutput(){
      this.$router.push('/jenkins/buildlog/' +this.buildJobForm.name)
    },
    gotoedit(){
      this.$router.push('/jenkins/editjob/'+this.jobid)
    },
    submitForm() {
      console.log(this.buildJobForm);
      this.$http.post('jobs/build_job/', this.buildJobForm).then(res => {
        this.$message.success("修改Item成功")
        // this.$refs['buildJobFormRef'].resetFields();
        // this.$router.push('/jenkins/jobs')
      }).catch(err => {
        this.$message.error("修改Item失败")
      })
      this.getConsoleOutput()
    },
    getJobinfo() {
      this.$http.get('jobs/' + this.jobid + '/').then(res => {
        this.buildJobForm = res.data
        if (res.data.params) {
          this.buildJobForm.params = JSON.parse(res.data.params.replace(/\'/g, '"'))
        } else {
          this.buildJobForm.params = []
        }
      })
    },
    getConsoleOutput() {
      this.status = true
      this.websocket = new WebSocket("ws://127.0.0.1/ws/get_build_output/")
      this.websocket.onopen = () => {
        const data = {"jobname": this.buildJobForm.name}
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
    this.jobid = this.$route.path.split("/").pop()
    this.getJobinfo()
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

.back {
  padding-left: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  background-color: #ffffff;
}

.el-form {
  padding-top: 10px;
}
</style>