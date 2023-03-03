import type { ICellRendererParams } from 'ag-grid-community'
import { debounce } from 'lodash-es'
import type { DefineComponent } from 'vue'
import type { GridCellRenderProps } from '~/pages/grid/type'
import type { IDataItem } from '~/utils/init'

const popoverRef = ref()
const dispatchRef = ref()
const popoverParams = ref<ICellRendererParams<IDataItem>>()
const popoverProps = computed<GridCellRenderProps>(() => popoverParams.value?.colDef?.cellRendererParams)
export function usePopover() {
  function setDispatchRef(ref: any, params: ICellRendererParams<IDataItem>) {
    dispatchRef.value = ref
    popoverParams.value = params
    unref(popoverRef).popperRef?.delayShow?.()
  }

  return {
    popoverRef,
    dispatchRef,
    onClickOutside,
    setDispatchRef: debounce(setDispatchRef, 250, { leading: true, trailing: false }),

    popoverParams,
    popoverProps,

    component: computedAsync(async () => markRaw((await unref(popoverProps)?.popover?.component?.()).default as DefineComponent)),
    componentFlag: computed(() => `${popoverParams.value?.node.id}-${popoverParams.value?.colDef?.field}`),
  }
}
