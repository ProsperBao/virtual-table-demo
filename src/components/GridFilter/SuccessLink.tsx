import { ElLink } from 'element-plus'
import { Check } from '@element-plus/icons-vue'

export default defineComponent({
  name: 'SuccessLink',
  emits: ['click'],
  setup(_, { emit, slots }) {
    const success = ref(false)
    const timer = ref<NodeJS.Timeout | null>(null)

    const onHandleClick = () => {
      if (timer.value)
        return
      emit('click')
      success.value = true
      timer.value = setTimeout(() => {
        success.value = false
        timer.value = null
      }, 1000)
    }

    return () => (<>
      <ElLink
        class="success-link"
        type={success.value ? 'success' : 'default'}
        onClick={onHandleClick}
      >
        {slots.default?.()}
        {success.value ? <Check class="el-icon--right"/> : null}
      </ElLink>
    </>)
  },
})
