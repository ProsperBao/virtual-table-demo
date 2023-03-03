import type { Component } from 'vue'
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

const popoverRef = ref()
const dispatchRef = ref()
const popoverComponent = ref<Component>()
const popoverProps = ref<GridCellRenderProps>()
export function usePopover(callback?: Function) {
  function setPopoverRef(ref: any) {
    popoverRef.value = ref
  }
  function setDispatchRef(ref: any) {
    dispatchRef.value = ref
    unref(popoverRef).popperRef?.delayShow?.()
  }
  function onClickOutside() {
    // 提前隐藏，否则会有闪烁
    const contentRef = unref(popoverRef)?.popperRef?.contentRef
    contentRef && (contentRef.style.display = 'none')

    unref(popoverRef).popperRef?.delayHide?.()
    callback?.()
  }

  function setComponent(component: Component, props: GridCellRenderProps) {
    popoverComponent.value = component
    popoverProps.value = props
  }

  return {
    setPopoverRef,
    popoverRef,
    dispatchRef,
    onClickOutside,
    setDispatchRef,
    component: popoverComponent,
    popoverProps,
    setComponent,
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
