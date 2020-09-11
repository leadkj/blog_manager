<template>
  <el-container class="home_container">
    <!--      头部区域-->
    <el-header>
      <div>
        <img src="">
        <span>博客后台管理系统</span>
      </div>
      <el-button type="info" plain @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!--        侧边栏-->
      <el-aside :width="iscollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="collapse">{{ iscollapse ? '>>>' : '<<<' }}</div>
        <!--        侧边栏导航-->
        <el-menu
            background-color="#333744"
            text-color="#fff"
            router
            :default-active="default_active"
            active-text-color="#409eff" unique-opened :collapse="iscollapse" :collapse-transition="false">
          <el-submenu :index="menu.id+''" v-for="menu in menulist" :key="menu.id">
            <template slot="title">
              <i :class="iconlist[menu.id]"></i>
              <span>{{ menu.menu }}</span>
            </template>
            <el-menu-item :index="'/'+submenu.path.toLowerCase()" v-for="submenu in menu.submenus" :key="submenu.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span @click="activeMenu('/'+submenu.path.toLowerCase())">{{ submenu.name }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--        主题区域-->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>

  </el-container>
</template>

<script>
export default {
  name: "IndexCpn",
  data() {
    return {
      menulist: [],
      iconlist: {
        1: 'el-icon-notebook-1',
        2: 'el-icon-user-solid'
      },
      iscollapse: false,
      default_active: ''
    }
  },
  methods: {
    logout() { //退出功能只需要清空session中的token，并跳转到login就可以了
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    collapse() {
      this.iscollapse = !this.iscollapse
    },
    activeMenu(active) {
      this.default_active = active
      //保存在sessionStorage中，不然刷新页面，当前激活菜单会丢失，在created中给default_active赋值
      window.sessionStorage.setItem('activepath', active)
    }
  },
  created() {
    this.$http.get('get_menu/').then(res => {
      if (res.data.status !== 200) return this.$message.error("获取菜单数据失败")
      this.menulist = res.data.data
      this.default_active = window.sessionStorage.getItem('activepath')
    })
  }
}
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
  font-size: 20px;
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1;
}

.home_container {
  height: 100%;
}

.el-menu {
  border-right: none;
}

.toggle-button {
  line-height: 24px;
  background-color: #4a5064;
  text-align: center;
  //letter-spacing: 0.3em;
  font-size: 20px;
  cursor: pointer;
  color: #ffffff;
  font-weight: bold;
  width: 100%;
}
</style>