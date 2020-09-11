<template>
  <div class="login">
    <div class="loginForm">
      <div class="logo">
        <img src="../assets/logo.png" alt="">
      </div>
      <!--      //登陆表单-->
      <el-form ref="loginformRef" class="login_inpu" :model="loginform" :rules="rules">
        <!--        //用户名-->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginform.username" placeholder="用户名"></el-input>
        </el-form-item>
        <!--        //密码-->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginform.password" type="password" placeholder="密码"></el-input>
        </el-form-item>
        <!--        //登陆按钮-->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
export default {
  name: "LoginCpn",
  data() {
    return {
      loginform: {
        username: '',
        password: ''
      },
      rules: {
        //用户名输入框验证
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'}, //必填项，鼠标失去焦点提示
          // {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}, //必填项，鼠标失去焦点提示
          // {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    reset() {
      this.$refs.loginformRef.resetFields();
    },
    login() {
      this.$refs.loginformRef.validate(valid => {
        console.log(valid);
        if (valid) {
          //axios
          this.$http.post('tauth/', this.loginform).then(res => {
            this.$message.success("登陆成功")
            window.sessionStorage.setItem('token', res.data.access)
            this.$router.push("/index")
          }).catch(err => {
            this.$message.error("用户名或者密码错误")
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  background-color: #2b4b6b;
  height: 100%;
  width: 100%;

  .loginForm {
    width: 450px;
    height: 300px;
    background-color: #ffffff;
    position: absolute; //距离
    left: 50%; //左侧50%
    top: 50%; //距离上面50%
    transform: translate(-50%, -50%); //X轴移动自身的-50%，Y轴移动自身的-50%
    .logo {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #eeeeee;
      position: absolute;
      left: 50%;
      top: -50%;
      transform: translate(-50%, 50%);
      background-color: #ffffff;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}

.login_inpu {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>