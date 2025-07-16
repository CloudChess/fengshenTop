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
          <text class="subtitle">设备部管理驾驶舱</text>
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
              <view class="card-title">管理员出勤</view>
              
            </view>
            <view class="card card-overview">
              <view class="card-title">保全工出勤</view>
              
            </view>
          </view>
          <!-- 下方卡片区 -->
          <view class="card-row">
            <view class="card card-task">
              <view class="card-title">今日任务</view>
              <view class="task-list">
                <view class="task-item">设备巡检（已完成 3/5）</view>
                <view class="task-item">维修任务（进行中 2/4）</view>
                <view class="task-item">异常处理（待处理 1）</view>
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
            <view class="attendance-list">
              <view class="attendance-item" v-for="(person, index) in attendancePopupData.people" :key="index">
                <view class="person-info">
                  <text class="person-name">{{ person.name }}</text>
                  <text class="person-role">{{ person.role }}</text>
                </view>
                <view class="attendance-status" :class="'status-' + person.status">
                  <text>{{ person.statusText }}</text>
                </view>
                <view class="attendance-reason" v-if="person.reason">
                  <text class="reason-label">原因：</text>
                  <text class="reason-text">{{ person.reason }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </template>
  
  <script setup>
  import { ref,onMounted,reactive,onUnmounted } from 'vue';
  import Logo from '../../components/Logo/Logo.vue';
  import StackedBarChart from '../../components/StackedBarChart.vue';

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

  // 设备运行图表数据
  const deviceOperationCategories = ['炼胶', '压出', '成型', '硫化'];
  const deviceOperationSeries = [
    { name: '运行', data: [16, 12, 18, 12] },
    { name: '停机', data: [6, 3, 4, 1] },
    { name: '故障', data: [3, 5, 8, 2] }
  ];
  const deviceOperationColors = ['#34c759', '#b0b8d0', '#ff4d4f'];

  // 管理员出勤图表数据
  const adminAttendanceCategories = ['炼胶', '压出', '成型', '硫化'];
  const adminAttendanceSeries = [
    { name: '出勤', data: [8, 6, 10, 4] },
    { name: '未出勤', data: [2, 1, 2, 1] }
  ];
  const adminAttendanceColors = ['#34c759', '#ff9500'];

  // 保全工出勤图表数据
  const workerAttendanceCategories = ['炼胶', '压出', '成型', '硫化'];
  const workerAttendanceSeries = [
    { name: '出勤', data: [15, 12, 18, 8] },
    { name: '未出勤', data: [3, 2, 4, 2] }
  ];
  const workerAttendanceColors = ['#34c759', '#ff9500'];

  // 出勤详情数据
  const attendanceDetails = {
    admin: {
      '炼胶': {
        absent: [
          { name: '张师傅', role: '管理员', status: 'absent', statusText: '未出勤', reason: '病假' },
          { name: '王师傅', role: '管理员', status: 'absent', statusText: '未出勤', reason: '事假' }
        ]
      },
      '压出': {
        absent: [
          { name: '陈师傅', role: '管理员', status: 'absent', statusText: '未出勤', reason: '病假' }
        ]
      },
      '成型': {
        absent: [
          { name: '杨师傅', role: '管理员', status: 'absent', statusText: '未出勤', reason: '事假' },
          { name: '郭师傅', role: '管理员', status: 'absent', statusText: '未出勤', reason: '年假' }
        ]
      },
      '硫化': {
        absent: [
          { name: '朱师傅', role: '管理员', status: 'absent', statusText: '未出勤', reason: '病假' }
        ]
      }
    },
    worker: {
      '炼胶': {
        absent: [
          { name: '李师傅', role: '保全工', status: 'absent', statusText: '未出勤', reason: '病假' },
          { name: '赵师傅', role: '保全工', status: 'absent', statusText: '未出勤', reason: '事假' },
          { name: '孙师傅', role: '保全工', status: 'absent', statusText: '未出勤', reason: '年假' }
        ]
      },
      '压出': {
        absent: [
          { name: '刘师傅', role: '保全工', status: 'absent', statusText: '未出勤', reason: '病假' },
          { name: '黄师傅', role: '保全工', status: 'absent', statusText: '未出勤', reason: '事假' }
        ]
      },
      '成型': {
        absent: [
          { name: '徐师傅', role: '保全工', status: 'absent', statusText: '未出勤', reason: '病假' },
          { name: '何师傅', role: '保全工', status: 'absent', statusText: '未出勤', reason: '事假' },
          { name: '高师傅', role: '保全工', status: 'absent', statusText: '未出勤', reason: '年假' },
          { name: '唐师傅', role: '保全工', status: 'absent', statusText: '未出勤', reason: '病假' }
        ]
      },
      '硫化': {
        absent: [
          { name: '冯师傅', role: '保全工', status: 'absent', statusText: '未出勤', reason: '病假' },
          { name: '周师傅', role: '保全工', status: 'absent', statusText: '未出勤', reason: '事假' }
        ]
      }
    }
  };

  // 设备运行图表点击事件
  function onDeviceOperationClick(series, groupIdx, sIdx) {
    const section = deviceOperationCategories[groupIdx];
    const status = series.name;
    
    if (status === '停机' || status === '故障') {
      // 显示设备详情
      const devices = deviceStatusData[groupIdx].statuses.find(s => s.name === status)?.devices || [];
      showDeviceDetail(section, status, devices);
    }
  }

  // 管理员出勤图表点击事件
  function onAdminAttendanceClick(series, groupIdx, sIdx) {
    const section = adminAttendanceCategories[groupIdx];
    const status = series.name;
    
    if (status === '未出勤') {
      // 显示管理员未出勤详情
      const absentPeople = attendanceDetails.admin[section]?.absent || [];
      attendancePopupData.value = {
        title: `${section} - 管理员未出勤`,
        people: absentPeople
      };
      showAttendancePopup.value = true;
    }
  }

  // 保全工出勤图表点击事件
  function onWorkerAttendanceClick(series, groupIdx, sIdx) {
    const section = workerAttendanceCategories[groupIdx];
    const status = series.name;
    
    if (status === '未出勤') {
      // 显示保全工未出勤详情
      const absentPeople = attendanceDetails.worker[section]?.absent || [];
      attendancePopupData.value = {
        title: `${section} - 保全工未出勤`,
        people: absentPeople
      };
      showAttendancePopup.value = true;
    }
  }

  // 关闭出勤详情弹窗
  function closeAttendancePopup() {
    showAttendancePopup.value = false;
  }

  // 设备状态数据
  const deviceStatusData = reactive([
    {
      name: '炼胶',
      maxCount: 25,
      statuses: [
        { name: '停机', type: 'stopped', count: 6, devices: [
          { 
            name: '炼胶机A-01', 
            description: '主炼胶设备', 
            statusType: 'stopped', 
            statusText: '停机',
            reason: '设备维护保养',
            time: '2024-01-15 08:30',
            admin: '张师傅',
            worker: '李师傅',
            progressPercent: 80,
            progressTxt: '已完成设备清洁和润滑，正在更换磨损部件'
          },
          { 
            name: '炼胶机A-02', 
            description: '辅助炼胶设备', 
            statusType: 'stopped', 
            statusText: '停机',
            reason: '计划停机检修',
            time: '2024-01-15 09:00',
            admin: '王师傅',
            worker: '赵师傅',
            progressPercent: 60,
            progressTxt: '已拆卸主要部件，正在检查内部结构'
          },
          { 
            name: '炼胶机A-03', 
            description: '备用炼胶设备', 
            statusType: 'stopped', 
            statusText: '停机',
            reason: '原料不足',
            time: '2024-01-15 10:15',
            admin: '张师傅',
            worker: '孙师傅',
            progressPercent: 0,
            progressTxt: '等待原料供应，预计下午到货'
          },
          { 
            name: '炼胶机A-04', 
            description: '备用炼胶设备', 
            statusType: 'stopped', 
            statusText: '停机',
            reason: '设备维护保养',
            time: '2024-01-15 11:00',
            admin: '王师傅',
            worker: '周师傅',
            progressPercent: 90,
            progressTxt: '维护工作基本完成，正在进行最终测试'
          },
          { 
            name: '炼胶机A-05', 
            description: '备用炼胶设备', 
            statusType: 'stopped', 
            statusText: '停机',
            reason: '计划停机检修',
            time: '2024-01-15 13:30',
            admin: '张师傅',
            worker: '吴师傅',
            progressPercent: 40,
            progressTxt: '正在更换易损件，预计还需要2小时'
          },
          { 
            name: '炼胶机A-06', 
            description: '备用炼胶设备', 
            statusType: 'stopped', 
            statusText: '停机',
            reason: '原料不足',
            time: '2024-01-15 14:00',
            admin: '王师傅',
            worker: '郑师傅',
            progressPercent: 0,
            progressTxt: '原料库存不足，已联系供应商紧急调货'
          }
        ]},
        { name: '故障', type: 'error', count: 3, devices: [
          { 
            name: '炼胶机B-01', 
            description: '主炼胶设备', 
            statusType: 'error', 
            statusText: '故障',
            reason: '电机过热保护',
            time: '2024-01-15 07:45',
            admin: '张师傅',
            worker: '李师傅',
            progressPercent: 30,
            progressTxt: '已检查电机温度，正在分析过热原因'
          },
          { 
            name: '炼胶机B-02', 
            description: '辅助炼胶设备', 
            statusType: 'error', 
            statusText: '故障',
            reason: '轴承损坏',
            time: '2024-01-15 08:20',
            admin: '王师傅',
            worker: '赵师傅',
            progressPercent: 70,
            progressTxt: '新轴承已到货，正在安装调试'
          },
          { 
            name: '炼胶机B-03', 
            description: '备用炼胶设备', 
            statusType: 'error', 
            statusText: '故障',
            reason: '控制系统故障',
            time: '2024-01-15 09:30',
            admin: '张师傅',
            worker: '孙师傅',
            progressPercent: 50,
            progressTxt: '已定位故障点，正在更换控制模块'
          }
        ]}
      ]
    },
    {
      name: '压出',
      maxCount: 20,
      statuses: [
        { name: '停机', type: 'stopped', count: 3, devices: [
          { 
            name: '压出机C-01', 
            description: '主压出设备', 
            statusType: 'stopped', 
            statusText: '停机',
            reason: '设备维护保养',
            time: '2024-01-15 08:00',
            admin: '陈师傅',
            worker: '刘师傅',
            progressPercent: 85,
            progressTxt: '维护工作接近完成，正在进行设备校准'
          },
          { 
            name: '压出机C-02', 
            description: '辅助压出设备', 
            statusType: 'stopped', 
            statusText: '停机',
            reason: '计划停机检修',
            time: '2024-01-15 09:30',
            admin: '林师傅',
            worker: '黄师傅',
            progressPercent: 45,
            progressTxt: '正在检查设备运行状态，准备更换零件'
          },
          { 
            name: '压出机C-03', 
            description: '备用压出设备', 
            statusType: 'stopped', 
            statusText: '停机',
            reason: '原料不足',
            time: '2024-01-15 10:45',
            admin: '陈师傅',
            worker: '马师傅',
            progressPercent: 0,
            progressTxt: '等待原料配送，预计明天上午到货'
          }
        ]},
        { name: '故障', type: 'error', count: 5, devices: [
          { 
            name: '压出机D-01', 
            description: '主压出设备', 
            statusType: 'error', 
            statusText: '故障',
            reason: '螺杆磨损严重',
            time: '2024-01-15 06:30',
            admin: '陈师傅',
            worker: '刘师傅',
            progressPercent: 20,
            progressTxt: '正在拆卸螺杆，准备更换新配件'
          },
          { 
            name: '压出机D-02', 
            description: '辅助压出设备', 
            statusType: 'error', 
            statusText: '故障',
            reason: '温度控制系统故障',
            time: '2024-01-15 07:15',
            admin: '林师傅',
            worker: '黄师傅',
            progressPercent: 60,
            progressTxt: '已更换温度传感器，正在调试系统'
          },
          { 
            name: '压出机D-03', 
            description: '备用压出设备', 
            statusType: 'error', 
            statusText: '故障',
            reason: '液压系统泄漏',
            time: '2024-01-15 08:45',
            admin: '陈师傅',
            worker: '马师傅',
            progressPercent: 80,
            progressTxt: '已修复泄漏点，正在补充液压油'
          },
          { 
            name: '压出机D-04', 
            description: '备用压出设备', 
            statusType: 'error', 
            statusText: '故障',
            reason: '电机轴承损坏',
            time: '2024-01-15 09:20',
            admin: '林师傅',
            worker: '刘师傅',
            progressPercent: 40,
            progressTxt: '正在拆卸电机，准备更换轴承'
          },
          { 
            name: '压出机D-05', 
            description: '备用压出设备', 
            statusType: 'error', 
            statusText: '故障',
            reason: '控制系统异常',
            time: '2024-01-15 10:00',
            admin: '陈师傅',
            worker: '黄师傅',
            progressPercent: 25,
            progressTxt: '正在检查控制面板，分析异常原因'
          }
        ]}
      ]
    },
    {
      name: '成型',
      maxCount: 30,
      statuses: [
        { name: '停机', type: 'stopped', count: 4, devices: [
          { 
            name: '成型机E-01', 
            description: '主成型设备', 
            statusType: 'stopped', 
            statusText: '停机',
            reason: '设备维护保养',
            time: '2024-01-15 08:15',
            admin: '杨师傅',
            worker: '徐师傅',
            progressPercent: 75,
            progressTxt: '已完成主要维护工作，正在进行功能测试'
          },
          { 
            name: '成型机E-02', 
            description: '辅助成型设备', 
            statusType: 'stopped', 
            statusText: '停机',
            reason: '计划停机检修',
            time: '2024-01-15 09:45',
            admin: '郭师傅',
            worker: '何师傅',
            progressPercent: 55,
            progressTxt: '检修工作过半，正在更换关键部件'
          },
          { 
            name: '成型机E-03', 
            description: '备用成型设备', 
            statusType: 'stopped', 
            statusText: '停机',
            reason: '原料不足',
            time: '2024-01-15 11:00',
            admin: '杨师傅',
            worker: '高师傅',
            progressPercent: 0,
            progressTxt: '原料库存不足，已申请紧急采购'
          },
          { 
            name: '成型机E-04', 
            description: '备用成型设备', 
            statusType: 'stopped', 
            statusText: '停机',
            reason: '设备维护保养',
            time: '2024-01-15 12:30',
            admin: '郭师傅',
            worker: '唐师傅',
            progressPercent: 95,
            progressTxt: '维护工作已完成，等待开机测试'
          }
        ]},
        { name: '故障', type: 'error', count: 8, devices: [
          { 
            name: '成型机F-01', 
            description: '主成型设备', 
            statusType: 'error', 
            statusText: '故障',
            reason: '模具损坏',
            time: '2024-01-15 06:45',
            admin: '杨师傅',
            worker: '徐师傅',
            progressPercent: 15,
            progressTxt: '正在评估模具损坏程度，准备修复方案'
          },
          { 
            name: '成型机F-02', 
            description: '辅助成型设备', 
            statusType: 'error', 
            statusText: '故障',
            reason: '液压系统故障',
            time: '2024-01-15 07:30',
            admin: '郭师傅',
            worker: '何师傅',
            progressPercent: 65,
            progressTxt: '已更换液压泵，正在调试系统压力'
          },
          { 
            name: '成型机F-03', 
            description: '备用成型设备', 
            statusType: 'error', 
            statusText: '故障',
            reason: '温度控制系统异常',
            time: '2024-01-15 08:00',
            admin: '杨师傅',
            worker: '高师傅',
            progressPercent: 35,
            progressTxt: '正在检查温控系统，分析异常原因'
          },
          { 
            name: '成型机F-04', 
            description: '备用成型设备', 
            statusType: 'error', 
            statusText: '故障',
            reason: '电机过热保护',
            time: '2024-01-15 08:30',
            admin: '郭师傅',
            worker: '唐师傅',
            progressPercent: 85,
            progressTxt: '已修复散热系统，正在测试电机运行'
          },
          { 
            name: '成型机F-05', 
            description: '备用成型设备', 
            statusType: 'error', 
            statusText: '故障',
            reason: '轴承损坏',
            time: '2024-01-15 09:00',
            admin: '杨师傅',
            worker: '徐师傅',
            progressPercent: 45,
            progressTxt: '正在拆卸轴承，准备更换新配件'
          },
          { 
            name: '成型机F-06', 
            description: '备用成型设备', 
            statusType: 'error', 
            statusText: '故障',
            reason: '控制系统故障',
            time: '2024-01-15 09:30',
            admin: '郭师傅',
            worker: '何师傅',
            progressPercent: 70,
            progressTxt: '已更换控制主板，正在重新编程'
          },
          { 
            name: '成型机F-07', 
            description: '备用成型设备', 
            statusType: 'error', 
            statusText: '故障',
            reason: '传感器故障',
            time: '2024-01-15 10:00',
            admin: '杨师傅',
            worker: '高师傅',
            progressPercent: 30,
            progressTxt: '正在检查传感器连接，准备更换故障传感器'
          },
          { 
            name: '成型机F-08', 
            description: '备用成型设备', 
            statusType: 'error', 
            statusText: '故障',
            reason: '气动系统泄漏',
            time: '2024-01-15 10:30',
            admin: '郭师傅',
            worker: '唐师傅',
            progressPercent: 55,
            progressTxt: '已定位泄漏点，正在更换密封圈'
          }
        ]}
      ]
    },
    {
      name: '硫化',
      maxCount: 15,
      statuses: [
        { name: '停机', type: 'stopped', count: 1, devices: [
          { 
            name: '硫化机G-01', 
            description: '主硫化设备', 
            statusType: 'stopped', 
            statusText: '停机',
            reason: '设备维护保养',
            time: '2024-01-15 08:30',
            admin: '朱师傅',
            worker: '冯师傅',
            progressPercent: 90,
            progressTxt: '维护工作基本完成，正在进行最终检查'
          }
        ]},
        { name: '故障', type: 'error', count: 2, devices: [
          { 
            name: '硫化机H-01', 
            description: '主硫化设备', 
            statusType: 'error', 
            statusText: '故障',
            reason: '温度控制系统故障',
            time: '2024-01-15 07:00',
            admin: '朱师傅',
            worker: '冯师傅',
            progressPercent: 60,
            progressTxt: '已更换温控器，正在调试温度参数'
          },
          { 
            name: '硫化机H-02', 
            description: '辅助硫化设备', 
            statusType: 'error', 
            statusText: '故障',
            reason: '压力传感器异常',
            time: '2024-01-15 08:00',
            admin: '朱师傅',
            worker: '冯师傅',
            progressPercent: 40,
            progressTxt: '正在检查压力传感器，准备校准或更换'
          }
        ]}
      ]
    }
  ]);

  const sidebarMenuList = reactive([
    {
      name: '首页总览',
      icon: '🏠',
      path: '/pages/dashboard/dashboard'
    },
    {
      name: '设备管理',
      icon: '🛠️',
      path: '/pages/dashboard/dashboard'
    },
    {
      name: '管理员',
      icon: '👨‍💼',
      path: '/pages/dashboard/dashboard'
    },
    {
      name: '保全工',
      icon: '👷‍♂️',
      path: '/pages/dashboard/dashboard'
    },
    {
     name: '培训考试',
     icon: '📋',
     path: '/pages/dashboard/dashboard'
    },
    {
     name: '个人中心',
     icon: '👤',
     path: '/pages/dashboard/dashboard'
    }
  ])

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
  .task-item {
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