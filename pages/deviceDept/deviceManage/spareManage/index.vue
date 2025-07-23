<template>
  <view class="spare-manage-root">
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
      <view class="input-box" >
        <input class="filter-input" v-model="filterValue" :placeholder="filterPlaceholder" @focus="enumInputFocusHandle" @blur="hiddenEnum" />
        <view v-show="showEnumCandidates" class="enum-candidates">
          <view class="enum-candidate" v-for="c in enumCandidates" :key="c" @mousedown="selectEnumCandidate(c)">{{ c }}</view>
        </view>
      </view>
      <button class="toolBtn search-btn" @click="doFilter">搜索</button>
      <button class="toolBtn reset-btn" @click="resetFilter">重置</button>
      <button class="toolBtn add-btn" @click="openAdd">新增</button>
    </view>
    
    <view class="table-card">
      <view class="table">
        <view class="table-row table-header">
          <view class="table-cell">备件名称</view>
          <view v-if="!isNarrowScreen" class="table-cell">类型</view>
          <view v-if="!isNarrowScreen" class="table-cell">工段</view>
          <view class="table-cell">库存数量</view>
          <view v-if="!isNarrowScreen" class="table-cell">规格</view>
          <view v-if="!isNarrowScreen" class="table-cell">型号</view>
          <view class="table-cell table-opBtns">操作</view>
        </view>
        <view class="table-row table-dataContent" v-for="(item, idx) in pagedList" :key="item.id">
          <view class="table-cell">{{ item.name }}</view>
          <view v-if="!isNarrowScreen" class="table-cell">{{ item.type }}</view>
          <view v-if="!isNarrowScreen" class="table-cell">{{ item.section }}</view>
          <view class="table-cell">{{ item.quantity }}</view>
          <view v-if="!isNarrowScreen" class="table-cell">{{ item.spec }}</view>
          <view v-if="!isNarrowScreen" class="table-cell">{{ item.model }}</view>
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
        <view class="dialog-title">{{ editIdx === null ? '添加备件' : '编辑备件' }}</view>
        <view class="dialog-body">
          <view class="form-row" v-for="f in detailFields" :key="f.value">
            <label class="form-label">{{ f.label }}</label>
            <input class="edit-input" v-model="form[f.value]" :placeholder="f.label" />
          </view>
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
        <view class="dialog-title">备件详情</view>
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
        <view class="dialog-body">确定要删除该备件吗？</view>
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
import { spareList } from '@/utils/mockData.js'

const dataList = ref(spareList.map(item => ({ ...item })))

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
  { value: 'name', label: '备件名称', type: 'text' },
  { value: 'type', label: '类型', type: 'text' },
  { value: 'section', label: '工段', type: 'enum', candidates: ['炼胶','压出','成型','硫化'] },
  { value: 'quantity', label: '库存数量', type: 'text' },
  { value: 'spec', label: '规格', type: 'text' },
  { value: 'model', label: '型号', type: 'text' }
]
const filterField = ref(filterFields[0].value)
const filterValue = ref('')
const showEnumCandidates = ref(false)
const filterPlaceholder = computed(() => {
  const f = filterFields.find(f => f.value === filterField.value)
  return f ? `请输入${f.label}` : '请输入筛选内容'
})

// 枚举候选词逻辑
const enumInputFocusHandle = ()=>{
  const isEnum = filterFields.find(f => f.value === filterField.value)
  if(isEnum) showEnumCandidates.value = true
}
const enumCandidates = computed(() => {
  const f = filterFields.find(f => f.value === filterField.value)
  if (!f || f.type !== 'enum') return []
  return f.candidates
})
function selectEnumCandidate(val) {
  filterValue.value = val
  showEnumCandidates.value = false
}
const hiddenEnum = ()=>{
  showEnumCandidates.value = false
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
    filteredList.value = dataList.value.filter(item => (item[f.value] || '').toString().toLowerCase().includes(filterValue.value.toLowerCase()))
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
  { value: 'name', label: '备件名称' },
  { value: 'type', label: '类型' },
  { value: 'section', label: '工段' },
  { value: 'quantity', label: '库存数量' },
  { value: 'spec', label: '规格' },
  { value: 'model', label: '型号' }
]
function showDetail(item) {
  detailItem.value = { ...item }
  showDetailDialog.value = true
}
function closeDetail() {
  showDetailDialog.value = false
  detailItem.value = {}
}

// 增删改查逻辑
const showDialog = ref(false)
const editIdx = ref(null)
const form = reactive({
  name: '', type: '', section: '', quantity: '', spec: '', model: ''
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
  uni.showToast && uni.showToast({ title: '删除成功', icon: 'success' })
}
function cancelDel() {
  showDelConfirm.value = false
  delIdx.value = null
}

function openAdd() {
  editIdx.value = null
  Object.assign(form, { name: '', type: '', section: '', quantity: '', spec: '', model: '' })
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
  if (!form.name || !form.type || !form.section || form.quantity === '') {
    errorMsg.value = '请填写所有必填项';
    return;
  }
  if (editIdx.value === null) {
    dataList.value.push({
      id: Date.now(),
      name: form.name,
      type: form.type,
      section: form.section,
      quantity: Number(form.quantity),
      spec: form.spec,
      model: form.model
    })
    uni.showToast && uni.showToast({ title: '添加成功', icon: 'success' })
  } else {
    Object.assign(dataList.value[editIdx.value], form)
    dataList.value[editIdx.value].quantity = Number(form.quantity)
    uni.showToast && uni.showToast({ title: '修改成功', icon: 'success' })
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
.spare-manage-root {
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
.input-box{
  position: relative;
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
.enum-candidates{
  position: absolute;
  width: 100%;
  border-bottom-left-radius: 10rpx;
  border-bottom-right-radius: 10rpx;
  background-color: #fff;
  box-shadow:0 4rpx 16rpx rgba(0,0,0,0.08);
  z-index: 10;
}
.enum-candidate {
  padding: 12rpx 20rpx;
  color: #353535;
  cursor: pointer;
  transition: background 0.15s;
}
.enum-candidate:hover, .enum-candidate.active {
  background: #f0f0f8;
  color: #145fff;
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
.add-btn{
  margin-left: 20rpx;
  border: 1rpx solid #709cfc;
  background-color: #fff;
  color: #556c9c;
}
.add-btn:hover{
  outline: 3rpx solid #709cfc;
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

/* 弹窗样式 */
.dialog-mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.35);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dialog {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  min-width: 800rpx;
  max-width: 92vw;
  padding: 32px 28px 20px 28px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
}
.dialog-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 18px;
  text-align: left;
  letter-spacing: 1px;
}
.dialog-body {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  margin-bottom: 18px;
}
/* 表单行样式 */
.form-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.form-label {
  min-width: 80px;
  color: #909399;
  font-size: 24rpx;
  margin-right: 12px;
  text-align: right;
  flex-shrink: 0;
}
.dialog-body input {
  flex: 1;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 25rpx;
  background: #fafbfc;
  color: #303133;
  outline: none;
  transition: border 0.2s;
  width: 100%;
}
.dialog-body input:focus {
  border-color: #409eff;
  background: #fff;
}
.form-error {
  color: #f56c6c;
  font-size: 13px;
  margin-top: 4px;
  text-align: left;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 18px;
  margin-top: 6rpx;
}
.dialog-footer button {
  min-width: 88px;
  padding: 8rpx 0;
  border-radius: 6rpx;
  font-size: 22rpx;
  border: none;
  background: #409eff;
  color: #fff;
  font-weight: 500;
  transition: background 0.2s;
  cursor: pointer;
  box-sizing: border-box;
}
.dialog-footer button:last-child {
  background: #f4f4f5;
  color: #606266;
}
.dialog-footer button:active {
  background: #337ecc;
}

/* 详情弹窗样式 */
.detail-dialog {
  min-width: 340px;
  max-width: 92vw;
  padding: 32px 28px 20px 28px;
}
.detail-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 4px 0 0 0;
}
.detail-row {
  display: flex;
  align-items: flex-start;
  font-size: 15px;
  color: #303133;
  border-bottom: 1px solid #f0f0f0;
  padding: 7px 0;
}
.detail-row:last-child {
  border-bottom: none;
}
.detail-label {
  min-width: 90px;
  color: #909399;
  font-weight: 500;
  flex-shrink: 0;
}
.detail-value {
  flex: 1;
  color: #303133;
  margin-left: 8px;
  word-break: break-all;
}

@media (max-width: 900px) {
  .dialog{
    min-width: 500rpx;
  }
  .detail-dialog{
    min-width: 500rpx;
  }
}
</style>
