<script lang="ts" setup>
import type { ICellRendererParams } from 'ag-grid-community'
import { vOnClickOutside } from '@vueuse/components'
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
const { setDispatchRef } = usePopover(onExitEditMode)
</script>

<template>
  <div v-if="disabled" class="grid-input-cell disabled" />
  <div
    v-else class="grid-input-cell" w-full
    h-full
    @mouseenter="(e) => setDispatchRef(e.currentTarget)"
  >
    <input v-if="editing" ref="inputRef" v-model.lazy="value" @blur="onExitEditMode" @keydown.enter="onExitEditMode">
    <div v-if="!editing" flex justify-center items-center h-full truncate @click="onEnterEditMode">
      {{ value }}
    </div>
  </div>
</template>

<style lang="scss">
.grid-input-cell {
  &.disabled::before {
    content: ' ';
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
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
