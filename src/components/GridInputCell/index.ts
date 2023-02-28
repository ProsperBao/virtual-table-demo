export function useCellEditing() {
  const editing = ref(false)
  const inputRef = ref()
  const visible = ref(false)

  const onExitEditMode = () => (editing.value = false)
  const onEnterEditMode = () => {
    editing.value = true
    visible.value = false
    inputRef.value && setTimeout(inputRef.value.focus)
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
export function usePopover(callback?: Function) {
  function setPopoverRef(ref: any) {
    popoverRef.value = ref
  }
  function setDispatchRef(ref: any) {
    dispatchRef.value = ref
    unref(popoverRef).popperRef?.delayShow?.()
  }
  function onClickOutside() {
    unref(popoverRef).popperRef?.delayHide?.()
    callback?.()
  }

  return {
    setPopoverRef,
    popoverRef,
    dispatchRef,
    onClickOutside,
    setDispatchRef,
  }
}
