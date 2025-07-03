<template>
	<view class="home">
		<view class="content">
			<view class="custom-navbar">
				<view class="status_bar" style="height:var(--status-bar-height); width: 100%;"></view>
				<view class="navbar-container">
					<view class="back-button" @click="handleBack">退出</view>
					<view class="navbar-username">{{username}}</view>
				</view>
			</view>
			<view class="main-list">
				<view class="list-box">
					<view class="box-content">
						<view class="item" v-if="showModules.includes('teaminfo')" @click="topage('/pages/teamchart/teamchart')">
							<view class="item-img" style="background-color: #6cc9f0">
								<Myicon class="icon" type="teaminfo"></Myicon>
								<text class="item-txt">团队信息</text>
							</view>
						</view>
						<view class="item" @click="topage('/pages/exam/exam')">
							<view class="item-img" style="background-color: #c1abf0">
								<Myicon class="icon" type="skillup"></Myicon>
								<text class="item-txt">能力提升</text>
							</view>
						</view>
						<view class="item" v-if="showModules.includes('perfInfo')" @click="topage('/pages/perfStats/perfStats')">
							<view class="item-img" style="background-color: #4ae8b4">
								<Myicon class="icon" type="perfStats"></Myicon>
								<text class="item-txt">绩效统计</text>
							</view>
						</view>
						<view class="item" v-if="showModules.includes('dayPerf')" @click="topage('/pages/perfDay/perfDay')">
							<view class="item-img" style="background-color: #ecc9a3">
								<Myicon class="icon" type="perfDay"></Myicon>
								<text class="item-txt">日绩效</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<MyBottom></MyBottom>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username: "默认大大1234",
				title: 'Hello',
				showModules:[]
			}
		},
		methods: {
			handleBack() {
				uni.showModal({
					content: '确认退出登录吗？',
					success: function(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/login/login'
							});
						}
					}
				})
			},
			topage(src) {
				uni.navigateTo({
					url: src
				});
			},
			surePermisson(){
				let username=uni.getStorageSync('username')
				let token=uni.getStorageSync('token')
				
				uni.request({
					url:'http://10.72.59.63:90/surePermisson.php',
					method:'POST',
					header: {
					    'Authorization': 'Bearer ' + token,
					},
					data:{
						username:username,
						page:'index'
					},
					success:(res)=> {
						if(res.data&&res.data.moudle){
							this.showModules=res.data.moudle
						}
					}
				})
			}
		},
		onLoad() {
			this.username = uni.getStorageSync('username');
			if (!this.username) {
				uni.showModal({
					title: '登陆错误',
					content: '未获取到用户名',
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/login/login'
							});
						}
					}
				})
			}
			
			this.surePermisson()
		}
	}
</script>

<style scoped>
	.home {
		background: linear-gradient(to bottom, #b8e5f0 0%, #d1f7f6 30%, #eafff4 80%, #f7f7f7 100%);
		height: 100vh;
		width: 100vw;
	}

	.navbar-container {
		font-size: 36rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100rpx; /*高度需要根据实际情况调整，包括状态栏高度 */
		padding: 0 10rpx;
		z-index: 999;
	}

	.back-button {
		margin-left: 20rpx;
		/* 返回按钮样式 */
	}

	.navbar-username {
		/* 用户名样式 */
		margin-right: 20rpx;
	}

	.main-list {
		display: flex;
		flex-direction: column;
		padding: 20rpx;

	}

	.list-box {
		padding: 15rpx 0;
		display: flex;
		flex-direction: column;
		justify-content: start;
	}

	.box-title {
		margin-bottom: 20rpx;
	}

	.box-content {
		padding-top: 30rpx;
		padding-left: 40rpx;
		display: flex;
		justify-content: start;
		flex-wrap: wrap;
	}

	.item {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 30rpx;
		margin-right: 30rpx;
	}

	.item-img {
		padding: 20rpx;
		border-radius: 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: start;
		height: 150rpx;
		width: 150rpx;
		box-shadow: #b5e2ea 2rpx 2rpx 4rpx 4rpx;
	}

	.icon {
		width: 75%;
		height: 75%;
	}

	.item-txt {
		font-family: '幼圆';
		color: #ffffff;
		font-size: 32rpx;
		font-weight: bold;
		margin-top: 15rpx;
	}
</style>