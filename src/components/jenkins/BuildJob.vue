<template>
        <div>
          <el-form :model="buildJobForm" ref="buildJobFormRef" label-width="100px"
                   size="normal">
            <el-form-item label="Job名称" prop="name" style="display: none">
              <el-col :span="11">
                <el-input v-model="buildJobForm.name" :disabled="true"></el-input>
              </el-col>

            </el-form-item>
            <el-form-item
                v-for="(param, index) in buildJobForm.params"
                :label="'参数' + parseInt(index+1)"
                :key="param.index"
                :prop="param.name"
            >
              <el-row :gutter="20">
                <el-col :span="6">
                  <el-input v-model="param.name" placeholder="参数名称" :disabled="true"></el-input>
                </el-col>
                <el-col :span="6">
                  <el-input v-model="param.defaultValue" placeholder="参数默认值"></el-input>
                </el-col>
                <el-col :span="6">
                  <el-input v-model="param.description" placeholder="参数描述" :disabled="true"></el-input>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm">立即构建</el-button>
            </el-form-item>
          </el-form>
          <div style="white-space: pre-wrap" ref="buildoOutputRef" v-html="output">
          </div>
          <div v-show="status"><i class="el-icon-loading"></i></div>
        </div>
</template>

<script>
export default {
  name: "BuildJob",
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
    submitForm() {
      console.log(this.buildJobForm);
      this.$http.post('jobs/build_job/', this.buildJobForm).then(res => {
        this.$message.success("修改Item成功")
        // this.$refs['buildJobFormRef'].resetFields();
        // this.$router.push('/jenkins/jobs')
      }).catch(err => {
        this.$message.error("修改Item失败")
      })
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