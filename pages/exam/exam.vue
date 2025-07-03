<template>
	<view class="content">
		<MyHeader :title="'考试列表'"></MyHeader>
		<view class="searchNav">
			<view class="searchNav-blank"></view>
			<view class="exam-searchNav-container">
				<!-- #ifdef H5 -->
				<view class="searchNav-btn" style="background-color: #5555ff;" v-if="showModules.includes('addExam')" @click="toPage('/pages/addexam/addexam')">新增</view>
				<!-- #endif -->
				<input class="searchNav-input" v-model="searchInput" type="text" @confirm="searchHandle()" confirm-type="search" />
			</view>
		</view>
		<view class="main-list">
			<view class="no-exam" v-if="!examlist[0]">未找到相关考试</view>
			<view class="item-box" v-for="(item,index) in examlist">
				<view class="adminList" v-if="showModules.includes('markPaper')">
					<uni-card :title="item.examName" :sub-title="item.eCreateTime">
						<template v-slot:actions>
								<view class="card-actions">
									<view class="card-actions-item actionBtn-check" @click="toMark(item.eid)">
										<text class="card-actions-item-text">阅卷</text>
									</view>
									<view class="card-actions-item actionBtn-alter" @click="alterExam(item.eid)">
										<text class="card-actions-item-text">修改</text>
									</view>
									<view class="card-actions-item actionBtn-del" @click="delExam(item.eid)">
										<text class="card-actions-item-text">删除</text>
									</view>
								</view>
							</template>
					</uni-card>
				</view>
				<view class="nomList" v-else>
					<uni-card :title="item.examName" :sub-title="item.eCreateTime" v-if="item.isFinished=='已完成'" :extra="'分数：'+(item.subScore+item.objScore)" @click="toPaper(item.eid,item.isFinished)"></uni-card>
					<uni-card :title="item.examName" :sub-title="item.eCreateTime" v-else :extra="item.isFinished" @click="toPaper(item.eid,item.isFinished)"></uni-card>
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
				username:'',
				searchInput:'',
				exams:[],
				showModules:[]
			}
		},
		computed:{
			examlist(){
				if(this.searchInput){
					return this.exams.filter((item)=>{
						if(item.examName.includes(this.searchInput)){
							return item
						}
					})
				}
				else{
					return this.exams
				}
			}
		},
		methods: {
			alterExam(eid){
				uni.navigateTo({
					url:'/pages/addexam/addexam?eid='+eid
				})
			},
			delExam(eid){
				uni.showModal({
					content:'确认删除考试？',
					success: (res) => {
						if(res.confirm){
							let username=uni.getStorageSync('username')
							let token=uni.getStorageSync('token')
							
							uni.request({
								url:'http://10.72.59.63:90/delExam.php',
								method:'POST',
								header: {
								    'Authorization': 'Bearer ' + token,
								},
								data:{
									username:username,
									eid:eid
								},
								success:(res)=> {
									if(res.data&&res.data.status){
										if(res.data.status=='success'){
											for(let i=0;i<this.exams.length;i++){
												if(this.exams[i].eid==eid){
													this.exams.splice(i,1)
													return
												}
											}
										}
									}
								}
							})
						}
					}
				})
			},
			handleBack(){
				uni.navigateTo({
					url: '/pages/index/index'
				});
			},
			toPaper(eid,isFinished){
				uni.navigateTo({
				    url: '/pages/exampaper/exampaper?isFinished=' + isFinished+'&eid='+eid,
					events:{
						FinishExam:this.getExams
					}
				}); 
			},
			toPage(url){
				uni.navigateTo({
				    url: url,
					events:{
						FinishPost:this.getExams
					}
				}); 
			},
			toMark(eid){
				uni.navigateTo({
					url:'/pages/markPaper/markPaper?eid='+eid
				})
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
						page:'examlist'
					},
					success:(res)=> {
						if(res.data&&res.data.moudle){
							this.showModules=res.data.moudle
						}
					}
				})
			},
			getExams(){
				let username=uni.getStorageSync('username')
				let token=uni.getStorageSync('token')
				
				uni.request({
					url:'http://10.72.59.63:90/getExams.php',
					method:'POST',
					header: {
					    'Authorization': 'Bearer ' + token,
					},
					data:{
						username:username
					},
					success:(res)=> {
						if(res.data){
							if(res.data.status=='success'){
								let exams=res.data.exams
								let uExamsInfo=res.data.uExamsInfo
								if(exams&&uExamsInfo){
									exams.forEach((exam)=>{
										uExamsInfo.forEach((state)=>{
											if(exam.eid==state.eid){
												exam.isFinished=state.isFinished
												exam.objScore=state.objScore
												exam.subScore=state.subScore
											}
										})
									})
								}
								this.exams=exams
							}
						}
					}
				})
			}
		},
		onLoad() {
			this.username=uni.getStorageSync('username')
		},
		mounted() {
			this.getExams()
			this.surePermisson()
		}
	}
</script>

<style scoped>
.searchNav-input{
	flex-grow: 1;
	border: 1rpx #d3d3d3 solid;
	border-radius: 30rpx;
	margin-left: 10rpx;
	padding-left: 20rpx;
	padding-right: 20rpx;
	font-size: 32rpx;
	color: #3b3b3b;
}
.searchNav-blank{
	height: 80rpx;
}
.exam-searchNav-container{
	width: 100%;
	position: fixed;
	top: calc(var(--status-bar-height) + 100rpx);
	font-size: 34rpx;
	box-sizing: border-box;
	padding: 15rpx;
	padding-left: 30rpx;
	padding-right: 30rpx;
	background-color: #f5f5f5;
	display: flex;
	justify-content: space-around;
	align-items: center;
	z-index: 999;
}
.searchNav-btn{
	width: 100rpx;
	height: 50rpx;
	font-size: 20rpx;
	text-align: center;
	line-height: 50rpx;
	border-radius: 20rpx;
	color: #ffffff;
}
.no-exam{
	padding-top: 20rpx;
	text-align: center;
}
.card-actions{
	display: flex;
	justify-content: end;
	align-items: center;
	padding-bottom: 10rpx;
}
.card-actions-item{
	text-align: center;
	width: 80rpx;
	padding: 10rpx;
	color: #fff;
	border-radius: 10rpx;
	margin-right: 10rpx;
}
.actionBtn-check{
	background-color: #49dd6c;
}
.actionBtn-alter{
	background-color: #546be8;
}
.actionBtn-del{
	background-color: #fe0818;
}
</style>
