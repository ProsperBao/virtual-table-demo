<script lang="ts" setup>
import type { ICellRendererParams } from 'ag-grid-community'
import { ClickOutside as vClickOutside } from 'element-plus'
import { get, set } from 'lodash-es'
import { useCellEditing, usePopover } from '.'
import type { IDataItem } from '~/utils/init'
import type { GridCellRenderProps } from '~/pages/grid/type'
const props = defineProps<{ params: ICellRendererParams<IDataItem> }>()

const colDef = props.params.colDef!
const field = colDef.field!
const value = computed({
  get: () => get(props.params.data, field),
  set: (val) => {
    set(props.params!.data!, field, val)
    props.params.api!.applyTransaction({ update: [props.params!.data!] })
  },
})
const disabled = $computed(() => {
  const renderProps = colDef.cellRendererParams as GridCellRenderProps
  return typeof renderProps.disabled === 'function'
    ? renderProps.disabled(props.params.data!, renderProps)
    : renderProps.disabled
})

const { editing, inputRef, onExitEditMode, onEnterEditMode } = useCellEditing()
const { setDispatchRef, onClickOutside } = usePopover(onExitEditMode)
</script>

<template>
  <div v-click-outside="onClickOutside" :class="{ disabled }" class="grid-input-cell" w-full h-full @mouseenter="(e) => setDispatchRef(e.currentTarget)">
    <input v-if="editing" ref="inputRef" v-model.lazy="value" @blur="onExitEditMode" @keydown.enter="onExitEditMode">
    <div v-if="!editing" h-full class="truncate" @click="onEnterEditMode">
      {{ value }}
    </div>
  </div>
</template>

<style>
.grid-input-cell.disabled {
  pointer-events: none;
  position: relative;
  z-index: -1;
}
.grid-input-cell.disabled::before {
  content: ' ';
  position: absolute;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
}
</style>
