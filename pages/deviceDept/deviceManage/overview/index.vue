<template>
  <view class="overview-root">
    <view class="overview-main-row">
      <!-- 左侧信息卡片区 -->
      <view class="overview-side info-side">
        <view class="info-card device-stats-card">
          <div class="stats-title">设备统计</div>
          <div class="stats-total-row">
            <span class="stats-total-label">总数</span>
            <span class="stats-total-value">{{ deviceStats.total }}</span>
          </div>
          <div class="stats-status-group">
            <div class="stats-status-item">
              <span class="stats-dot stats-dot-running"></span>
              <span class="stats-status-value">{{ deviceStats.running }}</span>
              <span class="stats-status-label">运行</span>
            </div>
            <div class="stats-status-item">
              <span class="stats-dot stats-dot-stopped"></span>
              <span class="stats-status-value">{{ deviceStats.stopped }}</span>
              <span class="stats-status-label">停机</span>
            </div>
            <div class="stats-status-item">
              <span class="stats-dot stats-dot-maintain"></span>
              <span class="stats-status-value">{{ deviceStats.maintain }}</span>
              <span class="stats-status-label">维护</span>
            </div>
            <div class="stats-status-item">
              <span class="stats-dot stats-dot-error"></span>
              <span class="stats-status-value">{{ deviceStats.error }}</span>
              <span class="stats-status-label">故障</span>
            </div>
          </div>
        </view>
        <view class="info-card resource-stats-card">
          <div class="stats-title">可调度资源</div>
          <div class="resource-row">
            <div class="resource-item">
              <span class="resource-value">{{ resourceStats.workerCount }}</span>
              <span class="resource-label">保全工</span>
            </div>
            <div class="resource-item">
              <span class="resource-value">{{ resourceStats.fund.toLocaleString() }}</span>
              <span class="resource-label">资金</span>
            </div>
          </div>
        </view>
      </view>
      <!-- 中间卡片车间区 -->
      <view class="overview-center">
        <view class="breadcrumb-row breadcrumb-search-row">
          <span v-for="(item, idx) in historyPath" :key="idx" class="breadcrumb-item" @click="goLevel(idx)">
            {{ item }}<span v-if="idx < historyPath.length-1"> / </span>
          </span>
          <input class="device-search-input" v-model="searchText" @keyup.enter="searchDevice" placeholder="搜索设备名定位..." />
          <button class="device-search-btn" @click="searchDevice">搜索</button>
        </view>
        <transition name="fade">
          <div v-if="showSearchToast" class="search-toast">未找到该设备</div>
        </transition>
        <view class="card-workshop">
          <!-- 工段卡片 -->
          <view v-if="currentLevel.section === null" class="section-card-row">
            <view v-for="section in workshopTree" :key="section.section" class="section-card" @click="enterSection(section.section)">
              <div class="section-title">{{ section.section }}</div>
              <div class="section-info">运行: {{ section.running }}/{{ section.total }}</div>
              <div class="section-info">消耗: {{ section.expectedInput }}</div>
              <div class="section-info">产出: {{ section.expectedOutput }}</div>
            </view>
          </view>
          <!-- 车间卡片 -->
          <view v-else-if="currentLevel.workshop === null" class="section-card-row">
            <view v-for="workshop in currentSection.workshops" :key="workshop.name" class="section-card" @click="enterWorkshop(workshop.name)">
              <div class="section-title">{{ workshop.name }}</div>
              <div class="section-info">运行: {{ workshop.running }}/{{ workshop.total }}</div>
              <div class="section-info">消耗: {{ workshop.expectedInput }}</div>
              <div class="section-info">产出: {{ workshop.expectedOutput }}</div>
            </view>
          </view>
          <!-- 设备卡片 -->
          <view v-else class="device-card-row">
            <view v-for="device in currentWorkshop.devices" :key="device.id" class="device-card" :data-device-id="device.id" @click="selectDevice(device)">
              <div class="device-card-top">
                <img :src="device.img" class="device-img" />
                <div class="device-info-block">
                  <div class="device-title">{{ device.name }}</div>
                  <div class="device-status">状态: <span :class="'status-dot status-dot-' + device.status"></span><span>{{ device.status }}</span></div>
                  <div class="device-persons">负责人: <span class="device-person">{{ device.principal || '管理员' }}</span> / <span class="device-person">{{ device.maintainer || '保全工' }}</span></div>
                </div>
              </div>
              <div class="device-card-bottom">
                <div class="device-modules">
                  <span v-for="m in device.modules" :key="m" class="device-module">{{ m }}模块：正常</span>
                </div>
              </div>
            </view>
          </view>
        </view>
      </view>
      <!-- 右侧任务操作区 -->
      <view class="overview-side op-side">
        <view class="op-card task-op-card">
          <div class="task-title">任务操作区</div>
          <div class="task-form-row">
            <label>任务类型</label>
            <select class="task-form-select" v-model="taskForm.type">
              <option value="" disabled>请选择</option>
              <option v-for="t in taskTypes" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>
           <div class="task-form-row">
            <label>任务名称</label>
            <input class="task-form-input" v-model="taskForm.name" placeholder="请输入任务名称" />
          </div>
          <div class="task-form-row">
            <label>计划时间</label>
            <input class="task-form-date" v-model="taskForm.planTime" type="date" />
          </div>
          <div class="task-form-row">
            <label>设备</label>
            <p class="task-sublist">
              <span class="task-subitem deviceItem" v-for="(device,index) in taskForm.deviceIds" :key="index">
                <span>{{ device.name }}</span>
                <span class="task-subitem-del" @click="delSelectDevice(device)">×</span>
              </span>
              <span class="device-placeholder" v-if="!taskForm.deviceIds.length">请在左侧列表选择</span>
            </p>
          </div>
          <div class="task-form-row">
            <div class="task-form-title">
              <label>保全工</label>
              <span class="task-title-select" @click="ShowSelectPanel(false)">选择</span>
            </div>
            <p class="task-sublist">
              <span class="task-subitem workerItem" v-for="(worker,index) in workerIds" :key="index">
                <span>{{ worker.name }}</span>
                <span class="task-subitem-del" @click="workerList[workerList.findIndex(item=>item.id===worker.id)].isSelect=false">×</span>
              </span>
              <span class="device-placeholder" v-if="!workerIds.length">未指定</span>
            </p>
          </div>
          <div class="task-form-row">
            <div class="task-form-title">
              <label>管理员</label>
              <span class="task-title-select" @click="ShowSelectPanel(true)" >选择</span>
            </div>
            <p class="task-sublist">
              <span class="task-subitem adminItem" v-for="(admin,index) in adminIds" :key="index">
                <span>{{ admin.name }}</span>
                <span class="task-subitem-del" @click="adminList[adminList.findIndex(item=>item.id===admin.id)].isSelect=false">×</span>
              </span>
              <span class="device-placeholder" v-if="!adminIds.length">未指定</span>
            </p>
          </div>
          <button class="task-publish-btn" @click="publishTask">发布任务</button>
          <div v-if="taskPublishMsg" class="task-publish-msg">{{ taskPublishMsg }}</div>
        </view>
      </view>
    </view>
    <!-- 下半部分图表区 -->
    <view class="overview-charts-row">
      <view class="chart-card">
        <div class="chart-title">设备状态分布</div>
        <QiunDataCharts type="pie" :chartData="statusPieData" :opts="{legend:{show:true}, title:{show:false}, extra:{pie:{labelWidth:15}}}" style="width:100%;height:180px;" />
      </view>
      <view class="chart-card">
        <div class="chart-title chart-title-row">
          <span>电气/机械故障分布</span>
          <select class="chart-time-select" v-model="chartTimeRange2">
            <option v-for="opt in chartTimeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>
        <QiunDataCharts type="column" :chartData="faultBarData" :opts="{legend:{show:true}, title:{show:false}, xAxis:{disableGrid:true}, yAxis:{min:0}}" style="width:100%;height:180px;" />
      </view>
      <view class="chart-card">
        <div class="chart-title chart-title-row">
          <span>故障趋势统计</span>
          <select class="chart-time-select" v-model="chartTimeRange3">
            <option v-for="opt in chartTimeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>
        <QiunDataCharts type="line" :chartData="trendLineData" :opts="{legend:{show:false}, title:{show:false}, xAxis:{disableGrid:true}, yAxis:{min:0}}" style="width:100%;height:180px;" />
      </view>
      <view class="chart-card">
        <div class="chart-title chart-title-row">
          <span>故障机器停机时长</span>
          <select class="chart-time-select" v-model="chartTimeRange4">
            <option v-for="opt in chartTimeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>
        <QiunDataCharts type="bar" :chartData="downtimeBarData" :opts="{legend:{show:false}, title:{show:false}, xAxis:{min:0}, yAxis:{disableGrid:true}}" style="width:100%;height:180px;" />
      </view>
    </view>

    <!-- 弹窗区 -->
    <view v-show="isShowSelectPanel" class="dialog-mask">
      <view class="dialog">
        <view class="dialog-title">
          <span>人员列表</span>
          <span class="dialog-cancel-btn" @click="isShowSelectPanel=false">×</span>
        </view>
        <view class="dialog-body">
          <div class="table">
            <div class="table-thead">
              <div class="table-row">
                <div class="table-cell" v-for="item in ['姓名','工龄','任务数','上季度绩效']">{{ item }}</div>
              </div>
            </div>
            <div class="table-tbody">
              <div  :class="['table-row',person.isSelect ? 'taskSelected':'']" v-for="(person,pindex) in pagedPersonList" :key="pindex" @click="person.isSelect=!person.isSelect">
                  <div class="table-cell">{{ person.name }}</div>
                  <div class="table-cell">{{ person.workYears }}</div>
                  <div class="table-cell">{{ person.taskNum }}</div>
                  <div class="table-cell">{{ person.lastMer }}</div>
              </div>
            </div>
          </div>
        </view>
        <view class="dialog-footer">
          <div class="pagination">
            <button class="pagination-btn" @click="prevPage" :disabled="currentPage === 1">上一页</button>
            <span class="pagination-info">{{ currentPage }}/{{ totalPages }}</span>
            <button class="pagination-btn" @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
          </div>
        </view>
      </view>
    </view>

  </view>
</template>

<script setup>
import { ref,reactive, computed } from 'vue'
import { workshopTree, deviceStatusStats, faultTypeStats, faultTrendStats, downtimeStats } from '@/utils/mockData.js'
import { workerList as wL, adminList as aL } from '@/utils/mockData.js'
import QiunDataCharts from '@/uni_modules/qiun-data-charts/components/qiun-data-charts/qiun-data-charts.vue'

const workerList = reactive(
  wL.map(worker => ({
    ...worker,
    isSelect: false, // 新增字段
  }))
);

const adminList = reactive(
  aL.map(admin => ({
    ...admin,
    isSelect: false, // 新增字段
  }))
);

const sectionList = workshopTree.map(s => s.section)
const currentLevel = ref({ section: null, workshop: null })
const historyPath = ref(['全部工段'])

const searchText = ref('')
const showSearchToast = ref(false)

const currentSection = computed(() =>
  workshopTree.find(s => s.section === currentLevel.value.section)
)
const currentWorkshop = computed(() =>
  currentSection.value && currentSection.value.workshops.find(w => w.name === currentLevel.value.workshop)
)

// 设备统计
const deviceStats = computed(() => {
  let devices = []
  if (!currentLevel.value.section) {
    // 全部
    for (const s of workshopTree) for (const w of s.workshops) devices.push(...w.devices)
  } else {
    for (const w of currentSection.value.workshops) devices.push(...w.devices)
  }
  const total = devices.length
  const running = devices.filter(d => d.status === '运行').length
  const stopped = devices.filter(d => d.status === '停机').length
  const maintain = devices.filter(d => d.status === '维护').length
  const error = devices.filter(d => d.status === '故障').length
  return { total, running, stopped, maintain, error }
})
// 可调度资源统计
const resourceStats = computed(() => {
  let section = currentLevel.value.section
  let workers = section ? adminList.filter(a => a.section === section && a.role === '保全工') : adminList.filter(a => a.role === '保全工')
  let fund = 0
  if (!section) {
    fund = workshopTree.reduce((sum, s) => sum + (s.fund || 0), 0)
  } else {
    const sec = workshopTree.find(s => s.section === section)
    fund = sec && sec.fund ? sec.fund : 0
  }
  return {
    workerCount: workers.length,
    fund
  }
})

// 图表区相关
const chartTimeRange = ref('7d') // 7d, 30d, custom
const chartTimeOptions = [
  { label: '近7天', value: '7d' },
  { label: '近30天', value: '30d' },
  // { label: '自定义', value: 'custom' }
]
const chartTimeRange2 = ref('7d') // 电气/机械故障分布
const chartTimeRange3 = ref('7d') // 故障趋势
const chartTimeRange4 = ref('7d') // 停机时长

// 获取当前层级下所有设备
const allDevices = computed(() => {
  if (!currentLevel.value.section) {
    // 全部
    let arr = []
    for (const s of workshopTree) for (const w of s.workshops) arr.push(...w.devices)
    return arr
  } else {
    let arr = []
    for (const w of currentSection.value.workshops) arr.push(...w.devices)
    return arr
  }
})

// 1. 设备状态分布（饼图）
const statusPieData = computed(() => {
  const section = currentLevel.value.section || '全部'
  const stat = deviceStatusStats.find(s => s.section === section)
  const statusArr = ['运行','停机','维护','故障']
  let data = statusArr.map(name => ({
      name,
      value: stat ? stat[{ '运行': 'running', '停机': 'stopped', '维护': 'maintain', '故障': 'error' }[name]] ?? stat[name] : 0
    }))
  const charData =  {
    categories: statusArr,
    series: [
      {
        data:data
      }
    ]
  }
  return charData
})
// 2. 电气/机械故障分布（柱状图）
const faultBarData = computed(() => {
  let sections = !currentLevel.value.section ? ['炼胶','压出','成型','硫化'] : [currentLevel.value.section]
  const range = chartTimeRange2.value
  return {
    categories: sections,
    series: [
      { name: '电气故障', data: sections.map(sec => (faultTypeStats.find(s => s.section === sec && (s.range === range || !s.range))?.elec || 0)) },
      { name: '机械故障', data: sections.map(sec => (faultTypeStats.find(s => s.section === sec && (s.range === range || !s.range))?.mech || 0)) }
    ]
  }
})
// 3. 故障趋势统计（折线图）
const trendLineData = computed(() => {
  const section = currentLevel.value.section || '全部'
  const range = chartTimeRange3.value
  const stat = faultTrendStats.find(s => s.section === section && (s.range === range || !s.range))
  return {
    categories: stat ? stat.days : [],
    series: [ { name: '故障数', data: stat ? stat.counts : [] } ]
  }
})
// 4. 故障机器停机时长（横向柱状图）
const downtimeBarData = computed(() => {
  const section = currentLevel.value.section || '全部'
  const range = chartTimeRange4.value
  const stat = downtimeStats.find(s => s.section === section && s.range === range)
  return {
    categories: stat ? stat.data.map(d => d.name) : [],
    series: [ { name: '停机时长(h)', data: stat ? stat.data.map(d => d.value) : [] } ]
  }
})

function enterSection(section) {
  currentLevel.value.section = section
  currentLevel.value.workshop = null
  historyPath.value = ['全部工段', section]
}
function enterWorkshop(workshop) {
  currentLevel.value.workshop = workshop
  historyPath.value = ['全部工段', currentLevel.value.section, workshop]
}
function goLevel(idx) {
  if (idx === 0) {
    currentLevel.value.section = null
    currentLevel.value.workshop = null
    historyPath.value = ['全部工段']
  } else if (idx === 1) {
    currentLevel.value.workshop = null
    historyPath.value = ['全部工段', currentLevel.value.section]
  }
}

function searchDevice() {
  const name = searchText.value.trim()
  if (!name) return
  let found = null
  for (const section of workshopTree) {
    for (const workshop of section.workshops) {
      for (const device of workshop.devices) {
        if (device.name.includes(name)) {
          found = { section: section.section, workshop: workshop.name, deviceId: device.id, deviceName: device.name }
          break
        }
      }
      if (found) break
    }
    if (found) break
  }
  if (found) {
    currentLevel.value.section = found.section
    currentLevel.value.workshop = found.workshop
    historyPath.value = ['全部工段', found.section, found.workshop]
    setTimeout(() => {
      const el = document.querySelector(`[data-device-id='${found.deviceId}']`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  } else {
    showSearchToast.value = true
    setTimeout(() => { showSearchToast.value = false }, 1800)
  }
}

function onTimeRangeChange(e) {
  chartTimeRange.value = e.target.value
  // TODO: 联动数据
}

//任务操作区相关
const taskTypes = [ '检修', '巡检', '临时任务', '升级改造' ]
const taskForm = ref({
  type: '',
  deviceIds: [],
  name: '',
  planTime: ''
})
const workerIds = computed(()=>{
  return workerList.filter(worker => worker.isSelect)
})
const adminIds = computed(()=>{
  return adminList.filter(admin => admin.isSelect)
})
const taskPublishMsg = ref('')
const isShowSelectPanel = ref(false)
const selectWho = ref(false)
const currentPage = ref(1)
const pageSize = ref(6)

// 当前层级保全工、管理员选项
const personList = computed(() => {
  let section = currentLevel.value.section
  if(!selectWho.value){
    return section ? workerList.filter(worker => worker.section === section) : workerList
  }
  else{
    return section ? adminList.filter(admin => admin.section === section) : adminList
  }
})

// 分页后的人员列表
const pagedPersonList = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return personList.value.slice(startIndex, endIndex)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(personList.value.length / pageSize.value)
})

// 上一页
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// 下一页
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// 重置分页
function resetPagination() {
  currentPage.value = 1
}

function selectDevice(device){
  // 检查设备是否已经在选中列表中
  const index = taskForm.value.deviceIds.findIndex(item => item.id === device.id);
  if (index === -1) {
    // 如果不在，则添加
    taskForm.value.deviceIds.push(device);
  } else {
    // 如果在，则删除
    taskForm.value.deviceIds.splice(index, 1);
  }
}
function delSelectDevice(device){
  // 从选中列表中删除设备
  const index = taskForm.value.deviceIds.findIndex(item => item.id === device.id);
  if (index !== -1) {
    taskForm.value.deviceIds.splice(index, 1);
  }
}
function ShowSelectPanel(isAdmin){
  selectWho.value = isAdmin
  isShowSelectPanel.value = true
}
function publishTask() {
  if (!taskForm.value.type || !taskForm.value.deviceIds.length || !taskForm.value.workerIds.length || !taskForm.value.adminIds.length || !taskForm.value.name) {
    taskPublishMsg.value = '请填写完整任务信息';
    setTimeout(()=>taskPublishMsg.value='', 1800)
    return
  }
  taskPublishMsg.value = '任务已发布！';
  setTimeout(()=>taskPublishMsg.value='', 1800)
  // 清空表单
  taskForm.value = { type: '', deviceIds: [], workerIds: [], adminIds: [], name: '', planTime: '' }
}


</script>

<style scoped>
.overview-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f8f8f8;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-btn {
  font-size: 26rpx;
  margin: 0 5px;
  background-color: #f0f0f0;
  border-radius: 4rpx;
  cursor: pointer;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  margin: 0 10px;
}

.overview-main-row {
  display: flex;
  flex-direction: row;
  gap: 24px;
  padding: 32px 32px 0 32px;
}
.overview-side {
  width: 220px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.info-side {
  flex-shrink: 0;
}
.op-side {
  flex-shrink: 0;
}
.info-card, .op-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(52,120,246,0.06);
  padding: 18px 16px;
  font-size: 16px;
  color: #3478f6;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.overview-center {
  background-color: #fff;
  border-radius: 12px;
  padding: 20rpx;
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}
.breadcrumb-row {
  font-size: 26rpx;
  color: #888;
  margin-bottom: 10px;
  user-select: none;
}
.breadcrumb-item {
  cursor: pointer;
  color: #3478f6;
}
.breadcrumb-item:last-child {
  color: #7e7c7c;
  cursor: default;
}
.breadcrumb-search-row {
  display: flex;
  align-items: center;
  gap: 18rpx;
}
.device-search-input {
  height: 32px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 0 12px;
  font-size: 15px;
  margin-left: 18rpx;
  outline: none;
  color: #333;
  background: #f7f7f7;
  transition: border 0.2s;
}
.device-search-input:focus {
  border-color: #3478f6;
}
.device-search-btn {
  height: 32px;
  padding: 0 16px;
  border: none;
  border-radius: 6px;
  background: #3478f6;
  color: #fff;
  font-size: 15px;
  margin-left: 4px;
  cursor: pointer;
  transition: background 0.2s;
}
.device-search-btn:active {
  background: #145fff;
}
.search-error {
  color: #f04343;
  font-size: 14px;
  margin: 6px 0 0 0;
  padding-left: 8px;
}
.card-workshop {
  
  background: #f7f7f7;
  border-radius: 14px;
  box-shadow: 0 4px 24px rgba(52,120,246,0.06);
  padding: 24px 20px;
  max-height: 800rpx;
  overflow: hidden;
}
.section-card-row {
  display: flex;
  flex-direction: row;
  gap: 24px;
}
.section-card {
  flex: 1;
  background: linear-gradient(135deg, #f4f8ff 0%, #e8f0fe 100%);
  border: 1.5px solid #dbeafe;
  border-radius: 10px;
  padding: 24px 18px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(.4,0,.2,1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
  min-height: 120px;
}
.section-card:hover {
  background: linear-gradient(135deg, #e8f0fe 0%, #dbeafe 100%);
  border-color: #3478f6;
  box-shadow: 0 4px 16px rgba(52,120,246,0.10);
}
.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #3478f6;
  margin-bottom: 12px;
}
.section-info {
  font-size: 15px;
  color: #888;
}
.overview-charts-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 24px;
  padding: 32px;
}
.chart-card {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(52,120,246,0.06);
  padding: 18px 16px;
  min-height: 180px;
  max-width: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #888;
}
.device-card-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.device-card {
  width: 320px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(52,120,246,0.06);
  padding: 18px 12px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 160px;
}
.device-card-top {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}
.device-img {
  width: 70px;
  height: 70px;
  object-fit: contain;
  border-radius: 8px;
  background: #f7f7f7;
}
.device-info-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.device-title {
  font-size: 17px;
  font-weight: 600;
  color: #3478f6;
}
.device-status {
  padding-left: 15rpx;
  font-size: 14px;
  color: #888;
  display: flex;
  align-items: center;
}
.status-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-left: 6px;
}
.status-dot-运行 { background: #3ecb6c; }
.status-dot-停机 { background: #bdbdbd; }
.status-dot-维护 { background: #4c84fc; }
.status-dot-故障 { background: #f04343; }
.device-persons {
  font-size: 13px;
  color: #666;
}
.device-person {
  color: #145fff;
  font-weight: 500;
}
.device-card-bottom {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}
.device-modules {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.device-module {
  background: #e8f0fe;
  color: #3478f6;
  border-radius: 6px;
  padding: 2px 10px;
  font-size: 13px;
}
.search-toast {
  position: absolute;
  left: 50%;
  top: 80px;
  transform: translateX(-50%);
  background: #f17d7d;
  color: #fff;
  padding: 10px 28px;
  border-radius: 8px;
  font-size: 15px;
  z-index: 99;
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  opacity: 0.95;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.device-stats-card, .resource-stats-card {
  padding: 18px 18px 12px 18px;
}
.stats-title {
  font-size: 17px;
  font-weight: 700;
  color: #3478f6;
  margin-bottom: 12px;
  text-align: left;
}
.stats-total-row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin-bottom: 10px;
}
.stats-total-label {
  font-size: 15px;
  color: #888;
}
.stats-total-value {
  font-size: 28px;
  font-weight: 700;
  color: #222;
  line-height: 1;
}
.stats-status-group {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px 18px;
  margin-bottom: 2px;
}
.stats-status-item {
  display: flex;
  align-items: center;
  min-width: 60px;
  gap: 3px;
}
.stats-status-value {
  font-size: 18px;
  font-weight: 600;
  color: #222;
  margin: 0 2px 0 0;
}
.stats-status-label {
  font-size: 14px;
  color: #888;
  margin-left: 2px;
}
.stats-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 4px;
}
.stats-dot-running { background: #3ecb6c; }
.stats-dot-stopped { background: #bdbdbd; }
.stats-dot-maintain { background: #4c84fc; }
.stats-dot-error { background: #f04343; }
.resource-row {
  display: flex;
  flex-direction: row;
  gap: 24px;
  justify-content: space-between;
  margin-top: 10px;
}
.resource-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}
.resource-value {
  font-size: 26px;
  font-weight: 700;
  color: #3478f6;
  margin-bottom: 2px;
}
.resource-label {
  min-width: 100rpx;
  text-align: center;
  font-size: 14px;
  color: #888;
}
.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #3478f6;
  margin-bottom: 10px;
}
.chart-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.chart-time-select {
  height: 28px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 0 8px;
  font-size: 14px;
  color: #3478f6;
  background: #f7f7f7;
  outline: none;
}
.chart-placeholder {
  width: 100%;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8px;
  color: #999;
  font-size: 14px;
}
.task-op-card {
  min-width: 220px;
  padding: 18px 18px 12px 18px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
}
.task-title {
  font-size: 17px;
  font-weight: 700;
  color: #3478f6;
  margin-bottom: 10px;
  text-align: left;
}
.task-form-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}
.task-form-row label {
  font-size: 14px;
  color: #888;
  margin-bottom: 2px;
}
.task-form-row select {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 26rpx;
  color: #424242;
  background: #ffffff;
  outline: none;
}
.task-form-row select[multiple] {
  min-height: 60px;
}
.task-form-input, .task-form-date{
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 26rpx;
  color: #424242;
  background: #ffffff;
  outline: none;
}
.task-title-select{
  font-size: 24rpx;
  color: #838383;
  text-decoration: underline;
  margin-left: 20rpx;
  cursor: pointer;
}
.task-sublist{
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}
.task-subitem{
  max-height: 40rpx;
  background-color: #7091d8;
  padding: 6rpx;
  color: #fff;
  font-size: 24rpx;
  border-radius: 15rpx;
}
.task-subitem-del{
  margin-left: 5rpx;
  cursor: pointer;
}
.table{
  display: flex;
  flex-direction: column;
  border: #848586 1rpx solid;
  border-radius: 15rpx;
  overflow: hidden;
}
.table-thead{
  color: #333;
  background-color: #c1d0f1;
}
.table-row{
  display: flex;
  border-bottom: #b9b9b9 1rpx solid;
}
.table-tbody .table-row:last-child{
  border-bottom: none;
}
.table-row.taskSelected{
  background-color: #e4eaf7;
}
.table-cell{
  padding: 20rpx 20rpx;
  min-width: 150rpx;
  text-align: center;
}
.device-placeholder{
  padding-left: 20rpx;
  font-size: 26rpx;
  color: #afafaf;
}
.task-publish-btn {
  width: 200rpx;
  height: 70rpx;
  line-height: 70rpx;
  background: #3478f6;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}
.task-publish-btn:active {
  background: #145fff;
}
.task-publish-msg {
  color: #3ecb6c;
  font-size: 15px;
  margin-top: 8px;
  text-align: center;
}
/* 弹窗样式 */
.dialog-mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.35);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dialog {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  min-width: 800rpx;
  max-width: 92vw;
  padding: 32px 28px 20px 28px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
}
.dialog-title {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 18px;
  text-align: left;
  letter-spacing: 1px;
}
.dialog-cancel-btn{
  background-color: #ff0000; 
  color: #fff;
  border-radius: 30rpx;
  padding: 0 8rpx;
  text-align: center;
  line-height: 60rpx;
  cursor: pointer;
}
.dialog-body {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  margin-bottom: 18px;
}
</style>
