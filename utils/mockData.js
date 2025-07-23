// fengshenTop/pages/dashboard/mockDashboardData.js

// 侧边栏菜单数据
export const sidebarMenuList = [
    {
      name: '首页总览',
      icon: '🏠',
      component:'dashboard'
    },
    {
      name: '设备管理',
      icon: '🛠️',
      component:'deviceManage'
    },
    {
      name: '管理员',
      icon: '👨‍💼',
      component:'adminManage'
    },
    {
      name: '保全工',
      icon: '👷‍♂️',
      component:'workerManage'
    },
    {
      name: '培训考试',
      icon: '📋',
      component:'exam'
    },
    {
      name: '个人中心',
      icon: '👤',
      component:'person'
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
      periodicTasks: [
        { name: '设备巡检', ownerType: '管理员', progress: 80, total: 10, finished: 8, unfinishedList: ['张三', '李四'] },
        { name: '安全培训', ownerType: '管理员', progress: 100, total: 10, finished: 10, unfinishedList: [] },
        { name: '日常保养', ownerType: '保全工', progress: 95, total: 20, finished: 19, unfinishedList: ['王五'] }
      ],
      keyTasks: [
        { name: '新设备调试', progress: 30, startTime: '2025-07-04', owner: '赵师傅', history: [
          { time: '2025-07-04', progress: '0%', desc: '设备到厂' },
          { time: '2025-07-05', progress: '20%', desc: '初步安装完成' },
          { time: '2025-07-06', progress: '30%', desc: '新购入炼胶机调试工作', isLatest: true }
        ] },
        { name: '工艺优化', progress: 60, startTime: '2025-07-05', owner: '孙师傅', history: [
          { time: '2025-07-05', progress: '0%', desc: '项目启动' },
          { time: '2025-07-06', progress: '30%', desc: '初步参数调整' },
          { time: '2025-07-07', progress: '60%', desc: '炼胶工艺参数优化项目', isLatest: true }
        ] }
      ]
    },
    {
      section: '压出',
      periodicTasks: [
        { name: '设备保养', ownerType: '保全工', progress: 60, total: 15, finished: 9, unfinishedList: ['刘一', '陈二', '赵三', '钱四', '孙五', '周六'] },
        { name: '质量检查', ownerType: '管理员', progress: 85, total: 10, finished: 8, unfinishedList: ['吴七', '郑八'] }
      ],
      keyTasks: [
        { name: '生产线改造', progress: 45, startTime: '2025-07-03', owner: '周师傅', history: [
          { time: '2025-07-03', progress: '0%', desc: '项目立项' },
          { time: '2025-07-04', progress: '20%', desc: '初步改造完成' },
          { time: '2025-07-05', progress: '45%', desc: '压出生产线自动化改造', isLatest: true }
        ] },
        { name: '模具维修', progress: 75, startTime: '2025-07-04', owner: '吴师傅', history: [
          { time: '2025-07-04', progress: '0%', desc: '任务下发' },
          { time: '2025-07-05', progress: '40%', desc: '部分模具维修完成' },
          { time: '2025-07-06', progress: '75%', desc: '关键模具维修工作', isLatest: true }
        ] }
      ]
    },
    {
      section: '成型',
      periodicTasks: [
        { name: '模具更换', ownerType: '保全工', progress: 50, total: 12, finished: 6, unfinishedList: ['王一', '王二', '王三', '王四', '王五', '王六'] },
        { name: '设备校准', ownerType: '管理员', progress: 90, total: 10, finished: 9, unfinishedList: ['李一'] }
      ],
      keyTasks: [
        { name: '新产品试制', progress: 20, startTime: '2025-07-03', owner: '高师傅', history: [
          { time: '2025-07-03', progress: '0%', desc: '项目启动' },
          { time: '2025-07-04', progress: '10%', desc: '初步试制完成' },
          { time: '2025-07-05', progress: '20%', desc: '新产品成型工艺试制', isLatest: true }
        ] },
        { name: '设备升级', progress: 40, startTime: '2025-07-04', owner: '唐师傅', history: [
          { time: '2025-07-04', progress: '0%', desc: '项目立项' },
          { time: '2025-07-05', progress: '20%', desc: '部分系统升级完成' },
          { time: '2025-07-06', progress: '40%', desc: '成型设备控制系统升级', isLatest: true }
        ] }
      ]
    },
    {
      section: '硫化',
      periodicTasks: [
        { name: '温控检查', ownerType: '管理员', progress: 90, total: 10, finished: 9, unfinishedList: ['冯一'] },
        { name: '压力测试', ownerType: '保全工', progress: 70, total: 10, finished: 7, unfinishedList: ['朱一', '朱二', '朱三'] }
      ],
      keyTasks: [
        { name: '节能改造', progress: 55, startTime: '2025-07-03', owner: '郑师傅', history: [
          { time: '2025-07-03', progress: '0%', desc: '项目启动' },
          { time: '2025-07-04', progress: '30%', desc: '部分节能改造完成' },
          { time: '2025-07-05', progress: '55%', desc: '硫化设备节能改造项目', isLatest: true }
        ] },
        { name: '安全系统升级', progress: 80, startTime: '2025-07-04', owner: '钱师傅', history: [
          { time: '2025-07-04', progress: '0%', desc: '项目启动' },
          { time: '2025-07-05', progress: '40%', desc: '部分系统升级完成' },
          { time: '2025-07-06', progress: '80%', desc: '硫化安全系统升级改造', isLatest: true }
        ] }
      ]
    }
  ];

// 安全报警信息 mock 数据
export const alarmList = [
  {
    type: '电机过载',
    time: '2025-07-08 10:05',
    section: '炼胶',
    device: '炼胶机A-02',
    status: '未处理'
  },
  {
    type: '液压系统故障',
    time: '2025-07-08 09:45',
    section: '压出',
    device: '压出机B-01',
    status: '处理中'
  },
  {
    type: '温度传感器失灵',
    time: '2025-07-08 09:30',
    section: '成型',
    device: '成型机C-01',
    status: '未处理'
  },
  {
    type: '安全门未关闭',
    time: '2025-07-08 09:20',
    section: '硫化',
    device: '硫化机D-02',
    status: '未处理'
  },
  {
    type: '电源异常',
    time: '2025-07-08 08:50',
    section: '炼胶',
    device: '炼胶机A-03',
    status: '已处理'
  },
  {
    type: '气压不足',
    time: '2025-07-08 08:40',
    section: '压出',
    device: '压出机B-03',
    status: '未处理'
  },
  {
    type: '冷却系统报警',
    time: '2025-07-07 18:10',
    section: '成型',
    device: '成型机C-02',
    status: '处理中'
  },
  {
    type: '紧急停止',
    time: '2025-07-07 17:55',
    section: '硫化',
    device: '硫化机D-03',
    status: '已处理'
  },
  {
    type: '润滑油位低',
    time: '2025-07-07 17:40',
    section: '炼胶',
    device: '炼胶机A-04',
    status: '未处理'
  },
  {
    type: 'PLC通信故障',
    time: '2025-07-07 16:30',
    section: '压出',
    device: '压出机B-04',
    status: '未处理'
  },
  {
    type: '异常振动',
    time: '2025-07-07 16:10',
    section: '成型',
    device: '成型机C-04',
    status: '处理中'
  },
  {
    type: '加热器故障',
    time: '2025-07-07 15:50',
    section: '硫化',
    device: '硫化机D-04',
    status: '未处理'
  },
  {
    type: '高温报警',
    time: '2025-07-08 09:12',
    section: '炼胶',
    device: '炼胶机A-01',
    status: '未处理'
  },
  {
    type: '气体泄漏',
    time: '2025-07-08 08:55',
    section: '压出',
    device: '压出机B-02',
    status: '处理中'
  },
  {
    type: '电气故障',
    time: '2025-07-07 17:30',
    section: '成型',
    device: '成型机C-03',
    status: '已处理'
  },
  {
    type: '压力异常',
    time: '2025-07-07 15:20',
    section: '硫化',
    device: '硫化机D-01',
    status: '未处理'
  }
];

// 设备故障 mock 数据
export const deviceFaultList = [
  {
    id: 1,
    deviceName: '炼胶机#01',
    section: '炼胶',
    type: '炼胶机',
    faultTime: '2024-07-08 09:30',
    faultType: '电机过热',
    status: '未处理',
    description: '主电机温度异常升高，自动停机保护',
    principal: '张师傅',
    maintainer: '李工',
    remark: '需更换冷却风扇'
  },
  {
    id: 2,
    deviceName: '压出机#02',
    section: '压出',
    type: '压出机',
    faultTime: '2024-07-07 15:20',
    faultType: '液压系统泄漏',
    status: '处理中',
    description: '液压油管破裂导致压力不足',
    principal: '王师傅',
    maintainer: '赵工',
    remark: '已更换部分油管'
  },
  {
    id: 3,
    deviceName: '成型机#03',
    section: '成型',
    type: '成型机',
    faultTime: '2024-07-06 11:10',
    faultType: '传感器故障',
    status: '已处理',
    description: '温度传感器失灵，无法自动调节温度',
    principal: '刘师傅',
    maintainer: '钱工',
    remark: '已更换传感器，恢复正常'
  },
  {
    id: 4,
    deviceName: '硫化机#04',
    section: '硫化',
    type: '硫化机',
    faultTime: '2024-07-05 17:45',
    faultType: 'PLC故障',
    status: '未处理',
    description: 'PLC模块无响应，设备无法启动',
    principal: '赵师傅',
    maintainer: '孙工',
    remark: '待更换PLC模块'
  }
]

export const machineList = [
  /**
   * 设备列表 mock 数据
   * 字段说明：
   * id: 设备唯一标识
   * name: 设备名称（设备类型+#编号）
   * section: 所属工段（炼胶、压出、成型、硫化）
   * type: 设备类型
   * manufacturer: 厂商
   * principal: 负责人
   * maintainer: 检修人
   * entryDate: 入厂时间
   * status: 运行状态（运行、停机、维护、故障等）
   * location: 设备位置
   * lastMaintenance: 上次检修时间
   * remark: 备注
   */
  {
    id: 1,
    name: '炼胶机#01',
    section: '炼胶',
    type: '炼胶机',
    manufacturer: '上海橡机',
    principal: '张师傅',
    maintainer: '李工',
    entryDate: '2022-03-15',
    status: '运行',
    location: 'A区-1号位',
    lastMaintenance: '2025-06-20',
    remark: '运行正常'
  },
  {
    id: 2,
    name: '压出机#02',
    section: '压出',
    type: '压出机',
    manufacturer: '江苏橡塑',
    principal: '王师傅',
    maintainer: '赵工',
    entryDate: '2021-11-10',
    status: '维护',
    location: 'B区-3号位',
    lastMaintenance: '2025-07-01',
    remark: '电机更换中'
  },
  {
    id: 3,
    name: '成型机#03',
    section: '成型',
    type: '成型机',
    manufacturer: '青岛机电',
    principal: '刘师傅',
    maintainer: '钱工',
    entryDate: '2023-01-05',
    status: '停机',
    location: 'C区-2号位',
    lastMaintenance: '2025-06-15',
    remark: '待更换模具'
  },
  {
    id: 4,
    name: '硫化机#04',
    section: '硫化',
    type: '硫化机',
    manufacturer: '无锡橡机',
    principal: '赵师傅',
    maintainer: '孙工',
    entryDate: '2020-08-22',
    status: '故障',
    location: 'D区-5号位',
    lastMaintenance: '2025-05-30',
    remark: '温控异常，待修复'
  },
  {
    id: 5,
    name: '炼胶机#05',
    section: '炼胶',
    type: '炼胶机',
    manufacturer: '上海橡机',
    principal: '郑师傅',
    maintainer: '周工',
    entryDate: '2024-02-18',
    status: '运行',
    location: 'A区-2号位',
    lastMaintenance: '2025-07-02',
    remark: ''
  },
  // 新增mock数据
  {
    id: 6,
    name: '压出机#06',
    section: '压出',
    type: '压出机',
    manufacturer: '天津橡机',
    principal: '林师傅',
    maintainer: '马工',
    entryDate: '2023-07-12',
    status: '运行',
    location: 'B区-5号位',
    lastMaintenance: '2025-06-28',
    remark: '新投产设备'
  },
  {
    id: 7,
    name: '成型机#07',
    section: '成型',
    type: '成型机',
    manufacturer: '广州机电',
    principal: '高师傅',
    maintainer: '唐工',
    entryDate: '2022-09-30',
    status: '维护',
    location: 'C区-4号位',
    lastMaintenance: '2025-07-03',
    remark: '更换液压系统'
  },
  {
    id: 8,
    name: '硫化机#08',
    section: '硫化',
    type: '硫化机',
    manufacturer: '成都橡机',
    principal: '钱师傅',
    maintainer: '吴工',
    entryDate: '2021-05-19',
    status: '运行',
    location: 'D区-2号位',
    lastMaintenance: '2025-06-10',
    remark: '运行平稳'
  },
  {
    id: 9,
    name: '炼胶机#09',
    section: '炼胶',
    type: '炼胶机',
    manufacturer: '上海橡机',
    principal: '陈师傅',
    maintainer: '郑工',
    entryDate: '2020-12-01',
    status: '停机',
    location: 'A区-3号位',
    lastMaintenance: '2025-05-15',
    remark: '待检修'
  },
  {
    id: 10,
    name: '压出机#10',
    section: '压出',
    type: '压出机',
    manufacturer: '江苏橡塑',
    principal: '孙师傅',
    maintainer: '冯工',
    entryDate: '2024-01-10',
    status: '运行',
    location: 'B区-6号位',
    lastMaintenance: '2025-07-05',
    remark: '自动化升级'
  }
]

export const spareList = [
  {
    id: 1,
    name: '主轴轴承',
    type: '轴承',
    section: '炼胶',
    quantity: 12,
    spec: '6205',
    model: 'SKF-6205'
  },
  {
    id: 2,
    name: '液压油缸',
    type: '液压件',
    section: '压出',
    quantity: 4,
    spec: 'Φ80×200',
    model: 'YH-80-200'
  },
  {
    id: 3,
    name: '温控传感器',
    type: '传感器',
    section: '硫化',
    quantity: 8,
    spec: 'PT100',
    model: 'WZP-PT100'
  },
  {
    id: 4,
    name: 'PLC模块',
    type: '电气元件',
    section: '成型',
    quantity: 6,
    spec: '16点输入',
    model: 'Siemens S7-1200'
  },
  {
    id: 5,
    name: '同步带',
    type: '传动件',
    section: '压出',
    quantity: 15,
    spec: '宽20mm 长1200mm',
    model: 'HTD-1200-20'
  },
  {
    id: 6,
    name: '电机',
    type: '电机',
    section: '炼胶',
    quantity: 2,
    spec: '7.5kW 380V',
    model: 'YE3-132M-4'
  },
  {
    id: 7,
    name: '气动阀',
    type: '气动元件',
    section: '成型',
    quantity: 10,
    spec: 'DN20',
    model: 'AIRTAC-4V210-08'
  },
  {
    id: 8,
    name: '加热管',
    type: '加热元件',
    section: '硫化',
    quantity: 20,
    spec: '220V 2kW',
    model: 'JRG2-220-2'
  },
  // 新增mock数据
  {
    id: 9,
    name: '温度继电器',
    type: '电气元件',
    section: '炼胶',
    quantity: 5,
    spec: 'AC220V',
    model: 'OMRON-TEMP-220'
  },
  {
    id: 10,
    name: '油封',
    type: '密封件',
    section: '压出',
    quantity: 18,
    spec: 'φ50×70×10',
    model: 'NOK-507010'
  },
  {
    id: 11,
    name: '气缸',
    type: '气动元件',
    section: '成型',
    quantity: 7,
    spec: 'SC63×200',
    model: 'AIRTAC-SC63-200'
  },
  {
    id: 12,
    name: '压力传感器',
    type: '传感器',
    section: '硫化',
    quantity: 9,
    spec: '0-10MPa',
    model: 'HYDAC-HDA-4744'
  },
  {
    id: 13,
    name: '变频器',
    type: '电气元件',
    section: '炼胶',
    quantity: 3,
    spec: '15kW',
    model: 'ABB-ACS580'
  }
]

// 管理员 mock 数据（含学历、专业、工龄、入厂时间，自动计算年龄和工龄）
function calcYears(from) {
  // from: 'YYYY-MM'
  const [year, month] = from.split('-').map(Number)
  const now = new Date()
  let years = now.getFullYear() - year
  if (now.getMonth() + 1 < month) years--
  return years
}

export const adminList = [
  {
    id: 1,
    name: '王强',
    section: '炼胶',
    birth: '1985-03',
    age: calcYears('1985-03'),
    entryDate: '2008-07',
    workYears: calcYears('2008-07'),
    major: '机械',
    education: '本科',
    nation: '汉族',
    nativePlace: '江苏南京',
    taskNum:5,
    lastMer:'A',
    resume: '2015年晋升炼胶主管，2020年获"优秀管理员"称号。'
  },
  {
    id: 2,
    name: '李敏',
    section: '压出',
    birth: '1990-07',
    age: calcYears('1990-07'),
    entryDate: '2013-03',
    workYears: calcYears('2013-03'),
    major: '电气',
    education: '硕士',
    nation: '回族',
    nativePlace: '安徽合肥',
    taskNum:0,
    lastMer:'B',
    resume: '2018年调任压出工段管理员，2021年获得"技术创新奖"。'
  },
  {
    id: 3,
    name: '张伟',
    section: '成型',
    birth: '1988-11',
    age: calcYears('1988-11'),
    entryDate: '2011-06',
    workYears: calcYears('2011-06'),
    major: '机械',
    education: '本科',
    nation: '汉族',
    nativePlace: '山东青岛',
    taskNum:0,
    lastMer:'C',
    resume: '2016年调任成型工段管理员，2019年获"安全生产先进个人"。'
  },
  {
    id: 4,
    name: '赵磊',
    section: '硫化',
    birth: '1982-02',
    age: calcYears('1982-02'),
    entryDate: '2005-09',
    workYears: calcYears('2005-09'),
    major: '机械',
    education: '本科',
    nation: '满族',
    nativePlace: '辽宁沈阳',
    taskNum:3,
    lastMer:'A',
    resume: '2012年调任硫化工段管理员，2017年获"管理标兵"称号。'
  },
  {
    id: 5,
    name: '陈静',
    section: '炼胶',
    birth: '1993-09',
    age: calcYears('1993-09'),
    entryDate: '2016-04',
    workYears: calcYears('2016-04'),
    major: '电气',
    education: '硕士',
    nation: '汉族',
    nativePlace: '浙江杭州',
    taskNum:2,
    lastMer:'A',
    resume: '2022年晋升炼胶工段管理员，2023年获"青年岗位能手"。'
  },
  {
    id: 6,
    name: '孙鹏',
    section: '压出',
    birth: '1987-05',
    age: calcYears('1987-05'),
    entryDate: '2010-08',
    workYears: calcYears('2010-08'),
    major: '自动化',
    education: '本科',
    nation: '汉族',
    nativePlace: '河北石家庄',
    taskNum:1,
    lastMer:'B',
    resume: '2017年获"优秀员工"，2022年带队完成压出自动化改造。'
  },
  {
    id: 7,
    name: '周丽',
    section: '成型',
    birth: '1991-12',
    age: calcYears('1991-12'),
    entryDate: '2014-03',
    workYears: calcYears('2014-03'),
    major: '材料',
    education: '硕士',
    nation: '汉族',
    nativePlace: '湖南长沙',
    taskNum:0,
    lastMer:'C',
    resume: '2019年晋升成型工段副主管，2023年获"技术创新奖"。'
  },
  {
    id: 8,
    name: '马超',
    section: '硫化',
    birth: '1984-10',
    age: calcYears('1984-10'),
    entryDate: '2007-05',
    workYears: calcYears('2007-05'),
    major: '机械',
    education: '本科',
    nation: '回族',
    nativePlace: '宁夏银川',
    taskNum:1,
    lastMer:'B',
    resume: '2015年获"安全生产标兵"，2021年主导硫化设备升级。'
  },
  {
    id: 9,
    name: '李雪',
    section: '炼胶',
    birth: '1995-06',
    age: calcYears('1995-06'),
    entryDate: '2018-09',
    workYears: calcYears('2018-09'),
    major: '化工',
    education: '本科',
    nation: '汉族',
    nativePlace: '四川成都',
    taskNum:0,
    lastMer:'C',
    resume: '2020年获"优秀新人"，2024年晋升炼胶工段主管。'
  }
]

export const workerList = [
  {
    id: 1,
    name: '张三',
    section: '炼胶',
    birth: '1990-05',
    age: calcYears('1990-05'),
    entryDate: '2015-03',
    workYears: calcYears('2015-03'),
    major: '机械',
    education: '专科',
    nation: '汉族',
    nativePlace: '山东济南',
    taskNum: 5,
    lastMer: 'A',
    resume: null
  },
  {
    id: 2,
    name: '李四',
    section: '压出',
    birth: '1992-08',
    age: calcYears('1992-08'),
    entryDate: '2017-06',
    workYears: calcYears('2017-06'),
    major: '电气',
    education: '高中',
    nation: '回族',
    nativePlace: '河南郑州',
    taskNum: 0,
    lastMer: 'B',
    resume: null
  },
  {
    id: 3,
    name: '王五',
    section: '成型',
    birth: '1988-12',
    age: calcYears('1988-12'),
    entryDate: '2013-10',
    workYears: calcYears('2013-10'),
    major: '自动化',
    education: '中专',
    nation: '汉族',
    nativePlace: '江苏苏州',
    taskNum: 0,
    lastMer: 'C',
    resume: null
  },
  {
    id: 4,
    name: '赵六',
    section: '硫化',
    birth: '1985-03',
    age: calcYears('1985-03'),
    entryDate: '2010-05',
    workYears: calcYears('2010-05'),
    major: '机械',
    education: '专科',
    nation: '满族',
    nativePlace: '吉林长春',
    taskNum: 3,
    lastMer: 'A',
    resume: null
  },
  {
    id: 5,
    name: '钱七',
    section: '炼胶',
    birth: '1993-11',
    age: calcYears('1993-11'),
    entryDate: '2018-09',
    workYears: calcYears('2018-09'),
    major: '化工',
    education: '中专',
    nation: '汉族',
    nativePlace: '浙江宁波',
    taskNum: 2,
    lastMer: 'A',
    resume: null
  },
  {
    id: 6,
    name: '孙八',
    section: '压出',
    birth: '1989-07',
    age: calcYears('1989-07'),
    entryDate: '2014-02',
    workYears: calcYears('2014-02'),
    major: '材料',
    education: '高中',
    nation: '汉族',
    nativePlace: '安徽芜湖',
    taskNum: 1,
    lastMer: 'B',
    resume: null
  },
  {
    id: 7,
    name: '周九',
    section: '成型',
    birth: '1991-04',
    age: calcYears('1991-04'),
    entryDate: '2016-08',
    workYears: calcYears('2016-08'),
    major: '机械',
    education: '专科',
    nation: '汉族',
    nativePlace: '江西南昌',
    taskNum: 0,
    lastMer: 'C',
    resume: null
  },
  {
    id: 8,
    name: '吴十',
    section: '硫化',
    birth: '1987-10',
    age: calcYears('1987-10'),
    entryDate: '2012-05',
    workYears: calcYears('2012-05'),
    major: '电气',
    education: '高中',
    nation: '回族',
    nativePlace: '甘肃兰州',
    taskNum: 1,
    lastMer: 'B',
    resume: null
  },
  {
    id: 9,
    name: '郑十一',
    section: '炼胶',
    birth: '1994-02',
    age: calcYears('1994-02'),
    entryDate: '2019-07',
    workYears: calcYears('2019-07'),
    major: '自动化',
    education: '中专',
    nation: '汉族',
    nativePlace: '福建厦门',
    taskNum: 0,
    lastMer: 'C',
    resume: null
  }
]    

// 工段-车间-设备三级结构 mock 数据
export const workshopTree = [
  {
    section: '炼胶',
    expectedInput: '原料A 100kg',
    expectedOutput: '胶片 80kg',
    running: 5,
    total: 10,
    fund: 80000,
    workshops: [
      {
        name: 'A车间',
        expectedInput: '原料A 50kg',
        expectedOutput: '胶片 40kg',
        running: 2,
        total: 4,
        devices: [
          {
            id: 1,
            name: '炼胶机#01',
            img: '/static/logo.png',
            status: '运行',
            principal: '张师傅',
            maintainer: '李工',
            modules: ['电气', '液压'],
            info: '2022年投产，主机',
            faultType: '电气',
            faultHistory: [
              { date: '2024-07-01', duration: 2.5 },
              { date: '2024-07-03', duration: 1.2 }
            ]
          },
          {
            id: 2,
            name: '炼胶机#02',
            img: '/static/logo.png',
            status: '停机',
            principal: '王师傅',
            maintainer: '赵工',
            modules: ['液压'],
            info: '备用设备',
            faultType: '机械',
            faultHistory: [
              { date: '2024-07-02', duration: 4.0 }
            ]
          },
          {
            id: 7,
            name: '炼胶机#03',
            img: '/static/logo.png',
            status: '维护',
            principal: '郑师傅',
            maintainer: '钱工',
            modules: ['电气', '液压', '传感'],
            info: '2023年投产',
            faultType: '电气',
            faultHistory: [
              { date: '2024-07-04', duration: 2.0 }
            ]
          }
        ]
      },
      {
        name: 'B车间',
        expectedInput: '原料A 50kg',
        expectedOutput: '胶片 40kg',
        running: 3,
        total: 6,
        devices: [
          {
            id: 3,
            name: '炼胶机#04',
            img: '/static/logo.png',
            status: '运行',
            principal: '刘师傅',
            maintainer: '孙工',
            modules: ['电气'],
            info: '2023年投产'
          },
          {
            id: 8,
            name: '炼胶机#05',
            img: '/static/logo.png',
            status: '故障',
            principal: '陈师傅',
            maintainer: '周工',
            modules: ['液压', '传感'],
            info: '2021年投产'
          }
        ]
      }
    ]
  },
  {
    section: '压出',
    expectedInput: '胶片 80kg',
    expectedOutput: '半成品 75kg',
    running: 4,
    total: 8,
    fund: 60000,
    workshops: [
      {
        name: 'C车间',
        expectedInput: '胶片 40kg',
        expectedOutput: '半成品 38kg',
        running: 2,
        total: 4,
        devices: [
          {
            id: 4,
            name: '压出机#01',
            img: '/static/logo.png',
            status: '运行',
            principal: '林师傅',
            maintainer: '马工',
            modules: ['电气', '液压'],
            info: '2021年投产'
          },
          {
            id: 9,
            name: '压出机#02',
            img: '/static/logo.png',
            status: '维护',
            principal: '孙师傅',
            maintainer: '冯工',
            modules: ['液压', '传感'],
            info: '2022年投产'
          }
        ]
      },
      {
        name: 'D车间',
        expectedInput: '胶片 40kg',
        expectedOutput: '半成品 37kg',
        running: 2,
        total: 4,
        devices: [
          {
            id: 10,
            name: '压出机#03',
            img: '/static/logo.png',
            status: '运行',
            principal: '高师傅',
            maintainer: '唐工',
            modules: ['电气'],
            info: '2020年投产'
          }
        ]
      }
    ]
  },
  {
    section: '成型',
    expectedInput: '半成品 75kg',
    expectedOutput: '成型件 70kg',
    running: 3,
    total: 7,
    fund: 90000,
    workshops: [
      {
        name: 'E车间',
        expectedInput: '半成品 35kg',
        expectedOutput: '成型件 33kg',
        running: 1,
        total: 3,
        devices: [
          {
            id: 5,
            name: '成型机#01',
            img: '/static/logo.png',
            status: '维护',
            principal: '赵师傅',
            maintainer: '钱工',
            modules: ['电气'],
            info: '2020年投产'
          },
          {
            id: 11,
            name: '成型机#02',
            img: '/static/logo.png',
            status: '运行',
            principal: '李师傅',
            maintainer: '吴工',
            modules: ['液压', '传感'],
            info: '2021年投产'
          }
        ]
      },
      {
        name: 'F车间',
        expectedInput: '半成品 40kg',
        expectedOutput: '成型件 37kg',
        running: 2,
        total: 4,
        devices: [
          {
            id: 12,
            name: '成型机#03',
            img: '/static/logo.png',
            status: '运行',
            principal: '周师傅',
            maintainer: '郑工',
            modules: ['电气', '液压'],
            info: '2022年投产'
          }
        ]
      }
    ]
  },
  {
    section: '硫化',
    expectedInput: '成型件 70kg',
    expectedOutput: '成品 68kg',
    running: 2,
    total: 5,
    fund: 70000,
    workshops: [
      {
        name: 'G车间',
        expectedInput: '成型件 35kg',
        expectedOutput: '成品 34kg',
        running: 1,
        total: 2,
        devices: [
          {
            id: 6,
            name: '硫化机#01',
            img: '/static/logo.png',
            status: '运行',
            principal: '钱师傅',
            maintainer: '吴工',
            modules: ['液压'],
            info: '2019年投产'
          },
          {
            id: 13,
            name: '硫化机#02',
            img: '/static/logo.png',
            status: '停机',
            principal: '马师傅',
            maintainer: '冯工',
            modules: ['电气', '液压'],
            info: '2020年投产'
          }
        ]
      },
      {
        name: 'H车间',
        expectedInput: '成型件 35kg',
        expectedOutput: '成品 34kg',
        running: 1,
        total: 3,
        devices: [
          {
            id: 14,
            name: '硫化机#03',
            img: '/static/logo.png',
            status: '维护',
            principal: '朱师傅',
            maintainer: '郑工',
            modules: ['液压', '传感'],
            info: '2021年投产'
          }
        ]
      }
    ]
  }
]

// 图表相关 mock 数据
export const deviceStatusStats = [
  { section: '全部', running: 20, stopped: 8, maintain: 6, error: 5 },
  { section: '炼胶', running: 6, stopped: 2, maintain: 1, error: 1 },
  { section: '压出', running: 5, stopped: 1, maintain: 2, error: 2 },
  { section: '成型', running: 6, stopped: 3, maintain: 2, error: 1 },
  { section: '硫化', running: 3, stopped: 2, maintain: 1, error: 1 }
]

export const faultTypeStats = [
  { section: '全部', range: '7d', elec: 7, mech: 6 },
  { section: '炼胶', range: '7d', elec: 2, mech: 1 },
  { section: '压出', range: '7d', elec: 1, mech: 3 },
  { section: '成型', range: '7d', elec: 3, mech: 1 },
  { section: '硫化', range: '7d', elec: 1, mech: 1 },
  { section: '全部', range: '30d', elec: 18, mech: 14 },
  { section: '炼胶', range: '30d', elec: 5, mech: 3 },
  { section: '压出', range: '30d', elec: 4, mech: 5 },
  { section: '成型', range: '30d', elec: 6, mech: 3 },
  { section: '硫化', range: '30d', elec: 3, mech: 3 }
]

// 生成近30天真实日期
function getRecent30Days() {
  const arr = []
  const now = new Date(2024, 6, 30) // 2024年7月30日，假设今天
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    arr.push(`${d.getMonth() + 1}-${d.getDate()}`)
  }
  return arr
}
const _recent30 = getRecent30Days()

export const faultTrendStats = [
  { section: '全部', range: '7d', days: ['7-01','7-02','7-03','7-04','7-05','7-06','7-07'], counts: [2, 3, 1, 4, 2, 1, 2] },
  { section: '炼胶', range: '7d', days: ['7-01','7-02','7-03','7-04','7-05','7-06','7-07'], counts: [1,0,0,2,1,0,1] },
  { section: '压出', range: '7d', days: ['7-01','7-02','7-03','7-04','7-05','7-06','7-07'], counts: [0,1,1,1,0,1,0] },
  { section: '成型', range: '7d', days: ['7-01','7-02','7-03','7-04','7-05','7-06','7-07'], counts: [1,1,0,1,1,0,1] },
  { section: '硫化', range: '7d', days: ['7-01','7-02','7-03','7-04','7-05','7-06','7-07'], counts: [0,1,0,0,0,1,0] },
  { section: '全部', range: '30d', days: _recent30, counts: [1,2,1,2,3,2,1,2,1,3,2,1,2,1,2,3,2,1,2,1,3,2,1,2,1,2,3,2,1,2] },
  { section: '炼胶', range: '30d', days: _recent30, counts: [0,1,0,1,2,1,0,1,0,2,1,0,1,0,1,2,1,0,1,0,2,1,0,1,0,1,2,1,0,1] },
  { section: '压出', range: '30d', days: _recent30, counts: [1,0,1,0,1,2,1,0,1,0,2,1,0,1,0,1,2,1,0,1,0,2,1,0,1,0,1,2,1,0] },
  { section: '成型', range: '30d', days: _recent30, counts: [1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0] },
  { section: '硫化', range: '30d', days: _recent30, counts: [0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1,0,1,0,0,0,1] }
]

export const downtimeStats = [
  { section: '全部', range: '7d', data: [
    { name: '炼胶机#01', value: 6.5 },
    { name: '炼胶机#02', value: 2.3 },
    { name: '压出机#01', value: 4.0 },
    { name: '压出机#02', value: 1.8 },
    { name: '成型机#01', value: 3.2 },
    { name: '成型机#02', value: 1.7 },
    { name: '硫化机#01', value: 2.8 },
    { name: '硫化机#02', value: 1.2 }
  ] },
  { section: '炼胶', range: '7d', data: [ { name: '炼胶机#01', value: 6.5 }, { name: '炼胶机#02', value: 2.3 } ] },
  { section: '压出', range: '7d', data: [ { name: '压出机#01', value: 4.0 }, { name: '压出机#02', value: 1.8 } ] },
  { section: '成型', range: '7d', data: [ { name: '成型机#01', value: 3.2 }, { name: '成型机#02', value: 1.7 } ] },
  { section: '硫化', range: '7d', data: [ { name: '硫化机#01', value: 2.8 }, { name: '硫化机#02', value: 1.2 } ] },
  { section: '全部', range: '30d', data: [
    { name: '炼胶机#01', value: 18.5 },
    { name: '炼胶机#02', value: 6.0 },
    { name: '压出机#01', value: 10.0 },
    { name: '压出机#02', value: 5.2 },
    { name: '成型机#01', value: 8.2 },
    { name: '成型机#02', value: 4.5 },
    { name: '硫化机#01', value: 7.8 },
    { name: '硫化机#02', value: 3.1 }
  ] },
  { section: '炼胶', range: '30d', data: [ { name: '炼胶机#01', value: 18.5 }, { name: '炼胶机#02', value: 6.0 } ] },
  { section: '压出', range: '30d', data: [ { name: '压出机#01', value: 10.0 }, { name: '压出机#02', value: 5.2 } ] },
  { section: '成型', range: '30d', data: [ { name: '成型机#01', value: 8.2 }, { name: '成型机#02', value: 4.5 } ] },
  { section: '硫化', range: '30d', data: [ { name: '硫化机#01', value: 7.8 }, { name: '硫化机#02', value: 3.1 } ] }
]