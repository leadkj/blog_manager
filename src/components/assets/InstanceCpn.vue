<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>资产</el-breadcrumb-item>
      <el-breadcrumb-item>主机实例</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片内容-->
    <el-card>
      <!--      搜素添加区域-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryinfo.name" clearable @clear="getIntances">
            <el-button slot="append" icon="el-icon-search" @click="getIntances"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="$router.push('/article/add')">添加主机</el-button>
        </el-col>
      </el-row>
      <!--数据列表区域-->
      <el-table
          border
          stripe
          :data="instances.results"
          style="width: 100%">
        <el-table-column
            type="index"
            label="#">
        </el-table-column>
        <el-table-column
            prop="hostname"
            label="主机名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="ipaddr"
            label="主机IP"
            width="180">
        </el-table-column>
        <el-table-column
            prop="group"
            label="主机组">
        </el-table-column>
        <el-table-column
            prop="origin"
            label="主机来源">
        </el-table-column>
        <el-table-column
            prop="status"
            label="是否可用">
          <template slot-scope="scope">
            <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <!--            {{ scope.row }}-->
            <el-tooltip class="item" effect="dark" content="console" placement="top" :enterable="false">
              <el-button  icon="el-icon-s-platform" circle size="normal"
                         @click="Console(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="主机信息" placement="top" :enterable="false">
              <el-button size="normal" icon="el-icon-info" circle @click=""></el-button>
            </el-tooltip>


          </template>
        </el-table-column>
      </el-table>
      <!--      分页-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryinfo.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="queryinfo.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="instances.count">
      </el-pagination>
    </el-card>
    <!--    删除分类对话框-->
<!--    <el-dialog-->
<!--        title="提示"-->
<!--        :visible.sync="delArtdialogVisible"-->
<!--        width="30%"-->
<!--    >-->
<!--      <span>确定要删除这个分类吗？</span>-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--    <el-button @click="delArtdialogVisible = false">取 消</el-button>-->
<!--    <el-button type="primary" @click="delArt">确 定</el-button>-->
<!--  </span>-->
<!--    </el-dialog>-->
  </div>
</template>

<script>
export default {
  name: "IntanceCpn",
  data() {
    return {
      queryinfo: {
        page_size: 6,
        page: 1,
        name: ''
      },
      instances: {},
      delArtId: '',
      delArtdialogVisible: false,
      emitData: {}
    }
  },
  methods: {
    getIntances() {
      this.$http.get('instances/', {params: this.queryinfo}).then(res => {
        this.instances = res.data
        console.log(res.data);
      }).catch(
          err => {
            this.$message.error("获取主机信息失败")
          }
      )
    },
    handleSizeChange(newSize) {
      //page_size改变的时候,可以拿到最新size
      this.queryinfo.page_size = newSize
      this.getIntances()
    },
    handleCurrentChange(newPageNum) {
      //页码值发生改变的情况
      this.queryinfo.page = newPageNum
      this.getIntances()
    },
    changeStatus(instanceinfo) {
      this.$http.put(`articles/${instanceinfo.id}/ChangeOriginal/`).then(res => {
        this.$message.success("更新成功")
      }).catch(
          err => {
            this.$message.error("更新失败")
            instanceinfo.original = !instanceinfo.original
          }
      )
    },
    // getDelArtId(artinfo) {
    //   this.delArtId = artinfo.id
    //   this.delArtdialogVisible = true
    // },
    // delArt() {
    //   this.$http.delete('articles/' + this.delArtId + '/').then(res => {
    //     this.$message.success("删除博客成功")
    //     this.delArtdialogVisible = false
    //     this.queryinfo.page = 1
    //     this.queryinfo.name = ''
    //     this.getArticles()
    //
    //   }).catch(err => {
    //         this.$message.error("删除数据失败")
    //       }
    //   )
    // },
    Console(instanceinfo) {
      let routedata = this.$router.resolve({
        path:'/console/'+instanceinfo.ipaddr
      });
      window.open(routedata.href,"_blank")
    }

  },
  created() {
    this.getIntances()
  },
  // beforeDestroy() {
  //   eventBus.$emit("sendArtinfo", this.emitData);
  // }
}
</script>

<style scoped>

</style>