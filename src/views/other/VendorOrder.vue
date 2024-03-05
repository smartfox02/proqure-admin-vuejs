<template>
  <div class="datepicker-container">
    <span class="p-1">Start Date:</span>
    <CDatePicker v-model:date="startDateTime" locale="en-US" timepicker />
    <span class="mx-2 p-1">~</span>
    <span class="p-1">End Date:</span>
    <CDatePicker v-model:date="endDateTime" locale="en-US" timepicker />
    <div class="hover" @click="handleFilter">
      <CIcon
        class="px-2"
        icon="cil-filter"
        height="25"
        alt="Logo"
        style="margin-top: 7px"
      />
    </div>
    <div class="hover" @click="handleFilterCancel">
      <CIcon
        icon="cil-filter-x"
        height="20"
        alt="Logo"
        style="margin-top: 7px"
      />
    </div>
    <CButton
      color="primary"
      class="ml-1"
      style="float: right"
      @click="handleExport"
      ><CIcon
        class="px-2"
        icon="cil-short-text"
        height="15"
        alt="Logo"
        style="margin-top: 7px"
      />Export</CButton
    >
  </div>
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
    <!-- <template #id="{ item, index }">
      <td>
        {{ getSortId(item, index) }}
      </td>
    </template> -->
    <template #created_at="{ item }">
      <td>
        {{ getDateTimeFormat(item.created_at) }}
      </td>
    </template>
    <template #firstname="{ item }">
      <td>
        {{ getFullName(item) }}
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
            Order Date: {{ getDateTimeFormat(item.created_at) }}
          </p>
          <p>Category name: {{ item.cat_name }}</p>
          <p>Name: {{ item.product_name }}</p>
          <p>Description: {{ item.description }}</p>
          <p>Details: {{ item.details }}</p>
        </CCardBody>
      </CCollapse>
    </template>
  </CSmartTable>

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
        <div class="row mb-3">
          <div class="col-12 text-center">
            <h4>Transporter Image</h4>
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
          <option value="1">Processing</option>
          <option value="2">Completed</option>
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
import orderService from '@/services/Order.Service'
import { CButton } from '@coreui/vue'
import { mapState } from 'vuex'
import { validatePhoneNumber, toastr } from '@/utils'
import { API_URL } from '@/config'
import moment from 'moment'
import {
  CSmartTable,
  // CAvatar,
  CDatePicker,
  CBadge,
  CCollapse,
  CCardBody,
} from '@coreui/vue-pro'
export default {
  components: {
    CSmartTable,
    // CAvatar,
    CDatePicker,
    CBadge,
    CCollapse,
    CCardBody,
    CButton,
  },
  mounted() {
    let vendor_id = this.user.user.id
    console.log('id:', vendor_id)
    orderService.getVendorOrderList({ vendor_id }).then(
      (result) => {
        console.log('vendororder_result: ', result)
        this.items = result.data.list
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
          key: 'order_id',
          label: 'OrderId',
          filter: false,
          sorter: false,
          _style: { width: '3%' },
        },
        // {
        //   key: 'avatar',
        //   label: '',
        //   filter: false,
        //   sorter: false,
        //   _style: { width: '5%' },
        // },
        {
          key: 'firstname',
          label: 'User Name',
          filter: false,
          _style: { width: '10%' },
        },
        {
          key: 'cat_name',
          label: 'Category',
          _style: { width: '10%' },
        },
        {
          key: 'product_name',
          _style: { width: '10%' },
        },
        {
          key: 'shipping',
          label: 'Shipping',
          _style: { width: '10%' },
        },
        {
          key: 'option',
          _style: { width: '15%' },
          filter: true,
          sorter: false,
        },
        {
          key: 'size',
          _style: { width: '10%' },
          filter: false,
          sorter: false,
        },
        {
          key: 'quantity',
          _style: { width: '10%' },
          filter: false,
          sorter: false,
        },
        {
          key: 'status',
          _style: { width: '5%' },
          filter: false,
          sorter: false,
        },
        {
          key: 'show_details',
          label: 'Details',
          _style: { width: '10%' },
          filter: false,
          sorter: false,
        },
      ],
      details: [],
      items: [],
      tempItems: [],
      id: '',
      company: '',
      firstname: '',
      lastname: '',
      phone: '',
      email: '',
      password: '',
      cpassword: '',
      showModal: false,
      showModal1: false,
      showModal2: false,
      showModal3: false,
      tableindex: 1,
    }
  },
  computed: {
    ...mapState({
      user: (state) => state.auth.user,
    }),
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
    getFullName(item) {
      return item.firstname + ' ' + item.lastname
    },
    getBadge(status) {
      switch (status) {
        case 1:
          return 'secondary'
        case 2:
          return 'primary'
        default:
          'secondary'
      }
    },
    getBadgeStr(status) {
      switch (status) {
        case 1:
          return 'Processing'
        case 2:
          return 'Completed'
        default:
          'Processing'
      }
    },
    getSortId(item, index) {
      return Number(index) + 1
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
    handleExport() {
      this.showModal = true
      if (window.confirm('Would you like to export the file')) {
        // remove it!
      }
    },
    handleEditDlg(item) {
      this.id = item.id
      this.company = item.company
      this.firstname = item.firstname
      this.lastname = item.lastname
      this.phone = item.phone
      this.email = item.email
      setTimeout(() => {
        this.showModal1 = true
      }, 1100)
    },
    handleStatusDlg(item) {
      console.log('changestatusitem:', item)
      this.id = item.id
      this.status = item.status
      this.showModal3 = true
    },
    handleDeleteDlg(item) {
      this.id = item.id
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
      orderService.createOrder(data).then((result) => {
        let data = result.data
        console.log('data', data)
        if (data.status == 0) {
          this.items = [...this.items, data.user]
          this.showModal = false
        }
      })
    },
    handleEdit() {
      // eslint-disable-next-line no-unused-vars
      let data = {
        id: this.id,
        company: this.company,
        firstname: this.firstname,
        lastname: this.lastname,
        phone: this.phone,
        email: this.email,
        role: 2,
      }
      orderService.editOrder(data).then((result) => {
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
      let data = { id: this.id, email: this.email }
      console.log('handleDelete', data)
      orderService.deleteOrder(data).then((result) => {
        console.log('order:', result)
        let data = result.data
        if (data.status == 0) {
          this.items = data.result[1]
          this.showModal2 = false
        }
      })
    },
    handleStatus() {
      let data = {
        vendor_id: this.user.user.id,
        id: this.id,
        status: this.status,
      }
      console.log('detail_status_data:', data)
      orderService.changeStatusVendorOrder(data).then((result) => {
        let data = result.data
        console.log('order_changestatus:', data)
        if (data.status == 0) {
          this.items = data.result[1]
          this.showModal3 = false
          toastr.success(data.message)
        } else {
          toastr.warning(data.message)
        }
      })
    },
  },
}
</script>
