<script setup lang="tsx">
import type { Column } from 'element-plus'
import { ElTooltip } from 'element-plus'
import type { CSSProperties, VNode } from 'vue'
import { cloneVNode } from 'vue'

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

interface IOptionItem {
  label: string
  value: string
}

interface ISpecItem extends IOptionItem {
  value: keyof IDataItem
  options: IOptionItem[]
}

interface IDataItem {
  id: number
  scheme: string
  network: string
  memory: string
  color: string
  degree: string
}

type TTableColumn = Column<IDataItem>

const otherData = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9', 'test10']

const specList: ISpecItem[] = [
  {
    label: '方案',
    value: 'scheme',
    options: [
      { label: '方案1', value: 'scheme1' },
      { label: '方案2', value: 'scheme2' },
      { label: '方案3', value: 'scheme3' },
    ],
  },
  {
    label: '网络',
    value: 'network',
    options: [
      { label: '网络一', value: 'network1' },
      { label: '网络二', value: 'network2' },
      { label: '网络三', value: 'network3' },
      { label: '网络四', value: 'network4' },
      { label: '网络五', value: 'network5' },
      { label: '网络六', value: 'network6' },
      { label: '网络七', value: 'network7' },
      { label: '网络八', value: 'network8' },
      { label: '网络九', value: 'network9' },
      { label: '网络十', value: 'network10' },
    ],
  },
  {
    label: '内存',
    value: 'memory',
    options: [
      { label: '内存一', value: 'memory1' },
      { label: '内存二', value: 'memory2' },
      { label: '内存三', value: 'memory3' },
      { label: '内存四', value: 'memory4' },
      { label: '内存五', value: 'memory5' },
      { label: '内存六', value: 'memory6' },
      { label: '内存七', value: 'memory7' },
      { label: '内存八', value: 'memory8' },
      { label: '内存九', value: 'memory9' },
      { label: '内存十', value: 'memory10' },
    ],
  },
  {
    label: '颜色',
    value: 'color',
    options: [
      { label: '颜色一', value: 'color1' },
      { label: '颜色二', value: 'color2' },
      { label: '颜色三', value: 'color3' },
      { label: '颜色四', value: 'color4' },
      { label: '颜色五', value: 'color5' },
      { label: '颜色六', value: 'color6' },
      { label: '颜色七', value: 'color7' },
      { label: '颜色八', value: 'color8' },
      { label: '颜色九', value: 'color9' },
      { label: '颜色十', value: 'color10' },
    ],
  },
  {
    label: '新旧',
    value: 'degree',
    options: [
      { label: '新旧一', value: 'degree1' },
      { label: '新旧二', value: 'degree2' },
      { label: '新旧三', value: 'degree3' },
      { label: '新旧四', value: 'degree4' },
      { label: '新旧五', value: 'degree5' },
      { label: '新旧六', value: 'degree6' },
      { label: '新旧七', value: 'degree7' },
      { label: '新旧八', value: 'degree8' },
      { label: '新旧九', value: 'degree9' },
      { label: '新旧十', value: 'degree10' },
    ],
  },
]
const dataSource = ref<IDataItem[]>([])
const columns = ref<Column[]>([])
const merges = ref<number[][]>([])
const dataLen = ref<number[]>([])

function initDataSource() {
  dataSource.value = specList.reduce<Partial<IDataItem>[]>((acc, cur) => {
    const specList: Partial<IDataItem>[] = []
    if (!acc.length)
      return cur.options.map(option => ({ [cur.value]: option.value, ...otherData.reduce((acc, cur) => ({ ...acc, [cur]: cur }), {}) }))
    acc.forEach(item => cur.options.forEach(option => specList.push({ ...item, [cur.value]: option.value })))
    return specList
  }, []) as IDataItem[]
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
      cellRenderer: ({ cellData }) => (<ElTooltip content={`${cellData}`} placement="top" effect="customized">{cellData}</ElTooltip>),
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
