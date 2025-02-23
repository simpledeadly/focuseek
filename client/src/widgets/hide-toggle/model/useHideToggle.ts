import { shallowRef } from 'vue'

export const useHideToggle = () => {
  const isHideToggle = shallowRef<boolean>(false)

  return { isHideToggle }
}
