<script lang="ts" setup>
import { usePopover } from '~/components/GridPopover'

const { popoverRef, dispatchRef, popoverParams, component, componentFlag } = usePopover()
</script>

<template>
  <div w-700px>
    <ElPopover
      ref="popoverRef"
      :virtual-ref="dispatchRef"
      trigger="hover"
      :title="popoverParams?.colDef?.field"
      virtual-triggering
      :offset="-1"
    >
      <suspense v-if="component">
        <component :is="component" :key="componentFlag" :params="popoverParams" />
      </suspense>
    </ElPopover>
  </div>
</template>
