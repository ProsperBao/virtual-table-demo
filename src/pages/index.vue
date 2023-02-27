<script setup lang="tsx">
import type { CellRenderProps, Column } from 'element-plus'
import type { CSSProperties, VNode } from 'vue'
import { cloneVNode } from 'vue'
import { ElInputCell } from '~/components/ElInputCell'
import { initData, otherData, specList } from '~/utils/initData'

interface RowSlotProps {
  columnIndex: number
  rowIndex: number
  data: any
  key: number | string
  isScrolling?: boolean | undefined
  style: CSSProperties
  cells: VNode[]
}

defineOptions({
  name: 'Home Page',
})

interface IDataItem {
  id: number
  scheme: string
  network: string
  memory: string
  color: string
  degree: string
}

type TTableColumn = Column<IDataItem>

const dataSource = ref<IDataItem[]>([])
const columns = ref<Column[]>([])
const merges = ref<number[][]>([])
const dataLen = ref<number[]>([])

function initDataSource() {
  dataSource.value = initData()
}
function initColumns() {
  columns.value = [
    ...specList,
    ...otherData.map(item => ({ label: item, value: item })),
  ].reduce<Partial<TTableColumn>[]>((acc, cur) => [
    ...acc,
    {
      title: cur.label,
      dataKey: cur.value,
      width: 100,
      cellRenderer: (props: CellRenderProps) => ElInputCell(props),
    },
  ], []) as TTableColumn[]
}
function calcColumnMerge() {
  // 制作映射查表
  const mergeKeys = specList.map(item => item.value)
  const mergeColLen = mergeKeys.length
  const mergeMap: number[][] = new Array(dataSource.value.length).fill([])
    .map(() => [...new Array(mergeColLen - 1).fill(0), 1])

  const data = dataSource.value

  // 开始计算行
  for (let rowIndex = 0; rowIndex < mergeMap.length; rowIndex++) {
    const row = data[rowIndex]
    const pre = rowIndex > 0 ? data[rowIndex - 1] : null
    // 开始计算列
    for (let columnIndex = 0; columnIndex < mergeColLen; columnIndex++) {
      const colKey = mergeKeys[columnIndex]
      if (rowIndex === 0 || (pre && pre[colKey] !== row[colKey])) {
        let rowspan = 1
        // 向下查找
        for (let i = rowIndex + 1; i < mergeMap.length; i++) {
          const cur = data[i]
          if (cur && row[colKey] === cur[colKey])
            rowspan++
          else
            break
        }
        mergeMap[rowIndex][columnIndex] = rowspan
      }
      else if (pre && pre[colKey] === row[colKey]) {
        mergeMap[rowIndex][columnIndex] = mergeMap[rowIndex - 1][columnIndex] - 1
      }
      else {
        mergeMap[rowIndex][columnIndex] = 0
      }
    }
  }

  merges.value = mergeMap

  specList.reduce((acc, cur) => {
    const res = acc / cur.options.length
    dataLen.value.push(res)
    return res
  }, dataSource.value.length)
}

initColumns()
initDataSource()
calcColumnMerge()

const Row = ({ rowIndex, cells }: RowSlotProps) => {
  for (let colIdx = 0; colIdx < cells.length; colIdx++) {
    if (colIdx >= specList.length)
      continue

    const cell = cells[colIdx]
    const rowSpan = merges.value[rowIndex][colIdx]
    const translate = dataLen.value[colIdx] - rowSpan
    const style = {
      ...cell.props?.style,
      backgroundColor: 'var(--el-color-primary-light-9)',
      borderRight: 'var(--el-table-border)',
      alignSelf: 'flex-start',
      height: `${(dataLen.value[colIdx]) * 50}px`,
      zIndex: dataSource.value.length - rowIndex,
      transform: `translateY(-${translate * 50}px)`,
    }
    cells[colIdx] = cloneVNode(cell, { style })
  }
  return cells
}
</script>

<template>
  <div>
    <el-table-v2 :columns="columns" :data="dataSource" :width="700" :height="400" fixed>
      <template #row="props">
        <Row v-bind="props" />
      </template>
    </el-table-v2>
  </div>
</template>

<style>
.el-popper.is-customized {
  /* Set padding to ensure the height is 32px */
  padding: 6px 12px;
  background: linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129));
}

.el-popper.is-customized .el-popper__arrow::before {
  background: linear-gradient(45deg, #b2e68d, #bce689);
  right: 0;
}
</style>
