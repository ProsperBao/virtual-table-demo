<script lang="ts" setup>
import type { ColDef, ICellRendererParams } from 'ag-grid-community'
import { get, set } from 'lodash-es'
import { conditionFunc, useCellEditing, usePopover } from '.'
import type { IDataItem } from '~/utils/init'
import type { GridCellRenderProps } from '~/pages/grid/type'
const props = defineProps<{ params: ICellRendererParams<IDataItem> }>()

const colDef = props.params.colDef! as ColDef<IDataItem>
const renderProps = colDef.cellRendererParams as GridCellRenderProps
const field = colDef.field!

const cellValue = computed({
  get: () => {
    if (typeof renderProps.formatter !== 'function' && renderProps.formatter?.getter)
      return renderProps.formatter.getter(props.params.data!, colDef)
    else if (typeof renderProps.formatter === 'function')
      return renderProps.formatter(props.params.data!, colDef)
    return get(props.params.data, field)
  },
  set: (val) => {
    if (typeof renderProps.formatter !== 'function' && renderProps.formatter?.setter)
      renderProps.formatter.setter(val, props.params.data!, colDef)
    else
      set(props.params!.data!, field, val)

    props.params.api!.applyTransaction({ update: [props.params!.data!] })
  },
})
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

const { editing, inputRef, onExitEditMode, onEnterEditMode } = useCellEditing()
const { setDispatchRef } = usePopover(onExitEditMode)
</script>

<template>
  <div v-if="disabled" class="grid-input-cell disabled" />
  <div
    v-else class="grid-input-cell" :class="{ readonly }" w-full
    h-full
    @mouseenter="(e) => setDispatchRef(e.currentTarget)"
  >
    <input v-if="editing" ref="inputRef" v-model.lazy="cellInputValue" @blur="onExitEditMode" @keydown.enter="onExitEditMode">
    <div v-if="!editing" flex justify-center items-center h-full truncate @click="onEnterEditMode">
      {{ cellValue }}
    </div>
  </div>
</template>

<style lang="scss">
.grid-input-cell {
  &.disabled::before{
    content: ' ';
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
  }
  &.readonly {
    pointer-events: none;
    opacity: 0.25;
    background: var(--el-fill-color-light);
  }
  &.disabled::before {
    cursor: not-allowed;
  }

  input {
    width: 100%;
    height: 100%;
    text-align: center;
    outline: none;
  }
}
</style>
