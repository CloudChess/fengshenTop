<template>
	<view>
		<MyHeader title="团队报表"></MyHeader>
		<view class="subclass">
			<view class="subclass-container">
				<view class="subclass-workshop">
					<view class="subclass-tag" :class="{subclassTagChecked:workShop=='炼胶'}" @click="setWorkshop('炼胶')">
						炼胶</view>
					<view class="subclass-tag" :class="{subclassTagChecked:workShop=='压出'}" @click="setWorkshop('压出')">
						压出</view>
					<view class="subclass-tag" :class="{subclassTagChecked:workShop=='成型'}" @click="setWorkshop('成型')">
						成型</view>
					<view class="subclass-tag" :class="{subclassTagChecked:workShop=='硫化'}" @click="setWorkshop('硫化')">
						硫化</view>
					<view class="subclass-tag" :class="{subclassTagChecked:workShop=='成品'}" @click="setWorkshop('成品')">
						成品</view>
					<view class="subclass-tag" :class="{subclassTagChecked:workShop=='叉车'}" @click="setWorkshop('叉车')">
						叉车</view>
				</view>
			</view>
			<view class="subclass-blank">
		
			</view>
		</view>
		<view class="chart-list">
			<view class="chart-box">
				<uni-section :title="'人数统计  总人数：'+workShopInfo.length" type="line" @click="toTeaminfo()"></uni-section>
				<qiun-data-charts type="column" :opts="colunmopts" :chartData="chartData_num" />
			</view>

			<view class="chart-box">
				<uni-section title="工种分布" type="line"></uni-section>
				<qiun-data-charts type="pie" :chartData="chartData_job_type" />
			</view>
			<view class="chart-box">
				<uni-section title="技能等级分布" type="line"></uni-section>
				<qiun-data-charts type="bar" :opts="baropts" :chartData="chartData_skill_level" />
			</view>

			<!-- <qiun-data-charts type="funnel" :opts="opts" :chartData="chartData_age" /> -->
		</view>
		<MyBottom></MyBottom>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				colunmopts: {
					legend: {
						show: false
					},
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: [15, 15, 0, 5],
					enableScroll: false,
					legend: {
						show:false
					},
					xAxis: {
						disableGrid: true
					},
					yAxis: {
						disabled:true,
						format: 'yAxisNotFloat',
						data: [{
							format: 'yAxisNotFloat',
							min: 0,

						}]
					}
				},
				baropts: {
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: [15, 30, 0, 5],
					enableScroll: false,
					legend: {
						show:false
					},
					xAxis: {
						boundaryGap: "justify",
						disableGrid: false,
						min: 0,
						axisLine: false,
					},
					xAxis: {
						disabled:true
					},
					extra: {
						bar: {
							type: "stack",
							width: 30,
							meterBorde: 1,
							meterFillColor: "#FFFFFF",
							activeBgColor: "#000000",
							activeBgOpacity: 0.08,
							categoryGap: 2
						}
					},
				},
				chartData_num: {},
				chartData_age: {},
				chartData_job_type: {},
				chartData_skill_level: {},
				workShop: '',
				workShopInfo: [],
				teamInfo: []
			}
		},
		methods: {
			toTeaminfo() {
				uni.navigateTo({
					url: '/pages/teaminfo/teaminfo'
				});
			},
			setWorkshop(value) {
				if (this.workShop == value) {
					this.workShop = ''
					this.workShopInfo = this.teamInfo
				} else {
					this.workShop = value
					this.workShopInfo = this.teamInfo.filter((person) => {
						return person.emp_workshop == this.workShop;
					})
				}
				this.updateInfo()
			},
			getColumnChartData(groupKey, chartData) {
				let temp = []
				let temp2 = []

				this.workShopInfo.forEach((person) => {
					let isadded = false
					for (let i = 0; i < temp.length; i++) {
						if (person[groupKey] == temp[i]) {
							isadded = true
							temp2[i]++
						}
					}
					if (!isadded) {
						temp.push(person[groupKey])
						temp2.push(1)
					}
				})
				let res = {
					categories: temp,
					series: [{
						name: "人数",
						data: temp2
					}, ]
				};
				this[chartData] = JSON.parse(JSON.stringify(res));

			},
			getPieChartData(groupKey, chartData) {
				let temp = []

				this.workShopInfo.forEach((person) => {
					let isAdded = false
					temp.forEach((item) => {
						if (item.name == person[groupKey]) {
							item.value++
							isAdded = true
						}
					})
					if (!isAdded) {
						temp.push({
							'name': person[groupKey],
							'value': 1
						})
					}
				})

				temp.map((item) => {
					item.labelText = item.name + ':' + item.value + "人"
				})
				let res = {
					series: [{
						data: temp
					}]
				};
				this[chartData] = JSON.parse(JSON.stringify(res));
			},
			updateInfo() {
				this.getColumnChartData('emp_workshop', 'chartData_num')
				this.getPieChartData('emp_birth_date', 'chartData_age')
				this.getPieChartData('emp_job_type', 'chartData_job_type')
				// this.getPieChartData('emp_skill_level', 'chartData_skill_level')
				this.getColumnChartData('emp_skill_level', 'chartData_skill_level')
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
							this.teamInfo = res.data.data
							this.workShopInfo = this.teamInfo
							this.updateInfo()
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

<style scoped>
	.chart-list {
		padding: 25rpx;
		display: flex;
		flex-direction: column;
		background-color: #d3ffd2;
	}

	.chart-box {
		background: rgba(200, 255, 255, 0.5);
		border: #b6b0b0 1rpx solid;
		border-radius: 20rpx;
		overflow: hidden;
		margin-bottom: 30rpx;
	}
	
	.subclass-container {
		width: 100%;
		position: fixed;
		z-index: 999;
	}

	.subclass-blank {
		height: 88rpx;
	}

	.subclass-workshop {
		border-bottom: 1rpx solid #d8d8d8;
		background-color: #d3fffa;
		padding: 10rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.subclass-tag {
		border: 1rpx solid #b6b0b0;
		padding: 10rpx;
		padding-left: 20rpx;
		padding-right: 20rpx;
		border-radius: 15rpx;
	}

	.subclassTagChecked {
		background-color: #aaff7f;

	}
</style>