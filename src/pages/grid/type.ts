import type { ColDef } from 'ag-grid-community'
import type { IDataItem } from '~/utils/init'

export type PropsConditionFunc = (data: IDataItem, renderProps: GridCellRenderProps) => boolean
export type PropsFormatterFunc = (data: IDataItem, renderProps: GridCellRenderProps) => string

export type PropsFormatterGetter = (data: IDataItem, colDef: ColDef<IDataItem>) => string
export interface PropsFormatter {
  /** 取值格式化显示 */
  getter: PropsFormatterGetter
  /** 输入框取值格式化 */
  valueGetter?: (data: IDataItem, colDef: ColDef<IDataItem>) => string
  /** 格式化保存值 */
  setter: <T = any>(value: T, data: IDataItem, colDef: ColDef<IDataItem>) => void
}

export interface GridCellRenderProps {
  idx: number
  disabled?: boolean | PropsConditionFunc
  readonly?: boolean | PropsConditionFunc
  formatter?: PropsFormatter | PropsFormatterGetter
}
