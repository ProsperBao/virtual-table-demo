export interface IDataItem {
  id: string
  scheme: string
  network: string
  memory: string
  color: string
  degree: string
  [key: string]: any
}

export interface IOptionItem {
  label: string
  value: string
}

export interface ISpecItem extends IOptionItem {
  value: keyof IDataItem & string
  options: IOptionItem[]
}

export const otherData = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9', 'test10', 'test11', 'test12', 'test13', 'test14', 'test15', 'test16', 'test17', 'test18', 'test19', 'test20']

export const specList: ISpecItem[] = [
  {
    label: '方案',
    value: 'scheme',
    options: [
      { label: '方案1', value: 'scheme1' },
      { label: '方案2', value: 'scheme2' },
      { label: '方案3', value: 'scheme3' },
    ],
  },
  {
    label: '网络',
    value: 'network',
    options: [
      { label: '网络一', value: 'network1' },
      { label: '网络二', value: 'network2' },
      { label: '网络三', value: 'network3' },
      { label: '网络四', value: 'network4' },
      { label: '网络五', value: 'network5' },
      { label: '网络六', value: 'network6' },
      { label: '网络七', value: 'network7' },
      { label: '网络八', value: 'network8' },
      { label: '网络九', value: 'network9' },
      { label: '网络十', value: 'network10' },
    ],
  },
  {
    label: '内存',
    value: 'memory',
    options: [
      { label: '内存一', value: 'memory1' },
      { label: '内存二', value: 'memory2' },
      { label: '内存三', value: 'memory3' },
      { label: '内存四', value: 'memory4' },
      { label: '内存五', value: 'memory5' },
      { label: '内存六', value: 'memory6' },
      { label: '内存七', value: 'memory7' },
      { label: '内存八', value: 'memory8' },
      { label: '内存九', value: 'memory9' },
      { label: '内存十', value: 'memory10' },
    ],
  },
  {
    label: '颜色',
    value: 'color',
    options: [
      { label: '颜色一', value: 'color1' },
      { label: '颜色二', value: 'color2' },
      { label: '颜色三', value: 'color3' },
      { label: '颜色四', value: 'color4' },
      { label: '颜色五', value: 'color5' },
      { label: '颜色六', value: 'color6' },
      { label: '颜色七', value: 'color7' },
      { label: '颜色八', value: 'color8' },
      { label: '颜色九', value: 'color9' },
      { label: '颜色十', value: 'color10' },
    ],
  },
  {
    label: '新旧',
    value: 'degree',
    options: [
      { label: '新旧一', value: 'degree1' },
      { label: '新旧二', value: 'degree2' },
      { label: '新旧三', value: 'degree3' },
      { label: '新旧四', value: 'degree4' },
      { label: '新旧五', value: 'degree5' },
      { label: '新旧六', value: 'degree6' },
      { label: '新旧七', value: 'degree7' },
      { label: '新旧八', value: 'degree8' },
      { label: '新旧九', value: 'degree9' },
      { label: '新旧十', value: 'degree10' },
    ],
  },
]

export function init(): IDataItem[] {
  const result = specList.reduce<Partial<IDataItem>[]>((acc, cur) => {
    const specList: Partial<IDataItem>[] = []
    if (!acc.length)
      return cur.options.map(option => ({ [cur.value]: option.value, ...otherData.reduce((acc, cur) => ({ ...acc, [cur]: cur }), {}) }))
    acc.forEach(item => cur.options.forEach(option => specList.push({ ...item, [cur.value]: option.value })))
    return specList
  }, []) as IDataItem[]
  return result.map(result => ({ ...result, id: Object.entries(result).map(i => i[1]).join('&') }))
}
