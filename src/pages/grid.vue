<script lang="ts" setup>
import type { ColDef } from 'ag-grid-community'
import { AgGridVue } from 'ag-grid-vue3'
import { init, otherData, specList } from '~/utils/init'
import { calcMerge } from '~/utils/merge'
import type { IDataItem } from '~/utils/init'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

type TableColumn = ColDef<IDataItem>

const dataSource = ref<IDataItem[]>([])
const columns = ref<any[]>([])
const merges = ref<number[][]>([])

function mergeCellStyle(params: CellClassParams<RelLeaseTable>) {
  const columnIndex = params.colDef.cellRendererParams.idx
  const rowIndex = params.node!.rowIndex!
  const merge = merges.value[rowIndex][columnIndex]
  if (!merge || merge === 1)
    return
  const transform = (merge > 1 ? 0 : merge - 1) * 80 - 1
  return {
    zIndex: 999999 - rowIndex,
    transform: `translateY(${transform}px)`,
    border: dataSource.value.length > 2 && merge > 1 ? '1px solid #DDD' : '',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'break-spaces',
  }
}
function mergeCellRowSpan(params: RowSpanParams<RelLeaseTable>) {
  const columnIndex = params.colDef.cellRendererParams.idx
  const rowIndex = params.node!.rowIndex!
  return merges.value[rowIndex][columnIndex]
}

function initDataSource() {
  dataSource.value = init()
}
function initColumns() {
  columns.value = [
    ...specList,
    ...otherData.map(item => ({ label: item, value: item })),
  ].reduce<Partial<TTableColumn>[]>((acc, cur, idx) => [
    ...acc,
    {
      headerName: cur.label,
      field: cur.value,
      width: 100,
      ...(idx > specList.length - 1
        ? {

          }
        : {
            cellStyle: params => ({ ...mergeCellStyle(params), lineHeight: '20px' }),
            cellRendererParams: { idx },
            rowSpan: mergeCellRowSpan,
          }),
    },
  ], []) as TTableColumn[]
}
function calcColumnMerge() {
  merges.value = calcMerge(dataSource.value, specList)
}

initColumns()
initDataSource()
calcColumnMerge()

const gridOptions = ref({
  suppressRowDrag: true, // 禁用行拖动
  suppressMovableColumns: true, // 禁用列拖动
  suppressCellFocus: true, // 禁用键盘选中
  getRowId(data) {
    return data.data.id
  },
})

const defaultColDef = ref({
  wrapHeaderText: false, // th文字换行
  autoHeaderHeight: false, // 配合th文字换行
  wrapText: false, // td文字换行
  autoHeight: false, // 配合td文字换行
  resizable: false,
})
</script>

<template>
  <div w-700px>
    <AgGridVue
      :default-col-def="defaultColDef" :grid-options="gridOptions" :suppress-row-transform="true"
      :row-height="80" :row-data="dataSource" :header-height="40" :column-defs="columns" h-400px class="ag-theme-alpine"
    />
  </div>
</template>
