<template>
	<view class="markPaper">
		<!-- #ifdef H5 -->
		<view class="markPaperBg"></view>
		<view class="markPaper-container">
			<view class="left sideWith">
				<view class="left-team whiteBlock">
					<view class="search">
						<input class="searchInput" type="text" placeholder="人员搜索" placeholder-style="color:#d6d6d6;" v-model="searchTxt" />
					</view>
					<view class="searchResBox">
						<view class="searchRes-item" v-for="(p,index) of searchTeam" @click="setNowPerson(p)">{{p.emp_name}}</view>
					</view>
					<view class="teamBox">
						<view class="teamBox-title"><view class="icon-point"></view><text>考试人员</text></view>
						<view class="teamMenu">
							<view class="Menu" v-for="(group,workshop) in groupTeam">
								<view class="GroupTitle" @click="showSub(workshop)">
									<text class="Title-txt">{{workshop}}</text>
									<text class="Title-txt"></text>
								</view>
								<MyTransition>
									<view class="subMenu" :style="subShowStyle" v-show="groupShow[workshop]">
										<!-- 期待更丰富准确的列表成员考试状态提示，有一个没有用上的类名PeopleFinished -->
										<view class="subMenu-item" v-for="(p,index) of group" @click="setNowPerson(p)" :class="{isNowPerson:p==nowPerson}">
											<text class="left-empName">{{p.emp_name}}</text>
											<text class="left-empTotalScore" v-if="p.totalScore">分数：{{p.totalScore}}</text>
										</view>
									</view>
								</MyTransition>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="mid midWidth">
				<!-- 答题人信息 -->
				<view class="personInfo whiteBlock marginBottom10">
					<text class="pName">姓名：{{nowPerson.emp_name}}</text>
					<text class="pWorkshop">工段：{{nowPerson.emp_workshop}}</text>
					<text class="pObjScore">客观题分数：{{scoreOfNowPerson.objScore||0}}</text>
					<text class="pSubScore">主观题分数：{{scoreOfNowPerson.subScore||0}}</text>
					<text class="pTotalScore">总分：{{scoreOfNowPerson.objScore+scoreOfNowPerson.subScore||0}}</text>
				</view>
				<!-- 题号 -->
				<view class="qList whiteBlock marginBottom10">
					<view class="qListOpera">
						<view class="qListOpera-left">
							<view class="classTags">
								<view class="qListClassTag" v-for="qtype in QtypeClassTags" :class="{isQtypeSelect:nowQtype==qtype}" @click="changeNowQtype(qtype)">{{qtype}}</view>
							</view>
						</view>
						<view class="qListOpera-right">
							<view class="togQlistMethod" @click="showQlistMethod=!showQlistMethod">
								<view class="togSlider">
									<view class="sliderBox">
										<view class="sliderDiv" :class="{sliderDivRight:showQlistMethod}" ></view>
									</view>
								</view>
								<text class="togDesTag">题号</text>
							</view>
						</view>
					</view>
					<view class="qListItems">
						<view class="qListItem" v-show="!showQlistMethod" v-for="(item,index) of showQuestions">
							<view class="qListItem-txt" :class="{nowOrder:item.now}" @click="alterNowQuestion(index)">{{index+1}}</view>
						</view>
						<view class="qListItem" v-show="showQlistMethod" v-for="(item,index) of showQuestions">
							<view class="qListItem-txt" :class="{nowOrder:item.now}" @click="alterNowQuestion(index)">{{questions.indexOf(item)+1}}</view>
						</view>
					</view>
				</view>
				<!-- 答题信息 -->
				<view class="noQuestionInfo whiteBlock" v-if="!questions.length||!showQuestions.length">暂无考试记录</view>
				<view class="questionBox whiteBlock" v-if="questions.length">
					<view class="questionInfo-for" v-for="(item,index) of questions">
						<view class="questionPanel" v-show="item.now">
							<view class="questionInfo">
								<view class="qOrder qInfoItem">
									<view class="questionTag">序号：</view>
									<view class="questionContent">{{index+1}}</view>
									<view class="questionPreScore">(分值：{{item.score}})</view>
								</view>
								<view class="qTitle qInfoItem">
									<view class="questionTag">题目：</view>
									<view class="questionContent">{{item.title}}</view>
								</view>
								<view class="qUanswer qInfoItem">
									<view class="questionTag">解答：</view>
									<view class="questionContent">
										<view class="qUanswer-shortT">{{item.uanswer}}</view>
										<view class="qUanswer-draw" v-if="item.qtype=='画图'">
											<img :src="'http://10.72.59.63:90/'+item.drawImg" />
										</view>
									</view>
								</view>
							</view>
							<view class="qInputs">
								<view class="alterPersonBtns">
									<button class="prePersonBtn" @click="setNowPerson(null,-1)">上一人</button>
									<button class="nextPersonBtn" @click="setNowPerson(null,1)">下一人</button>
								</view>
								<view class="markBtns">
									<button class="preQuestionBtn" @click="alterNowQuestion(index-1)">上一题</button>
									<view class="scoreInputs">
										<text class="scoreInput-tag">分数：</text>
										<input class="scoreInput" type="number" v-model="item.uscore" @focus="beforeInput" @input="subScore($event,item.qid,item.score)" />
									</view>
									<button class="nextQuestionBtn" @click="alterNowQuestion(index+1)">下一题</button>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="right sideWith">
				<view class="right-examInfo whiteBlock">
					<view class="examInfo-title">
						<text class="examName">{{examInfo.examName}}</text>
						<text>{{examInfo.eCreateTime}}</text>
						<text>已考：{{examInfo.joinNum}}人</text>
					</view>
				</view>
				<view class="right-btns whiteBlock">
					<view class="pageBtns">
						<button class="exitBtn" @click="exitPaper">退出阅卷</button>
					</view>
				</view>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				eid:null,
				team:[],
				questions:[],
				examInfo:{},
				searchTxt:'',
				groupShow:{
					'炼胶':false,
					'压出':false,
					'成型':false,
					'硫化':false,
					'辅助':false,
				},
				subShowStyle:'',
				nowPerson:{},
				indexOfGroup:null,
				scoreOfNowPerson:{},
				everyScore:[],
				theInputScore:0,
				nowQtype:'全部',
				QtypeClassTags:['全部','单选','多选','判断','填空','简答','画图'],
				showQlistMethod:false
			}
		},
		computed:{
			showQuestions(){
				if(this.questions){
					if(this.nowQtype=='全部'){
						return this.questions
					}
					else{
						let tempArr = []
						this.questions.forEach((q)=>{
							if(q.qtype==this.nowQtype){
								tempArr.push(q)
							}
						})
						return tempArr
					}
				}
			},
			groupTeam(){
				if(this.team){
					let tempArr={
						'炼胶':[],
						'压出':[],
						'成型':[],
						'硫化':[],
						'辅助':[],
					}
					this.team.forEach((p)=>{
						if(this.everyScore.length){
							this.everyScore.forEach((uEinfo)=>{
								if(uEinfo.pid==p.empid){
									p.totalScore=uEinfo.objScore+uEinfo.subScore
								}
							})
						}
						if(tempArr[p.emp_workshop]){
							tempArr[p.emp_workshop].push(p)
						}
					})
					return tempArr
				}
			},
			searchTeam(){
				if(this.searchTxt){
					let tempArr=[]
					this.team.forEach((p)=>{
						if(p.emp_name.includes(this.searchTxt)){
							tempArr.push(p)
						}
					})
					return tempArr
				}
			}
		},
		methods: {
			changeNowQtype(qtype){
				this.nowQtype=qtype
				this.questions.forEach((q)=>{q.now=false})
				this.showQuestions[0].now=true
			},
			togQlistShowMethod(){
				this.showQlistMethod=!this.showQlistMethod
			},
			exitPaper(){
				uni.navigateBack()
			},
			alterNowQuestion(qindex){
				if(qindex>=0){
					this.questions.forEach((q)=>{q.now=false})
					this.questions[qindex].now=true
				}
			},
			setNowPerson(person,dir){
				if(person){
					this.indexOfGroup=this.groupTeam[person.emp_workshop].indexOf(person)
					this.nowPerson=person
					this.getQuestions(person.empid)
					this.getPersonScoreM()
				}
				else if(dir){
					if(this.indexOfGroup+dir>0){
						let group=this.nowPerson.emp_workshop
						this.nowPerson=this.groupTeam[group][this.indexOfGroup+dir]
						this.indexOfGroup=this.groupTeam[group].indexOf(this.nowPerson)
						this.getQuestions(this.nowPerson.empid)
						this.getPersonScoreM()
					}
				}
			},
			showSub(workshop){
				this.groupShow[workshop]=!this.groupShow[workshop]
			},
			getTeam(){
				let username=uni.getStorageSync('username')
				let token=uni.getStorageSync('token')
				
				uni.request({
					url:'http://10.72.59.63:90/getteaminfo.php',
					method:'POST',
					header: {
					    'Authorization': 'Bearer ' + token,
					},
					data:{
						username:username,
					},
					success:(res)=> {
						if(res.data&&res.data.data){
							this.team=res.data.data
						}
					}
				})
			},
			getQuestions(pid){
				this.questions=[]
				
				let username=uni.getStorageSync('username')
				let token=uni.getStorageSync('token')
				
				uni.request({
					url:'http://10.72.59.63:90/getSubQuestions.php',
					method:'POST',
					header: {
					    'Authorization': 'Bearer ' + token,
					},
					data:{
						username:username,
						eid:this.eid,
						pid:pid
					},
					success:(res)=> {
						if(res.data&&res.data.questions){
							let qs=res.data.questions
							qs.forEach((q)=>{
								q.now=false
							})
							this.questions=qs.reverse()
							this.questions[0].now=true
						}
					}
				})
			},
			beforeInput(e){
				this.theInputScore=e.detail.value
			},
			subScore(e,qid,score){
				let subScore=e.detail.value//获取用户输入分数
				if(subScore && subScore>=0 && subScore<=score){
					let changeValue=subScore-this.theInputScore
					this.scoreOfNowPerson.subScore+=changeValue
					this.groupTeam[this.nowPerson.emp_workshop][this.indexOfGroup].totalScore+=changeValue
					this.theInputScore=subScore
					
					let username=uni.getStorageSync('username')
					let token=uni.getStorageSync('token')
					
					uni.request({
						url:'http://10.72.59.63:90/subScore.php',
						method:'POST',
						header: {
						    'Authorization': 'Bearer ' + token,
						},
						data:{
							username:username,
							eid:this.eid,
							pid:this.nowPerson.empid,
							qid:qid,
							uscore:subScore
						},
						success:(res)=> {
							if(res.data&&res.data.status){
								if(res.data.status=='fail'){
									uni.showModal({
										content:'修改分数失败(服务器错误)\n该信息相关：'+this.nowPerson.emp_name
									})
								}
							}
						}
					})
				}
				else if(subScore){
					uni.showModal({
						content:'分数不合法，请注意分值范围'
					})
				}
			},
			getPersonScoreM(){
				this.scoreOfNowPerson={}
				
				let username=uni.getStorageSync('username')
				let token=uni.getStorageSync('token')
				
				uni.request({
					url:'http://10.72.59.63:90/getSingleScore.php',
					method:'POST',
					header: {
					    'Authorization': 'Bearer ' + token,
					},
					data:{
						username:username,
						eid:this.eid,
						pid:this.nowPerson.empid
					},
					success:(res)=> {
						if(res.data&&res.data.data){
							this.scoreOfNowPerson = res.data.data
						}
					}
				})
			},
			getExamInfo(){
				let username=uni.getStorageSync('username')
				let token=uni.getStorageSync('token')
				
				uni.request({
					url:'http://10.72.59.63:90/getSingleExam.php',
					method:'POST',
					header: {
					    'Authorization': 'Bearer ' + token,
					},
					data:{
						username:username,
						eid:this.eid,
					},
					success:(res)=> {
						if(res.data&&res.data.data){
							this.examInfo = res.data.data
						}
					}
				})
			},
			getOneByOneScore(){
				let username=uni.getStorageSync('username')
				let token=uni.getStorageSync('token')
				
				uni.request({
					url:'http://10.72.59.63:90/getPeopleScore.php',
					method:'POST',
					header: {
					    'Authorization': 'Bearer ' + token,
					},
					data:{
						username:username,
						eid:this.eid,
					},
					success:(res)=> {
						if(res.data&&res.data.data){
							this.everyScore=res.data.data
						}
					}
				})
			}
		},
		onLoad(options) {
			this.eid=options.eid
			
			this.getExamInfo()
			this.getTeam()
			this.getExamInfo()
			this.getOneByOneScore()
		}
	}
</script>

<style scoped>
.markPaperBg{
	background-color: #cbdecf;
	height: 100vh;
	width: 100%;
	position: fixed;
	z-index: -999;
}
.markPaper-container{
	padding-top: 40rpx;
	display: flex;
	justify-content: center;
}
.whiteBlock{
	padding: 10rpx;
	background-color: #ffffff;
	border-radius: 10rpx;
}
.sideWith{
	width: 480rpx;
}
.midWidth{
	width: 1500rpx;
}
.mid{
	margin-left: 30rpx;
	margin-right: 30rpx;
}
.marginBottom10{
	margin-bottom: 10rpx;
}

.left-team{
	background-color: #d5ecea;
	padding: 20rpx;
}
.searchInput{
	border: #797979 1rpx solid;
	background-color: #a5b4a9;
	color: #ffffff;
	border-radius: 10rpx;
	padding-left: 20rpx;
	padding-top: 6rpx;
	padding-bottom: 6rpx;
}
.searchResBox{
	margin-top: 10rpx;
	background-color: #c7c7c7;
	border-radius: 10rpx;
}
.searchRes-item{
	padding: 10rpx;
}
.searchRes-item:hover{
	background-color: #dedede;
	cursor: pointer;
}
.teamBox{
	background-color: #c7c7c7;
	border-radius: 10rpx;
	margin-top: 20rpx;
	overflow: hidden;
}
.teamBox-title{
	padding: 20rpx;
	display: flex;
	align-items: center;
}
.icon-point{
	width: 10rpx;
	height: 30rpx;
	background-color: #4d4d4d;
	border-radius: 6rpx;
	margin-right: 10rpx;
}
.teamMenu{
	background-color: #000;
	color: #fff;
}
.Menu{
	
}
.teamMenu>.Menu:not(:last-child){
	border-bottom: 1rpx solid #747f77;
}
.GroupTitle{
	padding: 15rpx;
	
}
.subMenu{
	background-color: #484848;
	transition: all 1s;
}
.subMenu-item{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 10rpx;
	color: #d0d0d0;
}
.subMenu-item:hover{
	background-color: #949494;
	cursor: pointer;
}
.personInfo{
	font-size: 26rpx;
	display: flex;
	justify-content: space-around;
	font-weight: bold;
}
.qList{
	padding-left: 20rpx;
	padding-right: 20rpx;
	display: flex;
	flex-direction: column;
}
.qListItem-txt{
	text-align: center;
	width: 40rpx;
	height: 40rpx;
	padding: 5rpx;
	border: 1rpx solid #000;
	border-radius: 5rpx;
	margin-right: 8rpx;
}
.questionBox{
	overflow: hidden;
}
.questionInfo{
	padding: 15rpx;
}
.noQuestionInfo{
	padding: 20rpx;
	text-align: center;
	font-size: 24rpx;
}
.qInfoItem{
	display: flex;
	margin-bottom: 40rpx;
}
.questionTag{
	color: #747f77;
	min-width: 80rpx;
}
.questionContent{
	color: #4d4d4d;
	max-width: 90%;
}
.qTitle .questionContent{
	letter-spacing: 2rpx;
}
.qUanswer .questionContent{
	color: #000;
	background-color: #ebebeb;
	padding: 8rpx;
	border-radius: 8rpx;
	letter-spacing: 2rpx;
	line-height: 50rpx;
	font-family: "宋体";
}

.qInputs{
	background-color: #bde7bb;
	padding: 8rpx;
	border-radius: 8rpx;
	display: flex;
	justify-content: space-between;
}
.qInputs>view,.scoreInputs{
	display: flex;
	align-items: center;
}
.qInputs button{
	width: 150rpx;
	height: 50rpx;
	margin-right: 10rpx;
	font-size: 22rpx;
	line-height: 50rpx;
	color: #f7f7f7;
}
.alterPersonBtns button{
	background-color: #8fd48e;
}
.alterPersonBtns button:active{
	background-color: #84c383;
}
.markBtns button{
	background-color: #94d472;
}
.markBtns button:active{
	background-color: #88c268;
}
.scoreInputs{
	font-size: 24rpx;
	margin-left: 10rpx;
	margin-right: 20rpx;
}
.scoreInput{
	border-bottom: #549d63 1rpx solid;
	padding: 5rpx;
	text-align: center;
	width: 100rpx;
}
.qOrder{
	align-items: center;
}
.nowOrder{
	background-color: #66bf78;
	color: #ffffff;
	border: #66bf78 1rpx solid;
}
.questionPreScore{
	font-size: 24rpx;
	margin-left: 20rpx;
}
.isNowPerson{
	background-color: #636363;
}
.pName{
	width: 16%;
}
.examInfo-title{
	display: flex;
	flex-direction: column;
	align-items: center;
}
.examInfo-title>text{
	margin-bottom: 20rpx;
	font-size: 25rpx;
}
.examName{
	border-top-left-radius: 8rpx;
	border-top-right-radius: 8rpx;
	text-align: center;
	line-height: 60rpx;
	width: 100%;
	background-color: #585858;
	color: #fff;
}
/* .PeopleFinished{
	background-color: #9d9017;
} */
.left-empTotalScore{
	font-size: 26rpx;
}
.exitBtn{
	font-size: 26rpx;
	line-height: 60rpx;
	width: 100%;
	height: 60rpx;
	color: #fff;
	background-color: #e692b8;
}
.right>.whiteBlock{
	margin-bottom: 15rpx;
}
.qListOpera{
	padding-bottom: 15rpx;
	border-bottom: 1rpx solid #c8c8c8;
	margin-bottom: 15rpx;
	display: flex;
	justify-content: space-between;
}
.qListOpera-right{
	position: relative;
}
.classTags{
	display: flex;
	
}
.qListClassTag{
	margin-right: 15rpx;
	padding: 8rpx;
	border: #000 1rpx solid;
	border-radius: 10rpx;
	font-size: 24rpx;
}
.isQtypeSelect{
	border: 1rpx solid #65b956;
	background-color: #65b956;
	color: #fff;
}
.qListItems{
	display: flex;
	
}

.togQlistMethod {
	width: 150rpx;
	position: absolute;
	top: 8rpx;
	right: 0rpx;
	display: flex;
	align-items: center;
}
.togDesTag {
	color: #424242;
	margin-left: 12rpx;
	font-size: 22rpx;
}
.sliderBox {
	width: 70rpx;
	height: 20rpx;
	border: #909090 1rpx solid;
	border-radius: 10rpx;
	position: relative;
}
.sliderDiv {
	position: absolute;
	left: -2rpx;
	top: -4rpx;
	border-radius: 14rpx;
	width: 28rpx;
	height: 28rpx;
	background-color: #51c6e6;
	transition: all 0.3s;
}
.sliderDivRight {
	left: 63%;
	background-color: #0000ff;
}
</style>
