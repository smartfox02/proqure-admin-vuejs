<template>
  <CHeader position="sticky" class="mb-4">
    <CContainer fluid>
      <CHeaderToggler class="ps-1" @click="$store.commit('toggleSidebar')">
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
      <CHeaderNav class="d-none d-md-flex me-auto">
        <CNavItem>
          <CNavLink href="/dashboard"> Dashboard </CNavLink>
        </CNavItem>
      </CHeaderNav>
      <CHeaderNav>
        <CNavItem @click="handleBell">
          <div>
            <CIcon class="mx-2" icon="cil-bell" size="lg" />
          </div>
        </CNavItem>
        <CNavItem @click="handleList">
          <div>
            <CIcon class="mx-2" icon="cil-list" size="lg" />
          </div>
        </CNavItem>
        <CNavItem @click="handleInfo">
          <div>
            <CIcon class="mx-2" icon="cil-envelope-open" size="lg" />
          </div>
        </CNavItem>
        <AppHeaderDropdownAccnt />
      </CHeaderNav>
    </CContainer>
    <CHeaderDivider />
    <CContainer fluid>
      <AppBreadcrumb />
    </CContainer>
  </CHeader>
</template>

<script>
import AppBreadcrumb from './AppBreadcrumb'
import AppHeaderDropdownAccnt from './AppHeaderDropdownAccnt'

export default {
  name: 'AppHeader',
  components: {
    AppBreadcrumb,
    AppHeaderDropdownAccnt,
  },
  methods: {
    handleBell(event) {
      event.preventDefault()
    },
    handleList(event) {
      event.preventDefault()
    },
    handleInfo(event) {
      event.preventDefault()
    },
  },
  setup() {
    return {}
  },
}
</script>
<style>
.header-nav .nav-item {
  display: flex;
  align-self: center;
  padding: 5px;
}
</style>
