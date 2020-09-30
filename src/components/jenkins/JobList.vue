<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="7">
        <el-input placeholder="请输入内容" v-model="queryinfo.username" clearable @clear="getUsers">
          <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
        </el-input>
      </el-col>
      <!--          <el-col :span="4">-->
      <!--            <el-button type="primary" plain @click="addUserdialogVisible=true">添加用户</el-button>-->
      <!--          </el-col>-->
    </el-row>
    <!--数据列表区域-->
    <el-table
        align="center"
        header-align="center"
        stripe
        :data="jobs.results"
        style="width: 100%">
      <el-table-column
          prop="status"
          label="S"
          width="80">
        <template slot-scope="scope">

          <i v-if="scope.row.color === 'blue'"><img src="../../assets/img/blue.png"></i>
          <i v-if="scope.row.color === 'red'"><img src="../../assets/img/red.png"></i>
          <i v-if="scope.row.color === 'notbuilt'"><img src="../../assets/img/nobuilt.png"></i>
        </template>
      </el-table-column>
      <el-table-column
          prop="stability"
          label="W"
          width="80">
        <template slot-scope="scope">
          <i v-if="scope.row.healthReport >= 80"><img src="../../assets/img/health-80plus.png"></i>
          <i v-else-if="scope.row.healthReport >=60"><img src="../../assets/img/health-60to79.png"></i>
          <i v-else-if="scope.row.healthReport >=40"><img src="../../assets/img/health-40to59.png"></i>
          <i v-else-if="scope.row.healthReport >=20"><img src="../../assets/img/health-20to39.png"></i>
          <i v-else-if="scope.row.healthReport >=0"><img src="../../assets/img/health-00to19.png"></i>
        </template>
      </el-table-column>
      <el-table-column
          prop="name"
          label="名称">
        <template slot-scope="scope">
          <router-link :to="'/jenkins/jobinfo/'+scope.row.id" style="font-weight: bold">{{ scope.row.name }}</router-link>
        </template>
      </el-table-column>
      <el-table-column
          prop="last_success"
          label="上次成功"
          :formatter="formater">
      </el-table-column>
      <el-table-column
          prop="last_faild"
          label="上次失败"
          :formatter="formater">
      </el-table-column>
      <el-table-column
          prop="last_build_duration"
          label="上次持续时间"
          :formatter="format_duration"
      >
      </el-table-column>
      <el-table-column
          label=""
      >
        <template slot-scope="scope">
          <!--{{ scope.row }}-->
          <el-tooltip class="item" effect="dark" content="立即构建" placement="top" :enterable="false">
            <el-button type="text" plain size="normal" @click="buildBtn(scope.row)"><img
                src="../../assets/img/clock.png"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!--      分页-->
    <el-pagination

        :current-page="queryinfo.page"
        :page-sizes="[6, 12, 18, 24]"
        :page-size="queryinfo.page_size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="jobs.count">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "JobList",
  data() {
    return {
      queryinfo: {},
      jobs: {}
    }
  },
  methods: {
    buildBtn(item) {
      this.$router.push("/jenkins/buildjob/"+item.id)
    },
    getUsers() {

    },
    formater(row, col, value, index) {
      if (value != null) {
        const now = new Date().getTime()
        const timediff = now - value
        const daydiff = Math.floor(timediff / (24 * 3600 * 1000))  //计算相差的天数
        const leave1 = timediff % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数
        const hours = Math.floor(leave1 / (3600 * 1000));//计算出小时数
        const leave2 = leave1 % (3600 * 1000);   //计算小时数后剩余的毫秒数
        const minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
        const leave3 = leave2 % (60 * 1000);     //计算分钟数后剩余的毫秒数
        const seconds = Math.round(leave3 / 1000);//计算相差秒数
        return daydiff + '天' + hours + '小时' + minutes + '分' + seconds + '秒'
      } else {
        return 'None'
      }
    },
    format_duration(row, col, value, index) {
      const minute = Math.round(value / 1000 / 60)
      let second = Math.round((value / 1000) % 60)
      if (second == 0) {
        second = 1
      }
      if (minute == 0) {
        return second + '秒'
      } else {
        return minute + '分' + second + '秒'
      }

    },
    changeOrigin() {
    },
    get_jobs() {
      this.$http('jobs/').then(res => {
        this.jobs = res.data
      }).catch(err => {
      })
    }
  },
  created() {
    this.get_jobs()
  },
}
</script>

<style scoped>

</style>