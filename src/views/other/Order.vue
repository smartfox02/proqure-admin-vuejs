<template>
  <div class="searchcontainer">
    <div class="searchcontainer-left">
      <span class="p-1">Status:</span>
      <CCol :md="6">
        <CFormSelect v-model="unit" required>
          <option value="0">All</option>
          <option value="1">Processing</option>
          <option value="2">Out for delivery</option>
          <option value="3">Delivered</option>
          <option value="4">Returned</option>
        </CFormSelect>
      </CCol>
    </div>
    <div class="searchcontainer-right">
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
    </div>
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
          class="mr-1"
          variant="outline"
          square
          size="sm"
          @click="toggleDetails(item, index)"
        >
          {{ Boolean(item._toggled) ? 'Hide' : 'Show' }}
        </CButton>
        <CButton
          size="sm"
          color="info"
          spinnerType="grow"
          @click="handleEdit(item)"
        >
          Details
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
          <option value="2">Out for delivery</option>
          <option value="3">Delivered</option>
          <option value="4">Returned</option>
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
import { CIcon } from '@coreui/icons-vue'
import { ref } from 'vue'
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
  CLoadingButton,
} from '@coreui/vue-pro'
export default {
  components: {
    CSmartTable,
    // CAvatar,
    CDatePicker,
    CBadge,
    CCollapse,
    CCardBody,
    CLoadingButton,
    CButton,
    CIcon,
  },
  mounted() {
    let data = { vendor_id: this.user.user.id, role: this.user.user.role }
    orderService.getOrderList(data).then(
      (result) => {
        console.log('order_result: ', result)
        this.items = result.data.list
        this.tempItems = result.data.list
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
          filter: false,
          sorter: true,
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
          key: 'email',
          label: 'User Email',
          _style: { width: '10%' },
        },
        {
          key: 'firstname',
          label: 'User Name',
          filter: false,
          _style: { width: '10%' },
        },
        {
          key: 'shipping',
          label: 'Shipping',
          _style: { width: '5%' },
        },
        {
          key: 'created_at',
          label: 'Order Date',
          _style: { width: '10%' },
          filter: true,
          sorter: false,
        },
        {
          key: 'totalAmount',
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
      order_id: '',
      company: '',
      firstname: '',
      lastname: '',
      phone: '',
      email: '',
      password: '',
      cpassword: '',
      orderList: '',
      showModal: false,
      showModal1: false,
      showModal2: false,
      showModal3: false,
      tableindex: 1,
    }
  },
  setup() {
    const startDateTime = ref(new Date())
    const endDateTime = ref(new Date())
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }
    return {
      startDateTime,
      endDateTime,
      options,
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
    handleFilter() {
      console.log('===fmFilterDate:', this.startDateTime, this.endDateTime)
      const filterList = this.tempItems.filter((item) => {
        const itemDateTime = new Date(item.created_at)
        console.log('===items:', itemDateTime)
        return (
          itemDateTime >= this.startDateTime && itemDateTime <= this.endDateTime
        )
      })
      console.log('filterList:', filterList)
      this.items = filterList
    },
    handleFilterCancel() {
      this.items = this.tempItems
    },
    withBase(avatar) {
      return API_URL + avatar
    },
    getFullName(item) {
      return item.firstname + ' ' + item.lastname
    },
    getRoleStr(status) {
      switch (status) {
        case 1:
          return 'Super Admin'
        case 2:
          return 'Order'
        case 3:
          return 'Member'
      }
    },
    getBadge(status) {
      switch (status) {
        case 1:
          return 'secondary'
        case 2:
          return 'primary'
        case 3:
          return 'info'
        case 4:
          return 'dark'
        default:
          'secondary'
      }
    },
    getBadgeStr(status) {
      switch (status) {
        case 1:
          return 'Processing'
        case 2:
          return 'Out for delivery'
        case 3:
          return 'Delivered'
        case 4:
          return 'Returned'
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
    handleEdit(item) {
      this.order_id = item.id
      this.$router.push('/other/order/' + this.order_id)
    },
    handleStatusDlg(item) {
      console.log('changestatusitem:', item)
      this.order_id = item.id
      this.status = item.status
      this.showModal3 = true
    },
    handleDeleteDlg(item) {
      this.order_id = item.id
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
          this.tempItems = this.items
          this.showModal = false
        }
      })
    },
    handleDelete() {
      let data = { id: this.order_id, email: this.email }
      console.log('handleDelete', data)
      orderService.deleteOrder(data).then((result) => {
        console.log('order:', result)
        let data = result.data
        if (data.status == 0) {
          this.items = data.result[1]
          this.tempItems = this.items
          this.showModal2 = false
        }
      })
    },
    handleStatus() {
      let data = { id: this.order_id, status: this.status }
      console.log('status_data:', data)
      orderService.changeStatusOrder(data).then((result) => {
        let data = result.data
        console.log('order_changestatus:', data.result)
        if (data.status == 0) {
          this.items = data.result[1]
          this.showModal3 = false
          toastr.success(data.message)
        } else {
          toastr.wanring(data.message)
        }
      })
    },
  },
}
</script>
