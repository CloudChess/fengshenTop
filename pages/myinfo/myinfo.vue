<template>
	<view class="myinfo">
		<MyHeader :title="'我的信息'"></MyHeader>
		<view class="myinfo-container">
			<view class="mineList">
				<view class="mineList-item">
					<text class="mineList-item-tag">名字</text>
					<text class="mineList-item-txt">{{myinfo.userName}}</text>
				</view>
				<view class="mineList-item">
					<text class="mineList-item-tag">工段</text>
					<text class="mineList-item-txt">{{myinfo.gd}}</text>
				</view>
				<view class="mineList-item">
					<text class="mineList-item-tag">岗位</text>
					<text class="mineList-item-txt">{{myinfo.job}}</text>
				</view>
			</view>
		</view>
		<MyBottom></MyBottom>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				myinfo:{}
			}
		},
		methods: {
			getMyinfo(){
				let username=uni.getStorageSync('username')
				let token=uni.getStorageSync('token')
				
				uni.request({
					url:'http://10.72.59.63:90/getmyinfo.php',
					method:'POST',
					header: {
					    'Authorization': 'Bearer ' + token
					},
					data:{
						username:username
					},
					success:(res)=> {
						if(res.data){
							this.myinfo=res.data.data
						}
					}
				})
			}
		},
		mounted() {
			this.getMyinfo()
		}
	}
</script>

<style>
.mineList{
	display: flex;
	flex-direction: column;
}
.mineList-item{
	height: 80rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-sizing: border-box;
	padding-left: 40rpx;
	padding-right: 40rpx;
	border-bottom: 1rpx #e1e1e1 solid;
}
.mineList-item-tag{
	font-weight: bold;
}
.mineList-item-txt{
	color: #585858;
}
</style>
