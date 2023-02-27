import type { FunctionalComponent } from 'vue'
import type { CellRenderProps } from 'element-plus'
import { ElInput, ElTooltip } from 'element-plus'

interface SelectionCellProps {
  value: string
  intermediate?: boolean
  onChange: (value: string) => void
  forwardRef: (el: InputInstance) => void
}

const InputCell: FunctionalComponent<SelectionCellProps> = ({
  value,
  onChange,
  forwardRef,
}) => {
  return (
    <ElInput ref={forwardRef as any} onInput={onChange} modelValue={value} />
  )
}

export function ElInputCell({ rowData, cellData, column }: CellRenderProps): FunctionalComponent<SelectionCellProps> {
  const onChange = (value: string) => {
    rowData[column.dataKey!] = value
  }
  const onEnterEditMode = () => {
    if (!rowData._editing)
      rowData._editing = {}

    rowData._editing[column.dataKey!] = true
  }

  const onExitEditMode = () => (rowData._editing[column.dataKey!] = false)
  const input = ref()
  const setRef = (el) => {
    input.value = el
    if (el)
      el.focus?.()
  }

  return rowData?._editing?.[column.dataKey!]
    ? (
        <InputCell
          forwardRef={setRef}
          value={rowData[column.dataKey!]}
          onChange={onChange}
          onBlur={onExitEditMode}
          onKeydownEnter={onExitEditMode}
        />
      )
    : (
      <ElTooltip content={`${cellData}`} placement="top" effect="customized">
        <div onClick={onEnterEditMode}>{cellData}</div>
      </ElTooltip>
      )
}
