<template>
  <view class="spare-manage-root">
    <view class="table-toolbar">
      <button class="add-btn" @click="openAdd">添加备件</button>
    </view>
    <view class="table">
      <view class="table-header">
        <view class="table-cell">备件名称</view>
        <view class="table-cell">编号</view>
        <view class="table-cell">库存数量</view>
        <view class="table-cell">操作</view>
      </view>
      <view class="table-row" v-for="(item, idx) in dataList" :key="item.id">
        <view class="table-cell">{{ item.name }}</view>
        <view class="table-cell">{{ item.code }}</view>
        <view class="table-cell">{{ item.stock }}</view>
        <view class="table-cell">
          <button class="edit-btn" @click="openEdit(idx)">编辑</button>
          <button class="del-btn" @click="del(idx)">删除</button>
        </view>
      </view>
    </view>
    <!-- 弹窗表单 -->
    <view v-if="showDialog" class="dialog-mask">
      <view class="dialog">
        <view class="dialog-title">{{ editIdx === null ? '添加备件' : '编辑备件' }}</view>
        <view class="dialog-body">
          <input v-model="form.name" placeholder="备件名称" />
          <input v-model="form.code" placeholder="编号" />
          <input v-model="form.stock" type="number" placeholder="库存数量" />
        </view>
        <view class="dialog-footer">
          <button @click="save">保存</button>
          <button @click="closeDialog">取消</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'

const dataList = ref([
  { id: 1, name: '轴承', code: 'S001', stock: 20 },
  { id: 2, name: '皮带', code: 'S002', stock: 50 },
  { id: 3, name: '电机', code: 'S003', stock: 10 }
])

const showDialog = ref(false)
const editIdx = ref(null)
const form = reactive({ name: '', code: '', stock: '' })

function openAdd() {
  editIdx.value = null
  form.name = ''
  form.code = ''
  form.stock = ''
  showDialog.value = true
}
function openEdit(idx) {
  editIdx.value = idx
  Object.assign(form, dataList.value[idx])
  showDialog.value = true
}
function save() {
  if (!form.name || !form.code || form.stock === '') return
  if (editIdx.value === null) {
    dataList.value.push({
      id: Date.now(),
      name: form.name,
      code: form.code,
      stock: Number(form.stock)
    })
  } else {
    Object.assign(dataList.value[editIdx.value], form)
    dataList.value[editIdx.value].stock = Number(form.stock)
  }
  showDialog.value = false
}
function del(idx) {
  dataList.value.splice(idx, 1)
}
function closeDialog() {
  showDialog.value = false
}
</script>

<style scoped>
.spare-manage-root {
  padding: 32rpx;
}
.table-toolbar {
  margin-bottom: 24rpx;
}
.add-btn {
  background: #007bff;
  color: #fff;
  border: none;
  padding: 12rpx 32rpx;
  border-radius: 6rpx;
}
.table {
  background: #fff;
  border-radius: 8rpx;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  overflow: hidden;
}
.table-header, .table-row {
  display: flex;
  align-items: center;
}
.table-header {
  background: #f5f7fa;
  font-weight: bold;
}
.table-cell {
  flex: 1;
  padding: 18rpx 12rpx;
  border-bottom: 1px solid #eee;
}
.table-row:last-child .table-cell {
  border-bottom: none;
}
.edit-btn, .del-btn {
  margin-right: 12rpx;
  padding: 6rpx 18rpx;
  border-radius: 4rpx;
  border: none;
}
.edit-btn {
  background: #ffc107;
  color: #fff;
}
.del-btn {
  background: #dc3545;
  color: #fff;
}
.dialog-mask {
  position: fixed;
  left: 0; top: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.dialog {
  background: #fff;
  border-radius: 8rpx;
  padding: 32rpx 40rpx;
  min-width: 320rpx;
}
.dialog-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 24rpx;
}
.dialog-body input {
  display: block;
  width: 100%;
  margin-bottom: 18rpx;
  padding: 12rpx;
  border: 1px solid #eee;
  border-radius: 4rpx;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 18rpx;
}
</style> 