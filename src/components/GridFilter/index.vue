<script lang="ts">
import type { IFilterParams } from 'ag-grid-community'
import type { PropType, Ref } from 'vue'
import SuccessLink from './SuccessLink'
import { useChecked, useFilterMethod } from '.'
import type { IDataItem, IOptionItem } from '~/utils/init'

export default defineComponent({
  props: {
    params: {
      type: Object as PropType<IFilterParams<IDataItem>>,
      required: true,
    },
  },
  setup({ params }) {
    const colDef = params.colDef
    const options: IOptionItem[] = colDef.filterParams.options

    const calcColumnMerge = inject<() => void>('calcColumnMerge')
    const filters = inject<Ref<Record<string, string[]>>>('filters')

    const {
      checked,
      indeterminate,
      all,
      onCheckboxChange,
      handleCheckAllChange,
      saveLastChecked,
      recoveryChecked,
    } = useChecked(options)

    const {
      doesFilterPass,
      isFilterActive,
      afterGuiDetached,
    } = useFilterMethod({ colDef, checked, detachedFn: recoveryChecked })

    function resetFilter() {
      recoveryChecked()
      filterChange()
    }

    function applyFilter() {
      saveLastChecked()
      filterChange()
    }

    function filterChange() {
      if (filters)
        filters.value[colDef.field!] = checked.value || []
      calcColumnMerge?.()
      params.filterChangedCallback()
      setTimeout(() => params.api.redrawRows())
    }

    return {
      options,

      checked,
      indeterminate,
      all,
      onCheckboxChange,
      handleCheckAllChange,

      resetFilter,
      applyFilter,

      doesFilterPass,
      isFilterActive,
      afterGuiDetached,
    }
  },
})
</script>

<template>
  <section class="grid-filter" min-w-130px flex flex-col justify-start>
    <header sticky top-0 z-2 flex flex-col py-3px justify-start>
      <ElCheckbox v-model="all" mx-10px :indeterminate="indeterminate" @change="handleCheckAllChange">
        全选/反选
      </ElCheckbox>
    </header>
    <hr w-full>
    <ElScrollbar always max-height="200px">
      <ElCheckboxGroup v-model="checked" mx-10px flex justify-start flex-col @change="onCheckboxChange">
        <ElCheckbox v-for="option in options" :key="option.value" :label="option.value">
          {{ option.label }}
        </ElCheckbox>
      </ElCheckboxGroup>
    </ElScrollbar>
    <hr w-full>
    <footer p-10px flex justify-around>
      <ElLink @click="resetFilter">
        重置
      </ElLink>
      <SuccessLink @click="applyFilter">
        筛选
      </SuccessLink>
    </footer>
  </section>
</template>

<style lang="scss">
.grid-filter {
  header {
    background: var(--el-bg-color-overlay);
  }
  .success-link {
    white-space: nowrap;
    .el-icon--right {
      width: 14px;
    }
  }
}
</style>
