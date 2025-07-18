<template>
    <view :class="['sidebar', sidebarCollapsed===true ? 'collapsed' : '', appCollapsed===true ? 'appCollapsed' : '']">
        <view :class="['sidebar-logo',appCollapsed===true?'appCollapsed':'']">
          <Logo class="logo-img" />
          <text :class="['logo-title',appCollapsed===true?'appCollapsed':'']" v-show="sidebarCollapsed!==true">XX部设备部门</text>
        </view>
        <view :class="['sidebar-menu',appCollapsed===true?'appCollapsed':'']">
            <view class="menu-item-container" v-for="(item,index) in sidebarMenuList" :key="index" @click="toggleSidebApp">
                <view :class="['menu-item',activeIndex==index?'active':'']" @click="ToggleCommpont(index)" v-show="appCollapsed===null||(sidebarCollapsed===null && appCollapsed===true && activeIndex==index)||(sidebarCollapsed===null && appCollapsed===false)">
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
</template>
<script setup>
import { ref,reactive, onMounted, onUnmounted, watch } from 'vue';
import Logo from '@/components/Logo/Logo.vue';
import { sidebarMenuList as rawSidebarMenuList } from '@/utils/mockData.js';

  const sidebarMenuList = reactive(rawSidebarMenuList);
  const activeIndex = ref(0);
  const isMobileScreen = ref(window.innerWidth < 900);
  const sidebarCollapsed = ref(false);
  const appCollapsed = ref(false);
  const emit =defineEmits(['redirectTo'])

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

  //切换路由
  function ToggleCommpont(index){
    activeIndex.value = index;
    emit('redirectTo', sidebarMenuList[index].component);
  }

  onMounted(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
  });
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
</script>
<style scoped>
.sidebar {
    height: 100vh;
    width: 220px;
    background: #fff;
    box-shadow: 2px 0 12px rgba(52,120,246,0.06);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 0 24px 0;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
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
    overflow: hidden;
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
  }
</style> 