<template>
  <CLoadingButton
    color="primary"
    style="float: right"
    :timeout="1000"
    @click="handleRegisterDlg"
    >New Transporter</CLoadingButton
  >
  <CSmartTable
    clickableRows
    :tableProps="{
      striped: true,
      hover: true,
    }"
    :activePage="2"
    footer
    header
    :items="items"
    :columns="columns"
    columnFilter
    tableFilter
    cleaner
    itemsPerPageSelect
    :itemsPerPage="10"
    columnSorter
    :sorterValue="{ column: 'status', state: 'asc' }"
    pagination
  >
    <template #avatar="{ item }">
      <td>
        <CAvatar :src="withBase(item.avatar)" />
      </td>
    </template>
    <template #created_at="{ item }">
      <td>
        {{ getDateTimeFormat(item.created_at) }}
      </td>
    </template>
    <template #role="{ item }">
      <td>
        {{ getRoleStr(item.role) }}
      </td>
    </template>
    <template #status="{ item }">
      <td>
        <CBadge :color="getBadge(item.status)">{{
          getBadgeStr(item.status)
        }}</CBadge>
      </td>
    </template>
    <template #show_details="{ item, index }">
      <td class="py-2">
        <CButton
          color="primary"
          variant="outline"
          square
          size="sm"
          @click="toggleDetails(item, index)"
        >
          {{ Boolean(item._toggled) ? 'Hide' : 'Show' }}
        </CButton>
      </td>
    </template>
    <template #details="{ item }">
      <CCollapse :visible="this.details.includes(item.id)">
        <CCardBody>
          <h4>
            {{ item.firstname + ' ' + item.lastname }}
          </h4>
          <p class="text-muted">
            User since: {{ getDateTimeFormat(item.created_at) }}
          </p>
          <CLoadingButton
            size="sm"
            color="info"
            class="mr-1"
            spinnerType="grow"
            :timeout="1100"
            @click="handleEditDlg(item)"
          >
            Setting
          </CLoadingButton>
          <CLoadingButton
            size="sm"
            color="danger"
            class=""
            spinnerType="grow"
            :timeout="1100"
            @click="handleDeleteDlg(item)"
          >
            Delete
          </CLoadingButton>
        </CCardBody>
      </CCollapse>
    </template>
  </CSmartTable>
  <CModal
    alignment="center"
    :visible="showModal"
    @close="
      () => {
        showModal = false
      }
    "
  >
    <CForm @submit.prevent="handleSave">
      <CModalHeader>
        <CModalTitle>Create Transporter</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormSelect label="Company" v-model="company" required>
          <option value="">Select Company</option>
          <option value="Proqure">Proqure</option>
          <option value="Agenda">Agenda</option>
          <option value="Fillima">Fillima</option>
        </CFormSelect>
        <div class="d-flex">
          <CCol :md="6" style="padding-right: 10px">
            <CFormInput
              ref="firnameRef"
              type="text"
              label="First Name"
              placeholder="Enter First Name"
              v-model="firstname"
              required
            />
          </CCol>
          <CCol :md="6">
            <CFormInput
              type="text"
              label="Last Name"
              placeholder="Enter Last Name"
              v-model="lastname"
              required
            />
          </CCol>
        </div>
        <CFormInput
          type="text"
          label="Phone"
          placeholder="Enter phone number"
          v-model="phone"
          :class="{ 'is-invalid': !validatePhoneNumber }"
          autoComplete="phone"
          required
        />
        <div v-if="!validatePhoneNumber" class="invalid-feedback">
          Invalid phone number.
        </div>
        <CFormInput
          type="email"
          label="Email"
          placeholder="Enter email address"
          v-model="email"
          required
        />
        <CFormInput
          type="password"
          label="Password"
          placeholder="Enter password"
          v-model="password"
          required
        />
        <CFormInput
          type="password"
          label="Confirm Password"
          placeholder="Enter confirm password"
          v-model="cpassword"
          :class="{ 'is-invalid': !matchPassword }"
          required
        />
        <div v-if="!matchPassword" class="invalid-feedback">
          Confirm password is not matched.
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton
          color="secondary"
          @click="
            () => {
              showModal = false
            }
          "
        >
          Close
        </CButton>
        <CButton type="submit" style="background-color: #003b5c; color: white">
          Save
        </CButton>
      </CModalFooter>
    </CForm>
  </CModal>

  <CModal
    alignment="center"
    :visible="showModal1"
    @close="
      () => {
        showModal1 = false
      }
    "
  >
    <CForm @submit.prevent="handleEdit">
      <CModalHeader>
        <CModalTitle>Edit Transporter</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormSelect label="Company" v-model="company" required>
          <option value="">Select Company</option>
          <option value="Proqure">Proqure</option>
          <option value="Agenda">Agenda</option>
          <option value="Fillima">Fillima</option>
        </CFormSelect>
        <div class="d-flex">
          <CCol :md="6" style="padding-right: 10px">
            <CFormInput
              ref="firnameRef"
              type="text"
              label="First Name"
              placeholder="Enter First Name"
              v-model="firstname"
              required
            />
          </CCol>
          <CCol :md="6">
            <CFormInput
              type="text"
              label="Last Name"
              placeholder="Enter Last Name"
              v-model="lastname"
              required
            />
          </CCol>
        </div>
        <CFormInput
          type="text"
          label="Phone"
          placeholder="Enter phone number"
          v-model="phone"
          :class="{ 'is-invalid': !validatePhoneNumber }"
          autoComplete="phone"
          required
        />
        <div v-if="!validatePhoneNumber" class="invalid-feedback">
          Invalid phone number.
        </div>
        <CFormInput
          type="email"
          label="Email"
          placeholder="Enter email address"
          v-model="email"
          required
        />
      </CModalBody>
      <CModalFooter>
        <CButton
          color="secondary"
          @click="
            () => {
              showModal1 = false
            }
          "
        >
          Close
        </CButton>
        <CButton type="submit" style="background-color: #003b5c; color: white">
          Save
        </CButton>
      </CModalFooter>
    </CForm>
  </CModal>

  <CModal
    :visible="showModal2"
    @close="
      () => {
        showModal2 = false
      }
    "
  >
    <CModalHeader>
      <!-- <CModalTitle>Delete</CModalTitle> -->
    </CModalHeader>
    <CModalBody class="delete-text">Are you sure you want to delete</CModalBody>
    <CModalFooter>
      <CButton
        color="secondary"
        @click="
          () => {
            showModal2 = false
          }
        "
        >Cancel</CButton
      >
      <CButton color="danger" @click="handleDelete">Ok</CButton>
    </CModalFooter>
  </CModal>
</template>

<script>
// import CSmartTable from '@coreui/vue-pro/src/components/smart-table/CSmartTable'
import registrationService from '@/services/Transporter.Service'
import { CButton, CCol } from '@coreui/vue'
import { validatePhoneNumber } from '@/utils'
import { API_URL } from '@/config'
import moment from 'moment'
import {
  CSmartTable,
  // CAvatar,
  CBadge,
  CCollapse,
  CCardBody,
  CLoadingButton,
} from '@coreui/vue-pro'
export default {
  components: {
    CSmartTable,
    // CAvatar,
    CBadge,
    CCollapse,
    CCardBody,
    CLoadingButton,
    CCol,
    CButton,
  },
  mounted() {
    registrationService.getTransporterList().then(
      (result) => {
        console.log('result: ', result.data.transporters)
        this.items = result.data.transporters
      },
      (error) => {
        console.log('error: ', error)
      },
    )
  },
  data() {
    return {
      columns: [
        {
          key: 'avatar',
          label: '',
          filter: false,
          sorter: false,
          _style: { width: '5%' },
        },
        {
          key: 'email',
          label: 'Email',
          _style: { width: '20%' },
        },
        {
          key: 'created_at',
          label: 'Registration Date',
          _style: { width: '20%' },
        },
        {
          key: 'phone',
          label: 'Phone',
          _style: { width: '20%' },
        },
        {
          key: 'status',
          _style: { width: '20%' },
          filter: false,
          sorter: false,
        },
        {
          key: 'show_details',
          label: 'Details',
          _style: { width: '1%' },
          filter: false,
          sorter: false,
        },
      ],
      details: [],
      items: [],
      transporter_id: '',
      company: '',
      firstname: '',
      lastname: '',
      phone: '',
      email: '',
      password: '',
      cpassword: '',
      transporterList: '',
      showModal: false,
      showModal1: false,
      showModal2: false,
    }
  },
  computed: {
    validatePhoneNumber() {
      return validatePhoneNumber(this.phone)
    },
    // eslint-disable-next-line vue/return-in-computed-property
    matchPassword() {
      if (this.cpassword) {
        if (this.password == this.cpassword) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
  },
  methods: {
    withBase(avatar) {
      return API_URL + avatar
    },
    getBadge(status) {
      switch (status) {
        case 0:
          return 'secondary'
        case 1:
          return 'primary'
        case 2:
          return 'danger'
        default:
          'secondary'
      }
    },
    getRoleStr(status) {
      switch (status) {
        case 1:
          return 'Super Admin'
        case 2:
          return 'Transporter'
        case 3:
          return 'Member'
      }
    },
    getBadgeStr(status) {
      switch (status) {
        case 0:
          return 'Inactive'
        case 1:
          return 'Active'
        case 2:
          return 'Banned'
        default:
          'Inactive'
      }
    },
    getDateTimeFormat(date) {
      console.log('created_at', date)
      let formattedDate = moment(date).format('YYYY-MM-DD')
      let formattedTime = moment(date).format('HH:mm:ss')
      return formattedDate + ' ' + formattedTime
    },
    toggleDetails(item) {
      if (this.details.includes(item.id)) {
        this.details = this.details.filter((_item) => _item !== item.id)
        return
      }
      this.details.push(item.id)
    },
    handleRegisterDlg() {
      this.company = ''
      this.firstname = ''
      this.lastname = ''
      this.phone = ''
      this.email = ''
      this.password = ''
      this.cpassword = ''
      setTimeout(() => {
        this.showModal = true
      }, 1000)
    },
    handleEditDlg(item) {
      this.transporter_id = item.id
      this.company = item.company
      this.firstname = item.firstname
      this.lastname = item.lastname
      this.phone = item.phone
      this.email = item.email
      setTimeout(() => {
        this.showModal1 = true
      }, 1100)
    },
    handleDeleteDlg(item) {
      this.transporter_id = item.id
      this.email = item.email
      setTimeout(() => {
        this.showModal2 = true
      }, 1100)
    },
    handleSave() {
      if (!validatePhoneNumber(this.phone)) {
        return
      }
      // eslint-disable-next-line vue/no-use-computed-property-like-method
      if (this.password != this.cpassword) {
        return
      }
      // eslint-disable-next-line no-unused-vars
      let data = {
        company: this.company,
        firstname: this.firstname,
        lastname: this.lastname,
        phone: this.phone,
        email: this.email,
        password: this.password,
        cpassword: this.cpassword,
        role: 2,
      }
      console.log('data', data)
      registrationService.createTransporter(data).then((result) => {
        let data = result.data
        if (data.status == 0) {
          this.items = [...this.items, data.user]
          this.showModal = false
        }
      })
    },
    handleEdit() {
      // eslint-disable-next-line no-unused-vars
      let data = {
        id: this.transporter_id,
        company: this.company,
        firstname: this.firstname,
        lastname: this.lastname,
        phone: this.phone,
        email: this.email,
        role: 2,
      }
      registrationService.editTransporter(data).then((result) => {
        let data = result.data
        console.log('result', data)
        if (data.status == 0) {
          this.items = data.result[1]
          this.showModal1 = false
        }
      })
      console.log('data', data)
    },
    handleDelete() {
      let data = { id: this.transporter_id, email: this.email, role: 2 }
      console.log('handleDelete', data)
      registrationService.deleteTransporter(data).then((result) => {
        let data = result.data
        if (data.status == 0) {
          this.items = data.result[1]
          this.showModal2 = false
        }
      })
    },
  },
}
</script>
