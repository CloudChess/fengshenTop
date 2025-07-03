<template>
	<view class="teamStruct">
		<MyHeader :title="''"></MyHeader>
		<uni-data-picker placeholder="年份/月份" v-model="perfDate" :localdata="selectDate" @change="changeHandle" :preload="true"></uni-data-picker>
		<view class="picker-blank"></view>
		<scroll-view class="container" scroll-y="true" @scroll="scrollHandle">
			<view class="teamList">
				<view class="list-leader">
					<view class="listText" :style="absoluteItem">
					<!-- <view class="listText"> -->
						<view class="listItem" v-for="(person,index) in teaminfo.leader" @click="toDetail(person.empid)">
							<view class="listItem-left">
								<view class="icon leader" v-if="person.emp_job=='组长'"></view>
								<view class="icon sublearder" v-if="person.emp_job=='副组长'"></view>
								<view class="name">{{person.emp_name}}</view>
								<view class="job">{{person.emp_job}}</view>
							</view>
							<view class="listItem-right">
								<view class="perf">{{perfinfo[person.empid]}}</view>
								<view class="perf-noData" v-if="!perfinfo[person.empid]">本月无绩效</view>
							</view>
						</view>
					</view>
					<view class="list-more">
						<view class="listItem" v-for="(p,index) in sortPeople" @click="toDetail(p.empid)">
							<view class="listItem-left">
								<view class="icon"></view>
								<view class="name">{{p.emp_name}}</view>
							</view>
							<view class="listItem-right">
								<view class="perf">{{perfinfo[p.empid]}}</view>
								<view class="perf-noData" v-if="!perfinfo[p.empid]">本月无绩效</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="orderBtn" @click="changeOrder">
			<view class="orderBtn-text" v-if="!order">↑升序</view>
			<view class="orderBtn-text" v-if="order">↓降序</view>
		</view>
		<MyBottom></MyBottom>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				teaminfo: {
					leader: [],
					people: []
				},
				perfinfo:{},
				absoluteItem: '',
				perfDate:'',
				selectDate:[],
				team:'',
				order:1,
			}
		},
		computed:{
			sortPeople(){
				if(this.teaminfo.people&&this.perfinfo){
					this.teaminfo.people.sort((a,b)=>{
						if(this.order){
							return Number(this.perfinfo[b.empid])-Number(this.perfinfo[a.empid])
						}else{
							return Number(this.perfinfo[a.empid])-Number(this.perfinfo[b.empid])
						}
					})
					console.log(this.teaminfo.people)
					return this.teaminfo.people
				}
			}
		},
		methods: {
			scrollHandle(e) {
				// let scrollTop = e.detail.scrollTop
				// let fixedChange=0
				// if (scrollTop >= fixedChange) {
				// 	this.absoluteItem = "position: fixed;"
				// } else if (scrollTop < fixedChange) {
				// 	this.absoluteItem = ''
				// }
			},
			toDetail(pid) {
				uni.navigateTo({
					url: '/pages/teaminfoDetail/teaminfoDetail?pid=' + pid+'&to=1'
				})
			},
			changeOrder(){
				this.order=!this.order
			},
			creatDateTree(startYear){
				let selectDate = [];  
				    
				  // 为每一年生成数据  
				  for (let year = startYear; year <= startYear + 3; year++) { // 假设我们为接下来的10年生成数据  
				    let yearObj = {
				      text: String(year),  
				      value: String(year),
				      children: []  
				    };  
				      
				    // 为每个月生成数据  
				    for (let month = 1; month <= 12; month++) {
				      let monthText = month < 10 ? '0' + month : String(month); // 确保月份是两位数  
				      let monthValue = year + '-' + monthText;  
				      let monthObj = {  
				        text: monthText + '月',
				        value: monthValue  
				      };  
				        
				      yearObj.children.push(monthObj);  
				    }
				      
				    selectDate.push(yearObj);  
				  }
				  this.selectDate=selectDate
			},
			changeHandle(e){
				if(this.perfDate.length==7){
					let temparr=this.perfDate.split('-')
					this.getTeamInfoPerf(this.team,temparr[0],temparr[1])
				}
			},
			getTeamInfo(team) {
				let token = uni.getStorageSync('token');
				let username = uni.getStorageSync('username');
				uni.request({
					url: 'http://10.72.59.63:90/getteaminfobyteam.php',
					method: 'POST',
					header: {
						'Authorization': 'Bearer ' + token
					},
					data: {
						username: username,
						team: team
					},
					success: (res) => {
						if (res.data && res.data.data) {
							let subArr=[]
							res.data.data.map((person) => {
								if (person.emp_job == "组长") {
									this.teaminfo.leader.push(person)
								}
								else if(person.emp_job=='副组长'){
									subArr.push(person)
								}
								else {
									this.teaminfo.people.push(person)
								}
							})
							this.teaminfo.leader.push(...subArr)
						}
					}
				})
			},
			getTeamInfoPerf(team,year,month) {
				let token = uni.getStorageSync('token');
				let username = uni.getStorageSync('username');
				uni.request({
					url: 'http://10.72.59.63:90/getPerfbyteam.php',
					method: 'POST',
					header: {
						'Authorization': 'Bearer ' + token
					},
					data: {
						username: username,
						team: team,
						year:year,
						month:month
					},
					success: (res) => {
						if (res.data&& res.data.data) {
							this.perfinfo = res.data.data.reduce(function(obj, item) {  
							    obj[item.emp_id] = item.emp_perf;  
							    return obj;  
							}, {}); 
						}
					}
				})
			}
		},
		mounted() {

		},
		onLoad(options) {
			this.team = options.team
			if (this.team) {
				this.getTeamInfo(this.team)
				this.getTeamInfoPerf(this.team)
			}
			this.creatDateTree(2023)
			if(options.year){
				let d=new Date()
				let month=d.getMonth()+1
				month=month<10?'0' + month : String(month)
				this.perfDate=options.year+'-'+month
			}
		}
	}
</script>

<style scoped>
	.picker-blank{
		height: 35px;
	}
	.container {
		
	}

	.teamList {
		display: flex;
		flex-direction: column;
	}

	.listItem {
		display: flex;
		justify-content: space-between;
		width: 100%;
		background-color: #f5f5f5;
		box-sizing: border-box;
		padding-left: 20rpx;
		padding-right: 100rpx;
		height: 100rpx;
		line-height: 100rpx;
		border: 1rpx solid #dddddd;
	}
	.listText .listItem{
		padding-right: 80rpx;
	}
	
	.listItem>view{
		display: flex;
		align-items: center;
	}

	.listText,
	.list-more {
		display: flex;
		flex-direction: column;
	}

	.listText {
		width: 100%;
	}

	.icon {
		width: 20rpx;
		height: 20rpx;
		border-radius: 10rpx;
		background-color: #0055ff;
		margin-right: 10rpx;
	}

	.job {
		font-size: 18rpx;
		font-style: italic;
		margin-left: 10rpx;
		color: #949494;
	}

	.sublearder {
		background-color: #93cdff;
	}

	.list-more>.listItem {
		margin-left: 20rpx;
	}

	.list-more .icon {
		background-color: #00ff00;
	}
	.perf{
		font-size: 25rpx;
	}
	.perf-noData{
		font-size: 25rpx;
		color: #a1a1a1;
	}
	.orderBtn{
		position: fixed;
		bottom: 120rpx;
		right: 15rpx;
		width: 80rpx;
		height: 80rpx;
		background: rgba(115, 221, 209, 0.5);
		border-radius: 40rpx;
		line-height: 80rpx;
		text-align: center;
		font-size: 18rpx;
	}
</style>