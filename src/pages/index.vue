<script setup lang="tsx">
import type { CellRenderProps, Column } from 'element-plus'
import type { CSSProperties, VNode } from 'vue'
import { cloneVNode } from 'vue'
import { ElInputCell } from '~/components/ElInputCell'
import type { IDataItem } from '~/utils/init'
import { init, otherData, specList } from '~/utils/init'
import { calcMerge } from '~/utils/merge'

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

type TableColumn = Column<IDataItem>

const dataSource = ref<IDataItem[]>([])
const columns = ref<Column[]>([])
const merges = ref<number[][]>([])
const dataLen = ref<number[]>([])

function initDataSource() {
  dataSource.value = init()
}
function initColumns() {
  columns.value = [
    ...specList,
    ...otherData.map(item => ({ label: item, value: item })),
  ].reduce<Partial<TableColumn>[]>((acc, cur, idx) => [
    ...acc,
    {
      title: cur.label,
      dataKey: cur.value,
      width: 100,
      ...(idx > specList.length - 1
        ? {
            cellRenderer: (props: CellRenderProps) => ElInputCell(props),
          }
        : {}),
    },
  ], []) as TableColumn[]
}
function calcColumnMerge() {
  merges.value = calcMerge(dataSource.value, specList)

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
    <el-table-v2 :columns="columns" border :data="dataSource" :width="700" :height="400" fixed>
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
