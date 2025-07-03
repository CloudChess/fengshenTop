<template>
	<view class="exam-qlist">
		<view class="stateNav">
			<view class="stateNav-blank"></view>
			<view class="stateNav-main">
				<view class="processBox">
					<progress class="process" :percent="finshPercent" show-info />
				</view>
				<view class="stateBtns">
					<button class="showQlist" @click="showQlistHandle">题</button>
				</view>
			</view>
		</view>

		<view class="qlist-container">
			<view class="exam-item" v-for="(question,Qindex) in questions">
				<view class="radio" v-if="question.qtype=='单选'">
					<text class="question-title"><text
							style="font-weight: bold;">第{{Qindex+1}}题：</text>{{question.title}}</text>
					<view class="options" v-if="isComplated">
						<label class="option" v-for="(option,Oindex) in question.answer">
							<radio class="radio-option" :value="option.value" :checked="option.value==complateAnswer[Qindex].uanswer" :disabled="isComplated" /><text>{{option.value}}</text>
						</label>
					</view>
					<radio-group class="options" v-else @change="setAnswer($event,Qindex)">
						<label class="option" v-for="(option,Oindex) in question.answer">
							<radio class="radio-option" :value="option.value" :disabled="isComplated" /><text>{{option.value}}</text>
						</label>
					</radio-group>
				</view>
				<view class="choices" v-if="question.qtype=='多选'">
					<text class="question-title"><text
							style="font-weight: bold;">第{{Qindex+1}}题：</text>{{question.title}}</text>
					<view class="options" v-if="isComplated">
						<label class="option" v-for="(option,Oindex) in question.answer">
							<radio class="radio-option" :value="option.value" :checked="complateAnswer[Qindex].uanswer.include(option.value)" :disabled="isComplated" /><text>{{option.value}}</text>
						</label>
					</view>
					<checkbox-group class="options" @change="setAnswer($event,Qindex)">
						<label class="option" v-for="(option,Oindex) in question.answer">
							<checkbox :value="option.value" :disabled="isComplated" /><text>{{option.value}}</text>
						</label>
					</checkbox-group>
				</view>
				<view class="judgment" v-if="question.qtype=='判断'">
					<text class="question-title"><text
							style="font-weight: bold;">第{{Qindex+1}}题：</text>{{question.title}}</text>
					<view class="options" v-if="isComplated">
						<label class="option" v-for="(option,Oindex) in question.answer">
							<radio class="radio-option" :value="option.value" :checked="option.value==complateAnswer[Qindex].uanswer" :disabled="isComplated" /><text>{{option.value}}</text>
						</label>
					</view>
					<radio-group class="options" @change="setAnswer($event,Qindex)">
						<label class="option" v-for="(option,Oindex) in question.answer">
							<radio class="radio-option" :value="option.value" :disabled="isComplated" /><text>{{option.value}}</text>
						</label>
					</radio-group>
				</view>
				<view class="empty" v-if="question.qtype=='填空'">
					<text class="question-title"><text
							style="font-weight: bold;">第{{Qindex+1}}题：</text>{{question.title}}</text>
					<view class="emptyInputs">
						<input class="emptyInput txtInput" type="text" v-model="question.uanswer" @input="subQuestionHandle($event,Qindex)" :disabled="isComplated" />
					</view>
				</view>
				<view class="shortT" v-if="question.qtype=='简答'">
					<text class="question-title"><text
							style="font-weight: bold;">第{{Qindex+1}}题：</text>{{question.title}}</text>
					<view class="shortTxt" v-if="isComplated">{{complateAnswer[Qindex].uanswer}}</view>
					<textarea class="shortTxt txtInput" v-else :maxlength="-1" v-model="question.uanswer" @input="subQuestionHandle($event,Qindex)" :disabled="isComplated"></textarea>
				</view>
				<view class="draw" v-if="question.qtype=='画图'">
					<text class="question-title"><text
							style="font-weight: bold;">第{{Qindex+1}}题：</text>{{question.title}}</text>
					<image class="cameraSelect" v-if="isComplated" :src="complateAnswer[Qindex].drawImg"></image>
					<image class="cameraSelect" v-else :src="question.imageSrc" @click="takePhoto(Qindex)"></image>
				</view>
			</view>
		</view>

		<uni-drawer ref="showQlist" mode="right" :maskClick="true">
			<scroll-view style="height: 100%;" scroll-y="true">
				<view class="QlistBox">
					<view class="QlistItem" :class="{ItemFinshed:q.isFinshed==true}" v-for="(q,index) in questions" @click="jumpQuestion(index)">{{index+1}}</view>
				</view>
				<button class="subPaperBtn" @click="subPaperHandle">提交试卷</button>
			</scroll-view>
		</uni-drawer>
	</view>
</template>

<script>
	export default {
		name: "examQlist",
		data(){
			return{
				drawImgs:[],
				complateAnswer:[],
			}
		},
		props: {
			eid:null,
			isComplated: {default:false},
			questions: [{
				isFinshed:false,
				qtype: '',
				title: '',
				answer: [{
					value: '',
					isAnswer: true
				}],
				uanswer:null,
				analysis: '',
				imageSrc:''
			}]
		},
		computed: {
			finshPercent() {
				let finsh = 0
				let total = this.questions.length
				this.questions.forEach((q) => {
					if (q.isFinshed) {finsh++}
				})
				return Math.floor((finsh/total)*100)
			}
		},
		methods: {
			takePhoto(qindex){
				if(!this.isComplated){
					uni.chooseImage({
						count:1,
						success:(paths)=> {
							if(paths){
								let filePath=paths.tempFilePaths[0]
								this.questions[qindex].imageSrc=filePath
								this.questions[qindex].isFinshed=true
								this.drawImgs.push({name:this.questions[qindex].qid,uri:filePath})
							}
						}
					})
				}
			},
			subQuestionHandle(e,qindex){
				if(e.detail.value){
					this.questions[qindex].isFinshed=true
				}
				else{
					this.questions[qindex].isFinshed=false
				}
			},
			setAnswer(e,qindex){
				if(e.detail.value){
					this.questions[qindex].uanswer=e.detail.value
					this.questions[qindex].isFinshed=true
					if(this.questions[qindex].qtype=='多选'&&!this.questions[qindex].uanswer[0]){
						this.questions[qindex].isFinshed=false
					}
				}
			},
			showQlistHandle() {
				this.$refs.showQlist.open()
			},
			jumpQuestion(qindex){
				let targetTop=document.getElementsByClassName('exam-item')[qindex].offsetTop-100
				window.scrollTo({top:targetTop,left:0,behavior:'smooth'})
			},
			getUanswer(){
				let token = uni.getStorageSync('token');
				let username = uni.getStorageSync('username');
				
				uni.request({
					url:'http://10.72.59.63:90/getUanswer.php',
					method:'POST',
					header:{
						'Authorization': 'Bearer ' + token,
					},
					data:{
						username:username,
						eid:this.eid
					},
					success:(res)=> {
						if(res.data&&res.data.data){
							console.log(res.data.data)
							this.complateAnswer=res.data.data
						}
					}
				})
			},
			subPaperHandle(){
				if(this.isComplated){
					uni.showModal({
						content:'无法重复考试'
					})
				}
				else{
					let sureFinish=true
					this.questions.forEach((q)=>{
							if(q.isFinshed==false||!q.isFinshed)sureFinish=false
						})
					if(sureFinish){
						let token = uni.getStorageSync('token');
						let username = uni.getStorageSync('username');
						uni.uploadFile({
							url:'http://10.72.59.63:90/subPaper.php',
							header:{
								'Authorization': 'Bearer ' + token,
							},
							files:this.drawImgs,
							formData:{
								username: username,
								eid:this.eid,
								questions:JSON.stringify(this.questions),
							},
							success: (res) => {
								let result=JSON.parse(JSON.parse(res.data))
								if(result && result.state=='success'){
									this.$emit('updatecomplate',false)
									uni.showModal({
										content:'已提交'
									})
								}
								this.getOpenerEventChannel().emit('FinishExam')
							}
						})
					}
					else{
						uni.showModal({
							content:'请完成所有试题'
						})
					}
				}
			}
		},
		mounted() {
			if(this.isComplated){
				this.getUanswer()
			}
		}
	}
</script>

<style scoped>
	.stateNav-main {
		position: fixed;
		top: calc(var(--status-bar-height) + 100rpx);
		width: 100%;
		padding-top: 10rpx;
		padding-bottom: 10rpx;
		display: flex;
		align-items: center;
		background-color: #f4f4f4;
		z-index: 999;
	}

	.processBox {
		padding-left: 20rpx;
		flex-grow: 1;
	}

	.showQlist {
		font-size: 20rpx;
		width: 80rpx;
		height: 60rpx;
		line-height: 60rpx;
		margin-left: 10rpx;
		margin-right: 10rpx;
	}

	.stateNav-blank {
		height: calc(var(--status-bar-height) + 100rpx);
	}

	.draw-select {
		height: 150rpx;
		width: 150rpx;
		border: dotted 1rpx #c3c3c3;
		border-radius: 15rpx;
	}

	.qlist-container {
		padding: 15rpx;
	}

	.exam-item {
		padding: 20rpx;
		border: 1rpx solid #e2e2e2;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
	}

	.question-title {
		display: block;
		margin-bottom: 20rpx;
	}

	.options {
		display: flex;
		flex-direction: column;
	}

	.option {
		margin-bottom: 20rpx;
	}

	.QlistBox {
		display: flex;
		flex-wrap: wrap;
		padding-top: 30rpx;
		padding-left: 30rpx;
	}

	.QlistItem {
		width: 60rpx;
		height: 60rpx;
		margin-right: 15rpx;
		margin-bottom: 15rpx;
		border-radius: 10rpx;
		border: 1rpx solid #afafaf;
		text-align: center;
		line-height: 60rpx;
		font-size: 20rpx;
	}

	.ItemFinshed {
		background-color: #a0a4f0;
		border: 1rpx solid #a0a4f0;
		color: #fff;
	}
	.subPaperBtn{
		color: #fff;
		background-color: #51cde2;
		margin-top: 20rpx;
		width: 90%;
		height: 80rpx;
		line-height: 80rpx;
	}
	.emptyInput{
		height: 80rpx;
	}
	.txtInput{
		border: #51cde2 1rpx solid;
		width: 100%;
		border-radius: 10rpx;
		padding: 10rpx;
		box-sizing: border-box;
	}
	.cameraSelect{
		border: #51cde2 1rpx dotted;
		border-radius: 10rpx;
	}
</style>