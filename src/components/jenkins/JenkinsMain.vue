<template>
  <div class="jenkins_main">
    <el-container>
      <el-aside width="250px">
        <el-menu
            :unique-opened="true"
        >
          <el-menu-item index="1">
            <span slot="title" @click="goto('/jenkins/createjob')">新建Item</span>
          </el-menu-item>
          <el-divider></el-divider>
          <el-menu-item index="2">
            <span slot="title">用户列表</span>
          </el-menu-item>
          <el-divider></el-divider>
          <el-menu-item index="3">
            <span slot="title">构建历史</span>
          </el-menu-item>
          <el-divider></el-divider>
          <el-menu-item index="4">
            <span slot="title">项目关系</span>
          </el-menu-item>
          <el-divider></el-divider>
          <el-menu-item index="5">
            <span slot="title">检查文件指纹</span>
          </el-menu-item>
          <el-divider></el-divider>
          <el-menu-item index="6">
            <span slot="title">My Views</span>
          </el-menu-item>
          <el-divider></el-divider>
          <el-menu-item index="7">
            <span slot="title">新建视图</span>
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
  name: "JenkinsMain",
  data() {
    return {
      queryinfo: {},

        }

  },
  methods: {
    goto(url){
      this.$router.push(url)
    }

  },
  created() {

  }
}
</script>

<style lang="less" scoped>
.jenkins_main {
  height: 100%;
}

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
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  align-items: center;
  line-height: 200px;

}

.el-menu {
  background-color: #D3DCE6;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  padding-top: 0px;
  //text-align: center;
  //line-height: 160px;
}


</style>