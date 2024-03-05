import { createApp } from 'vue'
import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
import App from './App.vue'
import router from './router'
import store from './store'

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons'
import DocsExample from '@/components/DocsExample'
import { CLoadingButton } from '@coreui/vue-pro'
const app = createApp(App)
app.use(store)
app.use(router)
app.use(CoreuiVue)
app.use(CLoadingButton)
app.use(ToastPlugin)
app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('DocsExample', DocsExample)

app.mount('#app')
export default app
