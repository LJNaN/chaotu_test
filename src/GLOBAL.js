import { ref } from 'vue'
let viewer = null
const show2D = ref(false)

const GLOBAL = {
  viewer,
  show2D
}

window.GLOBAL = GLOBAL
export default GLOBAL
