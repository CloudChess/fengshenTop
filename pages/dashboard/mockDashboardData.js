// fengshenTop/pages/dashboard/mockDashboardData.js

// 侧边栏菜单数据
export const sidebarMenuList = [
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
  ];

// 设备运行图表数据
export const deviceOperationCategories = ['炼胶', '压出', '成型', '硫化'];
export const deviceOperationSeries = [
  { name: '运行', data: [16, 12, 18, 12] },
  { name: '停机', data: [6, 3, 4, 1] },
  { name: '故障', data: [3, 5, 8, 2] }
];

// 出勤详情数据
export const attendanceDetails = {
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

// 设备状态数据
export const deviceStatusData = [
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
];

// 工段任务数据
export const sectionTasks = [
    {
      section: '炼胶',
      tasks: [
        { name: '设备巡检', progress: 80, detail: '炼胶设备本周巡检，已完成80%' },
        { name: '安全培训', progress: 100, detail: '炼胶工段安全培训已全部完成' }
      ]
    },
    {
      section: '压出',
      tasks: [
        { name: '设备保养', progress: 60, detail: '压出设备保养，部分设备待处理' }
      ]
    },
    {
      section: '成型',
      tasks: [
        { name: '模具更换', progress: 50, detail: '成型模具更换中，预计明天完成' }
      ]
    },
    {
      section: '硫化',
      tasks: [
        { name: '温控检查', progress: 90, detail: '硫化温控系统检查，已完成大部分' }
      ]
    }
  ];

