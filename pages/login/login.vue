<template>  
  <view class="container">  
    <view class="form-container">  
      <view class="form-item">  
        <input type="text" v-model="username" placeholder="用户名" />  
      </view>  
      <view class="form-item">
        <input type="password" v-model="password" placeholder="密码" />  
      </view>  
      <button @click="handleLogin">登录</button> 
      <text class="register-link" @click="navigateToRegister">还没有账号？去注册</text>  
    </view>  
  </view>  
</template>  
  
<script>  
export default {  
  data() {  
    return {  
      username: '',  
      password: ''  
    };  
  },  
  methods: {  
    handleLogin() {  
      // 这里可以添加登录逻辑，比如调用API接口验证用户名和密码 
	  let usernameRegex = /^[\u4e00-\u9fff]{2,5}$/;
	  let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.x]{8,13}$/;
	  if (!usernameRegex.test(this.username)) {
	  	uni.showToast({
	  		title: '请输入正确的用户名',
	  		icon: 'none'
	  	})
	  }
	  else if(!passwordRegex.test(this.password)){
		uni.showToast({
			title: '密码输入错误',
			icon: 'none'
		})
	  }
	  else{
		this.LoginAPI()  
	  }
    },  
    navigateToRegister() {  
      uni.navigateTo({  
        url: '/pages/register/register'  
      });  
    },
	async LoginAPI() {
		try {
			const url = 'http://10.72.59.63:90/login.php'; // 替换为你的后端注册接口地址  
			const response = await uni.request({
				url: url,
				method: 'POST',
				data: {
					username: this.username,
					password: this.password
				}
			});
			if (response.data) {
				let resStatue=response.data.status
				if(resStatue=="success"){
					uni.setStorageSync('username',this.username)
					uni.setStorageSync('token',response.data.token)
					this.username = '';
					this.password = '';
					uni.showToast({
						title: '登陆成功',
						icon: 'success'
					});
					uni.navigateTo({
						url: '/pages/index/index'
					});
				}
				else{
					uni.showToast({
						title: response.data.errMsg,
						icon: 'none'
					});
				}
			} else {
				uni.showToast({
					title: '登陆失败: ' + response.errMsg,
					icon: 'none',
					duration: 2000
				});
			}
		} catch (error) {
			uni.showToast({
				title: '登陆时发生错误',
				icon: 'none',
				duration: 2000
			});
		}
	}
  }  
};  
</script>  
  
<style scoped>  
.container {  
  padding: 20rpx;  
}  
  
.form-container {  
  background-color: #fff;  
  border-radius: 10rpx;  
  padding: 20rpx;  
}  
  
.form-item {  
  margin-bottom: 20rpx;  
}  
  
input {  
  width: 100%;  
  padding: 10rpx;  
  border: 1rpx solid #ddd;  
  border-radius: 5rpx;  
}  
  
button {  
  width: 100%;  
  background-color: #ffff00;  
  color: #393939;  
  border: none;  
  border-radius: 5rpx;  
  padding: 10rpx 0;  
  margin-top: 20rpx;  
}  
  
.register-link {  
  text-align: center;  
  color: #409EFF;  
  margin-top: 20rpx;  
}  
</style>