<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>博客</el-breadcrumb-item>
      <el-breadcrumb-item>文章</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片内容-->
    <el-card>
      <!--      搜素添加区域-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryinfo.name" clearable @clear="getArticles">
            <el-button slot="append" icon="el-icon-search" @click="getArticles"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="$router.push('/article/add')">发布博文</el-button>
        </el-col>
      </el-row>
      <!--数据列表区域-->
      <el-table
          border
          stripe
          :data="articles.results"
          style="width: 100%">
        <el-table-column
            type="index"
            label="#">
        </el-table-column>
        <el-table-column
            prop="name"
            label="名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="desc"
            label="描述">
        </el-table-column>
        <el-table-column
            prop="publish"
            label="创建时间">
        </el-table-column>
        <el-table-column
            prop="original"
            label="是否原创">
          <template slot-scope="scope">
            <el-switch
                v-model="scope.row.original"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeOrigin(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <!--            {{ scope.row }}-->
            <el-tooltip class="item" effect="dark" content="修改文章" placement="top" :enterable="false">
              <el-button type="primary" size="small" icon="el-icon-edit"
                         @click="editArticle(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除文章" placement="top" :enterable="false">
              <el-button type="danger" size="small" icon="el-icon-delete" @click="getDelArtId(scope.row)"></el-button>
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
          :total="articles.count">
      </el-pagination>
    </el-card>
    <!--    删除分类对话框-->
    <el-dialog
        title="提示"
        :visible.sync="delArtdialogVisible"
        width="30%"
    >
      <span>确定要删除这个分类吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="delArtdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="delArt">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ArticleCpn",
  data() {
    return {
      queryinfo: {
        page_size: 6,
        page: 1,
        name: ''
      },
      articles: {},
      delArtId: '',
      delArtdialogVisible: false,
      emitData: {}
    }
  },
  methods: {
    getArticles() {
      this.$http.get('articles/', {params: this.queryinfo}).then(res => {
        this.articles = res.data
        console.log(res.data);
      }).catch(
          err => {
            this.$message.error("获取博文信息失败")
          }
      )
    },
    handleSizeChange(newSize) {
      //page_size改变的时候,可以拿到最新size
      this.queryinfo.page_size = newSize
      this.getArticles()
    },
    handleCurrentChange(newPageNum) {
      //页码值发生改变的情况
      this.queryinfo.page = newPageNum
      this.getArticles()
    },
    changeOrigin(articleinfo) {
      this.$http.put(`articles/${articleinfo.id}/ChangeOriginal/`).then(res => {
        this.$message.success("更新成功")
      }).catch(
          err => {
            this.$message.error("更新失败")
            articleinfo.original = !articleinfo.original
          }
      )
    },
    getDelArtId(artinfo) {
      this.delArtId = artinfo.id
      this.delArtdialogVisible = true
    },
    delArt() {
      this.$http.delete('articles/' + this.delArtId + '/').then(res => {
        this.$message.success("删除博客成功")
        this.delArtdialogVisible = false
        this.queryinfo.page = 1
        this.queryinfo.name = ''
        this.getArticles()

      }).catch(err => {
            this.$message.error("删除数据失败")
          }
      )
    },
    editArticle(artinfo) {
      this.$router.push('/article/' + artinfo.id);
      this.emitData = artinfo


    }

  },
  created() {
    this.getArticles()
  },
  beforeDestroy() {
    eventBus.$emit("sendArtinfo", this.emitData);
  }
}
</script>

<style scoped>

</style>