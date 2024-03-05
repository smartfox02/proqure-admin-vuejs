import store from './store/index'
let role = 2
export const nav = () => {
  if (
    store.state.auth &&
    store.state.auth.user &&
    store.state.auth.user.user &&
    store.state.auth.user.user.role
  ) {
    role = store.state.auth.user.user.role
  }
  console.log('====role:', role)
  if (role == 1)
    return [
      {
        component: 'CNavItem',
        name: 'Dashboard',
        to: '/dashboard',
        icon: 'cil-speedometer',
        // badge: {
        //   color: 'primary',
        //   text: 'NEW',
        // },
      },
      {
        component: 'CNavTitle',
        name: 'Managemets',
      },
      {
        component: 'CNavItem',
        name: 'Vendor',
        to: '/registration/vendor',
        icon: 'cil-puzzle',
      },
      {
        component: 'CNavItem',
        name: 'Transporter',
        to: '/registration/transporter',
        icon: 'cil-envelope-open',
      },
      {
        component: 'CNavItem',
        name: 'Customer',
        to: '/registration/customer',
        icon: 'cil-user',
      },
      {
        component: 'CNavItem',
        name: 'Category',
        to: '/management/category',
        icon: 'cil-notes',
      },
      {
        component: 'CNavItem',
        name: 'Product',
        to: '/management/product',
        icon: 'cil-layers',
      },
      {
        component: 'Management',
        name: 'Management',
        to: '/management',
        icon: 'cil-calculator',
        items: [
          {
            component: 'CNavItem',
            name: 'Referral',
            to: '/management/referral',
          },
          {
            component: 'CNavItem',
            name: 'Inventory',
            to: '/management/inventory',
          },
          {
            component: 'CNavItem',
            name: 'Content',
            to: '/management/content',
          },
          {
            component: 'CNavItem',
            name: 'Finance',
            to: '/management/finance',
          },
          {
            component: 'CNavItem',
            name: 'Shipping',
            to: '/management/shipping',
          },
          {
            component: 'CNavItem',
            name: 'Segment',
            to: '/management/segment',
          },
          {
            component: 'CNavItem',
            name: 'Member',
            to: '/management/member',
          },
        ],
      },
      {
        component: 'CNavItem',
        name: 'Sent',
        to: '/other/sent',
        icon: 'cil-cursor',
      },
      {
        component: 'CNavItem',
        name: 'Inbox',
        to: '/other/inbox',
        icon: 'cil-bell',
      },
      {
        component: 'CNavItem',
        name: 'Order Fulfillment',
        to: '/other/order',
        icon: 'cil-basket',
      },
      {
        component: 'CNavItem',
        name: 'Discount & Promo',
        to: '/other/discount',
        icon: 'cil-speedometer',
      },
      {
        component: 'CNavItem',
        name: 'Users',
        to: '/other/users',
        icon: 'cil-people',
      },
    ]
  if (role == 2)
    return [
      {
        component: 'CNavItem',
        name: 'Dashboard',
        to: '/dashboard',
        icon: 'cil-speedometer',
      },
      {
        component: 'CNavTitle',
        name: 'Managemets',
      },
      {
        component: 'CNavItem',
        name: 'Product',
        to: '/management/product',
        icon: 'cil-layers',
      },
      {
        component: 'Management',
        name: 'Management',
        to: '/management',
        icon: 'cil-calculator',
        items: [
          {
            component: 'CNavItem',
            name: 'Referral',
            to: '/management/referral',
          },
          {
            component: 'CNavItem',
            name: 'Inventory',
            to: '/management/inventory',
          },
          {
            component: 'CNavItem',
            name: 'Content',
            to: '/management/content',
          },
          {
            component: 'CNavItem',
            name: 'Finance',
            to: '/management/finance',
          },
          {
            component: 'CNavItem',
            name: 'Shipping',
            to: '/management/shipping',
          },
          {
            component: 'CNavItem',
            name: 'Segment',
            to: '/management/segment',
          },
          {
            component: 'CNavItem',
            name: 'Member',
            to: '/management/member',
          },
        ],
      },
      {
        component: 'CNavItem',
        name: 'Sent',
        to: '/other/sent',
        icon: 'cil-cursor',
      },
      {
        component: 'CNavItem',
        name: 'Inbox',
        to: '/other/inbox',
        icon: 'cil-bell',
      },
      {
        component: 'CNavItem',
        name: 'Order Fulfillment',
        to: '/other/vendororder',
        icon: 'cil-basket',
      },
    ]
}

const _nav = nav()
export default _nav
