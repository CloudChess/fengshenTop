<template>
  <div class="stacked-bar-chart">
    <div class="chart-bars-and-labels">
      <div class="bar-group" v-for="(group, groupIdx) in categories" :key="group">
        <div class="bar-stack">
          <div
            v-for="(s, sIdx) in series"
            :key="s.name"
            class="bar-segment"
            :style="segmentStyle(s, groupIdx, sIdx)"
            @click="handleClick(s, groupIdx, sIdx)"
          >
            <span v-if="s.data[groupIdx] > 0 && !shouldHideValue(s.name)" class="bar-value">{{ s.data[groupIdx] }}</span>
          </div>
        </div>
        <div class="section-label">{{ group }}</div>
      </div>
    </div>
    <div class="bar-legend">
      <div class="legend-item" v-for="(s, idx) in series" :key="s.name">
        <span class="legend-dot" :style="{background: colors[idx]}" />{{ s.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  categories: Array, // ['炼胶', '压出', ...]
  series: Array,     // [{name: '运行', data: [16,12,...]}, ...]
  colors: Array,     // ['#34c759', ...]
  onSegmentClick: Function, // (series, groupIdx, sIdx) => void
  hideValueFor: {    // 需要隐藏数字的 series 名称数组
    type: Array,
    default: () => []
  }
});

const MIN_HEIGHT = 18; // px

function shouldHideValue(seriesName) {
  return props.hideValueFor && props.hideValueFor.includes(seriesName);
}

function segmentStyle(s, groupIdx, sIdx) {
  const total = props.series.reduce((sum, item) => sum + (item.data[groupIdx] || 0), 0) || 1;
  const value = s.data[groupIdx] || 0;
  if (value === 0) return { display: 'none' };

  // 找到当前柱子非零的segment索引
  const nonZeroIdxs = props.series.map((item, idx) => item.data[groupIdx] > 0 ? idx : -1).filter(idx => idx !== -1);
  const isBottom = sIdx === nonZeroIdxs[0];
  const isTop = sIdx === nonZeroIdxs[nonZeroIdxs.length - 1];

  let borderRadius = '0px';
  if (isBottom && isTop) {
    borderRadius = '8px'; // 只有一个segment时，四角圆角
  } else if (isBottom) {
    borderRadius = '0 0 8px 8px';
  } else if (isTop) {
    borderRadius = '8px 8px 0 0';
  }

  // 计算高度，保证最小高度
  let percent = value / total;
  let heightPx = Math.max(percent * 80, MIN_HEIGHT); // 80px为柱子总高

  // 处理所有segment最小高度后，超出柱子总高的情况
  // 先统计所有segment最小高度之和
  const nonZeroCount = nonZeroIdxs.length;
  let minTotal = nonZeroCount * MIN_HEIGHT;
  if (minTotal > 80) {
    // 平均分配高度
    heightPx = 80 / nonZeroCount;
  } else if (percent * 80 < MIN_HEIGHT) {
    // 只对当前segment生效
    // 其余segment按比例分配剩余高度
    // 这里简单处理：只要有数据就最小MIN_HEIGHT
    heightPx = MIN_HEIGHT;
  }

  return {
    height: heightPx + 'px',
    background: props.colors[sIdx] || '#ccc',
    cursor: props.onSegmentClick ? 'pointer' : 'default',
    borderRadius,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    color: '#fff',
    fontWeight: 600,
    position: 'relative',
    zIndex: props.series.length - sIdx,
    margin: 0,
    padding: 0,
    boxShadow: 'none',
    minHeight: MIN_HEIGHT + 'px',
    overflow: 'hidden',
  };
}

function handleClick(s, groupIdx, sIdx) {
  if (props.onSegmentClick && s.data[groupIdx] > 0) {
    props.onSegmentClick(s, groupIdx, sIdx);
  }
}
</script>

<style scoped>
.stacked-bar-chart {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 140px;
}
.chart-bars-and-labels {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 24px;
  justify-content: flex-start;
  margin-bottom: 16px;
}
.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 38px;
  min-width: 38px;
}
.bar-stack {
  width: 100%;
  height: 80px;
  display: flex;
  flex-direction: column-reverse;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0f0;
  position: relative;
}
.bar-segment {
  width: 100%;
  transition: height 0.3s;
  position: relative;
  margin: 0;
  padding: 0;
  box-shadow: none;
}
.bar-value {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}
.section-label {
  font-size: 13px;
  color: #333;
  text-align: center;
  margin-top: 6px;
  width: 100%;
  word-break: keep-all;
}
.bar-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}
.legend-item {
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #666;
  gap: 6px;
}
.legend-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: inline-block;
}
</style> 