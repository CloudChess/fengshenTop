<template>
  <view class="overview-3d-container">
    <!-- #ifdef H5 -->
    <div ref="threeContainer" class="three-canvas"></div>
    <!-- #endif -->
    <!-- #ifndef H5 -->
    <view style="padding: 40rpx; color: #888; text-align: center;">3D工厂场景仅在H5端预览，其他端请用图表展示。</view>
    <!-- #endif -->
  </view>
</template>

<script setup>
// #ifdef H5
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const threeContainer = ref(null)
let renderer, scene, camera, animationId

onMounted(() => {
  // 场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)

  // 相机
  camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000)
  camera.position.set(0, 8, 16)
  camera.lookAt(0, 0, 0)

  // 渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(400, 320)
  threeContainer.value.appendChild(renderer.domElement)

  // 地面
  const floorGeometry = new THREE.BoxGeometry(16, 0.5, 10)
  const floorMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc })
  const floor = new THREE.Mesh(floorGeometry, floorMaterial)
  floor.position.y = -0.25
  scene.add(floor)

  // 机器（用立方体/长方体表示）
  const machines = []
  const machineColors = [0x007bff, 0x28a745, 0xffc107]
  for (let i = 0; i < 3; i++) {
    const machineGeometry = new THREE.BoxGeometry(2, 2, 2)
    const machineMaterial = new THREE.MeshPhongMaterial({ color: machineColors[i] })
    const machine = new THREE.Mesh(machineGeometry, machineMaterial)
    machine.position.set(-4 + i * 4, 1, 0)
    scene.add(machine)
    machines.push(machine)
  }

  // 天花板灯光
  const light = new THREE.PointLight(0xffffff, 1.2)
  light.position.set(0, 10, 0)
  scene.add(light)
  const ambient = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambient)

  // 动画
  function animate() {
    animationId = requestAnimationFrame(animate)
    // 机器轻微旋转模拟运作
    machines.forEach((m, i) => {
      m.rotation.y += 0.01 + i * 0.005
    })
    renderer.render(scene, camera)
  }
  animate()
})

onBeforeUnmount(() => {
  if (animationId) cancelAnimationFrame(animationId)
  if (renderer) {
    renderer.dispose()
    renderer.forceContextLoss && renderer.forceContextLoss()
    renderer.domElement && renderer.domElement.remove()
    renderer = null
  }
  scene = null
  camera = null
})
// #endif
</script>

<style scoped>
.overview-3d-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 400rpx;
}
.three-canvas {
  width: 400px;
  height: 320px;
  background: #f0f0f0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
</style>
