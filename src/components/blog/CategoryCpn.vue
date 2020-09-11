<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>博客</el-breadcrumb-item>
      <el-breadcrumb-item>文章分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片内容-->
    <el-card>
      <!--      搜素添加区域-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryinfo.name" clearable @clear="getCategorys">
            <el-button slot="append" icon="el-icon-search" @click="getCategorys"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addCatedialogVisible=true">添加分类</el-button>
        </el-col>
      </el-row>
      <!--数据列表区域-->
      <el-table
          border
          stripe
          :data="categorys.results"
          style="width: 100%">
        <el-table-column
            prop="id"
            label="#"
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="分类"
            width="180">
        </el-table-column>
        <el-table-column
            prop="desc"
            label="描述">
        </el-table-column>
        <el-table-column
            prop="ctime"
            label="创建时间">
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <!--{{ scope.row }}-->
            <el-tooltip class="item" effect="dark" content="修改分类" placement="top" :enterable="false">
              <el-button type="primary" size="small" icon="el-icon-edit" @click="modifyBtn(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除分类" placement="top" :enterable="false">
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
          :total="categorys.count">
      </el-pagination>
    </el-card>
    <!--    添加分类弹出对话框-->
    <el-dialog
        title="添加分类"
        :visible.sync="addCatedialogVisible"
        width="30%"
    >
      <el-form :model="addCateForm" :rules="addCaterules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="addCateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="addCateForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCatedialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
    </el-dialog>
    <!--    删除分类对话框-->
    <el-dialog
        title="提示"
        :visible.sync="delCatedialogVisible"
        width="30%"
    >
      <span>确定要删除这个分类吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="delCatedialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="delCate">确 定</el-button>
  </span>
    </el-dialog>
    <!--    修改分类弹出对话框-->
    <el-dialog
        title="修改分类"
        :visible.sync="modifyCatedialogVisible"
        width="30%"
    >
      <el-form :model="modifyCateForm" :rules="addCaterules" ref="modifyCateFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="modifyCateForm.name"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="desc">
          <el-input v-model="modifyCateForm.desc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="modifyCatedialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="modifyCate">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "CategoryCpn",
  data() {
    return {
      queryinfo: {
        page: 1,
        page_size: 6,
        name: ''
      },
      categorys: {},
      addCatedialogVisible: false,
      delCatedialogVisible: false,
      modifyCatedialogVisible: false,
      //添加分类表单数据
      addCateForm: {},
      addCaterules: {
        name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'}, //必填项，鼠标失去焦点提示
        ],
        desc: [
          {required: true, message: '请输入分类描述', trigger: 'blur'}, //必填项，鼠标失去焦点提示
        ],
      },
      cateDelID: '',
      modifyCateForm: {}
    }
  },
  created() {
    this.getCategorys()
  },
  methods: {
    getCategorys() {
      this.$http.get('categorys/', {params: this.queryinfo}).then(res => {
        this.categorys = res.data
      }).catch(err => {
        this.$message.error("获取数据失败")
      })
    },
    handleSizeChange(newSize) {
      this.queryinfo.page_size = newSize
      this.getCategorys()
    },
    handleCurrentChange(newPageNum) {
      this.queryinfo.page = newPageNum
      this.getCategorys()
    },
    addCate() {
      this.$http.post('categorys/', this.addCateForm).then(res => {
        this.addCatedialogVisible = false
        this.$message.success("添加分类成功")
        this.getCategorys()
      }).catch(err => {
            this.$message.err("添加分类失败")
          }
      )
    },
    getDelid(cateinfo) {
      this.cateDelID = cateinfo.id
      this.delCatedialogVisible = true
    },

    delCate() {
      this.$http.delete('categorys/' + this.cateDelID + '/').then(res => {
        this.$message.success("删除成功")
        this.delCatedialogVisible = false
        this.queryinfo.page = 1
        this.queryinfo.name = ''
        this.getCategorys()
      }).catch(
          err => {
            this.$message.error("删除失败")
          }
      )
    },
    modifyBtn(cateinfo) {
      this.modifyCateForm = cateinfo
      this.modifyCatedialogVisible = true
    },
    modifyCate() {
      this.$http.put('categorys/' + this.modifyCateForm.id + '/', this.modifyCateForm).then(res => {
        this.modifyCatedialogVisible = false
        this.$message.success("修改分类成功")
        this.getCategorys()
      }).catch(
          err => {
            this.$message.err("修改分类失败")
          }
      )
    },
  }
}
</script>

<style scoped>

</style>