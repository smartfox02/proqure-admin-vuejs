<template>
  <CDropdown variant="nav-item">
    <CDropdownToggle
      placement="bottom-end"
      class="py-0"
      :caret="false"
      @click="handlePreventDropdown"
    >
      <CAvatar :src="avatarUrl" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
        Account
      </CDropdownHeader>
      <CDropdownItem> <CIcon icon="cil-user" /> Profile </CDropdownItem>
      <CDropdownItem @click="logOut">
        <CIcon icon="cil-lock-locked" />
        Logout
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script>
import avatar from '@/assets/images/avatars/8.jpg'
import { mapState } from 'vuex'
import { API_URL } from '@/config'
export default {
  name: 'AppHeaderDropdownAccnt',
  // data() {
  //   return {
  //     avatarUrl: '',
  //   }
  // },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
    avatarUrl() {
      if (this.user) {
        return API_URL + this.user.user.avatar
      }
      return ''
    },
  },
  methods: {
    handlePreventDropdown(event) {
      event.preventDefault()
      console.log('====authsuer', this.user)
    },
    logOut() {
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    },
  },
  setup() {
    return {
      avatar: avatar,
      itemsCount: 42,
    }
  },
}
</script>
<style>
.dropdown-menu .dropdown-item:hover {
  cursor: pointer;
}
</style>
