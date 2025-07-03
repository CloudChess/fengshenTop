<template>
	<view class="container">
		<view class="form-container">
			<view class="form-item">
				<input type="text" v-model="username" placeholder="请输入您要使用的用户名" />
			</view>
			<view class="form-item">
				<input type="password" v-model="password" placeholder="请输入您要使用的密码" />
			</view>
			<view class="form-item">
				<input type="password" v-model="repassword" placeholder="再次输入密码以确认密码" />
			</view>
			<view class="form-item">
				<input type="text" v-model="section" placeholder="工段" />
			</view>
			<view class="form-item">
				<input type="text" v-model="position" placeholder="岗位" />
			</view>
			<button @click="handleRegister">注册</button>
			<text class="register-link" @click="handleBackLogin()">已账号？去登录</text>
			<view class="form-tip">
				<text class="tip-tittle">注册规范：</text>
				<text class="tip-item">1.用户名为2-5位汉字</text>
				<text class="tip-item">2.密码为8-13位，包含大写字母、小写字母、数字和符号</text>
				<text class="tip-item">3.工段示例：三部成型</text>
				<text class="tip-item">4.岗位示例：保全</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: '',
				password: '',
				repassword: '',
				section: '',
				position: ''
			};
		},
		methods: {
			handleBackLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
				});
			},
			handleRegister() {
				//表单数据合法性验证
				let usernameRegex = /^[\u4e00-\u9fff]{2,5}$/;
				let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.x]{8,13}$/;
				let otherRegex = /^[\u4e00-\u9fa5]{2,5}$/;
				if (!usernameRegex.test(this.username)) {
					uni.showToast({
						title: '用户名应为2-5位汉字',
						icon: 'fail'
					})
				} else if (!passwordRegex.test(this.password)) {
					uni.showToast({
						title: '密码为8-13位，包含大写字母、小写字母、数字和符号',
						icon: 'fail'
					})
				} else if (this.password != this.repassword) {
					uni.showToast({
						title: '两次密码不一致',
						icon: 'fail'
					})
				} else if (!otherRegex.test(this.section)) {
					uni.showToast({
						title: '请输入正确的工段',
						icon: 'fail'
					})
				} else if (!otherRegex.test(this.position)) {
					uni.showToast({
						title: '请输入正确的岗位',
						icon: 'fail'
					})
				} else {
					// 这里可以添加登录逻辑，比如调用API接口验证用户名和密码
					this.registerUser()
				}
			},
			//跳转注册页面
			navigateToRegister() {
				uni.navigateTo({
					url: '/pages/register/register'
				});
			},
			//注册接口请求
			async registerUser() {
				const url = 'http://10.72.59.63:90/register.php'; // 替换为你的后端注册接口地址  
				const response=await uni.request({
					url: url,
					method: 'POST',
					data: {
						username: this.username,
						password: this.password,
						section: this.section,
						position: this.position
					}
				});
				if (response.data) {
					let resStatue=response.data.status
					if(resStatue=="success"){
						this.username = '';
						this.password = '';
						this.section = '';
						this.position = '';
						uni.showToast({
							title: '注册成功',
							icon: 'success'
						});
						uni.navigateTo({
							url: '/pages/login/login'
						});
					}
					else{
						uni.showToast({
							title: response.data.message,
							icon:'none'
						});
					}
				} else {
					uni.showToast({
						title: '注册失败: ' + response.message,
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

	.form-tip {
		margin-top: 80rpx;
		display: flex;
		flex-direction: column;
	}

	.tip-tittle {
		font-size: 50rpx;
		margin-bottom: 20rpx;
	}

	.tip-item {
		color: #595959;
		margin-bottom: 10rpx;
	}
</style>