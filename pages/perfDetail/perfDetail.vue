<template>
	<view class="perfDetail">
		<MyHeader :title="'人员结构'"></MyHeader>
		<view class="container">
			
		</view>
	</view>
	
	<!-- #ifdef APP -->
	<view class="perfDetail">
		<MyHeader title="绩效详情"></MyHeader>
		<view class="perfStats-container">
			<view class="perChart">
				<view class="chart-box">
					<uni-section :title="'平均指数'" type="line"></uni-section>
					<scroll-view class="perfLongChart" scroll-x="true">
						<qiun-data-charts type="column" :opts="colunmopts" :chartData="chartData_Month" />
					</scroll-view>
				</view>
			</view>
			<view class="perTable-mask">
				<scroll-view scroll-x="true">
					<view class="perTable">
						<view class="perTable-title">
							<view class="perTable-title-cell" v-for="item in fieldMapConfig">{{item}}</view>
						</view>
						<view class="perTable-row" v-for="(person,index) in teaminfo">
							<view class="tableValue">{{person.emp_name}}</view>
							<view class="tableValue" v-for="(vaule,key) in fieldMapConfig">{{person[key]}}</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
	<!-- #endif -->
</template>

<script>
	export default {
		data() {
			return {
				chartData_Month: {},
				colunmopts: {
					legend: {
						show: false
					},
					color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4",
						"#ea7ccc"
					],
					padding: [15, 15, 0, 5],
					enableScroll: true,
					legend: {
						show: false
					},
					xAxis: {
						disableGrid: true,
						itemCount: 5
					},
					yAxis: {
						disabled: true,
						format: 'yAxisNotFloat',
						data: [{
							format: 'yAxisNotFloat',
							min: 0,
						}]
					},
				},
				teaminfo: [],
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
				}
			}
		},
		methods: {
			getColumnChartData(perf, chartData) {

				let temp = ['EAM_inspection', 'PM_score', 'QA_score', 'execution_ability', 'labor', 'leakage_rate',
					'operation_rate', 'safety', 'threeInspection', 'threeQualification'
				]
				let temp2 = []

				temp.forEach((key) => {
					let sum = 0
					let num = 0
					perf.forEach((item) => {
						sum += Number(item[key])
						num++
					})
					temp2.push((sum / num).toFixed(2))
				})
				temp = temp.map((item) => {
					return this.fieldMapConfig[item]
				})
				temp2[3] = {
					color: '#f56d43',
					value: Math.abs(temp2[3])
				}
				let res = {
					categories: temp,
					series: [{
						name: "平均指数",
						data: temp2,
					}, ]
				};
				this[chartData] = JSON.parse(JSON.stringify(res));
			},
			getTeamInfo(team) {
				let token = uni.getStorageSync('token');
				let username = uni.getStorageSync('username');
				uni.request({
					url: 'http://10.72.59.63:90/getprefDetails.php',
					method: 'POST',
					header: {
						'Authorization': 'Bearer ' + token
					},
					data: {
						username: username,
						team: team
					},
					success: (res) => {
						if (res.data.data) {
							this.teaminfo = res.data.data
							this.getColumnChartData(res.data.data, 'chartData_Month')
						}
					}
				})
			}
		},
		onLoad(options) {
			let team = options.team
			this.getTeamInfo(team)
		}
	}
</script>

<style scoped>
	.perfStats-container {
		padding: 25rpx;
		display: flex;
		flex-direction: column;
		background-color: #f7f7f7;
	}

	.chart-box {
		background: rgba(242, 228, 255, 0.6);
		border: #b6b0b0 1rpx solid;
		border-radius: 20rpx;
		overflow: hidden;
		margin-bottom: 30rpx;
	}

	.perfLongChart {
		/* width: 120%; */
	}

	.perTable-mask {
		width: 100%;
		overflow: hidden;
	}

	.perTable {
		width: 1500rpx;
		display: flex;
		flex-direction: column;
	}

	.perTable-title {
		height: 80rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		background-color: #f1d6e8;
		border-bottom: #827e7e 1rpx solid;
	}

	.perTable-row {
		height: 60rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.perTable-row:nth-child(odd) {
		background-color: #b6eeb5;
	}

	.perTable-row:nth-child(even) {
		background-color: #8eebff;
	}

	.perTable-title-cell {
		width: 100rpx;
		text-align: center;
	}

	.tableValue {
		width: 100rpx;
		text-align: center;
	}
</style>