<template>
  <view class="device-dept-header-nav">
    <view
      v-for="item in navList"
      :key="item.key"
      :class="['nav-item', { active: item.key === activeKey }]"
      @click="select(item.key)"
    >
      {{ item.label }}
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['redirectTo'])

const navList = [
  { key: 'overview', label: '总览' },
  { key: 'machineManage', label: '机器管理' },
  { key: 'spareManage', label: '备件管理' }
]

const activeKey = ref('overview')

function select(key) {
  if (activeKey.value !== key) {
    activeKey.value = key
    emit('redirectTo', key)
  }
}
</script>

<style scoped>
.device-dept-header-nav {
  display: flex;
  background: #fff;
  border-bottom: 1px solid #eee;
  padding: 0 24rpx;
  height: 88rpx;
  align-items: center;
}
.nav-item {
  margin-right: 48rpx;
  font-size: 32rpx;
  color: #666;
  padding: 0 8rpx 8rpx 8rpx;
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}
.nav-item.active {
  color: #007bff;
  font-weight: bold;
}
.nav-item.active::after {
  content: '';
  display: block;
  height: 4rpx;
  background: #007bff;
  border-radius: 2rpx;
  position: absolute;
  left: 0;
  right: 0;
  bottom: -2rpx;
}
</style> 