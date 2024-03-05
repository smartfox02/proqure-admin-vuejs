<template>
  <CLoadingButton
    color="primary"
    style="float: right"
    :timeout="1000"
    @click="handleRegisterDlg"
    >New Vendor</CLoadingButton
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
    :sorterValue="{ column: 'id', state: 'asc' }"
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
      <td @click="handleStatusDlg(item)">
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
            Edit
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
        <CModalTitle>Create Vendor</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="row mb-3">
          <div class="col-12 text-center">
            <h4>Vendor Image</h4>
          </div>
          <div class="">
            <form class="preimgout">
              <div class="border p-2 preimgin">
                <template v-if="preview">
                  <img :src="preview" class="img-fluid" />
                  <button class="preclose-button" @click="closeImagePreview">
                    &times;
                  </button>
                </template>
              </div>
              <div class="form-group">
                <input
                  type="file"
                  accept="image/*"
                  @change="previewImage"
                  class="form-control-file mt-3"
                  id="my-file"
                  name="Upload"
                  required
                />
              </div>
            </form>
          </div>
        </div>
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
        <CFormSelect label="Select Status" v-model="status" required>
          <option value="1">Inactive</option>
          <option value="2">Active</option>
          <option value="3">Banned</option>
        </CFormSelect>
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
        <CModalTitle>Edit Vendor</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="row mb-3">
          <div class="col-12 text-center">
            <h4>Vendor Image</h4>
          </div>
          <div class="">
            <form class="preimgout">
              <div class="border p-2 preimgin">
                <template v-if="preview">
                  <img :src="preview" class="img-fluid" />
                  <button class="preclose-button" @click="closeImagePreview">
                    &times;
                  </button>
                </template>
              </div>
              <div class="form-group">
                <input
                  type="file"
                  accept="image/*"
                  @change="previewImage"
                  class="form-control-file mt-3"
                  id="my-file"
                  name="Upload"
                  required
                />
              </div>
            </form>
          </div>
        </div>
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
        <CFormSelect label="Select Status" v-model="status" required>
          <!-- <option value="">Select Status</option> -->
          <option value="1">Inactive</option>
          <option value="2">Active</option>
          <option value="3">Banned</option>
        </CFormSelect>
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

  <CModal
    alignment="center"
    :visible="showModal3"
    @close="
      () => {
        showModal3 = false
      }
    "
  >
    <CForm @submit.prevent="handleStatus">
      <CModalHeader>
        <CModalTitle>Edit Status</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormSelect label="Select Status" v-model="status" required>
          <option value="1">Inactive</option>
          <option value="2">Active</option>
          <option value="3">Banned</option>
        </CFormSelect>
      </CModalBody>
      <CModalFooter>
        <CButton
          color="secondary"
          @click="
            () => {
              showModal3 = false
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
</template>

<script>
// import CSmartTable from '@coreui/vue-pro/src/components/smart-table/CSmartTable'
import vendorService from '@/services/Vendor.Service'
import { CButton, CCol } from '@coreui/vue'
import { toastr, validatePhoneNumber } from '@/utils'
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
    vendorService.getVendorList({ role: 2 }).then(
      (result) => {
        console.log('result: ', result.data.users)
        this.items = result.data.users
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
          key: 'id',
          label: 'Id',
          _style: { width: '5%' },
          sorter: true,
          filter: false,
        },
        {
          key: 'avatar',
          label: '',
          _style: { width: '5%' },
          filter: false,
          sorter: false,
        },
        {
          key: 'email',
          label: 'Email',
          _style: { width: '20%' },
          sorter: false,
        },
        {
          key: 'created_at',
          label: 'Registration Date',
          _style: { width: '20%' },
          sorter: 'desc',
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
      vendor_id: '',
      company: '',
      firstname: '',
      lastname: '',
      phone: '',
      email: '',
      password: '',
      cpassword: '',
      status: 1,
      vendorList: '',
      showModal: false,
      showModal1: false,
      showModal2: false,
      showModal3: false,
      preview: null,
      image: null,
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
        case 1:
          return 'secondary'
        case 2:
          return 'danger'
        case 3:
          return 'primary'
        default:
          'secondary'
      }
    },
    getRoleStr(status) {
      switch (status) {
        case 1:
          return 'Super Admin'
        case 2:
          return 'Vendor'
        case 3:
          return 'Transporter'
        case 4:
          return 'Client'
        default:
          'Client'
      }
    },
    getBadgeStr(status) {
      switch (status) {
        case 1:
          return 'Inactive'
        case 2:
          return 'Active'
        case 3:
          return 'Banned'
        default:
          'Inactive'
      }
    },
    getDateTimeFormat(date) {
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
      this.status = 1
      this.image = null
      this.preview = null
      setTimeout(() => {
        this.showModal = true
      }, 1000)
    },
    handleEditDlg(item) {
      console.log('item:', item.avatar)
      this.preview = API_URL + item.avatar
      this.vendor_id = item.id
      this.company = item.company
      this.firstname = item.firstname
      this.lastname = item.lastname
      this.phone = item.phone
      this.email = item.email
      this.status = item.status
      setTimeout(() => {
        this.showModal1 = true
      }, 1100)
    },
    handleDeleteDlg(item) {
      this.vendor_id = item.id
      this.email = item.email
      setTimeout(() => {
        this.showModal2 = true
      }, 1100)
    },
    handleStatusDlg(item) {
      console.log('changeItem', item)
      this.vendor_id = item.id
      this.status = item.status
      this.showModal3 = true
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
      const formData = new FormData()
      if (this.image !== null) formData.append('image', this.image)
      else {
        toastr.warning('Choose an image')
        return
      }
      formData.append('company', this.company)
      formData.append('firstname', this.firstname)
      formData.append('lastname', this.lastname)
      formData.append('phone', this.phone)
      formData.append('email', this.email)
      formData.append('password', this.password)
      formData.append('status', this.status)
      formData.append('role', 2)
      console.log('handleSave:', this.image)
      console.log('formData:', formData)
      vendorService.createVendor(formData).then((result) => {
        let data = result.data
        if (data.status == 0) {
          this.items = [...this.items, data.user]
          this.showModal = false
          toastr.success(data.message)
        } else {
          toastr.warning(data.message)
        }
      })
    },
    handleEdit() {
      // eslint-disable-next-line no-unused-vars
      const formData = new FormData()
      if (this.image !== null) formData.append('image', this.image)
      formData.append('id', this.vendor_id)
      formData.append('company', this.company)
      formData.append('firstname', this.firstname)
      formData.append('lastname', this.lastname)
      formData.append('phone', this.phone)
      formData.append('email', this.email)
      formData.append('status', this.status)
      formData.append('role', 2)
      vendorService.editVendor(formData).then((result) => {
        let data = result.data
        console.log('result', data)
        if (data.status == 0) {
          this.items = data.result[1]
          this.showModal1 = false
          toastr.success(data.message)
        } else {
          toastr.warning(data.message)
        }
      })
    },
    handleDelete() {
      let data = { id: this.vendor_id, email: this.email, role: 2 }
      console.log('handleDelete', data)
      vendorService.deleteVendor(data).then((result) => {
        let data = result.data
        if (data.status == 0) {
          this.items = data.result[1]
          this.showModal2 = false
          toastr.success(data.message)
        } else {
          toastr.warning(data.message)
        }
      })
    },
    handleStatus() {
      let data = {
        id: this.vendor_id,
        status: this.status,
        role: 2,
      }
      console.log('data', data)
      vendorService.changeStatusVender(data).then((result) => {
        let data = result.data
        if (data.status == 0) {
          this.items = data.result[1]
          this.showModal3 = false
          toastr.success(data.message)
        } else {
          toastr.warning(data.message)
        }
      })
    },
    previewImage: function (event) {
      var input = event.target
      if (input.files) {
        var reader = new FileReader()
        reader.onload = (e) => {
          this.preview = e.target.result
        }
        this.image = input.files[0]
        console.log('previewImage:', this.image)
        reader.readAsDataURL(input.files[0])
      }
    },
    closeImagePreview: function () {
      this.preview = null
      this.image = null
    },
  },
}
</script>
