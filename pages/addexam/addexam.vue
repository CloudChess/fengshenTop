<template>
	<!-- #ifdef APP-PLUS -->
	<view class="addexam-app">
		<MyHeader :title="'新增考试'"></MyHeader>
		<view class="addexam-container">
			<view class="">
				app
			</view>
		</view>
	</view>
	<!-- #endif -->

	<!-- #ifdef H5 -->
	<view class="addexam-pc">
		<view class="addexam-pc-background"></view>
		<view class="addexam-container">
			<view class="addexam-list">
				<view :id="Qindex" class="addquestion" v-for="(question,Qindex) in questions">
					<view class="question-index">第{{Qindex+1}}题</view>
					<view class="question-cancel" @click="delQuestion(Qindex)">x</view>
					<view class="question-row" v-for="(value,tagIndex) in questionTags">
						<text class="question-tag">{{value}}：</text>
						<view class="question-container">
							<view class="question-score" v-if="value=='分值'">
								<input type="text" v-model="question.score" />
							</view>
							<textarea class="question-txtInput" placeholder="在此设置题目..." v-model="question.title"
								v-else-if="value=='题目'" />
							<view class="question-radios" v-else-if="value=='题型'">
								<view class="questionRadio" :class="{typeChecked:question.qtype==type}"
									@click="changeType(Qindex,type)" v-for="(type,typeKey) in typeTags">
									{{type}}
								</view>
							</view>
							<view class="question-options" v-else-if="value=='答案'">
								<view class="objectiveQues"
									v-if="question.qtype=='单选'||question.qtype=='多选'||question.qtype=='判断'">
									<view class="questionOption" v-for="(option,Oindex) in question.answer">
										<input class="questionOption-input" type="text" placeholder="在此设置选项..."
											v-model="option.value" @input="changeRealAnswer($event,Qindex,Oindex)" />
										<label class="questionOption-answer">
											<checkbox class="answerCheck" :checked="option.isAnswer"
												@click="setAnswer(question.qtype,Qindex,Oindex)"
												:value="option.value" /><text>设为答案</text>
										</label>
										<view class="DeleteOptionBtn" @click="delOptionHandle(Qindex,Oindex)">-</view>
									</view>
									<view class="question-add-option-btn"
										@click="addOptionHandle(Qindex,question.qtype)">添加选项</view>
								</view>
								<view class="subjectiveQues" v-if="question.qtype=='填空'">
									<view class="questionOption" v-for="option in question.answer">
										<input class="questionOption-input" v-model="option.text" type="text"
											placeholder="在此设置答案..." />
										<view class="DeleteOptionBtn" @click="delOptionHandle(Qindex,Oindex)">-</view>
									</view>
									<view class="question-add-option-btn" @click="addOptionHandle(Qindex,question.qtype)">添加空位</view>
								</view>
							</view>
							<textarea class="question-txtInput" placeholder="在此设置解析..." v-else-if="value=='解析'" v-model="question.analysis" />
						</view>
					</view>
				</view>
				<view class="addquestion-btn" @click="addQuestionHandle()">添加题目</view>
			</view>

			<view class="floatBoxLeft">
				<view class="addexam-qlist">
					<view class="togQlistMethod" @click="showQlistMethod=!showQlistMethod">
						<view class="togSlider">
							<view class="sliderBox">
								<view class="sliderDiv" :class="{sliderDivRight:showQlistMethod}"></view>
							</view>
						</view>
						<text class="togDesTag">题号</text>
					</view>
					<scroll-view class="qList-scroll-view" scroll-y="true" >
						<view class="qlist-group" v-for="(tag,key) in typeTags">
							<view class="qlist-tag">
								<text class="qlist-tag-txt">{{tag}}</text>
								<text class="qlist-score-txt">分值：{{sectionScore(tag)}}</text>
							</view>
							<view class="qlist-items" v-if="!showQlistMethod">
								<label class="qlist-item" :class="{toQuestion:currentQuestoin==question.qqid}"
									v-for="(question,qindex) in qt_list[key]"
									@click="toQuestionHandle(question.qqid)">{{qindex+1}}</label>
							</view>
						
							<view class="qlist-items" v-else-if="showQlistMethod">
								<view v-for="(question,qindex) in questions">
									<view class="qlist-item" :class="{toQuestion:currentQuestoin==question.qqid}"
										v-if="question.qtype==tag" @click="toQuestionHandle(question.qqid)">{{qindex+1}}
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
					
				</view>
				<view class="totalScore">
					<text class="totalScore-txt">总分值：{{totalScore}}</text>
				</view>
			</view>

			<view class="addexam-setting floatBox">
				<view class="setting-item" v-for="tag in settingTags">
					<view class="setting-tag">{{tag}}</view>
					<view class="setting-box">
						<input class="settingBox-titleInput" v-if="tag=='试卷名'" placeholder="请填写试卷名"
							v-model="examSetting.examName" type="text" />
						<view class="settingBox-time" v-if="tag=='限定时间'">
							<input class="limtime-input" type="number" v-model="examSetting.limTime.hour"
								@input="checkFormat($event,1)" />时
							<input class="limtime-input" type="number" v-model="examSetting.limTime.min"
								@input="checkFormat($event,0)" />分
						</view>
					</view>
				</view>
			</view>
			<view class="addexam-sub floatBox">
				<button class="subBtn" @click="postQuestions">提 交</button>
				<button class="sub-cancel" @click="backHandle()">取消编辑并返回</button>
			</view>
			<view class="TopAndBottom floatBox">
				<view class="toTop toLabel" @click="toQuestionHandle(0)">顶</view>
				<view class="tohr"></view>
				<view class="toBottom toLabel" @click="toQuestionHandle(questions.length-1)">底</view>
			</view>
		</view>
	</view>
	<!-- #endif -->
</template>

<script>
	export default {
		// #ifdef APP-PLUS  
		data() {
			return {

			}
		},
		methods: {

		},
		// #endif 

		//PC
		// #ifdef H5
		data() {
			return {
				eid:null,
				showQlistMethod: false,
				currentQuestoin: 0,
				questions: [{
					qid: 0,
					qqid: 0,
					qtype: '单选',
					title: '',
					answer: [{
						value: '',
						isAnswer: true
					}],
					analysis: '',
					realAnswer: '',
					score: 0
				}],
				examSetting: {
					examName: '',
					eCreateTime: null,
					limTime: {
						hour: 0,
						min: 0
					}
				},
				questionTags: ['分值', '题型', '题目', '答案', '解析'],
				typeTags: {
					radio: '单选',
					check: '多选',
					jug: '判断',
					empty: '填空',
					shortT: '简答',
					draw: '画图'
				},
				settingTags: ['试卷名', '限定时间']
			}
		},
		computed: {
			qt_list() {
				let templist = {
					radio: [],
					check: [],
					jug: [],
					empty: [],
					shortT: [],
					draw: []
				}
				this.questions.map((item) => {
					if (item.qtype == '单选') {
						templist.radio.push(item)
					} else if (item.qtype == '多选') {
						templist.check.push(item)
					} else if (item.qtype == '判断') {
						templist.jug.push(item)
					} else if (item.qtype == '填空') {
						templist.empty.push(item)
					} else if (item.qtype == '简答') {
						templist.shortT.push(item)
					} else if (item.qtype == '画图') {
						templist.draw.push(item)
					}
				})
				return templist
			},
			totalScore() {
				let total = 0
				this.questions.forEach((q) => {
					total += Number(q.score)
				})
				return total
			}
		},
		methods: {
			sectionScore(qtype) {
				let scroe = 0
				this.questions.forEach((q) => {
					if (qtype == q.qtype) {
						scroe += Number(q.score)
					}
				})
				return scroe
			},
			toQuestionHandle(qqid) {
				let target = document.getElementById(qqid)
				if (target.offsetTop) {
					target.scrollIntoView({
						behavior: 'smooth',
						block: 'center'
					})
					this.currentQuestoin = qqid
				}
			},
			addQuestionHandle() {
				let defaultQuestion = {
					qqid: this.questions.length,
					qtype: '单选',
					title: '',
					answer: [{
						value: '',
						isAnswer: true
					}],
					analysis: '',
					realAnswer: '',
					score: '',
					isNew:true
				}
				this.questions.push(defaultQuestion)
				
				setTimeout(()=>{
					this.toQuestionHandle(defaultQuestion.qqid)
				},100)

			},
			delQuestion(qindex) {
				if (this.questions.length > 1) {
					if(this.questions[qindex].isNew){
						this.questions.splice(qindex, 1)
					}
					else{
						let username=uni.getStorageSync('username')
						let token=uni.getStorageSync('token')
						
						uni.request({
							url:'http://10.72.59.63:90/delQuestion.php',
							method:'POST',
							header: {
							    'Authorization': 'Bearer ' + token,
							},
							data:{
								username:username,
								qid:this.questions[qindex].qid,
								eid:this.eid
							},
							success:(res)=> {
								if(res.data && res.data.status=='success'){
									this.questions.splice(qindex, 1)
								}
							}
						})
					}
				}
			},
			delOptionHandle(qindex, oindex) {
				if(this.questions[qindex].qtype != '填空'){
					if (this.questions[qindex].answer.length > 2) {
						let ischecked = this.questions[qindex].answer[oindex].isAnswer
						let type = this.questions[qindex].qtype
						this.questions[qindex].answer.splice(oindex, 1)
						if (type == '单选' && ischecked) {
							this.questions[qindex].answer[0].isAnswer = true
						}
					} 
				}
				else{
					if(this.questions[qindex].answer.length>1){
						this.questions[qindex].answer.splice(oindex, 1)
					}
				}
			},
			changeRealAnswer(e, qindex, oindex) {
				let qtype = this.questions[qindex].qtype
				if (qtype == '多选') {
					let realAnswerArr = []
					this.questions[qindex].answer.forEach((option) => {
						if (option.isAnswer) {
							realAnswerArr.push(option.value)
						}
					})
					this.questions[qindex].realAnswer = realAnswerArr
				} else if (qtype == '单选' || qtype == '判断') {
					this.questions[qindex].realAnswer = e.detail.value
				}
			},
			addOptionHandle(Qindex, type) {
				if (type == '多选') {
					this.questions[Qindex].answer.push({
						value: '',
						isAnswer: true
					})
				} else if (type == '单选') {
					let defaultOption = {
						value: '',
						isAnswer: false
					}
					this.questions[Qindex].answer.push(defaultOption)
				}
				else if(type=='填空'){
					this.questions[Qindex].answer.push({text:''})
				}
			},
			changeType(qindex, type) {
				let originType = this.questions[qindex].qtype
				if (originType != type) {
					if (type == '单选') {
						this.questions[qindex].answer.forEach((item) => {
							item.isAnswer = false
						})
						this.questions[qindex].answer[0].isAnswer = true
					} else if (type == '多选') {
						if (this.questions[qindex].answer.length <= 1) {
							this.questions[qindex].answer.push({
								value: '',
								isAnswer: true
							})
						}
					} else if (type == '判断') {
						this.questions[qindex].answer = [{
								value: '对',
								isAnswer: true
							},
							{
								value: '错',
								isAnswer: false
							}
						]
					} else if (type == '填空') {
						this.questions[qindex].answer = [{
							text: ''
						}]
					}
				}
				this.questions[qindex].qtype = type
			},
			setAnswer(type, qindex, oindex) {
				if (type == '多选') {
					let checkNum = 0
					let options = this.questions[qindex].answer
					options.forEach((item) => {
						if (item.isAnswer) {
							checkNum++
							this.questions[qindex].realAnswer = []
							this.questions[qindex].realAnswer.push(item.value)
						}
					})
					if (checkNum <= 2 && this.questions[qindex].answer[oindex].isAnswer == true) {
						confirm('请注意多选题答案数量不要少于2')
					}
					this.questions[qindex].answer[oindex].isAnswer = !this.questions[qindex].answer[oindex].isAnswer

					let realAnswerArr = []
					options.forEach(() => {
						//忘记这里当时要写什么了
					})
				} else if (type == '单选' || type == '判断') {
					this.questions[qindex].answer.forEach((item) => {
						item.isAnswer = false
					})
					this.questions[qindex].answer[oindex].isAnswer = true
					this.questions[qindex].realAnswer = this.questions[qindex].answer[oindex].value
				}
			},
			checkFormat(e, type) {
				if (e.detail && e.detail.value) {
					let checkValue = e.detail.value
					if (type && (Number(checkValue) > 24 || Number(checkValue) < 0)) {
						this.examSetting.limTime.hour = null
					} else if (!type && (Number(checkValue) > 60 || Number(checkValue) < 0)) {
						this.examSetting.limTime.min = null
					}
				}
			},
			backHandle() {
				this.getOpenerEventChannel().emit('FinishPost')
				uni.navigateBack()
			},
			postQuestions() {
				if (this.questions[0]) {
					let username = uni.getStorageSync('username')
					let token = uni.getStorageSync('token')

					if(!this.eid){
						let date = new Date()
						this.examSetting.eCreateTime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
					}
					
					if (!this.examSetting.examName) {
						uni.showModal({
							content: '请填写考试名称'
						})
					}

					let limtime = ""
					let hour = null
					let min = null
					if (!this.examSetting.limTime.hour && !this.examSetting.limTime.min) {
						uni.showModal({
							content: '请设置考试限时'
						})
					} else {
						hour = this.examSetting.limTime.hour
						min = this.examSetting.limTime.min
						hour = hour >= 10 ? hour : '0' + hour
						min = min >= 10 ? min : '0' + min
						limtime = hour + ':' + min + ':' + '00'
						this.examSetting.limTime = limtime
					}
					
					if (this.examSetting.examName && limtime) {
						let url='http://10.72.59.63:90/postQuestions.php'
						uni.request({
							url: url,
							method: 'POST',
							header: {
								'Authorization': 'Bearer ' + token,
							},
							data: {
								username: username,
								questions: this.questions,
								examSetting: this.examSetting,
								eid:this.eid
							},
							success: (res) => {
								if (res.data && res.data.status) {
									if (res.data.status == 'fail') {
										uni.showModal({
											content: res.data.data
										})
									} else if (res.data.status == 'success') {
										let msg='添加考试成功'
										if(this.eid){msg='修改成功'}
										uni.showModal({
											content: msg
										})
									}
								}
							}
						})
					}
					this.examSetting.limTime = {
						hour: Number(hour),
						min: Number(min) 
					}
				}
			},
			getPaper(){
				let username=uni.getStorageSync('username')
				let token=uni.getStorageSync('token')
				
				uni.request({
					url:'http://10.72.59.63:90/getAlterExamPaper.php',
					method:'POST',
					header: {
					    'Authorization': 'Bearer ' + token,
					},
					data:{
						username:username,
						eid:this.eid
					},
					success:(res)=> {
						if(res.data && res.data.status=='success'){
							let examInfo = res.data.examInfo
							let limTime = examInfo.limTime
							examInfo.limTime={}
							examInfo.limTime.hour=Number(limTime.split(':')[0]) 
							examInfo.limTime.min=Number(limTime.split(':')[1]) 
							
							this.questions = res.data.questions
							this.examSetting=examInfo
						}
					}
				})
			}
		},
		onLoad(options) {
			this.eid=options.eid
			if(this.eid){
				this.getPaper()
			}
		}
		// #endif
	}
</script>

<style scoped>
	.addexam-pc {
		display: flex;
		justify-content: center;
	}

	.addexam-pc-background {
		position: fixed;
		background-color: #f4f4f4;
		height: 100vh;
		width: 100%;
		z-index: -1;
	}

	.addexam-container {
		width: 50%;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 50rpx;
		margin-top: 50rpx;
		margin-bottom: 50rpx;
	}

	.addexam-list {
		display: flex;
		flex-direction: column;
	}

	.addquestion {
		box-shadow: #d9e7ff 5rpx 5rpx 5rpx;
		background-color: #effdff;
		position: relative;
		padding: 20rpx;
		padding-top: 40rpx;
		border: 1rpx solid #1a7bcf;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		margin-bottom: 80rpx;
	}

	.question-index {
		font-weight: bold;
		color: #002395;
		padding-left: 15rpx;
		padding-right: 15rpx;
		text-align: center;
		position: absolute;
		top: -20rpx;
		left: 40rpx;
		background-color: #fff;
		border-radius: 8rpx;
	}

	.question-cancel {
		color: #fff;
		font-size: 18rpx;
		width: 40rpx;
		height: 40rpx;
		border-radius: 20rpx;
		line-height: 35rpx;
		background-color: #ea373a;
		text-align: center;
		position: absolute;
		top: -20rpx;
		right: 40rpx;
	}

	.question-row {
		display: flex;
		margin-bottom: 20rpx;
	}

	.question-container {
		width: 90%;
	}

	.question-score {
		border: 1rpx solid #dcdcdc;
		padding: 5rpx;
		width: 100rpx;
		color: #ff0000;
		text-align: center;
		border-radius: 5rpx;
	}

	.question-txtInput {
		padding: 15rpx;
		border: 1rpx solid #c6c6c6;
		border-radius: 15rpx;
		width: 100%;
		height: 200rpx;
		color: #5e5e5e;
		font-size: 25rpx;
	}

	.question-radios .typeChecked {
		background-color: #3dabff;
		color: #fff;
		border: 1rpx solid #3dabff;
	}

	.question-radios {
		display: flex;
	}

	.questionRadio {
		margin-right: 20rpx;
		padding: 10rpx;
		border: 1rpx solid #545454;
		border-radius: 15rpx;
		height: 25rpx;
		font-size: 20rpx;
	}

	.question-options {}

	.objectiveQues {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.questionOption {
		margin-bottom: 20rpx;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.questionOption-input {
		font-size: 25rpx;
		text-align: center;
		color: #5e5e5e;
		width: 60%;
		border-bottom: #545454 solid 1rpx;
	}

	.DeleteOptionBtn {
		width: 80rpx;
		height: 40rpx;
		line-height: 40rpx;
		text-align: center;
		border-radius: 20rpx;
		background: #ff4747;
		color: #fff;
	}

	.question-add-option-btn {
		background: #4577ff;
		color: #fff;
		padding: 15rpx;
		width: 80rpx;
		height: 20rpx;
		border-radius: 15rpx;
		font-size: 20rpx;
		line-height: 20rpx;
		margin: 40rpx;
	}

	.addquestion-btn {
		background: #0000ff;
		color: #fff;
		padding: 15rpx;
		width: 100rpx;
		height: 30rpx;
		border-radius: 15rpx;
		font-size: 25rpx;
		line-height: 25rpx;
		margin-top: 20rpx;
	}

	.floatBoxLeft {
		width: 400rpx;
		background-color: #fff;
		position: fixed;
		top: 50rpx;
		left: 8%;
		padding: 20rpx;
		border-radius: 20rpx;
	}

	.addexam-qlist {}

	.togQlistMethod {
		position: absolute;
		top: 25rpx;
		right: 40rpx;
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

	.qlist-group {
		margin-bottom: 20rpx;
	}

	.qlist-items {
		min-height: 70rpx;
		padding-top: 10rpx;
		padding-bottom: 10rpx;
		display: flex;
		flex-wrap: wrap;
	}

	.qlist-item {
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		width: 50rpx;
		height: 50rpx;
		border-radius: 5rpx;
		background-color: #f1f1f1;
		text-align: center;
		font-size: 20rpx;
		line-height: 50rpx;
	}

	.qlist-item:hover {
		background-color: #e7e7e7;
	}

	.qlist-items .toQuestion {
		background-color: #1a7bcf;
		color: #fff;
	}

	.floatBox {
		display: flex;
		position: fixed;
		background-color: #fff;
		border-radius: 15rpx;
		padding: 15rpx;
	}

	.addexam-setting {
		flex-direction: column;
		align-items: center;
		top: 50rpx;
		right: 8%;
		text-align: center;
		width: 400rpx;
	}

	.setting-item {
		width: 100%;
		margin-bottom: 40rpx;
	}

	.setting-tag {
		margin-bottom: 20rpx;
	}

	.setting-box {
		display: flex;
		justify-content: center;
		width: 100%;
	}

	.settingBox-titleInput {
		color: #8d8d8d;
		width: 90%;
		font-size: 22rpx;
		border-bottom: 1rpx solid #8d8d8d;
	}

	.settingBox-time {
		width: 100%;
		color: #8d8d8d;
		font-size: 22rpx;
		display: flex;
		justify-content: center;
	}

	.limtime-input {
		border-bottom: 1rpx solid #8d8d8d;
		width: 20%;
		font-size: 22rpx;
		margin-right: 10rpx;
	}

	.addexam-sub {
		flex-direction: column;
		width: 400rpx;
		top: 370rpx;
		right: 8%;
	}

	.subBtn {
		width: 100%;
		background-color: #30c8ff;
		border: none;
		color: #fff;
		font-size: 22rpx;
	}

	.subBtn:hover {
		background-color: #7eb1e6;
	}

	.subBtn:active {
		background-color: #0000ff;
	}

	.sub-cancel {
		margin-top: 20rpx;
		height: 60rpx;
		width: 100%;
		line-height: 60rpx;
		font-size: 22rpx;
		background-color: #ff5d8e;
		color: #fff;
	}

	.TopAndBottom {
		color: #c5c5c5;
		bottom: 20rpx;
		right: 8%;
		flex-direction: column;
		align-items: center;
	}

	.toLabel:hover {
		cursor: pointer;
		color: #868686;
	}

	.tohr {
		height: 1rpx;
		width: 80%;
		background-color: #dedede;
		margin-top: 10rpx;
		margin-bottom: 10rpx;
	}

	.qlist-score-txt {
		font-size: 22rpx;
		color: #ff0000;
		margin-left: 10rpx;
	}

	.totalScore {
		border-top: 1rpx solid #dcdcdc;
		padding-top: 20rpx;
	}
	.subjectiveQues{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.qList-scroll-view{
		max-height: 80vh;
		padding-top: 40rpx;
	}
</style>