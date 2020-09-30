<template>
  <div>

<!--    <el-card>-->
<!--      <el-page-header @back="$router.back()" :content="'配置 '+editJobForm.name">-->
<!--      </el-page-header>-->
<!--      <el-divider></el-divider>-->
      <el-form :model="editJobForm" :rules="rules" ref="editJobFormRef" label-width="100px"
               size="normal">
        <el-form-item label="Job名称" prop="name"  >
          <el-col :span="11">
            <el-input v-model="editJobForm.name" :disabled="true"></el-input>
          </el-col>

        </el-form-item>

        <el-form-item
            v-for="(param, index) in editJobForm.params"
            :label="'参数' + parseInt(index+1)"
            :key="param.index"
            :prop="param.name"
        >
          <el-row :gutter="20">
            <el-col :span="6">
              <el-input  v-model="param.name" placeholder="参数名称"></el-input>
            </el-col>
            <el-col :span="6">
              <el-input  v-model="param.defaultValue" placeholder="参数默认值"></el-input>
            </el-col>
            <el-col :span="6">
              <el-input  v-model="param.description" placeholder="参数描述"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button class="paramdel" @click.prevent="removeParam(param)">删除</el-button>
            </el-col>
          </el-row>
        </el-form-item>


        <el-form-item label="URL" prop="jenkinsfile_url" required>
          <el-col :span="11">
            <el-input v-model="editJobForm.jenkinsfile_url" placeholder="jenkinsfile git url"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="选择凭证" prop="credid">

          <el-select v-model="editJobForm.credid" placeholder="请选择凭证">
            <el-option :label="credential.name" :value="credential.id" v-for="credential in  credentials"
                       :key="credential.id"></el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="JenkinsFile" prop="jenkinsfilename" required>
          <el-col :span="11">
            <el-input v-model="editJobForm.jenkinsfilename" placeholder="jenkinsfile name" value="Jenkinsfile"></el-input>
          </el-col>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" @click="submitForm">保存配置</el-button>
          <el-button @click="addParam">新增参数</el-button>
          <el-button @click="$refs['editJobFormRef'].resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
<!--    </el-card>-->

  </div>
</template>

<script>
export default {
  name: "EditJob",
  data() {
    return {
      editJobForm: {
        params:[]
      },
      rules: {},
      credentials: [],
      jobid:''

    }
  },
  methods: {
    submitForm() {
      console.log(this.editJobForm);
      this.$http.put('jobs/'+this.jobid+'/', this.editJobForm).then(res => {
        this.$message.success("修改Item成功")
        // this.$refs['editJobFormRef'].resetFields();
        this.$router.push('/jenkins/jobs')
      }).catch(err => {
        this.$message.error("修改Item失败")
      })
    },
    get_credentials() {
      this.$http.get('jobs/get_credentials/').then(res => {
        this.credentials = res.data
      }).catch(err => {
      })
    },
    removeParam(item) {
      var index = this.editJobForm.params.indexOf(item)
      if (index !== -1) {
        this.editJobForm.params.splice(index, 1)
      }
    },
    addParam() {
      this.editJobForm.params.push({
        defaultValue: '',
        name: '',
        description: "param"+(this.editJobForm.params.length+1)
      });
    },
    getJobinfo(){
      this.$http.get('jobs/'+this.jobid+'/').then(res=>{
        this.editJobForm = res.data
        if(res.data.params){
          this.editJobForm.params = JSON.parse(res.data.params.replace(/\'/g,'"'))
        }else {
          this.editJobForm.params=[]
        }

      })
    }
  },
  created() {
    this.jobid = this.$route.path.split("/").pop()
    this.get_credentials()
    this.getJobinfo()
  }
}
</script>

<style lang="less" scoped>

.el-col {
  padding-left: 0 !important;
}
.el-col-4{
  padding-left: 10px !important;
}


</style>