<template>
    <view class="login-bg">
      <view class="login-left">
        <image src="/static/logo.png" mode="aspectFit" class="logo-img" />
        <view class="login-title">设备部管理系统</view>
      </view>
      <view class="login-right">
        <view class="login-form">
          <view class="form-title">欢迎登录</view>
          <input class="login-input" v-model.trim="username" placeholder="请输入用户名" maxlength="20" @input="onInput('username')" />
          <input class="login-input" v-model.trim="password" placeholder="请输入密码" password maxlength="20" @input="onInput('password')" />
          <view class="form-row">
            <label class="remember-label">
              <checkbox :checked="rememberMe" @change="rememberMe = !rememberMe" color="#3478f6" />
              <text>记住我</text>
            </label>
          </view>
          <view v-if="errorMsg" class="error-msg">{{ errorMsg }}</view>
          <button class="login-btn" :loading="loading" @click="onLogin">{{ loading ? '登录中...' : '登录' }}</button>
        </view>
      </view>
    </view>
  </template>
  
  <script>
  const SAFE_REG = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
  const LOGIN_KEY = 'login_token';
  export default {
    data() {
      return {
        username: '',
        password: '',
        errorMsg: '',
        loading: false,
        rememberMe: true
      }
    },
    onLoad() {
      // 自动登录逻辑
      const token = uni.getStorageSync(LOGIN_KEY);
      if (token && token.expire > Date.now()) {
        uni.setStorageSync('username', token.username);
        uni.reLaunch({ url: '/pages/dashboard/dashboard' });
      }
    },
    methods: {
      onInput(field) {
        if (this[field] && !SAFE_REG.test(this[field])) {
          this[field] = this[field].replace(/[^a-zA-Z0-9_\u4e00-\u9fa5]/g, '');
          this.errorMsg = '仅支持中英文、数字、下划线';
        } else {
          this.errorMsg = '';
        }
      },
      onLogin() {
        this.errorMsg = '';
        if (!this.username) {
          this.errorMsg = '请输入用户名';
          return;
        }
        if (!this.password) {
          this.errorMsg = '请输入密码';
          return;
        }
        if (this.username.length < 2 || this.username.length > 20) {
          this.errorMsg = '用户名长度2-20位';
          return;
        }
        if (this.password.length < 4 || this.password.length > 20) {
          this.errorMsg = '密码长度4-20位';
          return;
        }
        if (!SAFE_REG.test(this.username) || !SAFE_REG.test(this.password)) {
          this.errorMsg = '仅支持中英文、数字、下划线';
          return;
        }
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          if (this.username === 'admin' && this.password === '123456') {
            uni.setStorageSync('username', this.username);
            if (this.rememberMe) {
              uni.setStorageSync(LOGIN_KEY, {
                username: this.username,
                expire: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7天
              });
            } else {
              uni.removeStorageSync(LOGIN_KEY);
            }
            uni.reLaunch({ url: '/pages/dashboard/dashboard' });
          } else {
            this.errorMsg = '用户名或密码错误';
          }
        }, 1000);
      }
    }
  }
  </script>
  
  <style scoped>
  .login-bg {
    min-height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: row;
    background: linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%);
  }
  .login-left {
    flex: 1.2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(120deg, #3478f6 0%, #e0e7ff 100%);
    min-width: 260px;
  }
  .logo-img {
    width: 90px;
    height: 90px;
    margin-bottom: 18px;
    border-radius: 18px;
    box-shadow: 0 2px 16px rgba(52,120,246,0.10);
    background: #fff;
  }
  .login-title {
    font-size: 28px;
    font-weight: bold;
    color: #fff;
    letter-spacing: 2px;
    text-shadow: 0 2px 8px rgba(52,120,246,0.10);
  }
  .login-right {
    flex: 1.8;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 320px;
  }
  .login-form {
    width: 340px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background: #fff;
    padding: 40px 32px 32px 32px;
    border-radius: 16px;
    box-shadow: 0 6px 32px rgba(52,120,246,0.10);
    position: relative;
  }
  .form-title {
    font-size: 22px;
    font-weight: 600;
    color: #3478f6;
    margin-bottom: 10px;
    text-align: center;
    letter-spacing: 1px;
  }
  .login-input {
    height: 46px;
    border: 1px solid #e0e0e0;
    border-radius: 7px;
    padding: 0 14px;
    font-size: 16px;
    background: #fafbfc;
    transition: border 0.2s;
  }
  .login-input:focus {
    border: 1.5px solid #3478f6;
  }
  .form-row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: -8px;
  }
  .remember-label {
    display: flex;
    align-items: center;
    font-size: 15px;
    color: #888;
    user-select: none;
  }
  .remember-label text {
    margin-left: 6px;
  }
  .login-btn {
    height: 46px;
    background: #3478f6;
    color: #fff;
    font-size: 18px;
    border: none;
    border-radius: 7px;
    font-weight: bold;
    letter-spacing: 1px;
    margin-top: 6px;
    transition: background 0.2s;
  }
  .login-btn:active {
    background: #2456b3;
  }
  .error-msg {
    color: #e74c3c;
    font-size: 14px;
    text-align: center;
    margin-top: -8px;
  }
  @media (max-width: 800px) {
    .login-bg {
      flex-direction: column;
    }
    .login-left, .login-right {
      min-width: 0;
      width: 100vw;
      flex: none;
    }
    .login-form {
      width: 90vw;
      min-width: 0;
      max-width: 400px;
    }
  }
  </style> 