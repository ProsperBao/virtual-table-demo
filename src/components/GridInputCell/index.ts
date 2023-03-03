import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import { get, set } from 'lodash-es'
import type { GridCellRenderProps, PropsConditionFunc } from '~/pages/grid/type'
import type { IDataItem } from '~/utils/init'

export function useCellEditing() {
  const editing = ref(false)
  const inputRef = ref()
  const visible = ref(false)

  const onExitEditMode = () => (editing.value = false)
  const onEnterEditMode = () => {
    editing.value = true
    visible.value = false
    setTimeout(() => inputRef.value?.focus())
  }

  return {
    editing,
    inputRef,
    visible,
    onExitEditMode,
    onEnterEditMode,
  }
}

export function conditionFunc({
  props, key, data,
}: {
  props: GridCellRenderProps
  key: keyof Pick<GridCellRenderProps, 'disabled' | 'readonly'>
  data: IDataItem
}) {
  if (!props[key])
    return false
  if (typeof props[key] === 'boolean')
    return props[key]
  return (props[key] as PropsConditionFunc)(data, props)
}

export function useCellValue(props: { params: ICellRendererParams<IDataItem> }) {
  const colDef = props.params.colDef! as ColDef<IDataItem>
  const renderProps = colDef.cellRendererParams as GridCellRenderProps
  const field = colDef.field!
  // 用于显示的值
  const cellValue = computed({
    get: () => {
      if (typeof renderProps.formatter !== 'function' && renderProps.formatter?.getter)
        return renderProps.formatter.getter(props.params.data!, colDef)
      else if (typeof renderProps.formatter === 'function')
        return renderProps.formatter(props.params.data!, colDef)

      return get(props.params.data, field)
    },
    set: (val) => {
      if (typeof renderProps.formatter !== 'function' && renderProps.formatter?.setter) {
        // 格式化整行需要更新
        renderProps.formatter.setter(val, props.params.data!, colDef)
        props.params.api!.redrawRows({ rowNodes: [props.params.node!] })
      }
      else {
        // 单元格更新
        set(props.params!.data!, field, val)
        props.params.api!.applyTransaction({ update: [props.params!.data!] })
      }
    },
  })
  // 用于输入框的值
  const cellInputValue = computed({
    get: () => {
      if (typeof renderProps.formatter !== 'function' && renderProps.formatter?.valueGetter)
        return renderProps.formatter.valueGetter(props.params.data!, colDef)
      return cellValue.value
    },
    set: val => (cellValue.value = val),
  })

  const disabled = $computed(() => conditionFunc({ props: renderProps, key: 'disabled', data: props.params.data! }))
  const readonly = $computed(() => conditionFunc({ props: renderProps, key: 'readonly', data: props.params.data! }))

  return {
    cellValue,
    cellInputValue,
    disabled,
    readonly,
  }
}
