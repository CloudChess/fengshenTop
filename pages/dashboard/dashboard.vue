<template>
    <view class="dashboard-root">
      <!-- 左侧导航栏 -->
      <view :class="['sidebar', sidebarCollapsed===true ? 'collapsed' : '', appCollapsed===true ? 'appCollapsed' : '']">
        <view :class="['sidebar-logo',appCollapsed===true?'appCollapsed':'']">
          <Logo class="logo-img" />
          <text :class="['logo-title',appCollapsed===true?'appCollapsed':'']" v-show="sidebarCollapsed!==true">XX部设备部门</text>
        </view>
        <view :class="['sidebar-menu',appCollapsed===true?'appCollapsed':'']">
            <view class="menu-item-container" v-for="(item,index) in sidebarMenuList" :key="index" @click="toggleSidebApp">
                <view :class="['menu-item',activeIndex==index?'active':'']" @click="activeIndex = index" v-show="appCollapsed===null||(sidebarCollapsed===null && appCollapsed===true && activeIndex==index)||(sidebarCollapsed===null && appCollapsed===false)">
                    <text class="menu-icon">{{ item.icon }}</text>
                    <text class="menu-text" v-show="sidebarCollapsed!==true">{{ item.name }}</text>
                </view>
            </view>
        </view>
        <view class="sidebar-toggle" @click="toggleSidebar">
          <text>{{ sidebarCollapsed ? '→' : '←' }}</text>
        </view>
        <view class="sidebar-user" :class="appCollapsed===true?'appCollapsed':''" >
          <view class="user-avatar">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#dbeafe"/>
              <circle cx="16" cy="13" r="6" fill="#b6d0f7"/>
              <ellipse cx="16" cy="24" rx="9" ry="5" fill="#b6d0f7"/>
            </svg>
          </view>
          <view :class="['user-info', sidebarCollapsed===true ? 'collapsed' : '',appCollapsed===true ?'appCollapsed':'']">
            <text class="user-name">张三</text>
            <text class="user-role">领导</text>
          </view>
        </view>
      </view>
  
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
              <view class="task-list">
                <view
                  v-for="(section, idx) in sectionTasks"
                  :key="section.section"
                  class="section-item"
                  @click="toggleSection(section.section)"
                  :style="{ cursor: 'pointer', fontWeight: expandedSection === section.section ? 'bold' : 'normal' }"
                >
                  {{ section.section }}
                  <span style="float:right;">{{ expandedSection === section.section ? '▲' : '▼' }}</span>
                  <view
                    v-if="expandedSection === section.section"
                    v-for="task in section.tasks"
                    :key="task.name"
                    class="task-item"
                    @click.stop="showTaskDetail(task, section.section)"
                    >
                    <span>{{ task.name }}</span>
                    <span style="float:right;">{{ task.progress }}%</span>
                  </view>
                </view>
              </view>
            </view>
            <view class="card card-progress">
              <view class="card-title">维修进度</view>
              <view class="progress-bar-bg">
                <view class="progress-bar" :style="{width: '70%'}"></view>
              </view>
              <view class="progress-text">70%</view>
            </view>
            <view class="card card-shortcut">
              <view class="card-title">快捷入口</view>
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
    </view>
  </template>
  
  <script setup>
  import { ref,onMounted,reactive,onUnmounted,computed  } from 'vue';
  import Logo from '../../components/Logo/Logo.vue';
  import {
    sidebarMenuList as rawSidebarMenuList,
    deviceOperationCategories,
    attendanceDetails,
    deviceStatusData as rawDeviceStatusData,
    sectionTasks
  } from './mockDashboardData.js';

  const deviceStatusData = reactive(rawDeviceStatusData);
  const sidebarMenuList = reactive(rawSidebarMenuList);

  const isMobileScreen = ref(window.innerWidth < 900);
  const sidebarCollapsed = ref(false);
  const appCollapsed = ref(false);
  const greeting = ref('');
  const activeIndex = ref(0);
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

  function toggleSection(section) {
    expandedSection.value = expandedSection.value === section ? null : section;
  }
  
  function showTaskDetail(task, section) {
    taskPopupData.value = { ...task, section };
    showTaskPopup.value = true;
  }
  
  function closeTaskPopup() {
    showTaskPopup.value = false;
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
  
  // 手动 收缩宽屏时的 Sidebar
  function toggleSidebar() {
    if(appCollapsed.value===null){
      sidebarCollapsed.value = !sidebarCollapsed.value;
    }
    
  }
  // 手动 收缩窄屏时的 Sidebar
  function toggleSidebApp() {
    if(sidebarCollapsed.value===null){
      appCollapsed.value = !appCollapsed.value;
    }
  }
  // 获取问候语
  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  }

  // 监听窗口大小变化
  function handleResize() {
    isMobileScreen.value = window.innerWidth < 900;
    if (isMobileScreen.value) {
      appCollapsed.value = true; // 宽屏锁定
      sidebarCollapsed.value = null;
    } else {
      sidebarCollapsed.value = true; // 窄屏锁定
      appCollapsed.value = null;
    }
  }

  onMounted(() => {
    greeting.value = getGreeting();
    handleResize();
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  </script> 
  
  <style scoped>
  .dashboard-root {
    display: flex;
    min-height: 100vh;
    background: #f8f8f8;
  }
  .sidebar {
    width: 220px;
    background: #fff;
    box-shadow: 2px 0 12px rgba(52,120,246,0.06);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 0 24px 0;
    transition: all 0.2s;
    position: relative;
  }
  .sidebar.collapsed {
    width: 64px;
    min-width: 64px;
    align-items: flex-start;
  }
  
  .sidebar-logo {
    display: flex;
    align-items: center;
    margin: 32px 0 24px 0;
    justify-content: center;
  }
  .sidebar.collapsed .sidebar-logo {
    justify-content: flex-start;
    margin-left: 10px;
  }
  .logo-img {
    width: 38px;
    height: 38px;
    border-radius: 8px;
    margin-right: 10px;
  }
  .logo-title {
    font-size: 20px;
    font-weight: bold;
    color: #3478f6;
    letter-spacing: 1px;
  }
  .sidebar-menu {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .menu-item {
    width: 90%;
    padding: 8px 0 8px 24px;
    font-size: 16px;
    color: #333;
    cursor: pointer;
    border-left: 3px solid transparent;
    transition: background 0.2s, border-color 0.2s, padding 0.2s;
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 1;
  }
  .menu-icon {
    font-size: 18px;
    width: 32px;
    text-align: center;
    margin-right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .sidebar.collapsed .menu-item {
    padding: 8px 0 8px 0;
    justify-content: center;
  }
  .menu-item.active {
    background: #e8f0fe;
    color: #3478f6;
    border-left: 3px solid #3478f6;
    font-weight: bold;
  }
  .sidebar.collapsed .menu-item.active::before {
    width: 4px;
    left: 0;
  }
  .sidebar-toggle {
    width: 100%;
    text-align: right;
    padding: 6px 18px 6px 0;
    color: #3478f6;
    font-size: 18px;
    cursor: pointer;
    user-select: none;
  }
  .sidebar.collapsed .sidebar-toggle {
    text-align: center;
    padding: 6px 0;
  }
  .sidebar-user {
    display: flex;
    align-items: center;
    margin-top: 24px;
    background: #f4f8ff;
    border-radius: 8px;
    padding: 10px 16px;
    transition: padding 0.2s;
  }
  .sidebar.collapsed .sidebar-user {
    padding: 10px 8px;
  }
  .sidebar.app-collapsed .sidebar-user {
    width: 80px;
  }
  .user-avatar {
    width: 38px;
    height: 38px;
    background: #dbeafe;
    border-radius: 50%;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .user-info {
    display: flex;
    flex-direction: column;
  }
  .user-info.collapsed{
    display: none;
  }
  .user-name {
    font-size: 15px;
    font-weight: 600;
    color: #222;
  }
  .user-role {
    font-size: 13px;
    color: #888;
  }
  .main-content {
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
    gap: 12px;
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
    transform: scale(1.02);
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
    max-height: 220px;
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
    gap: 8px;
  }
  .section-item {
    font-size: 14px;
    color: #555;
    background: #f4f8ff;
    border-radius: 6px;
    padding: 6px 12px;
  }
  .card-progress {
    flex: 1.2;
    align-items: center;
    justify-content: center;
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
    align-items: center;
    justify-content: center;
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
    transition: transform 0.15s, box-shadow 0.15s;
    position: relative;
    margin-bottom: 8px;
  }
  .shortcut-btn:active {
    transform: scale(0.97);
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
    background: linear-gradient(135deg, #ffe58f 0%, #ffd666 100%);
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

  @media (max-width: 1100px) and (min-width: 900px) {
    .logo-title{
      display: none;
    }
    .main-content {
      padding: 36px 2vw 12px 100px;
    }
    .card-row {
      flex-direction: column;
      gap: 18px;
    }
    .sidebar {
      width: 64px;
      height: 98vh;
      min-width: 64px;
      padding-bottom: 24px;
      align-items: center;
      position: fixed;
    }
    .menu-item {
      width: 100%;
      min-width: 0;
      max-width: 100%;
      justify-content: center;
      padding: 8px 0 8px 0;
    }
    .menu-item text:not(.menu-icon) {
      display: none;
    }
    .user-avatar {
      margin-right: 0;
    }
    .user-info {
      display: none;
    }
    .sidebar-user {
      justify-content: center;
      padding: 10px 0;
    }
    .sidebar-toggle{
        display: none;
    }
  }
  @media (max-width: 900px) {
    .dashboard-root {
      flex-direction: column;
    }
    .sidebar {
      width: 98vw;
      min-width: 0;
      flex-direction: column;
      justify-content: space-between;
      padding-bottom: 10px;
      box-shadow: 0 2px 12px rgba(52,120,246,0.06);
      position: relative;
    }
    .sidebar.appCollapsed{
      width: 96vw;
      height: 45px;
      padding: 0 10px;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0px 1px 10px #d4d4d4;
    }
    .sidebar-logo.appCollapsed{
      margin: 0;
    }
    .sidebar-menu{  
      margin: 0 10px;
      width: 95%;
    }
    .sidebar-menu.appCollapsed{
      gap: 0;
    }
    .menu-item-container{
      width: 100%;
    }
    .menu-item{
      padding: 10px 0;
      width:100%;
      justify-content: center;
    }
    .menu-item.appCollapsed{
      display: none;
    }
    .menu-text{
      display: block;
    }
    .sidebar-logo {
      margin: 18px 0 12px 0;
    }
    .logo-title.appCollapsed{
      display: none;
    }
    .sidebar-toggle{
        display: none;
    }
    .sidebar-user{
        width: 90%;
        justify-content: flex-end;
    }
    .sidebar-user.appCollapsed{
      background-color:#fff;
      padding: 0;
      width: 30px;
      margin: 0;
    }
    .sidebar-user.appCollapsed .user-avatar{
      height: 30px;
      width: 30px;
      margin: 0;
    }
    .user-info.appCollapsed{
      display: none;
    }
    .main-content{
      padding: 12px 2vw 8px 2vw;
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