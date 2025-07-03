<template>
	<view class="teamInfo">
		<MyHeader title="团队信息"></MyHeader>
		<view class="stepNav">
			<view></view>
		</view>
		<view class="searchNav">
			<view class="searchNav-blank"></view>
			<view class="searchNav-container">
				<text class="searchNav-classify" @click="showClassfiy">筛选</text>
				<input class="searchNav-input" v-model="searchInput" type="text" @confirm="searchHandle()" confirm-type="search" />
				<text class="searchNav-order" @click="showOrder">排序</text>
			</view>
		</view>
		
		<view class="infoList">
			<view class="list-nodata" v-if="teaminfo.length==0">加载中</view>
			<view class="list-nodata" v-else-if="searchInfo.length==0">无检索结果</view>
			<view class="list-item" v-for="(person,Pindex) in searchInfo" @click="toDetail(person.empid)">
				<text class="item-name">{{person.emp_name}}</text>
				<text class="item-postion">{{person.emp_job_type}}</text>
				<text class="item-section">{{person.emp_workshop}}</text>
			</view>
		</view>
		<MyBottom></MyBottom>
		
		<uni-drawer ref="ShowClassfiy">
			<view class="drawer-blank"></view>
			<scroll-view  style="height: 100%;" scroll-y="true">
				<view>
					<uni-section :title="option.name" type="line" v-for="(option,Oindex) in classArr">
						<view class="classfiy-section">
							<view class="classfiyTag" :class="{tagChecked:tag.ischecked}" @click="tagHandle(Oindex,Tindex)" v-for="(tag,Tindex) in option.value">{{tag.tag}}</view>
						</view>
					</uni-section>
				</view>
			</scroll-view>
		</uni-drawer>
		<uni-drawer ref="ShowOrder" mode="right">
			<scroll-view style="height: 100%;" scroll-y="true">
				<view></view>
			</scroll-view>
		</uni-drawer>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				username:'用户名',
				classArr:[
					{keyname:'emp_workshop',name:'工段',value:[{tag:'炼胶',ischecked:false},{tag:'压出',ischecked:false},{tag:'成型',ischecked:false},{tag:'硫化',ischecked:false},{tag:'叉车',ischecked:false},{tag:'成品',ischecked:false}]},
					{keyname:'emp_position',name:'岗位',value:[{tag:'保全',ischecked:false},{tag:'设备管理员',ischecked:false},{tag:'设备主管',ischecked:false}]},
					{keyname:'emp_job_type',name:'工种',value:[{tag:'钳工',ischecked:false},{tag:'电工',ischecked:false},{tag:'焊工',ischecked:false}]},
					{keyname:'emp_edution',name:'学历',value:[{tag:'初中',ischecked:false},{tag:'中专',ischecked:false},{tag:'高中',ischecked:false},{tag:'大专',ischecked:false},{tag:'本科',ischecked:false},{tag:'小学',ischecked:false},{tag:'中技',ischecked:false},{tag:'技校',ischecked:false},]},
					{keyname:'emp_skill_level',name:'专业等级',value:[{tag:'无',ischecked:false},{tag:'技师',ischecked:false},{tag:'中级工',ischecked:false},{tag:'高级工',ischecked:false}]},
				],
				classNum:0,
				searchInput:"",
				searchInfo:[],
				teaminfo:[],
				showinfo:[]
			}
		},
		methods: {
			toDetail(empid){
				uni.navigateTo({
					url:'/pages/teaminfoDetail/teaminfoDetail?pid='+empid+'&to=2'
				})
			},
			showClassfiy(){
				this.$refs.ShowClassfiy.open()
			},
			showOrder(){
				this.$refs.ShowOrder.open()
			},
			searchHandle(){
				if (this.searchInput.trim()) {
					this.searchInfo=[]
					this.searchInfo = this.teaminfo.filter(item => {
						let flag=false
						if(item.emp_name.includes(this.searchInput))flag=true
						if(item.emp_position.includes(this.searchInput))flag=true
						if(item.emp_workshop.includes(this.searchInput))flag=true
						return flag
					});  
				} else {
					this.searchInfo = this.teaminfo;  
				} 
			},
			tagHandle(Oindex,Tindex){
				//多次获取赋值，减少深度遍历，空间换时间
				let section=this.classArr[Oindex] //获取section数据
				let tempkeyname=section.keyname   //获取keyname
				let tag=section.value[Tindex]     //获取标签数据
				let tagstr=tag.tag				  //获取tagvalue,被筛选数据
				let tempBool=!tag.ischecked		  //获取是否被选中
				
				this.classArr[Oindex].value[Tindex].ischecked=tempBool
				
				if(tempBool){
					if(!this.classNum&&!this.searchInput){
						this.searchInfo=[]
					}
					let tempArr=[]
					tempArr=this.teaminfo.filter((item)=>{
						if(item[tempkeyname].includes(tagstr)){
							let flag=true
							this.searchInfo.some((originItem)=>{
								if(originItem==item){
									flag=false;
									return true
								}
							})
							return flag
						}
					})
					this.classNum++
					this.searchInfo.push(...tempArr)
				}
				else{
					this.searchInfo=this.searchInfo.filter((item)=>{
						if(item[tempkeyname].includes(tagstr)){
							return false
						}
						return true
					})
					if(this.classNum>0){
						this.classNum--
					}
					if(!this.classNum){
						this.searchInfo=this.teaminfo
					}
				}
			},
			getTeamInfo() {
				let token = uni.getStorageSync('token');
				let username = uni.getStorageSync('username');
				uni.request({
					url: 'http://10.72.59.63:90/getteaminfo.php',
					method: 'POST',
					header: {
						'Authorization': 'Bearer ' + token
					},
					data: {
						username: username
					},
					success: (res) => {
						if (res.data.data) {
							this.teaminfo = res.data.data
							this.searchInfo=this.teaminfo
						}
					}
				})
			}
		},
		mounted() {
			this.getTeamInfo()
		}
	}
</script>

<style>
.searchNav{
	
}
.searchNav-input{
	border: 1rpx #d3d3d3 solid;
	border-radius: 30rpx;
	padding-left: 20rpx;
	padding-right: 20rpx;
	font-size: 32rpx;
	color: #3b3b3b;
}
.searchNav-blank{
	height: 80rpx;
}
.searchNav-container{
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
	justify-content: space-between;
	align-items: center;
}
.infoList{
	display: flex;
	flex-direction: column;
	padding: 20rpx;
}
.list-nodata{
	text-align: center;
}
.list-item{
	padding: 15rpx;
	border: 1rpx #cacaca solid;
	display: flex;
	justify-content: space-between;
}
.list-item:nth-child(odd){background-color: #c1e6ee;}
.list-item:nth-child(even){background-color: #eafffb;}
.item-name{
	width: 200rpx;
}

.classfiy-section{
	padding: 10rpx;
	width: 100%;
	display: flex;
	justify-content: start;
	flex-wrap: wrap;
}
.drawer-blank{
	height: var(--status-bar-height);
}
.classfiyTag{
	padding: 10rpx;
	margin-bottom: 10rpx;
	margin-right: 20rpx;
	border: 1rpx solid #739e9e;
	border-radius: 13rpx;
}
.tagChecked{
	background-color: #00aaff;
	color: #ffffff;
	border-color: #00aaff;
}
</style>
