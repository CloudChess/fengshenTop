<template>
  <view class="machine-manage-root">
    <view class="table-toolbar">
      <view class="custom-select" ref="selectRef" @click="toggleSelect">
        <view class="custom-select-btn">
          {{ filterFields.find(f => f.value === filterField)?.label || '筛选条件' }}
          <span class="custom-select-arrow">▼</span>
        </view>
        <view v-if="selectOpen" class="custom-select-options" @click.stop>
          <view v-for="f in filterFields" :key="f.value" class="custom-select-option"
            :class="{ active: filterField === f.value }"
            @click="selectField(f.value)">
            {{ f.label }}
          </view>
        </view>
      </view>
      <input class="filter-input" v-model="filterValue" :placeholder="filterPlaceholder" @input="onInput" />
      <button class="toolBtn search-btn" @click="doFilter">搜索</button>
      <button class="toolBtn reset-btn" @click="resetFilter">重置</button>
    </view>
    <!-- 枚举字段候选词 -->
    <view v-if="showEnumCandidates" class="enum-candidates">
      <view class="enum-candidate" v-for="c in enumCandidates" :key="c" @click="selectEnumCandidate(c)">{{ c }}</view>
    </view>
    <view class="table-card">
      <view class="table">
        <view class="table-row table-header">
          <view class="table-cell">设备名称</view>
          <view v-if="!isNarrowScreen" class="table-cell">类型</view>
          <view v-if="!isNarrowScreen" class="table-cell">工段</view>
          <view class="table-cell">状态</view>
          <view v-if="!isNarrowScreen" class="table-cell">负责人</view>
          <view v-if="!isNarrowScreen" class="table-cell">检修人</view>
          <view v-if="!isNarrowScreen" class="table-cell">入厂时间</view>
          <view v-if="!isNarrowScreen" class="table-cell">位置</view>
          <view v-if="!isNarrowScreen" class="table-cell">备注</view>
          <view class="table-cell table-opBtns">操作</view>
        </view>
        <view class="table-row table-dataContent" v-for="(item, idx) in pagedList" :key="item.id">
          <view class="table-cell">{{ item.name }}</view>
          <view v-if="!isNarrowScreen" class="table-cell">{{ item.type }}</view>
          <view v-if="!isNarrowScreen" class="table-cell">{{ item.section }}</view>
          <view class="table-cell">
            <span class="status-dot" :class="'status-dot-' + (item.status || '').replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '').toLowerCase()"></span>
            <span>{{ item.status }}</span>
          </view>
          <view v-if="!isNarrowScreen" class="table-cell">{{ item.principal }}</view>
          <view v-if="!isNarrowScreen" class="table-cell">{{ item.maintainer }}</view>
          <view v-if="!isNarrowScreen" class="table-cell">{{ item.entryDate }}</view>
          <view v-if="!isNarrowScreen" class="table-cell">{{ item.location }}</view>
          <view v-if="!isNarrowScreen" class="table-cell">{{ item.remark }}</view>
          <view class="table-cell table-opBtns ">
            <span class="table-opBtn edit-btn" @click="openEditById(item.id)">编辑</span>
            <span class="table-opBtn del-btn" @click="delWithConfirmById(item.id)">删除</span>
            <span class="table-opBtn detail-btn" @click="showDetail(item)">详情</span>
          </view>
        </view>
      </view>
    </view>
    <!-- 分页器 -->
    <view class="pagination-bar">
      <button class="page-btn" :disabled="currentPage === 1" @click="changePage(currentPage-1)">上一页</button>
      <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
      <button class="page-btn" :disabled="currentPage === totalPages" @click="changePage(currentPage+1)">下一页</button>
    </view>
    <!-- 弹窗表单 -->
    <view v-if="showDialog" class="dialog-mask">
      <view class="dialog">
        <view class="dialog-title">{{ editIdx === null ? '添加设备' : '编辑设备' }}</view>
        <view class="dialog-body">
          <input v-model="form.name" placeholder="设备名称" />
          <input v-model="form.type" placeholder="类型" />
          <input v-model="form.section" placeholder="工段" />
          <input v-model="form.status" placeholder="状态" />
          <input v-model="form.principal" placeholder="负责人" />
          <input v-model="form.maintainer" placeholder="检修人" />
          <input v-model="form.entryDate" placeholder="入厂时间" />
          <input v-model="form.location" placeholder="位置" />
          <input v-model="form.remark" placeholder="备注" />
          <view v-if="errorMsg" class="form-error">{{ errorMsg }}</view>
        </view>
        <view class="dialog-footer">
          <button @click="save">保存</button>
          <button @click="closeDialog">取消</button>
        </view>
      </view>
    </view>
    <!-- 详情模态框 -->
    <view v-if="showDetailDialog" class="dialog-mask">
      <view class="dialog detail-dialog">
        <view class="dialog-title">设备详情</view>
        <view class="dialog-body detail-body">
          <view v-for="f in detailFields" :key="f.value" class="detail-row">
            <text class="detail-label">{{ f.label }}：</text>
            <text class="detail-value">{{ detailItem[f.value] || '-' }}</text>
          </view>
        </view>
        <view class="dialog-footer">
          <button @click="closeDetail">关闭</button>
        </view>
      </view>
    </view>
    <!-- 删除确认弹窗 -->
    <view v-if="showDelConfirm" class="dialog-mask">
      <view class="dialog">
        <view class="dialog-title">确认删除</view>
        <view class="dialog-body">确定要删除该设备吗？</view>
        <view class="dialog-footer">
          <button @click="confirmDel">确定</button>
          <button @click="cancelDel">取消</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { machineList } from '@/utils/mockData.js'

const dataList = ref(machineList.map(item => ({ ...item })))

// 响应式屏幕宽度
const isNarrowScreen = ref(false)
function handleResize() {
  isNarrowScreen.value = window.innerWidth <= 700
}
onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

// 筛选字段配置
const filterFields = [
  { value: 'name', label: '设备名称', type: 'text' },
  { value: 'type', label: '类型', type: 'text' },
  { value: 'section', label: '工段', type: 'enum', candidates: ['压出','炼胶','成型','硫化'] },
  { value: 'status', label: '状态', type: 'enum', candidates: ['运行','维护','停机','故障']  },
  { value: 'principal', label: '负责人', type: 'text' },
  { value: 'maintainer', label: '检修人', type: 'text' },
  { value: 'entryDate', label: '入厂时间', type: 'text' },
  { value: 'location', label: '位置', type: 'text' },
  { value: 'remark', label: '备注', type: 'text' }
]
const filterField = ref(filterFields[0].value)
const filterValue = ref('')
const filterPlaceholder = computed(() => {
  const f = filterFields.find(f => f.value === filterField.value)
  return f ? `请输入${f.label}` : '请输入筛选内容'
})

// 枚举候选词逻辑
const showEnumCandidates = computed(() => {
  const f = filterFields.find(f => f.label === filterField.value)
  return f && f.type === 'enum' && filterValue.value && enumCandidates.value.length > 0
})
const enumCandidates = computed(() => {
  const f = filterFields.find(f => f.value === filterField.value)
  if (!f || f.type !== 'enum') return []
  return f.candidates.filter(c => c.includes(filterValue.value))
})
function selectEnumCandidate(val) {
  filterValue.value = val
}
function onInput() {
  // nothing, just for v-model
}

// 筛选逻辑
const filteredList = ref([...dataList.value])
function doFilter() {
  const f = filterFields.find(f => f.value === filterField.value)
  if (!f) return
  if (!filterValue.value) {
    filteredList.value = [...dataList.value]
    currentPage.value = 1
    return
  }
  if (f.type === 'enum') {
    filteredList.value = dataList.value.filter(item => (item[f.value] || '') === filterValue.value)
  } else {
    filteredList.value = dataList.value.filter(item => (item[f.value] || '').toLowerCase().includes(filterValue.value.toLowerCase()))
  }
  currentPage.value = 1
}

// 分页相关
const pageSize = 8
const currentPage = ref(1)
const totalPages = computed(() => Math.max(1, Math.ceil(filteredList.value.length / pageSize)))
const pagedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredList.value.slice(start, start + pageSize)
})
function changePage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

// 详情弹窗
const showDetailDialog = ref(false)
const detailItem = ref({})
const detailFields = [
  { value: 'name', label: '设备名称' },
  { value: 'type', label: '类型' },
  { value: 'section', label: '工段' },
  { value: 'status', label: '状态' },
  { value: 'principal', label: '负责人' },
  { value: 'maintainer', label: '检修人' },
  { value: 'entryDate', label: '入厂时间' },
  { value: 'location', label: '位置' },
  { value: 'remark', label: '备注' }
]
function showDetail(item) {
  detailItem.value = { ...item }
  showDetailDialog.value = true
}
function closeDetail() {
  showDetailDialog.value = false
  detailItem.value = {}
}

// 其余增删改查逻辑不变
const showDialog = ref(false)
const editIdx = ref(null)
const form = reactive({
  name: '', type: '', section: '', status: '', principal: '', maintainer: '', entryDate: '', location: '', remark: ''
})
const errorMsg = ref('')

// 删除确认相关
const showDelConfirm = ref(false)
const delIdx = ref(null)
function delWithConfirm(idx) {
  delIdx.value = idx
  showDelConfirm.value = true
}
function delWithConfirmById(id) {
  const idx = dataList.value.findIndex(i => i.id === id)
  delWithConfirm(idx)
}
function confirmDel() {
  dataList.value.splice(delIdx.value, 1)
  doFilter() // 删除后重新筛选
  showDelConfirm.value = false
  delIdx.value = null
  uni.showToast({ title: '删除成功', icon: 'success' })
}
function cancelDel() {
  showDelConfirm.value = false
  delIdx.value = null
}

function openAdd() {
  editIdx.value = null
  Object.assign(form, { name: '', type: '', section: '', status: '', principal: '', maintainer: '', entryDate: '', location: '', remark: '' })
  errorMsg.value = ''
  showDialog.value = true
}
function openEdit(idx) {
  editIdx.value = idx
  Object.assign(form, dataList.value[idx])
  errorMsg.value = ''
  showDialog.value = true
}
function openEditById(id) {
  const idx = dataList.value.findIndex(i => i.id === id)
  openEdit(idx)
}
function save() {
  // 校验
  if (!form.name || !form.type || !form.section || !form.status) {
    errorMsg.value = '请填写所有必填项';
    return;
  }
  if (editIdx.value === null) {
    dataList.value.push({
      id: Date.now(),
      name: form.name,
      type: form.type,
      section: form.section,
      status: form.status,
      principal: form.principal,
      maintainer: form.maintainer,
      entryDate: form.entryDate,
      location: form.location,
      remark: form.remark
    })
    uni.showToast({ title: '添加成功', icon: 'success' })
  } else {
    Object.assign(dataList.value[editIdx.value], form)
    uni.showToast({ title: '修改成功', icon: 'success' })
  }
  doFilter()
  showDialog.value = false
}
function closeDialog() {
  showDialog.value = false
  errorMsg.value = ''
  editIdx.value = null
}
function resetFilter() {
  filterField.value = filterFields[0].value
  filterValue.value = ''
  filteredList.value = [...dataList.value]
  currentPage.value = 1
}

const selectOpen = ref(false)
const selectRef = ref(null)
function toggleSelect() {
  selectOpen.value = !selectOpen.value
}
function selectField(val) {
  filterField.value = val
  selectOpen.value = false
}
function handleClickOutside(e) {
  let el = selectRef.value
  if (el && el.$el) el = el.$el
  if (el && typeof el.contains === 'function' && !el.contains(e.target)) {
    selectOpen.value = false
  }
}
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
button{
    margin: 0;
    padding: 0;
    overflow: unset;
}
.machine-manage-root {
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 28rpx;
}
.table-toolbar {
    width: 100%;
    background-color: #fff;
    padding: 20rpx;
    border-radius: 10rpx;
  margin-bottom: 24rpx;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 10rpx;
}
.filter-input{
    background-color: #eeeeee;
    color: #353535;
    border-radius: 8rpx;
    padding: 10rpx 20rpx;
    font-size: 28rpx;
}
.filter-input:focus {
    border:1rpx solid #777777 ;
}
.toolBtn{
    margin: 0;
    margin-right: 10rpx;
    font-size: 26rpx;
    width: 120rpx;
}
.search-btn{
    background-color: #4c84fc;
    color: #fff;
}
.reset-btn{
    color: #5a5a5a;
}
.table-card{
    width: 100%;
    background-color: #fff;
    padding: 20rpx;
    border-radius: 10rpx;
    margin-bottom: 20rpx;
}
.table{
    display: flex;
    flex-direction: column;
    border: 1rpx solid #dbdbdb;
    border-radius: 15rpx;
    overflow: hidden;
    color: #353535;
}
.table-row{
    display: flex;
    flex-wrap: nowrap;
    border-bottom:1px solid #dbdbdb;
}
.table-row:last-child{
    border-bottom: none;
}
.table-header{
    background-color: #f0f0f8;
}
.table-cell{
    flex-grow: 1;
    width: 200rpx;
    height: 80rpx;
    line-height: 80rpx;
    padding: 12rpx;
    text-align: center;
}

.table-opBtns{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300rpx;
}
.table-opBtn{
    border: none;
    margin: 0;
    margin-right: 5rpx;
    padding: 0;
    font-size: 26rpx;
    line-height: 40rpx;
    width: 80rpx;
    height: 45rpx;
}
.edit-btn{
    color: #145fff;
}
.del-btn{
    color: #f04343;
}
.detail-btn{
    color: #5a5a5a;
}
.pagination-bar{
    width: 100%;
    padding: 20rpx;
    background-color: #fff;
    border-radius: 10rpx;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
.page-btn{
    width: 100rpx;
    height: 50rpx;
    line-height: 50rpx;
    font-size: 26rpx;
    color: #686868;
    background-color: #f0f0f8;
}
.page-info{
    margin: 0 20rpx;
}

.custom-select {
  position: relative;
  display: inline-block;
  min-width: 180rpx;
  font-size: 28rpx;
  vertical-align: middle;
}
.custom-select-btn {
  background: #4c84fc;
  color: #fff;
  border: none;
  border-radius: 12rpx;
  padding: 10rpx 40rpx 10rpx 20rpx;
  cursor: pointer;
  min-width: 180rpx;
  text-align: left;
  position: relative;
  user-select: none;
}
.custom-select-arrow {
  position: absolute;
  right: 16rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 22rpx;
  color: #fff;
}
.custom-select-options {
  position: absolute;
  left: 0;
  top: 110%;
  background: #fff;
  border-radius: 0 0 12rpx 12rpx;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.08);
  min-width: 100%;
  z-index: 10;
  overflow: hidden;
}
.custom-select-option {
  padding: 12rpx 20rpx;
  color: #353535;
  cursor: pointer;
  transition: background 0.15s;
}
.custom-select-option:hover, .custom-select-option.active {
  background: #f0f0f8;
  color: #145fff;
}

.status-dot {
  display: inline-block;
  width: 18rpx;
  height: 18rpx;
  border-radius: 50%;
  margin-right: 10rpx;
  vertical-align: middle;
}
.status-dot-运行 {
  background: #3ecb6c;
}
.status-dot-停机 {
  background: #bdbdbd;
}
.status-dot-维护 {
  background: #4c84fc;
}
.status-dot-故障 {
  background: #f04343;
}
/* 兼容英文或其他状态 */
.status-dot-running {
  background: #3ecb6c;
}
.status-dot-stopped {
  background: #bdbdbd;
}
.status-dot-maintain {
  background: #4c84fc;
}
.status-dot-error {
  background: #f04343;
}

@media (max-width: 900px) {
    
}
</style>
