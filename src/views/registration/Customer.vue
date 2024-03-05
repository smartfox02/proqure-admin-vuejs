<template>
  <CLoadingButton
    color="primary"
    style="float: right"
    :timeout="1000"
    @click="handleRegisterDlg"
    >New Customer</CLoadingButton
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
    <template #segment_name="{ item }">
      <td @click="handleSegmentDlg(item)">
        <CBadge :color="getSegmentColor(item.segment_name)">
          {{ getSegmentFormat(item.segment_name) }}
        </CBadge>
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
            Customer since: {{ getDateTimeFormat(item.created_at) }}
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
            color="success"
            class="mr-1"
            spinnerType="grow"
            :timeout="1100"
            @click="handleTransaction(item)"
          >
            Transaction
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
        <CModalTitle>Create Customer</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="row mb-3">
          <div class="col-12 text-center">
            <h4>Customer Image</h4>
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
        <CFormSelect label="Segment" v-model="category">
          <option value="">Select Segment</option>
          <option
            v-for="dcategory in categories"
            :key="dcategory.id"
            :value="dcategory.name"
          >
            {{ dcategory.name }}
          </option>
        </CFormSelect>
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
        <CModalTitle>Edit Customer</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="row mb-3">
          <div class="col-12 text-center">
            <h4>Customer Image</h4>
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
        <CFormSelect label="Segment" v-model="category">
          <option value="">Select Segment</option>
          <option
            v-for="dcategory in categories"
            :key="dcategory.id"
            :value="dcategory.name"
          >
            {{ dcategory.name }}
          </option>
        </CFormSelect>
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

  <CModal
    alignment="center"
    :visible="showModal4"
    @close="
      () => {
        showModal4 = false
      }
    "
  >
    <CForm @submit.prevent="handleSegment">
      <CModalHeader>
        <CModalTitle>Edit Segment</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormSelect label="Segment" v-model="category">
          <option value="">Select Segment</option>
          <option
            v-for="dcategory in categories"
            :key="dcategory.id"
            :value="dcategory.name"
          >
            {{ dcategory.name }}
          </option>
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
import clientService from '@/services/Client.Service'
import segmentServie from '@/services/Segment.Service'
import { CButton, CCol } from '@coreui/vue'
import { validatePhoneNumber, toastr, isEmpty } from '@/utils'
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
    clientService.getClientList({ role: 4 }).then((result) => {
      console.log('result: ', result.data.users)
      this.items = result.data.users
    })
    segmentServie.getSegmentList().then((result) => {
      let data = result.data
      console.log('resultdata', data)
      this.categories = data.list
    })
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
          _style: { width: '10%' },
          filter: false,
          sorter: false,
        },
        {
          key: 'segment_name',
          label: 'Segment',
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
      customer_id: '',
      company: '',
      firstname: '',
      lastname: '',
      phone: '',
      email: '',
      password: '',
      cpassword: '',
      status: 1,
      category: '',
      categories: [],
      clientList: '',
      showModal: false,
      showModal1: false,
      showModal2: false,
      showModal3: false,
      showModal4: false,
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
    getSegmentFormat(data) {
      if (isEmpty(data)) return 'Add'
      else return data
    },
    getSegmentColor(data) {
      if (!isEmpty(data)) {
        return 'success'
      } else {
        return 'info'
      }
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
      this.category = ''
      this.status = 1
      this.image = null
      this.preview = null
      setTimeout(() => {
        this.showModal = true
      }, 1000)
    },
    handleEditDlg(item) {
      segmentServie.getSegmentList().then((result) => {
        let data = result.data
        console.log('resultdata', data)
        this.categories = data.list
      })
      console.log('item:', item.avatar)
      this.preview = API_URL + item.avatar
      this.customer_id = item.id
      this.company = item.company
      this.firstname = item.firstname
      this.lastname = item.lastname
      this.phone = item.phone
      this.email = item.email
      this.status = item.status
      this.category = item.segment_name
      setTimeout(() => {
        this.showModal1 = true
      }, 1100)
    },
    handleTransaction(item) {
      console.log('transaction_item:', item)
      setTimeout(() => {
        this.customer_id = item.id
        this.$router.push('/other/transaction/' + this.customer_id)
      }, 1100)
    },
    handleDeleteDlg(item) {
      this.customer_id = item.id
      this.email = item.email
      setTimeout(() => {
        this.showModal2 = true
      }, 1100)
    },
    handleStatusDlg(item) {
      console.log('changeStatusItem', item)
      this.vendor_id = item.id
      this.status = item.status
      this.showModal3 = true
    },
    handleSegmentDlg(item) {
      console.log('changeSegmentItem', item)
      segmentServie.getSegmentList().then((result) => {
        let data = result.data
        console.log('resultdata', data)
        this.categories = data.list
      })
      this.vendor_id = item.id
      this.category = item.segment_name
      this.showModal4 = true
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
      if (!isEmpty(this.category)) {
        let findCategory = this.categories.find(
          (category) => category.name == this.category,
        )
        let segment_id = findCategory.id
        formData.append('segment_id', segment_id)
      }
      formData.append('company', this.company)
      formData.append('firstname', this.firstname)
      formData.append('lastname', this.lastname)
      formData.append('phone', this.phone)
      formData.append('email', this.email)
      formData.append('password', this.password)
      formData.append('status', this.status)
      formData.append('role', 4)
      clientService.createClient(formData).then((result) => {
        let data = result.data
        if (data.status == 0) {
          this.items = data.result[1]
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
      if (!isEmpty(this.category)) {
        let findCategory = this.categories.find(
          (category) => category.name == this.category,
        )
        let segment_id = findCategory.id
        formData.append('segment_id', segment_id)
      }
      formData.append('id', this.customer_id)
      formData.append('company', this.company)
      formData.append('firstname', this.firstname)
      formData.append('lastname', this.lastname)
      formData.append('phone', this.phone)
      formData.append('email', this.email)
      formData.append('status', this.status)
      formData.append('role', 4)
      clientService.editClient(formData).then((result) => {
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
      let data = { id: this.customer_id, email: this.email, role: 4 }
      console.log('handleDelete', data)
      clientService.deleteClient(data).then((result) => {
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
        role: 3,
      }
      console.log('data', data)
      clientService.changeStatusClient(data).then((result) => {
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
    handleSegment() {
      // eslint-disable-next-line no-unused-vars
      let data = { id: this.vendor_id, role: 4 }
      if (!isEmpty(this.category)) {
        let findCategory = this.categories.find(
          (category) => category.name == this.category,
        )
        let segment_id = findCategory.id
        data.segment_id = segment_id
      }
      console.log('data', data)
      clientService.changeSegmentClient(data).then((result) => {
        let data = result.data
        console.log('result', data)
        if (data.status == 0) {
          this.items = data.result[1]
          this.showModal4 = false
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
