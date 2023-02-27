import type { IDataItem, ISpecItem } from './init'

export function calcMerge(data: IDataItem[], specList: ISpecItem[]) {
  // 制作映射查表
  const mergeKeys = specList.map(item => item.value)
  const mergeColLen = mergeKeys.length
  const mergeMap: number[][] = new Array(data.length).fill([])
    .map(() => [...new Array(mergeColLen - 1).fill(0), 1])

  // 开始计算行
  for (let rowIndex = 0; rowIndex < mergeMap.length; rowIndex++) {
    const row = data[rowIndex]
    const pre = rowIndex > 0 ? data[rowIndex - 1] : null
    // 开始计算列
    for (let columnIndex = 0; columnIndex < mergeColLen; columnIndex++) {
      const colKey = mergeKeys[columnIndex]
      if (rowIndex === 0 || (pre && pre[colKey] !== row[colKey])) {
        let rowspan = 1
        // 向下查找
        for (let i = rowIndex + 1; i < mergeMap.length; i++) {
          const cur = data[i]
          if (cur && row[colKey] === cur[colKey])
            rowspan++
          else
            break
        }
        mergeMap[rowIndex][columnIndex] = rowspan
      }
      else if (pre && pre[colKey] === row[colKey]) {
        mergeMap[rowIndex][columnIndex] = mergeMap[rowIndex - 1][columnIndex] - 1
      }
      else {
        mergeMap[rowIndex][columnIndex] = 0
      }
    }
  }

  return mergeMap
}
