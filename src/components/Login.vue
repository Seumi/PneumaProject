<template>
    <div class="login">
        <div class="login-container">
            <div class="login-head">
                <h3>系统登录</h3>
            </div>
            <div class="login-body">
                <el-form :model="loginForm" :rules="rules" ref="loginForm">
                    <el-form-item prop="username">
                        <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="用户名"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
                    </el-form-item>
                    <el-form-item style="padding-top:20px">
                        <el-button type="primary" style="width:100%;" @click.native.prevent="submit" :loading="islogin">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="footer">
          <p>Copyright 2018 by Seumi. All rights reserved.</p>
          <p style="padding-top:5px">
            Driven by 
            <a href="https://cn.vuejs.org/" target="_blank" title="Vuejs渐进式前端框架">
              <img src="https://cn.vuejs.org/images/logo.png" width="16px" height="16px">
            </a> &amp;&nbsp;
            <a href="http://element.eleme.io/#/zh-CN" target="_blank" title="基于 Vue 2.0 的桌面端组件库">
              <img src="../assets/elelogo.svg" height="16px">
            </a>
          </p>
        </div>
    </div>
</template>

<script>
import { doLogin } from '../api/api'

export default {
  name: "Login",
  data() {
    return {
      islogin: false,
      loginForm: {
        username: "admin",
        password: "123"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    submit() {
      this.islogin = true;
      this.$refs.loginForm.validate((validate) => {
        if(validate) {
          let param = { username: this.loginForm.username, password: this.loginForm.password };
          doLogin(param).then(data => {
            let { msg, code } = data.data;
            this.islogin = false;
            if (code !== 'LOGINSUCCESS') {
              this.$message({message: '登录失败，用户名或密码错误',type: 'error'});
            } else {
              this.$message({message: '登录成功',type: 'success'});
              let payload = {
                token: msg.token,
                username: msg.username,
                userID: this.loginForm.username
              }
              this.$store.dispatch('Login', payload);
              this.$router.push({ path: '/main' });
            }
          })
        } else {
          console.log('登录失败，用户名或密码没有填写');
          this.$message({message: '请输入用户名或密码',type: 'warning'});
          this.islogin = false;
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url('../assets/bg.png');
  background-size: cover;
  background-position: center;
  border-top: 70px solid #41B883;
  .footer {
    margin: 0;
    position: absolute;
    bottom: 10px;
    width:100%;
    height:100px;
    font-size: 10px;
    color: #757575;
    p {
      line-height: 1;
      margin: 0;
    }
  }
}
.login-container {
  background-color: #ffffff;
  position: absolute;
  top: 50%;
  transform: translateY(-60%);
  right: 250px;
  box-shadow: 0 0 25px #cac6c6;
  border: 1px solid #eaeaea;
  border-radius: 5px;
  width: 300px;
  .login-head {
      height: 30px;
      border-bottom: 1px solid #dcdfe6;
      
      h3 {
          font-size: 15px;
          color: #757575;
      }
  }
  .login-body {
      padding: 20px;
      padding-bottom: 10px;
  }
}
.el-form-item {
  padding-top: 10px;
}
</style>


