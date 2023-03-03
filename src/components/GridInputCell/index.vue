<script lang="ts" setup>
import type { ICellRendererParams } from 'ag-grid-community'
import { useCellEditing, useCellValue } from '.'
import { usePopover } from '~/components/GridPopover'
import type { IDataItem } from '~/utils/init'
const props = defineProps<{ params: ICellRendererParams<IDataItem> }>()

const { editing, inputRef, onExitEditMode, onEnterEditMode } = useCellEditing()
const { setDispatchRef } = usePopover()
const { cellValue, cellInputValue, disabled, readonly } = useCellValue(props)
</script>

<template>
  <div v-if="disabled" class="grid-input-cell disabled" />
  <div
    v-else class="grid-input-cell" :class="{ readonly }" w-full
    h-full
    @mouseenter="(e) => setDispatchRef(e.currentTarget, params)"
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
