<template>
	<view class="teaminfoDetail">
		<MyHeader title="员工信息"></MyHeader>
		<view class="container">
			<view class="infoCard">
				<view class="simple-info">
					<view class="simple-left simple-v">
						<view class="info-cell">
							<text class="infotag">姓名：</text>
							<text class="simpleinfo-txt">{{personinfo.emp_name}}</text>
						</view>
						<view class="info-cell">
							<text class="infotag">学历：</text>
							<text class="simpleinfo-txt">{{personinfo.emp_education}}</text>
						</view>
					</view>
					<view class="simple-mid simple-v">
						<view class="info-cell">
							<text class="infotag">工种：</text>
							<text class="simpleinfo-txt">{{personinfo.emp_job_type}}</text>
						</view>
						<view class="info-cell">
							<text class="infotag">等级：</text>
							<text class="simpleinfo-txt">{{personinfo.emp_skill_level}}</text>
						</view>
					</view>
					<view class="simple-right">
						<img class="info-img" :src="personinfo.emp_photo">
					</view>
				</view>
			</view>

			<view class="subLine-groove">
				<view class="subLineTag" :class="{selectedTag:togShow==0}" @click="togShow=0">日绩效</view>
				<view class="subLineTag" :class="{selectedTag:togShow==1}" @click="togShow=1">月绩效</view>
				<view class="subLineTag" :class="{selectedTag:togShow==2}" @click="togShow=2">基本信息</view>
				<view class="subLineTag" :class="{selectedTag:togShow==3}" @click="togShow=3">更多信息</view>
				<view class="subLine"
					:class="{swiperLineSecond:togShow==1,swiperLineThird:togShow==2,swiperLineFour:togShow==3}"></view>
			</view>

			<swiper class="swiper" :autoplay="false" :duration="450" :current="togShow" @change="togPage($event)">
				<swiper-item>
					<view class="swiper-item chartInfo">a</view>
				</swiper-item>
				<swiper-item>
					<scroll-view class="swiper-scroll">
						<view class="swiper-item perfMonth">
							<view class="OneSence"></view>
							<view class="personChart">
								<canvas canvas-id="waterfallChart" style="width: 1200px;height: 1257px;"></canvas>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view class="swiper-scroll">
						<view class="swiper-item textInfo">
							<!-- <view class="info-item">
								<text class="infotag">民族：</text>
								<text class="">{{personinfo.emp_ethnic_group}}</text>
							</view> -->
							<view class="info-item">
								<text class="infotag">性别：</text>
								<text class="">{{personinfo.emp_gender}}</text>
							</view>
							<view class="info-item">
								<text class="infotag">年龄：</text>
								<text class="">{{personinfo.emp_age}}</text>
							</view>
							<!-- <view class="info-item">
								<text class="infotag">籍贯：</text>
								<text class="">{{personinfo.emp_origin_place}}</text>
							</view> -->
							<view class="info-item">
								<text class="infotag">司龄：</text>
								<text class="">{{personinfo.emp_service_years}}</text>
							</view>
							<view class="info-item">
								<text class="infotag">工段：</text>
								<text class="">{{personinfo.emp_workshop}}</text>
							</view>
							<view class="info-item">
								<text class="infotag">班组：</text>
								<text class="">{{personinfo.emp_team}}</text>
							</view>
							<view class="info-item">
								<text class="infotag">毕业院校：</text>
								<text class="">{{personinfo.emp_school}}</text>
							</view>
							<view class="info-item">
								<text class="infotag">专业：</text>
								<text class="">{{personinfo.emp_major||'无'}}</text>
							</view>
							<view class="info-item">
								<text class="infotag">优势：</text>
								<text class="">{{personinfo.emp_advantage||'暂无'}}</text>
							</view>
							<view class="info-item">
								<text class="infotag">不足：</text>
								<text class="">{{personinfo.emp_deficiency||'暂无'}}</text>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view class="swiper-scroll">
						<view class="swiper-item textInfo">
							<view class="info-item">
								<text class="infotag">荣誉：</text>
								<text class="">{{personinfo.emp_honor||'暂无'}}</text>
							</view>
							<view class="info-item">
								<text class="infotag">成长经历：</text>
								<text class="">{{personinfo.emp_growth_record||'暂无'}}</text>
							</view>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		<MyBottom></MyBottom>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				togShow: 1,
				personinfo: {},
				ctx: null,
				fieldMapConfig: {
					emp_perf: '绩效',
					EAM_inspection: 'EAM巡检',
					PM_score: 'PM',
					QA_score: 'QA',
					execution_ability: '执行力',
					labor: '劳动纪律',
					leakage_rate: '泄漏',
					operation_rate: '运转率',
					safety: '本质安全',
					threeInspection: '三级检查',
					threeQualification: '三称合格率',
				},
				WaterFallopt: {
					data: {},
					scoreRect: {
						width: 20,
						height: 40
					},
					leftRect:{
						width: 30,
						height: 260
					},
					width:0,
					height:0
				}
			}
		},
		methods: {
			handleBack() {
				uni.navigateBack();
			},
			togPage(e) {
				this.togShow = e.detail.current
			},
			getPersonInfo(pid, token, username) {
				uni.request({
					url: "http://10.72.59.63:90/getpersoninfo.php",
					method: 'POST',
					header: {
						'Authorization': 'Bearer ' + token
					},
					data: {
						pid: pid,
						username: username
					},
					success: (res) => {
						if (res.data&&res.data.data) {
							this.personinfo = res.data.data
						}
					},
					fail(err) {

					}
				})
			},
			getPersonPerfMonth(pid, token, username, year, month) {
				uni.request({
					url: "http://10.72.59.63:90/getpersonPerfMonth.php",
					method: 'POST',
					header: {
						'Authorization': 'Bearer ' + token
					},
					data: {
						pid: Number(pid),
						username: username,
						year: year,
						month: 4
					},
					success: (res) => {
						if (res.data && res.data.data) {
							let requestData=res.data.data
							let chartDate={}
							chartDate.total=Number(requestData.total_score)
							chartDate.execution_ability=Number(requestData.execution_ability)
							chartDate.EAM_inspection=Number(requestData.EAM_inspection)
							chartDate.PM_score=Number(requestData.PM_score)
							chartDate.QA_score=Number(requestData.QA_score)
							chartDate.labor=Number(requestData.labor)
							chartDate.leakage_rate=Number(requestData.leakage_rate)
							chartDate.operation_rate=Number(requestData.operation_rate)
							chartDate.safety=Number(requestData.safety)
							chartDate.threeInspection=Number(requestData.threeInspection)
							chartDate.threeQualification=Number(requestData.threeQualification)
							this.WaterFallopt.data=chartDate
						}
						else{
							
						}
					},
					fail(err) {

					}
				})
			},
			drawWaterFallChart() {
				let lastBottom = 0
				let current = 0
				let paddingTop=20
				let paddingLeft=16
				let offsetItem=11
				let Great='#87a4f3'
				let Normal='#a0d3ff'
				let Weak='#eeeeee'
				
				let totalLevel=""
				
				function drawText(ctx,opt,txt,offsetY,paddingToTotal,offsetItem){
					ctx.beginPath()
					ctx.setTextAlign('center')
					ctx.setFillStyle('#000000')
					ctx.setFontSize(8)
					ctx.fillText(txt,current * (opt.scoreRect.width + offsetItem) +opt.scoreRect.width/2+ paddingToTotal,lastBottom+paddingTop+offsetY)
				}
				
				const DrawMyRect = (ctx, opt, total,key,value) => {
					let theValueHeight = (value/(this.WaterFallopt.data.total-this.WaterFallopt.data.execution_ability))*this.WaterFallopt.leftRect.height
					
					let theColor='#9dc0f3'
					let paddingToTotal=paddingLeft+10
					
					//分项数据文字
					drawText(this.ctx,this.WaterFallopt,value,0,paddingToTotal,offsetItem)
					
					//分项字段名
					drawText(this.ctx,this.WaterFallopt,key,theValueHeight+8,paddingToTotal,offsetItem)
					
					//分项牵引指示线
					ctx.beginPath()
					ctx.setStrokeStyle('#f3f3f3')
					ctx.moveTo(this.WaterFallopt.leftRect.width+paddingToTotal,lastBottom+paddingTop)
					ctx.lineTo(current * (opt.scoreRect.width + offsetItem) + paddingToTotal,lastBottom+paddingTop)
					ctx.stroke()
					
					//各项矩形
					ctx.beginPath()
					ctx.rect(current * (opt.scoreRect.width + offsetItem) + paddingToTotal,lastBottom+paddingTop, opt.scoreRect.width, theValueHeight)
					if(value/total<0.7){
						theColor=Weak
					}
					if(value/total>0.7){
						theColor=Normal
					}
					if(value/total>0.9){
						theColor=Great
					}
					ctx.setFillStyle(theColor)
					ctx.fill()
					lastBottom += theValueHeight
					
					//添加说明框
				}

				function drawDes(ctx,x,desText,color){
					ctx.beginPath()
					ctx.rect(x,3, 20, 4)
					ctx.setFillStyle(color)
					ctx.fill()
					ctx.setFontSize(8)
					ctx.setFillStyle('#000000')
					ctx.fillText(desText,x+26,7)
				}
				
				drawDes(this.ctx,200,'优秀',Great)
				drawDes(this.ctx,250,'良好',Normal)
				drawDes(this.ctx,300,'一般',Weak)
				for (let key in this.WaterFallopt.data) {
					//console.log(key)
					if(key == 'operation_rate' || key == 'labor'){
						DrawMyRect(this.ctx, this.WaterFallopt,20,this.fieldMapConfig[key],this.WaterFallopt.data[key])
					}
					else if(key == 'total'){
						this.ctx.beginPath()
						this.ctx.rect(paddingLeft,paddingTop, this.WaterFallopt.leftRect.width, this.WaterFallopt.leftRect.height)
						if(this.WaterFallopt.data[key]<80){
							this.ctx.setFillStyle(Weak)
							totalLevel='一般'
						}
						if(this.WaterFallopt.data[key]>80){
							this.ctx.setFillStyle(Normal)
							totalLevel='良好'
						}
						if(this.WaterFallopt.data[key]>90){
							this.ctx.setFillStyle(Great)
							totalLevel='优秀'
						}
						this.ctx.fill()
						this.ctx.beginPath()
						this.ctx.setTextAlign('center')
						this.ctx.setFillStyle('#000000')
						this.ctx.setFontSize(9)
						this.ctx.fillText(this.WaterFallopt.data['total'],paddingLeft+this.WaterFallopt.leftRect.width/2,this.WaterFallopt.leftRect.height/2+paddingTop)
					}
					else if(key=='execution_ability'&&this.WaterFallopt.data[key]==0){
						continue
					}
					else if(key=='execution_ability'&&this.WaterFallopt.data[key]!=0){
						this.ctx.setFillStyle('#000000')
						this.ctx.setFontSize(10)
						this.ctx.fillText("补充说明：",80,250)
						this.ctx.fillText('执行力：'+this.WaterFallopt.data[key],80,270)
						continue
					}
					else{
						DrawMyRect(this.ctx, this.WaterFallopt,10,this.fieldMapConfig[key],this.WaterFallopt.data[key])
					}
					current++
				}
				this.ctx.setFillStyle('#000000')
				this.ctx.font='12px 楷体'
				this.ctx.fillText("月度总评：",250,80)
				this.ctx.setFillStyle('#ff6ee0')
				this.ctx.font='20px 隶书'
				this.ctx.fillText(totalLevel,300,80)
				
				this.ctx.draw()
			}
		},
		watch:{
			'WaterFallopt.data':{
				handler:function(newVal,oldVal){
					this.drawWaterFallChart()
				},
				deep:true
			}
		},
		onLoad(options) {
			let to=options.to
			let pid = options.pid
			let perf=options.perf
			let token = uni.getStorageSync('token');
			let username = uni.getStorageSync('username');
			this.togShow=to;
			
			this.getPersonInfo(pid, token, username)

			let d = new Date()
			let timeYear = d.getFullYear()
			let timeMonth = d.getMonth()
			
			if(to!=1){
				
			}
			this.getPersonPerfMonth(pid, token, username, timeYear, timeMonth)

			
		},
		onReady() {
			this.ctx = uni.createCanvasContext('waterfallChart', this);
			
			uni.getSystemInfo({
				success:(res)=>{
					this.WaterFallopt.width=res.screenWidth
					this.WaterFallopt.height=res.screenHeight
				}
			})
		}
	}
</script>

<style scoped>
	.container {
		padding: 10rpx;
		padding-top: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center
	}

	.infotag {
		font-weight: bold;
	}

	.infoCard {
		width: 93%;
		background-color: #25c396;
		border-radius: 50rpx;
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		box-shadow: #d8d8d8 10rpx 8rpx 5rpx 5rpx;
		font-size: 32rpx;
	}

	.simple-info {
		width: 100%;
		display: flex;
		justify-content: space-around;
	}

	.info-img {
		border: 1rpx solid #d2d7f8;
		border-radius: 15rpx;
		width: 200rpx;
		height: 250rpx;
	}

	.simple-v {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}

	.simpleinfo-txt {
		font-style: italic;
		font-family: "幼圆";
		color: #ffffff;
	}

	.subLine-groove {
		color: #fff;
		border-radius: 20rpx;
		background-color: #646eca;
		height: 80rpx;
		width: 90%;
		line-height: 80rpx;
		margin-top: 40rpx;
		margin-bottom: 40rpx;
		position: relative;
		display: flex;
		justify-content: space-around;
		overflow: hidden;
	}

	.subLine {
		background-color: rgba(76, 255, 175, 0.6);
		width: 25%;
		height: 100%;
		border-radius: 10rpx;
		position: absolute;
		left: 0rpx;
		transition: left 0.3s;
	}

	.subLineTag {
		text-align: center;
		width: 25%;
		transition: all 0.5s;
	}

	.swiper {
		height: 750rpx;
		width: 100%;
		/* overflow: scroll; */
	}

	.swiper-scroll {
		height: 100%;
	}

	.swiper-item {
		padding: 10rpx;
		width: 100%;
		margin-top: 10rpx;
		margin-bottom: 10rpx;
	}

	.textInfo {
		display: flex;
		flex-direction: column;
		font-size: 33rpx;
		padding-left: 40rpx;
	}

	.info-item {
		margin-bottom: 40rpx;
	}

	.info-item>.infotag {
		margin-right: 30rpx;
	}

	.swiperLineSecond {
		left: 25%;
	}

	.swiperLineThird {
		left: 50%;
	}

	.swiperLineFour {
		left: 75%;
	}

	.selectedTag {
		font-weight: bold;
		color: #ac0003;
	}

	.personChart {}
</style>