<script lang="ts" setup>
import { usePopover } from '~/components/GridInputCell/index'

const { popoverRef, dispatchRef } = usePopover()
</script>

<template>
  <div w-700px>
    <ElPopover
      ref="popoverRef"
      :virtual-ref="dispatchRef"
      trigger="hover"
      title="With title"
      virtual-triggering
      propper-class="grid-popover"
      :offset="-1"
    >
      <span> Some content </span>
    </ElPopover>
  </div>
</template>
