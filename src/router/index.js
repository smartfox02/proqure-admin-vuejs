import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'

import DefaultLayout from '@/layouts/DefaultLayout'
import store from '../store/index'
let role = 2 // Initialize the role variable with a default value

const getRoute = () => {
  if (
    store.state.auth &&
    store.state.auth.user &&
    store.state.auth.user.user &&
    store.state.auth.user.user.role
  ) {
    role = store.state.auth.user.user.role
  }
  let token = window.localStorage.getItem('token')
  console.log('role:', role, token)
  if (role == 1)
    return [
      {
        path: '/',
        name: 'Home',
        component: DefaultLayout,
        redirect: '/dashboard',
        children: [
          {
            path: '/dashboard',
            name: 'Dashboard',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('@/views/Dashboard.vue'),
          },
          {
            path: '/registration',
            name: 'Registration',
            component: {
              render() {
                return h(resolveComponent('router-view'))
              },
            },
            children: [
              {
                path: '/registration/vendor',
                name: 'Vendor',
                component: () => import('@/views/registration/Vendor.vue'),
              },
              {
                path: '/registration/transporter',
                name: 'Transporter',
                component: () => import('@/views/registration/Transporter.vue'),
              },
              {
                path: '/registration/customer',
                name: 'Customer',
                component: () => import('@/views/registration/Customer.vue'),
              },
            ],
          },
          {
            path: '/management',
            name: 'Management',
            component: {
              render() {
                return h(resolveComponent('router-view'))
              },
            },
            children: [
              {
                path: '/management/referral',
                name: 'Referral',
                component: () => import('@/views/management/Referral.vue'),
              },
              {
                path: '/management/category',
                name: 'Category',
                component: () => import('@/views/management/Category.vue'),
              },
              {
                path: '/management/product',
                name: 'Product',
                component: () => import('@/views/management/Product.vue'),
              },
              {
                path: '/management/inventory',
                name: 'Inventory',
                component: () => import('@/views/management/Inventory.vue'),
              },
              {
                path: '/management/content',
                name: 'Content',
                component: () => import('@/views/management/Content.vue'),
              },
              {
                path: '/management/finance',
                name: 'Finance',
                component: () => import('@/views/management/Finance.vue'),
              },
              {
                path: '/management/shipping',
                name: 'Shipping',
                component: () => import('@/views/management/Shipping.vue'),
              },
              {
                path: '/management/segment',
                name: 'Segment',
                component: () => import('@/views/management/Segment.vue'),
              },
              {
                path: '/management/member',
                name: 'Member',
                component: () => import('@/views/management/Member.vue'),
              },
            ],
          },
          {
            path: '/other',
            name: 'Other',
            component: {
              render() {
                return h(resolveComponent('router-view'))
              },
            },
            children: [
              {
                path: '/other/sent',
                name: 'Sent',
                component: () => import('@/views/other/Sent.vue'),
              },
              {
                path: '/other/inbox',
                name: 'Inbox',
                component: () => import('@/views/other/Inbox.vue'),
              },
              {
                path: '/other/order',
                name: 'Order Fulfillment',
                component: () => import('@/views/other/Order.vue'),
              },
              {
                path: '/other/order/:id',
                name: 'Order Fulfillment Detail',
                component: () => import('@/views/other/OrderDetail.vue'),
              },
              {
                path: '/other/transaction/:id',
                name: 'Customer Transaction',
                component: () => import('@/views/other/Transaction.vue'),
              },
              {
                path: '/other/discount',
                name: 'Discount & Promo',
                component: () => import('@/views/other/Discount.vue'),
              },
              {
                path: '/other/users',
                name: 'Users',
                component: () => import('@/views/other/Users.vue'),
              },
              {
                path: '/other/export',
                name: 'Export',
                component: () => import('@/views/other/Export.vue'),
              },
            ],
          },
        ],
      },
      {
        path: '/404',
        name: 'Page404',
        component: () => import('@/views/pages/Page404'),
      },
      {
        path: '/500',
        name: 'Page500',
        component: () => import('@/views/pages/Page500'),
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/pages/Login'),
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/pages/Register'),
      },
    ]
  if (role == 2)
    return [
      {
        path: '/',
        name: 'Home',
        component: DefaultLayout,
        redirect: '/dashboard',
        children: [
          {
            path: '/dashboard',
            name: 'Dashboard',
            // route level code-splitting
            // this generates a separate chunk (about.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('@/views/Dashboard.vue'),
          },
          {
            path: '/management',
            name: 'Management',
            component: {
              render() {
                return h(resolveComponent('router-view'))
              },
            },
            children: [
              {
                path: '/management/referral',
                name: 'Referral',
                component: () => import('@/views/management/Referral.vue'),
              },
              {
                path: '/management/product',
                name: 'Product',
                component: () => import('@/views/management/Product.vue'),
              },
              {
                path: '/management/inventory',
                name: 'Inventory',
                component: () => import('@/views/management/Inventory.vue'),
              },
              {
                path: '/management/content',
                name: 'Content',
                component: () => import('@/views/management/Content.vue'),
              },
              {
                path: '/management/finance',
                name: 'Finance',
                component: () => import('@/views/management/Finance.vue'),
              },
              {
                path: '/management/shipping',
                name: 'Shipping',
                component: () => import('@/views/management/Shipping.vue'),
              },
              {
                path: '/management/segment',
                name: 'Segment',
                component: () => import('@/views/management/Segment.vue'),
              },
              {
                path: '/management/member',
                name: 'Member',
                component: () => import('@/views/management/Member.vue'),
              },
            ],
          },
          {
            path: '/other',
            name: 'Other',
            component: {
              render() {
                return h(resolveComponent('router-view'))
              },
            },
            children: [
              {
                path: '/other/sent',
                name: 'Sent',
                component: () => import('@/views/other/Sent.vue'),
              },
              {
                path: '/other/inbox',
                name: 'Inbox',
                component: () => import('@/views/other/Inbox.vue'),
              },
              {
                path: '/other/vendororder',
                name: 'Order Fulfillment',
                component: () => import('@/views/other/Transaction.vue'),
              },
              {
                path: '/other/order/:id',
                name: 'Order Fulfillment Detail',
                component: () => import('@/views/other/OrderDetail.vue'),
              },
            ],
          },
        ],
      },
      {
        path: '/404',
        name: 'Page404',
        component: () => import('@/views/pages/Page404'),
      },
      {
        path: '/500',
        name: 'Page500',
        component: () => import('@/views/pages/Page500'),
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/pages/Login'),
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/pages/Register'),
      },
    ]
  if (role == undefined) {
    return [
      {
        path: '/404',
        name: 'Page404',
        component: () => import('@/views/pages/Page404'),
      },
      {
        path: '/500',
        name: 'Page500',
        component: () => import('@/views/pages/Page500'),
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/pages/Login'),
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/pages/Register'),
      },
    ]
  }
}

const routes = getRoute()

const router = createRouter({
  history: createWebHashHistory('/'),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('token')
  if (authRequired && !loggedIn) {
    next('/login')
  } else {
    try {
      next()
    } catch (err) {
      console.log('beach_error:', err)
      next('/login')
    }
  }
})

export default router
