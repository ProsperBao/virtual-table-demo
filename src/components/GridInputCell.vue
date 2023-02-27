<script lang="ts" setup>
import type { ICellRendererParams } from 'ag-grid-community'
import type { IDataItem } from '~/utils/init'
const props = defineProps<{ params: ICellRendererParams<IDataItem> }>()

const value = computed({
  get: () => props.params.getValue?.(),
  set: val => props.params.setValue?.(val),
})

const editing = ref(false)
const inputRef = ref()
const visible = ref(false)

const onExitEditMode = () => (editing.value = false)
const onEnterEditMode = () => {
  editing.value = true
  visible.value = false
  setTimeout(() => {
    inputRef.value.focus()
  })
}
</script>

<template>
  <ElTooltip :visible="!editing && visible" effect="dark" :content="value" placement="top">
    <input v-if="editing" ref="inputRef" v-model.lazy="value" @blur="onExitEditMode" @keydown.enter="onExitEditMode">
    <div v-if="!editing" class="truncate" @mouseenter="visible = true" @mouseleave="visible = false" @click="onEnterEditMode">
      {{ value }}
    </div>
  </ElTooltip>
</template>
