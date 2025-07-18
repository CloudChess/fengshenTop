<template>
  <view class="device-manage-layout-root">
    <DeviceDeptHeaderNav @redirectTo="redirectTo" />
    <view class="device-manage-content">
      <component :is="currentComponent" />
    </view>
  </view>
</template>

<script setup>
import { ref,shallowRef,defineAsyncComponent } from 'vue';
import DeviceDeptHeaderNav from '@/components/DeviceDeptHeaderNav.vue';


const componentMap = {
  overview: defineAsyncComponent(()=>import('./overview/index.vue')),
  machineManage: defineAsyncComponent(()=>import('./machineManage/index.vue')),
  spareManage: defineAsyncComponent(()=>import('./spareManage/index.vue'))
};

const currentComponent = shallowRef(componentMap['overview']); // 默认显示总览

const redirectTo = (key) => { 
  currentComponent.value = componentMap[key];
};
</script>

<style scoped>
.device-manage-layout-root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f8f8f8;
}
.device-manage-content {
  flex: 1;
  min-width: 0;
  padding: 0;
  background: #f8f8f8;
}
</style> 