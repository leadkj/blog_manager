<template>
  <div>

    <el-card>
      <el-page-header @back="$router.back()" content="新建Item">
      </el-page-header>
      <el-divider></el-divider>
      <el-form :model="JobForm" :rules="rules" ref="jobFormRef" label-width="100px"
               size="normal">
        <el-form-item label="Job名称" prop="name" required>
          <el-col :span="11">
            <el-input v-model="JobForm.name"></el-input>
          </el-col>

        </el-form-item>

        <el-form-item
            v-for="(param, index) in JobForm.params"
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
            <el-input v-model="JobForm.jenkinsfile_url" placeholder="jenkinsfile git url"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="选择凭证" prop="credid">

          <el-select v-model="JobForm.credid" placeholder="请选择凭证">
            <el-option :label="credential.name" :value="credential.id" v-for="credential in  credentials"
                       :key="credential.id"></el-option>
          </el-select>

        </el-form-item>
        <el-form-item label="JenkinsFile" prop="jenkinsfilename" required>
          <el-col :span="11">
            <el-input v-model="JobForm.jenkinsfilename" placeholder="jenkinsfile name" value="Jenkinsfile"></el-input>
          </el-col>
        </el-form-item>


        <el-form-item>
          <el-button type="primary" @click="submitForm">立即创建</el-button>
          <el-button @click="addParam">新增参数</el-button>
          <el-button @click="$refs['jobFormRef'].resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>

<script>
export default {
  name: "CreateJob",
  data() {
    return {
      JobForm: {
        params: [
          {
            name: '参数名称',
            defaultValue: '默认值',
            description: '参数描述'
          }
        ]
      },
      rules: {},
      credentials: [],

    }
  },
  methods: {
    submitForm() {
      this.$http.post('jobs/', this.JobForm).then(res => {
        this.$message.success("创建Item成功")
        this.$refs['jobFormRef'].resetFields();
      }).catch(err => {
        this.$message.error("创建Item失败")
      })
    },
    get_credentials() {
      this.$http.get('jobs/get_credentials/').then(res => {
        console.log(res);
        this.credentials = res.data
      }).catch(err => {
      })
    },
    removeParam(item) {
      var index = this.JobForm.params.indexOf(item)
      if (index !== -1) {
        this.JobForm.params.splice(index, 1)
      }
    },
    addParam() {
      this.JobForm.params.push({
        defaultValue: '',
        name: '',
        description: "param"+(this.JobForm.params.length+1)
      });
    }
  },
  created() {
    this.get_credentials()
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