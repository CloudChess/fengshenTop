<template>
	<view class="myheader">
		<view class="myheader-blank">
			
		</view>
		<view class="myheader-navbar">
			<view class="status_bar"></view>
			<view class="myheader-container">
			  <view class="back-button" @click="handleBack">返回</view>
			  <view>{{title}}</view>
			  <view v-if="isusername" class="navbar-username">{{username}}</view>
			  <view v-else-if="!isusername" class="navbar-blank"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"MyHeader",
		props:{
			title:'',
			isusername:{
				default:false
			},
			sureBack:{
				default:false
			}
		},
		data(){
			return{
				username:''
			}
		},
		methods:{
			handleBack(){
				if(this.sureBack){
					uni.showModal({
						content:'确认退出吗？',
						success(res) {
							if(res.confirm){
								uni.navigateBack()
							}
						}
					})
				}
				else{
					uni.navigateBack()
				}
			}
		},
		mounted() {
			let usernameinfo=uni.getStorageSync('username'); 
			if(usernameinfo){
				this.username=usernameinfo
			}
			else{
				uni.navigateTo({
					url: '/pages/index/index'
				});
			}
		}
	}
</script>

<style>
.myheader-blank{
	height: calc(var(--status-bar-height) + 100rpx);
}
.myheader-navbar{
	position: fixed;
	top: 0;
	width: 100%;
	background-color: #ffffff;
	z-index: 999;
	border-bottom: #dcdcdc 1rpx solid;
	display: flex;
	flex-direction: column;
}
.status_bar{
	height: var(--status-bar-height); 
	width: 100%;
}
.myheader-container{
	width: 100%;
	font-size: 36rpx;
	display: flex;  
	align-items: center;  
	justify-content: space-between;
	height:100rpx;
	padding: 0 10rpx;
}
.back-button {  
	margin-left: 20rpx;
  /* 返回按钮样式 */
}  
  
.navbar-username {  
  /* 用户名样式 */
  margin-right: 20rpx;
}
.navbar-blank{
	width: 90rpx;
}
</style>