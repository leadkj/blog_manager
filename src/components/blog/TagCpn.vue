<template>
  <div>

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>博客</el-breadcrumb-item>
      <el-breadcrumb-item>标签</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片内容-->
    <el-card>
      <!--      搜素添加区域-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryinfo.name" clearable @clear="getTages">
            <el-button slot="append" icon="el-icon-search" @click="getTages"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addTagdialogVisible=true">添加标签</el-button>
        </el-col>
      </el-row>
      <!--数据列表区域-->
      <el-table
          border
          stripe
          :data="taglist.results"
          style="width: 100%">
        <el-table-column
            type="index"
            label="#"
            width="170px"
        >
        </el-table-column>
        <el-table-column
            prop="name"
            label="标签"
            width="250">
        </el-table-column>
        <el-table-column
            label="操作" align="right">
          <template slot-scope="scope">
            <!--{{ scope.row }}-->
            <el-tooltip class="item" effect="dark" content="修改标签" placement="top" :enterable="false">
              <el-button type="primary" size="small" icon="el-icon-edit" @click="modifyBtn(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除标签" placement="top" :enterable="false">
              <el-button type="danger" size="small" icon="el-icon-delete" @click="getDelid(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryinfo.page"
          :page-sizes="[6, 12, 18, 24]"
          :page-size="queryinfo.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="taglist.count">
      </el-pagination>
    </el-card>
    <!--    添加分类弹出对话框-->
    <el-dialog
        title="添加标签"
        :visible.sync="addTagdialogVisible"
        width="30%"
    >
      <el-form :model="addTagForm" :rules="addTagrules" ref="addTagFormRef" label-width="100px">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="addTagForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addTagdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addTag">确 定</el-button>
  </span>
    </el-dialog>
    <!--    删除分类对话框-->
    <el-dialog
        title="提示"
        :visible.sync="delTagdialogVisible"
        width="30%"
    >
      <span>确定要删除这个分类吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="delTagdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="delTag">确 定</el-button>
  </span>
    </el-dialog>
    <!--    修改分类弹出对话框-->
    <el-dialog
        title="修改分类"
        :visible.sync="modifyTagdialogVisible"
        width="30%"
    >
      <el-form :model="modifyTagForm" :rules="addTagrules" ref="modifyTagFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="modifyTagForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="modifyTagdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="modifyTag">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TagCpn",
  data() {
    return {
      queryinfo: {
        page_size: 6,
        page: 1,
        name: ''
      },
      taglist: [],
      addTagForm: {},
      addTagrules: {
        name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'}, //必填项，鼠标失去焦点提示
        ],
      },
      modifyTagForm: {},
      addTagdialogVisible: false,
      delTagdialogVisible: false,
      modifyTagdialogVisible: false,
      delTagId: '',
    }
  },
  methods: {
    getTages() {
      this.$http.get('tags/', {params: this.queryinfo}).then(res => {
        console.log(res);
        this.taglist = res.data
      }).catch(err => {
        this.$message.error("获取数据失败")
      })
    },
    handleSizeChange(newSize) {
      this.queryinfo.page_size = newSize
      this.getTages()
    },
    handleCurrentChange(newPageNum) {
      this.queryinfo.page = newPageNum
      this.getTages()
    },
    addTag() {
      this.$http.post('tags/', this.addTagForm).then(res => {
        this.$message.success("添加标签成功")
        this.getTages()
        this.addTagdialogVisible = false
      }).catch(err => {
        this.$message.error("添加标签失败")
      })
    },
    delTag() {
      this.$http.delete('tags/' + this.delTagId + '/').then(res => {
        this.$message.success("删除标签成功")
        this.delTagdialogVisible = false
        this.queryinfo.name = ''
        this.queryinfo.page = 1
        this.getTages()
      }).catch(err => {
        this.$message.error("删除标签失败")
      })
    },
    modifyTag() {
      this.$http.put('tags/' + this.modifyTagForm.id + '/', this.modifyTagForm).then(res => {
        this.$message.success("修改标签成功")
        this.modifyTagdialogVisible = false
        this.queryinfo.name = ''
        this.queryinfo.page = 1
        this.getTages()
      }).catch(
          err => {
            this.$message.error("修改标签失败")
          }
      )
    },
    getDelid(taginfo) {
      this.delTagId = taginfo.id
      this.delTagdialogVisible = true
    },
    modifyBtn(taginfo) {
      this.modifyTagForm = taginfo
      this.modifyTagdialogVisible = true
    }

  },
  created() {
    this.getTages()
  }
}
</script>

<style scoped>

</style>