<template>
  <CLoadingButton
    color="primary"
    style="float: right"
    :timeout="1000"
    @click="handleRegisterDlg"
    >New Coupon</CLoadingButton
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
    class="coupon_table"
  >
    <!-- <template #value="{ item }">
      <td>
        {{ item.value }}
      </td>
    </template> -->
    <template #created_at="{ item }">
      <td>
        {{ getDateTimeFormat(item.created_at) }}
      </td>
    </template>
    <template #validity_date="{ item }">
      <td>
        {{ getDateFormat(item.validity_date) }}
      </td>
    </template>
    <template #active="{ item }">
      <td>
        <CBadge :color="getStatus(item.active)">
          {{ getStatusStr(item.active) }}
        </CBadge>
      </td>
    </template>
    <template #applied_name="{ item }">
      <td>
        <CBadge color="info">
          {{ item.applied_name }}
        </CBadge>
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
            {{ getAppliedName(item) }}
          </h4>
          <p class="text-muted">
            Created Date : {{ getDateTimeFormat(item.created_at) }}
          </p>
          <p class="text-muted">
            Validity Date : {{ getDateFormat(item.validity_date) }}
          </p>
          <!-- <CLoadingButton
            size="sm"
            color="info"
            class="mr-1"
            spinnerType="grow"
            :timeout="1100"
            @click="handleEditDlg(item)"
          >
            Edit
          </CLoadingButton> -->
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
        <CModalTitle>Create Coupon</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="d-flex">
          <CCol :md="8" style="padding-right: 10px">
            <CFormInput
              type="text"
              label="Code"
              placeholder="Enter code"
              v-model="code"
              required
            />
          </CCol>
          <CCol :md="4" style="margin-top: auto; display: flex">
            <CLoadingButton
              color="primary"
              style="width: 100%"
              :timeout="1000"
              @click="handleGenerate"
            >
              GENERATE
            </CLoadingButton>
          </CCol>
        </div>
        <CFormSelect label="Type" v-model="type" required>
          <option value="">Select type</option>
          <option value="Discount(%)">Discount(%)</option>
          <option value="Cash Off Order">Cash Off Order</option>
          <option value="Category Specific">Category Specific</option>
          <option value="Free Delivery">Free Delivery</option>
          <option value="BOGOF">BOGOF</option>
        </CFormSelect>
        <CFormSelect
          label="Category"
          v-model="category_id"
          required
          v-if="coptionflag"
        >
          <option value="">Select Category</option>
          <option
            v-for="dcategory in categories"
            :key="dcategory.id"
            :value="dcategory.id"
          >
            {{ dcategory.name }}
          </option>
        </CFormSelect>
        <CFormSelect
          label="Product"
          v-model="product_id"
          required
          v-if="poptionflag"
        >
          <option value="">Select Product</option>
          <option
            v-for="dproduct in products"
            :key="dproduct.id"
            :value="dproduct.id"
          >
            {{ dproduct.name }}
          </option>
        </CFormSelect>
        <CFormInput
          type="number"
          label="Value"
          placeholder="Enter value"
          v-model="value"
          autoComplete="value"
          v-if="valueflag"
        ></CFormInput>
        <CFormInput
          type="number"
          label="Count"
          placeholder="Enter count"
          v-model="count"
          autoComplete="count"
          required
        ></CFormInput>
        <CDatePicker
          label="Validity date"
          locale="en-US"
          v-model:date="validity_date"
          required
        />
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
        <CModalTitle>Edit Coupon</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormInput
          type="text"
          label="Code"
          placeholder="Enter code"
          v-model="code"
          disabled
        />
        <CFormSelect label="Type" v-model="type" required>
          <option value="">Select type</option>
          <option value="Discount">Discount(%)</option>
          <option value="Cash Off Order">Cash Off Order</option>
          <option value="Category Specific">Category Specific</option>
          <option value="Free Delivery">Free Delivery</option>
          <option value="BOGOF">BOGOF</option>
        </CFormSelect>
        <CFormInput
          type="text"
          label="Value"
          placeholder="Enter value"
          v-model="value"
          autoComplete="value"
          required
        ></CFormInput>
        <CFormInput
          type="text"
          label="Count"
          placeholder="Enter count"
          v-model="count"
          autoComplete="count"
          required
        ></CFormInput>
        <CDatePicker
          label="Validity date"
          locale="en-US"
          v-model:date="validity_date"
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
import couponService from '@/services/Coupon.Service'
import categoryService from '@/services/Category.Service'
import productService from '@/services/Product.Service'
import { CButton } from '@coreui/vue'
import moment from 'moment'
import {
  getDateTimeFormat,
  toastr,
  // isEmpty,
  randomString,
  getDateFormat,
  isEmpty,
} from '@/utils'
import { API_URL } from '@/config'
import {
  CSmartTable,
  // CAvatar,
  CBadge,
  CLoadingButton,
  CDatePicker,
} from '@coreui/vue-pro'
export default {
  components: {
    CSmartTable,
    // CAvatar,
    CBadge,
    CLoadingButton,
    CButton,
    CDatePicker,
  },
  mounted() {
    couponService.getCouponList().then((result) => {
      console.log('======couponlist:', result.data.list)
      this.items = result.data.list
    })
    categoryService.getCategoryList().then((result) => {
      let data = result.data
      console.log('resultdata', data)
      this.categories = data.list
    })
    productService.getProductList().then((result) => {
      console.log('======productlist:', result.data.products)
      this.products = result.data.products
    })
  },
  data() {
    return {
      columns: [
        {
          key: 'id',
          label: 'Id',
          _style: { width: '3%' },
          sorter: false,
          filter: false,
        },
        {
          key: 'code',
          label: 'Code',
          _style: { width: '7%' },
        },
        {
          key: 'type',
          label: 'Type',
          _style: { width: '10%' },
          sorter: true,
        },
        {
          key: 'applied_name',
          label: 'Applied Object',
          _style: { width: '10%' },
          sorter: true,
        },
        {
          key: 'value',
          label: 'Value',
          _style: { width: '5%' },
        },
        {
          key: 'count',
          label: 'Count',
          _style: { width: '5%' },
        },
        // {
        //   key: 'created_at',
        //   label: 'Created Date',
        //   _style: { width: '10%' },
        //   sorter: true,
        // },
        // {
        //   key: 'validity_date',
        //   label: 'Validity Date',
        //   _style: { width: '10%' },
        //   filter: false,
        //   sorter: false,
        // },
        {
          key: 'used_count',
          label: 'Used Count',
          _style: { width: '8%' },
          filter: false,
          sorter: false,
        },
        {
          key: 'active',
          label: 'Status',
          _style: { width: '5%' },
          filter: false,
          sorter: false,
        },
        {
          key: 'show_details',
          label: 'Details',
          _style: { width: '7%' },
          filter: false,
          sorter: false,
        },
      ],
      id: '',
      details: [],
      items: [],
      code: '',
      value: 0,
      count: 0,
      categories: [],
      category: '',
      products: [],
      product: '',
      validity_date: new Date(),
      expiry_date: new Date(),
      showModal: false,
      showModal1: false,
      showModal2: false,
      preview: null,
      image: null,
      poptionflag: false,
      coptionflag: false,
      valueflag: true,
      type: '',
    }
  },
  computed: {
    formattedValidityDate() {
      return moment(this.validity_date).format('YYYY-MM-DD')
    },
  },
  watch: {
    type(newType) {
      console.log('new type: ', newType)
      if (newType === 'Category Specific') {
        this.coptionflag = true
        this.poptionflag = false
        this.product_id = ''
      } else if (newType === 'BOGOF') {
        this.coptionflag = false
        this.poptionflag = true
        this.category_id = ''
      } else {
        this.coptionflag = false
        this.poptionflag = false
        this.category_id = ''
        this.product_id = ''
      }

      if (newType === 'Free Delivery' || newType === 'BOGOF') {
        this.valueflag = false
        this.value = 0
      } else {
        this.valueflag = true
      }
    },
  },
  methods: {
    getStatus(active) {
      if (active == 0) {
        return 'primary'
      } else {
        return 'secondary'
      }
    },
    getStatusStr(active) {
      if (active == 0) {
        return 'Active'
      } else {
        return 'Inactive'
      }
    },
    handleGenerate() {
      setTimeout(() => {
        console.log('generate!')
        this.code = randomString(7)
      }, 1000)
    },
    withBase(image) {
      return API_URL + image
    },
    getBadge(status) {
      switch (status) {
        case 'High':
          return 'success'
        case 'Medium':
          return 'primary'
        case 'Normal':
          return 'dark'
        case 'Low':
          return 'secondary'
        default:
          'primary'
      }
    },
    getDateFormat(date) {
      return getDateFormat(date)
    },
    getDateTimeFormat(date) {
      return getDateTimeFormat(date)
    },
    getAppliedName(item) {
      console.log('item: ', item)
    },
    toggleDetails(item) {
      if (this.details.includes(item.id)) {
        this.details = this.details.filter((_item) => _item !== item.id)
        return
      }
      this.details.push(item.id)
    },
    handleRegisterDlg() {
      this.code = ''
      this.value = 0
      this.count = 0
      setTimeout(() => {
        this.showModal = true
      }, 1000)
    },
    handleEditDlg(item) {
      console.log('item====', item)
      this.id = item.id
      this.code = item.code
      this.type = item.type
      this.value = item.value
      this.count = item.count
      this.validity_date = item.validity_date
      setTimeout(() => {
        this.showModal1 = true
      }, 1100)
    },
    handleDeleteDlg(item) {
      this.coupon_id = item.id
      this.email = item.email
      setTimeout(() => {
        this.showModal2 = true
      }, 1100)
    },
    handleSave() {
      console.log(
        'Coupon saved',
        this.code,
        this.type,
        this.value,
        this.count,
        this.validity_date,
        this.category_id,
        this.category,
        this.product_id,
        this.product,
      )
      let applied_id = ''
      let applied_name = ''
      if (!isEmpty(this.category_id)) {
        applied_id = this.category_id
        const index = this.categories.findIndex(
          (item) => item.id == this.category_id,
        )
        applied_name = this.categories[index].name
      } else if (!isEmpty(this.product_id)) {
        applied_id = this.product_id
        const index = this.products.findIndex(
          (item) => item.id == this.product_id,
        )
        applied_name = this.products[index].name
      } else {
        applied_id = 'all'
        applied_name = 'all'
      }
      console.log('selected item name', applied_id, applied_name)

      let title = 'New Coupon Message!'
      let content = `You have received a ${this.type} coupon for ${applied_name}. Limited time offer: ${this.code}`
      const formData = new FormData()
      formData.append('code', this.code)
      formData.append('type', this.type)
      formData.append('value', this.value)
      formData.append('count', this.count)
      formData.append('applied_id', applied_id)
      formData.append('applied_name', applied_name)
      formData.append('validity_date', this.validity_date)
      formData.append('title', title)
      formData.append('content', content)
      couponService.createCoupon(formData).then((result) => {
        let data = result.data
        console.log('result', data)
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
      console.log(
        'Coupon saved',
        this.id,
        this.code,
        this.type,
        this.value,
        this.count,
        this.validity_date,
      )
      const formData = new FormData()
      if (this.image !== null) formData.append('image', this.image)
      formData.append('id', this.id)
      formData.append('code', this.code)
      formData.append('type', this.type)
      formData.append('value', this.value)
      formData.append('count', this.count)
      formData.append('validity_date', this.validity_date)
      couponService.editCoupon(formData).then((result) => {
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
      let data = { id: this.coupon_id, email: this.email, role: 2 }
      console.log('handleDelete', data)
      couponService.deleteCoupon(data).then((result) => {
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
    previewImage: function (event) {
      var input = event.target
      if (input.files) {
        var reader = new FileReader()
        reader.onload = (e) => {
          this.preview = e.target.result
        }
        this.image = input.files[0]
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
<style>
.coupon_table td {
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.coupon_details {
  white-space: break-spaces !important;
}
</style>
