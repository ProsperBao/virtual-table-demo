<script lang="ts" setup>
import type { ICellRendererParams } from 'ag-grid-community'
import type { IDataItem } from '~/utils/init'

const props = defineProps<{ params: ICellRendererParams<IDataItem> }>()
</script>

<template>
  <div>
    Hello
  </div>
</template>
