import type { ColDef, IDoesFilterPassParams } from 'ag-grid-community'
import type { CheckboxValueType } from 'element-plus'
import type { Ref } from 'vue'
import type { IDataItem, IOptionItem } from '~/utils/init'

export function useChecked(options: IOptionItem[]) {
  const checked = ref<string[]>([])
  const indeterminate = ref(false)
  const all = ref(false)
  const lastChecked = ref<string[]>([])

  function onCheckboxChange(values: CheckboxValueType[]): any {
    checked.value = values as string[]
    indeterminate.value = checked.value.length > 0 && checked.value.length < options.length
    all.value = checked.value.length === options.length
  }

  function handleCheckAllChange(values: CheckboxValueType): void {
    checked.value = values ? options.map(option => option.value) : []
    indeterminate.value = false
    all.value = values as boolean
  }

  function saveLastChecked() {
    lastChecked.value = checked.value
    onCheckboxChange(checked.value)
  }

  function recoveryChecked() {
    checked.value = lastChecked.value
    onCheckboxChange(checked.value)
  }

  return {
    checked,
    indeterminate,
    all,
    lastChecked,
    onCheckboxChange,
    handleCheckAllChange,
    saveLastChecked,
    recoveryChecked,
  }
}

export function useFilterMethod({
  colDef, checked, detachedFn,
}: {
  colDef: ColDef<IDataItem>
  checked: Ref<string[]>
  detachedFn: () => void
}) {
  function doesFilterPass(params: IDoesFilterPassParams<IDataItem>): boolean {
    if (checked.value.length === 0)
      return true
    return checked.value.includes(params.data[colDef.field!])
  }

  function isFilterActive(): boolean {
    return checked.value.length > 0
  }

  function afterGuiDetached() {
    detachedFn()
  }

  return {
    doesFilterPass,
    isFilterActive,
    afterGuiDetached,
  }
}
