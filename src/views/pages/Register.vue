<template>
  <div
    class="register-background min-vh-100 d-flex flex-row align-items-center"
  >
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="9" :lg="7" :xl="6">
          <CCard class="mx-4">
            <CCardBody class="p-4">
              <CForm @submit.prevent="handleRegisterDlg">
                <h1>Register</h1>
                <p class="text-medium-emphasis">Create your account</p>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-user" />
                  </CInputGroupText>
                  <CFormInput
                    v-model="username"
                    placeholder="Username"
                    autocomplete="username"
                    required
                  />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput
                    v-model="email"
                    placeholder="Email"
                    autocomplete="email"
                    required
                  />
                </CInputGroup>
                <CInputGroup class="mb-3">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput
                    v-model="password"
                    type="password"
                    placeholder="Password"
                    autocomplete="new-password"
                    required
                  />
                </CInputGroup>
                <CInputGroup class="mb-4">
                  <CInputGroupText>
                    <CIcon icon="cil-lock-locked" />
                  </CInputGroupText>
                  <CFormInput
                    v-model="cpassword"
                    type="password"
                    placeholder="Repeat password"
                    autocomplete="new-password"
                    required
                  />
                </CInputGroup>
                <div class="d-grid">
                  <CButton color="success" type="submit"
                    >Create Account</CButton
                  >
                </div>
                <div class="d-grid mt-3">
                  <CButton color="success" @click="handleBack">Back</CButton>
                </div>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: 'Register',
  methods: {
    handleRegisterDlg() {
      console.log('---------------------')
      if (this.username && this.email && this.password && this.cpassword) {
        const user = {
          username: this.username,
          email: this.email,
          password: this.password,
          cpassword: this.cpassword,
        }
        this.$store.dispatch('auth/register', user).then(
          () => {
            console.log('user', user)
          },
          (error) => {
            console.log('error', error)
          },
        )
      }
    },
    handleBack() {
      this.$router.push('/login')
    },
  },
}
</script>
<style>
.register-background {
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url('@/assets/images/logback.png');
}
</style>
