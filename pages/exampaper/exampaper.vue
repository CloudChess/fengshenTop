<template>
	<view>
		<view class="exampaper">
			<MyHeader title="考试" :sureBack="true"></MyHeader>
			<examQlist :questions="questions" :isComplated="isFinished" :eid="eid" @updatecomplate="updatecomplate"></examQlist>
		</view>
	</view>
</template>

<script scoped>
	import examQlist from '../../components/examQlist.vue'

	export default {
		components: {
			examQlist
		},
		data() {
			return {
				username: '',
				isFinished: '',
				eid:0,
				questions: []
			}
		},

		methods: {
			updatecomplate(){
				this.isFinished=true
			},
			handleBack() {
				uni.navigateTo({
					url: '/pages/index/index'
				});
			},
			getExamPaper(){
				let username=uni.getStorageSync('username')
				let token=uni.getStorageSync('token')
				
				uni.request({
					url:'http://10.72.59.63:90/getExamPaper.php',
					method:'POST',
					header: {
					    'Authorization': 'Bearer ' + token,
					},
					data:{
						username:username,
						eid:this.eid
					},
					success:(res)=> {
						if(res.data&&res.data.data){
							this.questions=res.data.data
						}
					}
				})
			}
		},
		onLoad(options) {
			this.username = uni.getStorageSync('username')
			this.isFinished = options.isFinished == '已完成' ? true : false
			this.eid=options.eid
			this.getExamPaper(this.eid)
		}
	}
</script>

<style scoped>

</style>