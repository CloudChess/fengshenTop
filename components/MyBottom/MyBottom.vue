<template>
	<view class="myBottom">
		<view class="bottomNav-blank">

		</view>
		<view class="bottomNav">
			<view class="bottomNav-home" @click="toPage('/pages/index/index')">首 页</view>
			<view class="bottomNav-mine" @click="toPage('/pages/myinfo/myinfo')">我 的</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "MyHeader",
		props: {
			title: '',
			isusername: {
				default: false
			}
		},
		data() {
			return {
				username: ''
			}
		},
		methods: {
			toPage(url){
				uni.navigateTo({
					url:url
				})
			},
		},
		mounted() {
			let usernameinfo = uni.getStorageSync('username');
			if (usernameinfo) {
				this.username = usernameinfo
			} else {
				uni.navigateTo({
					url: '/pages/index/index'
				});
			}
		}
	}
</script>

<style>
	.bottomNav-blank{
		height: 100rpx;
		width: 100%;
	}
	.bottomNav {
		background: #ffffff;
		height: 100rpx;
		box-sizing: border-box;
		padding-left: 100rpx;
		padding-right: 100rpx;
		width: 100%;
		position: fixed;
		bottom: 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		box-shadow: #ebebeb 0rpx 0rpx 6rpx 6rpx;
	}
</style>