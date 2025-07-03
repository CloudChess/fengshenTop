<template>
	<div>123</div>
</template>

<script>
	export default {
		onLaunch: function() {
			const username = uni.getStorageSync('username');
			const token = uni.getStorageSync('token');
			if (username&&token) {
			    // 已有登录状态，执行自动登录逻辑
				this.autoLogin(username,token)
			}
			else{
				// uni.navigateTo({url:'/pages/login/login'});
			}  
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
		    autoLogin(username,token) {  
		      uni.request({
		      	url:'http://10.72.59.63:90/autologin.php',
				method: 'POST',
				header: {
				    'Authorization': 'Bearer ' + token
				},
				data:{
					username:username
				},
				success(res) {
					if(res.data.status=='fail'){
						uni.showModal({
							content: '请重新登录',
							showCancel: false,
							success: function(sure) {
								if (sure.confirm) {
									uni.navigateTo({
										url: '/pages/login/login'
									});
								}
							}
						})
					}
					else if(res.data.status=='success'){
						uni.navigateTo({url:'/pages/index/index'});
					}
				},
				fail() {
					
				}
		      })
		    }  
		}  
	}
</script>

<style>
	/*每个页面公共css */
</style>
