<template>
  <view class="device-dept-layout-root">
    <DeviceDeptNav @redirectTo="redirectTo" />
    <view class="device-dept-content">
      <component :is="currentComponent" />
    </view>
  </view>
</template>
<script setup>
import DeviceDeptNav from '@/components/DeviceDeptNav.vue';
import { ref,shallowRef,defineAsyncComponent, onMounted } from 'vue';

//按需异步加载组件
const componentMap = {
  dashboard:defineAsyncComponent(()=>import('@/pages/deviceDept/dashboard/index.vue')),
  deviceManage:defineAsyncComponent(()=>import('@/pages/deviceDept/deviceManage/index.vue')),
  adminManage:defineAsyncComponent(()=>import('@/pages/deviceDept/adminManage/index.vue')),
  workerManage:defineAsyncComponent(()=>import('@/pages/deviceDept/workerManage/index.vue')),
  examSkill:defineAsyncComponent(()=>import('@/pages/deviceDept/examSkill/index.vue')),
  person:defineAsyncComponent(()=>import('@/pages/deviceDept/person/index.vue')),
}
const currentComponent = shallowRef(componentMap["dashboard"]);


const redirectTo = (component) => {
  currentComponent.value = componentMap[component];
};

</script>
<style scoped>
.device-dept-layout-root {
  display: flex;
}
.device-dept-content {
  flex: 1;
  background: #f8f8f8;
}
@media (max-width: 900px) {
  .device-dept-layout-root{
    flex-direction: column;
  }
}
</style> 