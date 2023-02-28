import type { IDataItem } from '~/utils/init'

export interface GridCellRenderProps {
  idx: number
  disabled?: boolean | ((params: IDataItem, renderProps: GridCellRenderProps) => boolean)
}
