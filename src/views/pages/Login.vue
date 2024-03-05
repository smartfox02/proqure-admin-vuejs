<template>
  <div class="login-background min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm @submit.prevent="handleLogin">
                  <h1>Login</h1>
                  <p class="text-medium-emphasis">Sign In to your account</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="email"
                      :class="{ 'is-invalid': !isValidEmail }"
                      placeholder="Email"
                      autocomplete="email"
                      required
                    />
                    <div v-if="!isValidEmail" class="invalid-feedback">
                      Invalid email address.
                    </div>
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      v-model="password"
                      type="password"
                      placeholder="Password"
                      autocomplete="current-password"
                      required
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol :xs="6">
                      <CLoadingButton
                        type="submit"
                        color="primary"
                        class="px-4"
                        :timeout="1100"
                      >
                        Login
                      </CLoadingButton>
                    </CCol>
                    <!-- <CCol :xs="6" class="text-right">
                      <CButton color="link" class="px-0">
                        Forgot password?
                      </CButton>
                    </CCol> -->
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard class="text-white bg-primary py-5" style="width: 44%">
              <CCardBody class="text-center">
                <div>
                  <h2>Proqure</h2>
                  <p>
                    Proqure provide access to finance by facilitating credit
                    arrangements in the form of embedded financing to customers.
                  </p>
                  <!-- <CButton
                    color="light"
                    variant="outline"
                    class="mt-3"
                    @click="handleRegisterDlg"
                  >
                    Register Now!
                  </CButton> -->
                </div>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
  <Toastr></Toastr>
</template>

<script>
import { isValidEmail } from '../../utils'
import { CLoadingButton } from '@coreui/vue-pro'
import { toastr } from '../../utils'
export default {
  components: {
    CLoadingButton,
  },
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      message: '',
      timeAgo: '',
      toastrMessage: '',
      toastrVisible: false,
    }
  },
  computed: {
    // loggedIn() {
    //   return this.$store.state.auth.status.loggedIn
    // },
    isValidEmail() {
      return isValidEmail(this.email)
    },
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/')
    }
  },
  methods: {
    handleLogin() {
      if (this.email && this.password) {
        const user = {
          email: this.email,
          password: this.password,
        }
        this.$store.dispatch('auth/login', user).then(
          (result) => {
            console.log('=====result:', result)
            if (result.status == 0) {
              toastr.success(
                `Welcome ${result.user.firstname + ' ' + result.user.lastname}`,
              )
            } else {
              toastr.warning(result.message)
            }
            setTimeout(() => {
              this.visible = false
              //this.$router.push('/')
              window.location.href = '/'
            }, 1000)
          },
          (error) => {
            console.log('error:', error)
            toastr.warning('Please try again later')
          },
        )
      }
    },
    handleRegisterDlg() {
      console.log('register:')
      this.$router.push('/register')
    },
  },
  watch: {
    toastrVisible(newVal, oldVal) {
      console.log(`count changed from ${oldVal} to ${newVal}`)
    },
  },
}
</script>
<style scoped>
.login-background {
  background-size: cover;
  background-image: url('@/assets/images/logback.png');
  background-repeat: no-repeat;
}
#toastr {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
