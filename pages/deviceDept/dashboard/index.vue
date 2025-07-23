<template>
    <view class="dashboard-root">
      <!-- 右侧内容区 -->
      <view class="main-content">
        <view class="main-header">
          <text class="welcome">{{ greeting }}，张三！</text>
          <text class="subtitle">设备部管理面板</text>
        </view>
        <view class="main-section">
          <!-- 上方卡片区 -->
          <view class="card-row">
            <view class="card card-chart">
              <view class="card-title">设备问题总览</view>
              <view class="chart-container">
                <view class="chart-section" v-for="(section, sectionIndex) in deviceStatusData" :key="sectionIndex">
                  <view class="section-label">{{ section.name }}</view>
                  <view class="bar-container">
                    <view class="bar-item" 
                         v-for="(status, statusIndex) in section.statuses" 
                         :key="statusIndex"
                         @click="showDeviceDetail(section.name, status.name, status.devices)"
                         :style="{ width: getBarWidth(status.count, section.maxCount, status.type) }"
                         :class="['status-' + status.type]">
                      <text class="bar-count">{{ status.count }}</text>
                    </view>
                  </view>
                </view>
                <view class="chart-legend">
                  <view class="legend-item">
                    <span class="dot stopped"></span>停机
                  </view>
                  <view class="legend-item">
                    <span class="dot error"></span>故障
                  </view>
                </view>
              </view>
            </view>
            <view class="card card-overview">
              <view class="card-title">
                <text>管理员出勤</text>
                <text class="card-title-count">25/26</text>
              </view>
              <view class="card-content">
                <view
                  v-for="(person, index) in adminAbsentList"
                  :key="index"
                  class="absent-list-item"
                  :class="{ 'has-problem': person.hasProblem }"
                  @click="showEmployeeProblemDevices(person)"
                >
                  <text class="absent-name">{{ person.name }}</text>
                  <text class="absent-section">{{ person.section }}</text>
                  <text class="absent-reason">{{ person.reason }}</text>
                </view>
              </view>
            </view>
            <view class="card card-overview">
              <view class="card-title">
                <text>保全工出勤</text>
                <text class="card-title-count">68/70</text>
              </view>
              <view class="card-content">
                <view
                  v-for="(person, index) in adminAbsentList"
                  :key="index"
                  class="absent-list-item"
                  :class="{ 'has-problem': person.hasProblem }"
                  @click="showEmployeeProblemDevices(person)"
                >
                  <text class="absent-name">{{ person.name }}</text>
                  <text class="absent-section">{{ person.section }}</text>
                  <text class="absent-reason">{{ person.reason }}</text>
                </view>
              </view>
            </view>
          </view>
          <!-- 下方卡片区 -->
          <view class="card-row">
            <view class="card card-task">
             <view class="card-title">任务状况</view>
             <view class="card-content">
              <view class="task-list">
                <view
                  v-for="(section, idx) in sectionTasks"
                  :key="section.section"
                  class="section-item"
                  @click="toggleSection(section.section)"
                  :style="{ cursor: 'pointer', fontWeight: expandedSection === section.section ? 'bold' : 'normal' }"
                >
                  <view class="section-item-title">
                    {{ section.section }}
                    <span style="float:right;">{{ expandedSection === section.section ? '▲' : '▼' }}</span>
                  </view>  
                  
                  <!-- 周期任务 -->
                  <view class="periodic-tasks-section" v-if="expandedSection === section.section">
                    <view class="task-category-title">
                      <text class="category-text">周期任务</text>
                      <span class="toggle-periodic" @click.stop="togglePeriodicTasks(section.section)">
                       {{ expandedPeriodicTasks.includes(section.section) ? '收起' : '展开' }}
                      </span>
                    </view>
                    <view v-if="expandedPeriodicTasks.includes(section.section)" class="periodic-tasks-list">
                      <view
                        v-for="task in section.periodicTasks"
                        :key="task.name"
                        class="task-item periodic-task"
                        @click.stop="showTaskDetail(task, section.section, 'periodic')"
                      >
                        <view class="task-main-row">
                          <span class="task-item-label">{{ task.name }}</span>
                          <span class="task-progress">{{ task.progress }}%</span>
                        </view>
                      </view>
                    </view>
                  </view>

                  <!-- 重点任务 -->
                  <view class="key-tasks-section" v-if="expandedSection === section.section">
                    <view class="task-category-title">
                      <text class="category-text">重点任务</text>
                    </view>
                    <view class="key-tasks-list">
                      <view
                        v-for="task in section.keyTasks"
                        :key="task.name"
                        class="task-item key-task"
                        @click.stop="showTaskDetail(task, section.section, 'key')"
                      >
                        <view class="task-main-row">
                          <span class="task-item-label">{{ task.name }}</span>
                          <span class="task-owner">{{ task.owner }}</span>
                        </view>
                        <view class="task-latest-progress-row">
                          <template v-if="task.history && task.history.length">
                            <span class="task-item-label">最新进度：</span>
                            <span class="latest-progress-desc">{{ task.history[task.history.length-1].desc }}</span>
                            <span class="latest-progress-time">({{ task.history[task.history.length-1].time }})</span>
                          </template>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
             </view>
            </view>
            <view class="card">
              <view class="card-title alarm-card-title-flex">
                <span>报警信息</span>
                <view class="alarm-date-picker">
                  <input type="date" v-model="alarmStartDate" class="alarm-date-input" />
                  <span style="margin: 0 6px;">-</span>
                  <input type="date" v-model="alarmEndDate" class="alarm-date-input" />
                </view>
              </view>
              <view class="card-content">
                <view class="alarm-list">
                <view v-for="(alarm, idx) in filteredAlarmList" :key="idx" class="alarm-item">
                  <view class="alarm-main">
                    <span class="alarm-type">{{ alarm.type }}</span>
                    <span class="alarm-status" :class="'status-' + alarm.status">{{ alarm.status }}</span>
                  </view>
                  <view class="alarm-detail">
                    <span class="alarm-time">{{ alarm.time }}</span>
                    <span class="alarm-section">{{ alarm.section }}</span>
                    <span class="alarm-device">{{ alarm.device }}</span>
                  </view>
                </view>
              </view>
              </view>
            </view>
            <view class="card card-shortcut">
              <view class="card-title">快捷入口</view>
              <view class="card-content">
                <view class="shortcut-list">
                <view class="shortcut-btn gradient-blue">
                  <text class="shortcut-icon">🛠️</text>
                  <text class="shortcut-label">设备管理</text>
                </view>
                <view class="shortcut-btn gradient-green">
                  <text class="shortcut-icon">📋</text>
                  <text class="shortcut-label">任务管理</text>
                </view>
                <view class="shortcut-btn gradient-yellow">
                  <text class="shortcut-icon">🎓</text>
                  <text class="shortcut-label">培训考试</text>
                </view>
              </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 设备详情弹窗 -->
      <view class="popup-overlay" v-if="showPopup" @click="closePopup">
        <view class="popup-content" @click.stop>
          <view class="popup-header">
            <text class="popup-title">{{ popupData.section }} - {{ popupData.status }}设备</text>
            <text class="popup-close" @click="closePopup">×</text>
          </view>
          <view class="popup-body">
            <view class="device-list">
              <view class="device-item" v-for="(device, index) in popupData.devices" :key="index">
                <view class="device-header">
                  <view class="device-info">
                    <text class="device-name">{{ device.name }}</text>
                    <text class="device-desc">{{ device.description }}</text>
                  </view>
                  <view class="device-status" :class="'status-' + device.statusType">
                    <text>{{ device.statusText }}</text>
                  </view>
                </view>
                <view class="device-details">
                  <view class="detail-row">
                    <text class="detail-label">原因：</text>
                    <text class="detail-value">{{ device.reason }}</text>
                  </view>
                  <view class="detail-row">
                    <text class="detail-label">时间：</text>
                    <text class="detail-value">{{ device.time }}</text>
                  </view>
                  <view class="detail-row">
                    <text class="detail-label">负责人：</text>
                    <text class="detail-value">{{ device.admin }} / {{ device.worker }}</text>
                  </view>
                  <view class="detail-row">
                    <text class="detail-label">进度：</text>
                    <view class="progress-section">
                      <view class="progress-container">
                        <view class="progress-bar-bg-small">
                          <view class="progress-bar-small" :style="{width: device.progressPercent + '%'}"></view>
                        </view>
                        <text class="progress-text-small">{{ device.progressPercent }}%</text>
                      </view>
                      <text class="progress-description">{{ device.progressTxt }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 出勤详情弹窗 -->
      <view class="popup-overlay" v-if="showAttendancePopup" @click="closeAttendancePopup">
        <view class="popup-content" @click.stop>
          <view class="popup-header">
            <text class="popup-title">{{ attendancePopupData.title }}</text>
            <text class="popup-close" @click="closeAttendancePopup">×</text>
          </view>
          <view class="popup-body">
            <view v-if="attendancePopupData.devices && attendancePopupData.devices.length">
              <view class="device-list">
                <view class="device-item" v-for="(device, index) in attendancePopupData.devices" :key="index">
                  <view class="device-header">
                    <view class="device-info">
                      <text class="device-name">{{ device.name }}</text>
                      <text class="device-desc">{{ device.description }}</text>
                    </view>
                    <view class="device-status" :class="'status-' + device.statusType">
                      <text>{{ device.statusText }}</text>
                    </view>
                  </view>
                  <view class="device-details">
                    <view class="detail-row">
                      <text class="detail-label">工段：</text>
                      <text class="detail-value">{{ device.section }}</text>
                    </view>
                    <view class="detail-row">
                      <text class="detail-label">原因：</text>
                      <text class="detail-value">{{ device.reason }}</text>
                    </view>
                    <view class="detail-row">
                      <text class="detail-label">时间：</text>
                      <text class="detail-value">{{ device.time }}</text>
                    </view>
                    <view class="detail-row">
                      <text class="detail-label">负责人：</text>
                      <text class="detail-value">{{ device.admin }} / {{ device.worker }}</text>
                    </view>
                    <view class="detail-row">
                      <text class="detail-label">进度：</text>
                      <view class="progress-section">
                        <view class="progress-container">
                          <view class="progress-bar-bg-small">
                            <view class="progress-bar-small" :style="{width: device.progressPercent + '%'}"></view>
                          </view>
                          <text class="progress-text-small">{{ device.progressPercent }}%</text>
                        </view>
                        <text class="progress-description">{{ device.progressTxt }}</text>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view v-else>
              <text>该员工负责的设备运行正常</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 任务详情弹窗 -->
      <view class="popup-overlay" v-if="showTaskPopup" @click="closeTaskPopup">
        <view class="popup-content task-popup-content" @click.stop>
          <view class="popup-header">
            <text class="popup-title">{{ taskPopupData.section }} - {{ taskPopupData.name }}</text>
            <text class="popup-close" @click="closeTaskPopup">×</text>
          </view>
          <view class="popup-body task-popup-body">
            <view class="task-info-block">
              <view class="task-detail-row">
                <text class="detail-label">任务类型：</text>
                <text class="detail-value">{{ taskPopupData.type === 'periodic' ? '周期任务' : '重点任务' }}</text>
              </view>
              <view class="task-detail-row">
                <text class="detail-label">任务名称：</text>
                <text class="detail-value">{{ taskPopupData.name }}</text>
              </view>
              <view v-if="taskPopupData.type === 'periodic'">
                <view class="task-detail-row">
                  <text class="detail-label">负责人类型：</text>
                  <text class="detail-value">{{ taskPopupData.ownerType }}</text>
                </view>
                <view class="task-detail-row">
                  <text class="detail-label">进度：</text>
                  <text class="detail-value">{{ taskPopupData.progress }}%（{{ taskPopupData.finished }}/{{ taskPopupData.total }}）</text>
                </view>
              </view>
              <view v-else>
                <view class="task-detail-row">
                  <text class="detail-label">开始时间：</text>
                  <text class="detail-value">{{ taskPopupData.startTime }}</text>
                </view>
                <view class="task-detail-row">
                  <text class="detail-label">负责人：</text>
                  <text class="detail-value">{{ taskPopupData.owner }}</text>
                </view>
              </view>
            </view>
            <view v-if="taskPopupData.type === 'periodic'">
              <view class="task-history-block">
                <view class="history-title">未完成人员</view>
                <view class="history-list">
                  <view class="history-item" v-for="(name, idx) in taskPopupData.unfinishedList" :key="idx">
                    <span class="history-desc">{{ name }}</span>
                  </view>
                  <view v-if="!taskPopupData.unfinishedList || taskPopupData.unfinishedList.length === 0" class="history-item">
                    <span class="history-desc">全部已完成</span>
                  </view>
                </view>
              </view>
            </view>
            <view v-else-if="taskPopupData.history && taskPopupData.history.length">
              <view class="task-history-block">
                <view class="history-title">历史进度</view>
                <view class="history-list">
                  <template v-for="(h, idx) in [...taskPopupData.history].reverse()" :key="idx">
                    <view
                      class="history-item"
                      :class="{ 'latest-history-item': h.isLatest && idx === 0 }"
                    >
                      <p class="history-time-progress">
                        <span class="history-time">{{ h.time }}</span>
                        <span class="history-progress">{{ h.progress }}</span>
                      </p>
                      <span class="history-desc">{{ h.desc }}</span>
                    </view>
                  </template>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </template>
  
  <script setup>
  import { ref,onMounted,reactive,onUnmounted,computed  } from 'vue';
  
  import {
    sidebarMenuList as rawSidebarMenuList,
    deviceOperationCategories,
    attendanceDetails,
    deviceStatusData as rawDeviceStatusData,
    sectionTasks,
    alarmList
  } from '@/utils/mockData.js';

  // 时间筛选相关
  const alarmStartDate = ref('');
  const alarmEndDate = ref('');

  function filterAlarmsByDate(list) {
    if (!alarmStartDate.value || !alarmEndDate.value) return list.filter(alarm => alarm.status !== '已处理');
    return list.filter(alarm => {
      const alarmDate = alarm.time.split(' ')[0];
      return alarm.status !== '已处理' && alarmDate >= alarmStartDate.value && alarmDate <= alarmEndDate.value;
    });
  }
  const filteredAlarmList = computed(() => filterAlarmsByDate(alarmList));

  const deviceStatusData = reactive(rawDeviceStatusData);

  const greeting = ref('');
  const showPopup = ref(false);
  const popupData = ref({
    section: '',
    status: '',
    devices: []
  });

  const showAttendancePopup = ref(false);
  const attendancePopupData = ref({
    title: '',
    people: []
  });

  const expandedSection = ref(null); // 当前展开的工段
  const showTaskPopup = ref(false);
  const taskPopupData = ref({}); // 弹窗任务数据
  const expandedPeriodicTasks = ref([]); // 展开的周期任务工段

  function toggleSection(section) {
    expandedSection.value = expandedSection.value === section ? null : section;
  }
  
  function showTaskDetail(task, section, type) {
    taskPopupData.value = { ...task, section, type };
    showTaskPopup.value = true;
  }
  
  function closeTaskPopup() {
    showTaskPopup.value = false;
  }

  function togglePeriodicTasks(section) {
    const index = expandedPeriodicTasks.value.indexOf(section);
    if (index > -1) {
      expandedPeriodicTasks.value.splice(index, 1);
    } else {
      expandedPeriodicTasks.value.push(section);
    }
  }

  //辅助函数：获取员工负责的有问题设备
  function getEmployeeProblemDevices(employeeName) {
  const result = [];
  deviceStatusData.forEach(section => {
    section.statuses.forEach(status => {
      if (status.name === '停机' || status.name === '故障') {
        status.devices.forEach(device => {
          if (device.admin === employeeName || device.worker === employeeName) {
            result.push({
              ...device,
              section: section.name,
              status: status.name
            });
          }
        });
      }
    });
  });
  return result;
}

// 管理员出勤列表
const adminAbsentList = computed(() => {
  // 遍历所有工段
  let list = [];
  Object.entries(attendanceDetails.admin).forEach(([section, { absent }]) => {
    absent.forEach(person => {
      const problemDevices = getEmployeeProblemDevices(person.name);
      list.push({
        ...person,
        section,
        hasProblem: problemDevices.length > 0,
        problemDevices
      });
    });
  });
  // 有问题的排前面
  return list.sort((a, b) => Number(b.hasProblem) - Number(a.hasProblem));
});

// 保全工出勤列表
const workerAbsentList = computed(() => {
  let list = [];
  Object.entries(attendanceDetails.worker).forEach(([section, { absent }]) => {
    absent.forEach(person => {
      const problemDevices = getEmployeeProblemDevices(person.name);
      list.push({
        ...person,
        section,
        hasProblem: problemDevices.length > 0,
        problemDevices
      });
    });
  });
  return list.sort((a, b) => Number(b.hasProblem) - Number(a.hasProblem));
});


// 弹窗显示员工负责的有问题设备
function showEmployeeProblemDevices(person) {
  attendancePopupData.value = {
    title: `${person.name}（${person.section}）负责的问题设备`,
    people: [], // 不用
    devices: person.problemDevices
  };
  showAttendancePopup.value = true;
}


  // 关闭出勤详情弹窗
  function closeAttendancePopup() {
    showAttendancePopup.value = false;
  }

  // 计算柱状图宽度
  function getBarWidth(count, maxCount, type) {
    let percentage;
    
    if (type === 'stopped') {
      // 停机设备：超过5个后不再增加宽度
      if (count <= 5) {
        percentage = (count / 5) * 10; // 0-5个设备占10%宽度
      } else {
        percentage = 10; // 超过5个固定10%宽度
      }
    } else if (type === 'error') {
      // 故障设备：使用对数函数让增长速度变慢，最大70%
      percentage = Math.min(70, Math.log(count + 1) * 20);
    } else {
      // 其他状态使用默认计算
      percentage = (count / maxCount) * 100;
    }
    
    return Math.max(percentage, 8) + '%'; // 最小宽度8%
  }

  // 显示设备详情弹窗
  function showDeviceDetail(section, status, devices) {
    popupData.value = {
      section: section,
      status: status,
      devices: devices
    };
    showPopup.value = true;
  }

  // 关闭弹窗
  function closePopup() {
    showPopup.value = false;
  }
  
 
  // 获取问候语
  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  }


  onMounted(() => {
    greeting.value = getGreeting();
  });

  

  </script> 
  
  <style scoped>
  .dashboard-root {
    display: flex;
    min-height: 100vh;
    background: #f8f8f8;
  }
  
  .main-content {
    box-sizing: border-box;
    height: 100%;
    overflow: hidden;
    flex: 1;
    padding: 36px 36px 24px 36px;
    display: flex;
    flex-direction: column;
  }
  .main-header {
    margin-bottom: 18px;
  }
  .welcome {
    font-size: 22px;
    font-weight: bold;
    color: #222;
    margin-right: 18px;
  }
  .subtitle {
    font-size: 16px;
    color: #888;
  }
  .main-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .card-row {
    display: flex;
    flex-direction: row;
    gap: 24px;
  }
  .card {
    max-height: 800rpx;
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 4px 24px rgba(52,120,246,0.06);
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: #3478f6;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
  }
  .card-title-count {
    font-size: 14px;
    font-weight: 400;
    color: #999;
    margin-left: 10px;
  } 

  .absent-list-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    margin-bottom: 6px;
    border-radius: 6px;
    background: #f4f8ff;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;
    border-left: 4px solid transparent;
}
.absent-list-item:hover {
  background: #e8f0fe;
  box-shadow: 0 2px 8px rgba(52,120,246,0.08);
}
.absent-list-item.has-problem {
  background: #fffdf0; 
}
.absent-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  min-width: 60px;
}
.absent-section {
  font-size: 14px;
  color: #888;
  min-width: 40px;
  margin: 0 10px;
}
.absent-reason {
  font-size: 13px;
  color: #999;
  min-width: 70px;
  text-align: center;
}
.absent-problem {
  font-size: 13px;
  color: #999;
  padding: 2px 10px;
  border-radius: 10px;
  background: #f0f0f0;
  min-width: 70px;
  text-align: center;
  transition: background 0.2s, color 0.2s;
}
.absent-problem.problem {
  color: #fff;
  background: #ff4d4f;
  font-weight: 600;
}

  .card-chart {
    flex: 2.2;
    align-items: center;
    min-width: 220px;
  }
  .chart-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .chart-section {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .section-label {
    font-size: 14px;
    font-weight: 500;
    color: #333;
    min-width: 40px;
    text-align: right;
  }
  .bar-container {
    flex: 1;
    display: flex;
    gap: 4px;
    height: 24px;
    border-radius: 12px;
    overflow: hidden;
    background: #f0f0f0;
  }
  .bar-item {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }
  .bar-item:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
  .bar-item.status-stopped {
    background: #b0b8d0;
  }
  .bar-item.status-error {
    background: #ff4d4f;
  }
  .bar-count {
    font-size: 12px;
    font-weight: 600;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  }
  .chart-legend {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 8px;
  }
  .legend-item {
    font-size: 14px;
    color: #666;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 4px;
  }
  .dot.running { background: #34c759; }
  .dot.stopped { background: #b0b8d0; }
  .dot.error { background: #ff4d4f; }
  .card-overview {
    flex: 1;
    min-width: 200px;
  }
  .card-content{
    overflow: auto;
    padding-right: 4px;
  }

  /* 滚动条整体 */
.card-content::-webkit-scrollbar {
  width: 8px;
  background: transparent;
}

/* 滚动条滑块 */
.card-content::-webkit-scrollbar-thumb {
  background: #dbeafe;
  border-radius: 6px;
  transition: background 0.2s;
}

/* 滚动条滑块悬浮时 */
.card-content::-webkit-scrollbar-thumb:hover {
  background: #b6d0f7;
}

/* 滚动条轨道 */
.card-content::-webkit-scrollbar-track {
  background: transparent;
}

/* 火狐浏览器 */
.card-content {
  scrollbar-width: thin;
  scrollbar-color: #dbeafe transparent;
}

  .chart-placeholder {
    width: 100%;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f9fa;
    border-radius: 8px;
    color: #999;
    font-size: 14px;
  }


  .card-task {
    flex: 2;
  }
  .task-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .section-item {
    font-size: 15px;
    color: #222;
    background: linear-gradient(135deg, #f4f8ff 0%, #e8f0fe 100%);
    border: 1.5px solid #dbeafe;
    border-radius: 10px;
    padding: 12px 18px;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(.4,0,.2,1);
    position: relative;
    font-weight: 600;
    margin-bottom: 2px;
    box-shadow: 0 2px 8px rgba(52,120,246,0.06);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .section-item:hover {
    background: linear-gradient(135deg, #e8f0fe 0%, #dbeafe 100%);
    border-color: #3478f6;
    box-shadow: 0 4px 16px rgba(52,120,246,0.10);
  }
  .section-item span:last-child {
    font-size: 13px;
    color: #3478f6;
    transition: transform 0.2s;
  }
  .section-item-title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .task-item {
    background: #fff;
    border: 1px solid #ececec;
    border-radius: 7px;
    box-shadow: none;
    padding: 12px 16px;
    margin: 6px 0 6px 24px;
    transition: background 0.2s, border-color 0.2s;
    cursor: pointer;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    min-height: 48px;
  }
  .task-item:hover {
    background: #f7faff;
    border-color: #b6d0f7;
  }
  .task-main-row {
    font-size: 15px;
    font-weight: 500;
    color: #222;
    margin-bottom: 4px;
    gap: 12px;
  }
  .task-latest-progress-row {
    font-size: 13px;
    color: #3478f6;
    gap: 4px;
    line-height: 1.6;
  }
  .task-owner {
    color: #888;
    font-size: 13px;
    margin-left: 10px;
    font-weight: 400;
  }
  .task-item-label {
    color: #888;
    font-size: 15px;
  }
  .latest-progress-desc {
    color: #3478f6;
    font-weight: 500;
  }
  .latest-progress-time {
    color: #bbb;
    margin-left: 2px;
  }
  .progress-bar-bg {
    width: 100%;
    height: 14px;
    background: #e0e7ff;
    border-radius: 7px;
    margin: 10px 0 6px 0;
    overflow: hidden;
  }
  .progress-bar {
    height: 100%;
    background: #3478f6;
    border-radius: 7px 0 0 7px;
    transition: width 0.3s;
  }
  .progress-text {
    font-size: 14px;
    color: #3478f6;
    text-align: right;
  }
  .card-shortcut {
    flex: 1;
  }
  .shortcut-list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    gap: 16px;
    margin-top: 8px;
    justify-content: flex-start;
  }
  .shortcut-btn {
    flex: 1 1 110px;
    min-width: 90px;
    max-width: 160px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px 0 10px 0;
    border-radius: 12px;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(52,120,246,0.10);
    cursor: pointer;
    transition:  box-shadow 0.15s;
    position: relative;
    margin-bottom: 8px;
  }
  .shortcut-btn:active {
    box-shadow: 0 1px 4px rgba(52,120,246,0.08);
  }
  .shortcut-icon {
    font-size: 26px;
    margin-bottom: 6px;
  }
  .shortcut-label {
    font-size: 15px;
    font-weight: 500;
    letter-spacing: 1px;
  }
  .gradient-blue {
    background: linear-gradient(135deg, #3478f6 0%, #5fcfff 100%);
  }
  .gradient-green {
    background: linear-gradient(135deg, #34c759 0%, #a8ff78 100%);
  }
  .gradient-yellow {
    background: linear-gradient(135deg, #fffdfa 0%, #fffbe0 100%);
    color: #ad6800;
  }

  /* 弹窗样式 */
  .popup-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .popup-content {
    background: #fff;
    border-radius: 16px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }
  .popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #f0f0f0;
    background: #f8f9fa;
  }
  .popup-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
  .popup-close {
    font-size: 24px;
    color: #999;
    cursor: pointer;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background 0.2s;
  }
  .popup-close:hover {
    background: #f0f0f0;
  }
  .popup-body {
    padding: 20px 24px;
    max-height: 60vh;
    overflow-y: auto;
  }
  .device-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .device-item {
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #ddd;
    margin-bottom: 12px;
  }
  .device-item .device-status.status-stopped {
    border-left-color: #b0b8d0;
  }
  .device-item .device-status.status-error {
    border-left-color: #ff4d4f;
  }
  .device-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }
  .device-info {
    flex: 1;
  }
  .device-name {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    display: block;
    margin-bottom: 4px;
  }
  .device-desc {
    font-size: 14px;
    color: #666;
  }
  .device-status {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    color: #fff;
    white-space: nowrap;
  }
  .device-status.status-stopped {
    background: #b0b8d0;
  }
  .device-status.status-error {
    background: #ff4d4f;
  }
  .device-status.status-absent {
    background: #ff9500;
  }
  .device-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .detail-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .detail-label {
    font-size: 13px;
    color: #666;
    min-width: 50px;
  }
  .detail-value {
    font-size: 13px;
    color: #333;
    flex: 1;
  }
  .progress-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
  }
  .progress-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .progress-bar-bg-small {
    width: 100%;
    height: 6px;
    background: #e0e7ff;
    border-radius: 3px;
    overflow: hidden;
    flex: 1;
  }
  .progress-bar-small {
    height: 100%;
    background: #3478f6;
    border-radius: 3px;
    transition: width 0.3s ease;
  }
  .progress-text-small {
    font-size: 12px;
    color: #3478f6;
    font-weight: 500;
    min-width: 35px;
  }
  .progress-description {
    font-size: 13px;
    color: #666;
    line-height: 1.4;
  }

  /* 出勤详情弹窗样式 */
  .attendance-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .attendance-item {
    padding: 16px;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .attendance-item .person-info {
    display: flex;
    flex-direction: column;
  }
  .attendance-item .person-name {
    font-size: 16px;
    font-weight: 500;
    color: #333;
    margin-bottom: 4px;
  }
  .attendance-item .person-role {
    font-size: 14px;
    color: #666;
  }
  .attendance-status {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    color: #fff;
    white-space: nowrap;
  }
  .attendance-status.status-present {
    background: #34c759;
  }
  .attendance-status.status-absent {
    background: #ff9500;
  }
  .attendance-status.status-late {
    background: #ffc107;
  }
  .attendance-status.status-leave {
    background: #1890ff;
  }
  .attendance-reason {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #666;
    margin-top: 8px;
  }
  .reason-label {
    font-weight: 500;
  }
  .reason-text {
    font-style: italic;
  }

  /* 任务详情弹窗样式 */
  .task-item.periodic-task {
    background: #f8faff;
    border: 1px solid #e8f0fe;
    border-radius: 8px;
    padding: 10px 16px;
    margin: 6px 0 6px 24px;
    box-shadow: 0 2px 8px rgba(52,120,246,0.04);
    transition: all 0.2s cubic-bezier(.4,0,.2,1);
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .task-item.periodic-task:hover {
    background: #f8faff;
    border-color: #3478f6;
    box-shadow: 0 4px 12px rgba(52,120,246,0.10);
  }
  .task-item.key-task {
    background: #fffdfa;
    border: 1px solid #fffbe0;
    border-radius: 8px;
    padding: 10px 16px;
    margin: 6px 0 6px 24px;
    box-shadow: 0 2px 8px rgba(255,214,102,0.3);
    transition: all 0.2s cubic-bezier(.4,0,.2,1);
    cursor: pointer;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .task-item.key-task:hover {
    background: #fffbe6;
    border-color: #ffe58f;
    box-shadow: 0 2px 8px rgba(255,15,102,0.3);
  }
  .task-item.periodic-task span:first-child {
    font-size: 13px;
    color: #333;
    font-weight: 500;
  }
  .task-item.periodic-task span:last-child {
    font-size: 13px;
    color: #3478f6;
    font-weight: 600;
    background: #e8f0fe;
    padding: 2px 10px;
    border-radius: 12px;
    margin-left: 10px;
    min-width: 38px;
    text-align: right;
    transition: background 0.2s, color 0.2s, transform 0.2s;
  }
  .task-item.periodic-task:hover span:last-child {
    background: #3478f6;
    color: #fff;
  }
  .task-item.key-task span:first-child {
    font-size: 13px;
    color: #333;
    font-weight: 500;
  }
  .task-item.key-task span:last-child {
    font-size: 12px;
    color: #a5a5a5;
    font-weight: 500;
    padding: 4px 8px;
    border-radius: 8px;
    margin-left: 10px;
    max-width: 120px;
    text-align: center;
    line-height: 1.3;
    transition: background 0.2s, color 0.2s, transform 0.2s;
  }
  .task-category-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 15px;
    color: #333;
    font-weight: 500;
    padding: 8px 12px;
    background: #f8f9fa;
    border-radius: 6px;
    border-left:3px solid #3478f6;
  }
  .category-text {
    color: #949494;
  }
  .toggle-periodic {
    font-size: 13px;
    color: #3478f6;
    cursor: pointer;
    margin-left: auto;
    padding: 2px 8px;
    background: #e8f0fe;
    border-radius: 12px;
    transition: all 0.2s;
    font-weight: 600;
  }
  .toggle-periodic:hover {
    background: #3478f6;
    color: #fff;
  }
  .periodic-tasks-list {
    padding-left: 16px;
    margin-bottom: 12px;
    border-left:2px solid #e8f0fe;
  }
  .key-tasks-section {
    margin-top: 16px;
  }
  .key-tasks-list {
    padding-left: 16px;
    border-left:2px solid #ffd666;
  }
  .alarm-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 4px;
  }
  .alarm-item {
    background: #fffdfa;
    border: 1px solid #fffbe0;
    border-radius: 8px;
    padding: 10px 14px;
    box-shadow: 0 1px 4px rgba(255,214,102,0.10);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .alarm-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .alarm-type {
    font-size: 15px;
    font-weight: 700;
    color: #ff9500;
  }
  .alarm-status {
    font-size: 13px;
    font-weight: 600;
    padding: 2px 10px;
    border-radius: 12px;
    background: #fffbe0;
    color: #ad6800;
  }
  .alarm-status.status-未处理 {
    background: #fff0e0;
    color: #ff4d4f;
  }
  .alarm-status.status-处理中 {
    background: #e6f7ff;
    color: #1890ff;
  }
  .alarm-status.status-已处理 {
    background: #e6ffed;
    color: #52c41a;
  }
  .alarm-detail {
    display: flex;
    gap: 16px;
    font-size: 13px;
    color: #888;
    margin-top: 2px;
  }
  .alarm-time {
    min-width: 110px;
  }
  .alarm-section {
    min-width: 40px;
  }
  .alarm-device {
    min-width: 80px;
  }
  .alarm-card-title-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .alarm-date-picker {
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .alarm-date-input {
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    padding: 2px 6px;
    font-size: 13px;
    color: #333;
    background: #fff;
    outline: none;
    transition: border 0.2s;
  }
  .alarm-date-input:focus {
    border: 1.5px solid #3478f6;
  }
  .task-detail-row {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 12px;
  }
  .task-detail-row .detail-label {
    font-size: 14px;
    color: #888;
    min-width: 70px;
  }
  .task-detail-row .detail-value {
    font-size: 14px;
    color: #333;
    flex: 1;
    word-break: break-all;
  }
  .task-popup-content {
    max-width: 480px;
    min-width: 320px;
  }
  .task-popup-body {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .task-info-block {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 14px 12px 10px 12px;
    margin-bottom: 0;
  }
  .task-history-block {
    background: #fffdfa;
    border-radius: 8px;
    padding: 12px 12px 8px 12px;
    border: 1px solid #fffbe0;
  }
  .history-title {
    font-size: 15px;
    font-weight: 700;
    color: #ad6800;
    margin-bottom: 8px;
  }
  .history-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .history-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: #666;
    background: #fffbe6;
    border-radius: 6px;
    padding: 6px 8px;
  }
  .history-time {
    color: #ad6800;
    font-weight: 600;
    min-width: 80px;
  }
  .history-progress {
    color: #3478f6;
    font-weight: 600;
    min-width: 48px;
  }
  .history-desc {
    flex: 1;
    color: #666;
    word-break: break-all;
  }
  .history-time-progress {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
  }
  .task-latest-progress {
    color: #3478f6;
    font-size: 13px;
    margin-left: 10px;
  }
  .latest-progress-label {
    color: #888;
    font-weight: 500;
  }
  .latest-progress-desc {
    color: #6078a5;
    font-weight: 600;
  }
  .latest-progress-time {
    color: #bbb;
    margin-left: 2px;
  }
  .history-item.latest-history-item {
    background: #e6f7ff;
    border: 1.5px solid #1890ff;
    color: #222;
    font-weight: 600;
    position: relative;
  }
  .history-latest-badge {
    background: #1890ff;
    color: #fff;
    font-size: 12px;
    border-radius: 8px;
    padding: 2px 8px;
    margin-left: 10px;
    font-weight: 600;
  }
  .task-main-row {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  .task-latest-progress-row {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 6px;
    font-size: 13px;
    color: #3478f6;
    margin-bottom: 2px;
    line-height: 1.6;
  }
  .task-item {
    flex-direction: column;
    align-items: flex-start;
    padding-top: 12px;
    padding-bottom: 12px;
    min-height: 56px;
  }

  @media (max-width: 900px) {
    .main-content{
      padding: 12px 2vw 8px 2vw;
    }
    .card-title{
      flex-direction: column;
      align-items: center;
    }
    .card-title-count{
      margin: 0;
    }
    .card-row{
      flex-direction: column;
    }
    .popup-content {
      width: 95%;
      margin: 20px;
    }
  }
  </style> 