<template>
  <div>
    <!--    面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>账户信息</el-breadcrumb-item>
      <el-breadcrumb-item>用户</el-breadcrumb-item>
    </el-breadcrumb>
    <!--    卡片内容-->
    <el-card>
      <!--      搜素添加区域-->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryinfo.username" clearable @clear="getUsers">
            <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" plain @click="addUserdialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--数据列表区域-->
      <el-table
          border
          stripe
          :data="users.results"
          style="width: 100%">
        <el-table-column
            prop="id"
            label="#"
            width="180">
        </el-table-column>
        <el-table-column
            prop="username"
            label="用户名"
            width="180">
        </el-table-column>
        <el-table-column
            prop="nick_name"
            label="昵称">
        </el-table-column>
        <el-table-column
            prop="email"
            label="邮箱">
        </el-table-column>
        <el-table-column
            prop="gender"
            label="性别"
            :formatter="formater">
        </el-table-column>
        <el-table-column
            prop="is_active"
            label="是否可用">
          <template slot-scope="scope">
            <el-switch
                v-model="scope.row.is_active"
                @change="changeOrigin(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
        >
          <template slot-scope="scope">
            <!--{{ scope.row }}-->
            <el-tooltip class="item" effect="dark" content="修改用户" placement="top" :enterable="false">
              <el-button type="text" plain size="normal" @click="modifyBtn(scope.row)">编辑</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除用户" placement="top" :enterable="false">
              <el-button type="text" plain size="normal" @click="getDelid(scope.row)">删除</el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="修改密码" placement="top" :enterable="false">
              <el-button type="text" plain size="normal" @click="changPassid(scope.row)">修改密码</el-button>
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
          :total="users.count">
      </el-pagination>
    </el-card>
    <!--    添加用户弹出对话框-->
    <el-dialog
        title="添加用户"
        :visible.sync="addUserdialogVisible"
        width="30%"
    >
      <el-form :model="addUserForm" :rules="addUserrules" ref="addUserFormRef" label-width="120px">
        <el-form-item label="用户名" prop="username" required>
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" required>
          <el-input type="password" v-model="addUserForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass" required>
          <el-input type="password" v-model="addUserForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addUserdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
    <!--    删除分类对话框-->
    <el-dialog
        title="提示"
        :visible.sync="delUserdialogVisible"
        width="30%"
    >
      <span>确定要删除这个用户吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="delUserdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="delUser">确 定</el-button>
  </span>
    </el-dialog>
    <!--    修改分类弹出对话框-->
    <el-dialog
        title="修改分类"
        :visible.sync="modifyUserdialogVisible"
        width="30%"
    >
      <el-form :model="modifyUserForm" :rules="addUserrules" ref="modifyUserFormRef" label-width="100px">
        <el-form-item label="用户名" prop="username" required>
          <el-input v-model="modifyUserForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nick_name">
          <el-input v-model="modifyUserForm.nick_name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email" :rules="[
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ]">
          <el-input v-model="modifyUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="modifyUserForm.gender" placeholder="请选择">
            <el-option label="男" value="male"></el-option>
            <el-option label="女" value="female"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="modifyUserdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="modifyUser">确 定</el-button>
  </span>
    </el-dialog>
    <!--    修改密码弹出对话框-->
    <el-dialog
        title="修改密码"
        :visible.sync="changPassdialogVisible"
        width="30%"
    >
      <el-form :model="changPassForm" :rules="addUserrules" ref="changPassFormRef" label-width="120px">
        <el-form-item label="密码" prop="password" required>
          <el-input type="password" v-model="changPassForm.password" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="changPassdialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="changPass">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "UsersCpn",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.addUserForm.checkPass !== '') {
          this.$refs.addUserFormRef.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.addUserForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      queryinfo: {
        page: 1,
        page_size: 6,
        username: ''
      },
      users: {},
      addUserdialogVisible: false,
      delUserdialogVisible: false,
      modifyUserdialogVisible: false,
      changPassdialogVisible: false,
      //添加分类表单数据
      addUserForm: {
        'password': '',
        'checkPass': '',
        'username': '',
        'gender': 'male',
        'email': '',
        'is_staff': true
      },
      changPassForm: {},
      addUserrules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}, //必填项，鼠标失去焦点提示
        ],
        pass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'}
        ],
      },
      userDelID: '',
      changPassId: '',
      modifyUserForm: {}
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
    formater(row, col) {
      return (row.gender === 'male') ? '男' : '女'
    },
    getUsers() {
      this.$http.get('users/', {params: this.queryinfo}).then(res => {
        this.users = res.data
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
    addUser() {
      this.$refs['addUserFormRef'].validate((valid) => {
        if (valid) {
          delete this.addUserForm.checkPass
          this.$http.post('users/', this.addUserForm).then(res => {
            this.addUserdialogVisible = false
            this.$message.success("添加用户成功")
            this.getUsers()
          }).catch(err => {
                this.$message.error("添加用户失败")
              }
          )
        } else {
          this.$message.error("信息有误")
          return false;
        }
      });

    },
    getDelid(userinfo) {
      this.userDelID = userinfo.id
      this.delUserdialogVisible = true
    },
    delUser() {
      this.$http.delete('users/' + this.userDelID + '/').then(res => {
        this.$message.success("删除成功")
        this.delUserdialogVisible = false
        this.queryinfo.page = 1
        this.queryinfo.name = ''
        this.getUsers()
      }).catch(
          err => {
            this.$message.error("删除失败")
          }
      )
    },
    modifyBtn(userinfo) {
      this.modifyUserForm = userinfo
      this.modifyUserdialogVisible = true
    },
    modifyUser() {
      const modifyId = this.modifyUserForm.id
      delete this.modifyUserForm.id
      this.$http.put('users/' + modifyId + '/', this.modifyUserForm).then(res => {
        this.modifyUserdialogVisible = false
        this.$message.success("修改用户成功")
        this.getUsers()
      }).catch(
          err => {
            this.$message.error("修改用户失败")
          }
      )
    },
    changPassid(userinfo) {
      this.changPassId = userinfo.id;
      this.changPassdialogVisible = true
    },
    changPass() {
      this.$http.put(`users/${this.changPassId}/modifyPass/`, this.changPassForm).then(res => {
        this.$message.success("修改密码成功")
        this.changPassdialogVisible = false
      }).catch(err => {
        this.$message.error("修改密码失败")
      })
    },


    changeOrigin(userinfo) {
      const data = {"username": userinfo.username, "is_active": userinfo.is_active}
      this.$http.put(`users/${userinfo.id}/`, data).then(res => {
        this.$message.success("更新成功")
      }).catch(
          err => {
            this.$message.error("更新失败")
            userinfo.is_active = !userinfo.is_active
          }
      )
    },
  }
}
</script>

<style scoped>

</style>