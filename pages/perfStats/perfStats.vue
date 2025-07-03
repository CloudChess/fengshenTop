<template>
	<view class="perfStats">
		<MyHeader title="绩效统计"></MyHeader>
		<uni-data-picker placeholder="选择年份" v-model="perfDate" :localdata="selectDate" @change="changeHandle" :preload="true"></uni-data-picker>
		<view class="picker-blank"></view>
		<view class="perfStats-container">
			<view class="perTable">
				<view class="perTable-title">
					<view class="perTable-title-cell" style="font-weight: bold;">&gt;</view>
					<view class="perTable-title-cell" @click="toStruct('炼胶')">炼胶</view>
					<view class="perTable-title-cell" @click="toStruct('压出')">压出</view>
					<view class="perTable-title-cell" @click="toStruct('成型')">成型</view>
					<view class="perTable-title-cell" @click="toStruct('硫化')">硫化</view>
					<view class="perTable-title-cell" @click="toStruct('辅助')">辅助</view>
				</view>
				<view class="perTable-null" v-if="!perfinfo[0]">本年无数据</view>
				<view class="perTable-row" v-for="(item,index) in perfinfo">
					<view class="tableKey">{{item.month}}月</view>
					<view class="tableValue" v-for="(t,i) in item.group">{{t.perfCoefficient}}</view>
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
				perfDate:0,
				selectDate:[],
				perfinfo:[]
			}
		},
		methods: {
			changeHandle(e){
				this.getPrefStauts()
			},
			creatDateTree(startYear){
				let selectDate = [];  
				    
				  // 为每一年生成数据
				  for (let year = startYear; year <= startYear + 3; year++) {
				    let yearObj = {
				      text: year,  
				      value: year,
				    };  
				      
				    selectDate.push(yearObj);  
				  }
				    
				  this.selectDate=selectDate
			},
			toStruct(param){
				uni.navigateTo({
					url: '/pages/teamStruct/teamStruct?team='+param+'&year='+this.perfDate
				});
			},
			unscramblePerf(perf){
				if(typeof perf=='object'){
					let temp=[]
					
					perf.map((item)=>{
						let isExist=false
						temp.forEach((t)=>{
							if(t.month==item.month){
								isExist=true
								t.group.push({perfteam:item.emp_team,perfCoefficient:item.emp_perf})
							}
						})
						if(!isExist){
							temp.push({month:item.month,group:[{perfteam:item.emp_team,perfCoefficient:item.emp_perf}]})
						}
					})
					
					//let sortArr=['炼胶','压出','成型','硫化','辅助']
					
					this.perfinfo=temp
				}
			},
			getPrefStauts(){
				let token = uni.getStorageSync('token');
				let username = uni.getStorageSync('username');
				
				uni.request({
					url: 'http://10.72.59.63:90/getprefstauts.php',
					method: 'POST',
					header: {
						'Authorization': 'Bearer ' + token
					},
					data: {
						username: username,
						year:this.perfDate
					},
					success: (res) => {
						if (res.data&&res.data.data) {
							this.unscramblePerf(res.data.data)
						}
						else{
							this.perfinfo=[]
						}
					}
				})
			}
		},
		mounted() {
			this.creatDateTree(2024)
			let d=new Date()
			let year=d.getFullYear()
			this.perfDate=year
			this.getPrefStauts()
		}
	}
</script>

<style scoped>
.picker-blank{
	height: 35px;
}
.perfStats-container{
	padding: 25rpx;
	display: flex;
	flex-direction: column;
	background-color: #f7f7f7;
}

.perTable{
	overflow: hidden;
	border-radius: 10rpx;
	display: flex;
	flex-direction: column;
}
.perTable-title{
	height: 80rpx;
	display: flex;
	justify-content: space-around;
	align-items: center;
	background-color: #f1d6e8;
	border-bottom: #827e7e 1rpx solid;
}
.perTable-title-cell{
	width: 80rpx;
	text-align: center;
}
.perTable-null{
	height: 60rpx;
	text-align: center;
	background-color: #f7dcee;
	padding: 10rpx;
}
.perTable-row{
	height: 60rpx;
	display: flex;
	justify-content: space-around;
	align-items: center;
}
.perTable-row:nth-child(odd){background-color: #b6eeb5;}
.perTable-row:nth-child(even){background-color: #8eebff;}

.item{
	justify-content: center;
}
</style>
