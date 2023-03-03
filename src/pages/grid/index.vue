<script lang="ts" setup>
import type { CellClassParams, CellStyle, ColDef, RowSpanParams } from 'ag-grid-community'
import { AgGridVue } from 'ag-grid-vue3'
import { get, set } from 'lodash-es'
import type { GridCellRenderProps } from './type'
import { init, otherData, specList } from '~/utils/init'
import { calcMerge } from '~/utils/merge'
import type { IDataItem } from '~/utils/init'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import GridInputCell from '~/components/GridInputCell/index.vue'
import GridFilter from '~/components/GridFilter/index.vue'

type TableColumn = ColDef<IDataItem>

const dataSource = ref<IDataItem[]>([])
const columns = ref<any[]>([])
const merges = ref<number[][]>([])
const filters = ref<Record<string, string[]>>({})

function mergeCellStyle(params: CellClassParams<IDataItem>): CellStyle {
  const columnIndex = params.colDef.cellRendererParams.idx
  const rowIndex = params.node!.rowIndex!
  const merge = merges.value[rowIndex][columnIndex]
  if (!merge || merge === 1) {
    return {
      borderRight: '1px solid var(--el-border-color-lighter)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'break-spaces',
    }
  }
  const transform = (merge > 1 ? 0 : merge - 1) * 80 - 1
  return {
    zIndex: 999999 - rowIndex,
    transform: `translateY(${transform}px)`,
    border: '1px solid var(--el-border-color-lighter)',
    borderBottom: 0,
    borderLeft: 0,
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'break-spaces',
  }
}
function mergeCellRowSpan(params: RowSpanParams<IDataItem>) {
  const columnIndex = params.colDef.cellRendererParams.idx
  const rowIndex = params.node!.rowIndex!
  return merges.value[rowIndex][columnIndex]
}

function initDataSource() {
  dataSource.value = init()
}
function initColumns() {
  const funcMapping: Record<string, any> = {
    5: {
      formatter: {
        getter: (data: IDataItem) => `${data.degree}-${data.color}`,
        setter: (data: IDataItem, value: string) => {
          const [degree, color] = value.split('-')
          data.degree = degree
          data.color = color
        },
      },
    },
    7: {
      formatter: {
        getter: (data: IDataItem, colDef: ColDef<IDataItem>) => `*${get(data, colDef.field!)}*`,
        valueGetter: (data: IDataItem, colDef: ColDef<IDataItem>) => `${get(data, colDef.field!)}`,
      },
    },
    8: {
      formatter: {
        getter: (data: IDataItem, colDef: ColDef<IDataItem>) => `*${get(data, colDef.field!)}*`,
        setter: (value: string, data: IDataItem, colDef: ColDef<IDataItem>) => set(data, colDef.field!, value.replace(/^\*/, '').replace(/\*$/, '')),
      },
    },
  }

  columns.value = [
    ...specList,
    ...otherData.map(item => ({ label: item, value: item })),
  ].reduce<Partial<TableColumn>[]>((acc, cur, idx) => [
    ...acc,
    {
      headerName: cur.label,
      field: cur.value,
      width: 100,
      ...(idx > specList.length - 1
        ? {
            cellRenderer: GridInputCell,
            cellRendererParams: {
              idx,
              disabled: (data: IDataItem, renderProps: any) => renderProps.idx === 6 && ['degree1', 'degree2', 'degree3', 'degree4'].includes(data.degree),
              readonly: (data: IDataItem, renderProps: any) => renderProps.idx === 7 && ['degree5', 'degree6', 'degree7', 'degree8'].includes(data.degree),
              ...(funcMapping[`${idx}`] || {}),
            } as GridCellRenderProps,
          }
        : {
            cellStyle: (params: CellClassParams<IDataItem>) => ({ ...mergeCellStyle(params), lineHeight: '20px' }),
            cellRendererParams: { idx } as GridCellRenderProps,
            filter: GridFilter,
            filterParams: {
              options: specList[idx].options,
            },
            rowSpan: mergeCellRowSpan,
          }),
    },
  ], []) as TableColumn[]
}
function calcColumnMerge() {
  const filterDataSource = dataSource.value.filter((item) => {
    const keys = Object.keys(filters.value).filter(i => filters.value[i].length)
    return keys.length
      ? keys.every(key => filters.value[key].includes(item[key]))
      : true
  })
  merges.value = calcMerge(filterDataSource, specList)
}

initColumns()
initDataSource()
calcColumnMerge()

const gridOptions = ref({
  suppressRowDrag: true,
  suppressMovableColumns: true,
  suppressCellFocus: true,
  getRowId(data: { data: { id: string } }) {
    return data.data.id
  },
})

const defaultColDef = ref({
  wrapHeaderText: false,
  autoHeaderHeight: false,
  wrapText: false,
  autoHeight: false,
  resizable: false,
})

provide('calcColumnMerge', calcColumnMerge)
provide('filters', filters)
</script>

<template>
  <div w-700px>
    <AgGridVue
      :default-col-def="defaultColDef" :grid-options="gridOptions" :suppress-row-transform="true"
      :row-height="80" :row-data="dataSource" :header-height="40" :column-defs="columns" h-400px
      class="ag-theme-alpine ag-theme-element"
    >
      <AgGridColumnMenu>
        <template>
          <ElIcon name="el-icon-more" />
        </template>
      </AgGridColumnMenu>
    </AgGridVue>
    <GridPopover />
  </div>
</template>

<style lang="scss">
.ag-theme-element {
  --ag-header-background-color: var(--el-fill-color-light);
  --ag-border-color: var(--el-border-color-lighter);
  --ag-control-panel-background-color: var(--el-bg-color-overlay);

  .ag-cell {
    border-right: 1px solid var(--el-border-color-lighter) !important;
  }

  .ag-header-cell,
  .ag-header-group-cell {
    border-right: 1px solid var(--el-border-color-lighter);
  }

  .ag-body {
    --ag-cell-horizontal-padding: 0;
  }

  .ag-row-hover,
  .ag-row-hover:not(.ag-full-width-row)::before {
    background: var(--el-fill-color-light) !important;
  }
}
/* Set the icon font to element plus */
:root {
  --ag-icon-font-family: 'element-plus';
}

/* Set the filter icon character to '\e6a7' */
.ag-theme-alpine .ag-header-cell-menu-button {
  --ag-icon-font-code-filter: '\e6a7';
}
</style>
