<template>
  <CLoadingButton
    color="primary"
    style="float: right"
    :timeout="1000"
    @click="handleRegisterDlg"
    >New Product</CLoadingButton
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
    <template #image="{ item }">
      <td>
        <CAvatar :src="withBase(item.image)" />
      </td>
    </template>
    <template #price="{ item }">
      <td>
        {{ item.price + '' + '₦' }}
      </td>
    </template>
    <template #quality="{ item }">
      <td>
        <CBadge :color="getBadge(item.quality)">{{ item.quality }}</CBadge>
      </td>
    </template>
    <template #quantity="{ item }">
      <td @click="handleQuantityDlg(item)">
        <CBadge color="primary">
          {{ item.quantity }}
        </CBadge>
      </td>
    </template>
    <template #receive_date="{ item }">
      <td>
        {{ getDateFormat(item.receive_date) }}
      </td>
    </template>
    <template #expiry_date="{ item }">
      <td>
        {{ getDateFormat(item.expiry_date) }}
      </td>
    </template>
    <template #coupon_code="{ item }">
      <td>
        {{ getCouponFormat(item.coupon_code) }}
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
            {{ item.name }}
          </h4>
          <h6>{{ item.description }}</h6>
          <h6>Size: {{ item.size }}</h6>
          <p class="text-muted">
            {{ item.details }}
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
        <CModalTitle>Create Product</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="row mb-3">
          <div class="col-12 text-center">
            <h4>Product Image</h4>
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
                />
              </div>
            </form>
          </div>
        </div>
        <CFormSelect label="Category" v-model="category" required>
          <option value="">Select Category</option>
          <option
            v-for="dcategory in categories"
            :key="dcategory.id"
            :value="dcategory.name"
          >
            {{ dcategory.name }}
          </option>
        </CFormSelect>
        <CFormInput
          type="text"
          label="Name"
          placeholder="Enter name"
          v-model="name"
          autoComplete="name"
          required
        />
        <div class="d-flex">
          <CCol :md="6" style="padding-right: 10px">
            <CFormInput
              type="text"
              label="Price"
              placeholder="Enter price"
              v-model="price"
              required
            />
          </CCol>
          <CCol :md="6">
            <CFormInput
              type="text"
              label="Quantity"
              placeholder="Enter quantity"
              v-model="quantity"
              required
            />
          </CCol>
        </div>
        <div class="productsizediv">
          <CFormInput
            type="text"
            label="Size list"
            placeholder="Enter size"
            v-model="sizeList"
            required
          />
          <div class="d-flex">
            <CCol :md="6" style="padding-right: 10px">
              <CFormInput
                type="text"
                label="Size"
                placeholder="Enter size"
                v-model="size"
                required
              />
            </CCol>
            <CCol :md="6">
              <CFormSelect label="Unit" v-model="unit" required>
                <option value="Grams">Grams</option>
                <option value="Kg">Kg</option>
                <option value="Kg">Liter</option>
              </CFormSelect>
            </CCol>
          </div>
          <CButton
            class="mt-2"
            color="primary"
            @click="
              () => {
                addSizeList()
              }
            "
          >
            Add
          </CButton>
        </div>
        <CFormSelect label="Quality" v-model="quality" required>
          <option value="">Select quality</option>
          <option value="Low">Low</option>
          <option value="Normal">Normal</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </CFormSelect>
        <CFormTextarea
          type="text"
          label="Description"
          placeholder="Enter description"
          v-model="description"
          autoComplete="description"
          required
        ></CFormTextarea>
        <CFormTextarea
          type="text"
          label="Details"
          placeholder="Enter details"
          autoComplete="details"
          v-model="mdetails"
          required
        ></CFormTextarea>
        <CDatePicker
          label="Receiving Date"
          locale="en-US"
          v-model:date="receive_date"
          required
        />
        <CDatePicker
          label="Expiry Date"
          locale="en-US"
          v-model:date="expiry_date"
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
        <CModalTitle>Edit Product</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="row mb-3">
          <div class="col-12 text-center">
            <h4>Product Image</h4>
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
                />
              </div>
            </form>
          </div>
        </div>
        <CFormSelect label="Category" v-model="category" required>
          <option value="">Select Category</option>
          <option
            v-for="dcategory in categories"
            :key="dcategory.id"
            :value="dcategory.name"
          >
            {{ dcategory.name }}
          </option>
        </CFormSelect>
        <CFormInput
          type="text"
          label="Name"
          placeholder="Enter name"
          v-model="name"
          autoComplete="name"
          required
        />
        <CFormInput
          type="text"
          label="Price"
          placeholder="Enter price"
          v-model="price"
          required
        />
        <div class="productsizediv">
          <CFormInput
            type="text"
            label="Size list"
            placeholder="Enter size"
            v-model="sizeList"
            required
          />
          <div class="d-flex">
            <CCol :md="6" style="padding-right: 10px">
              <CFormInput
                type="text"
                label="Size"
                placeholder="Enter size"
                v-model="size"
                required
              />
            </CCol>
            <CCol :md="6">
              <CFormSelect label="Unit" v-model="unit" required>
                <option value="Grams">Grams</option>
                <option value="Kg">Kg</option>
                <option value="Kg">Liter</option>
              </CFormSelect>
            </CCol>
          </div>
          <CButton
            class="mt-2"
            color="primary"
            @click="
              () => {
                addSizeList()
              }
            "
          >
            Add
          </CButton>
        </div>
        <CFormSelect label="Quality" v-model="quality" required>
          <option value="">Select quality</option>
          <option value="Low">Low</option>
          <option value="Normal">Normal</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </CFormSelect>
        <CFormTextarea
          type="text"
          label="Description"
          placeholder="Enter description"
          v-model="description"
          autoComplete="description"
          required
        ></CFormTextarea>
        <CFormTextarea
          type="text"
          label="Details"
          placeholder="Enter details"
          autoComplete="details"
          v-model="mdetails"
          required
        ></CFormTextarea>
        <CDatePicker
          label="Receiving Date"
          locale="en-US"
          v-model:date="receive_date"
          required
        />
        <CDatePicker
          label="Expiry Date"
          locale="en-US"
          v-model:date="expiry_date"
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

  <CModal
    alignment="center"
    :visible="showModal3"
    @close="
      () => {
        showModal3 = false
      }
    "
  >
    <CForm @submit.prevent="handleQuantity">
      <CModalHeader>
        <CModalTitle>Edit Quantity</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CInputGroup>
          <CFormInput
            placeholder="Input group example"
            aria-label="Input group example"
            aria-describedby="btnGroupAddon"
            type="number"
            v-model="quantity"
            :min="0"
            :max="10000"
          />
        </CInputGroup>
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
import productService from '@/services/Product.Service'
import categoryService from '@/services/Category.Service'
import { mapState } from 'vuex'
import { CButton, CCol } from '@coreui/vue'
import { CDatePicker, CFormTextarea } from '@coreui/vue-pro'
import { validatePhoneNumber, getDateFormat, toastr, isEmpty } from '@/utils'
import { API_URL } from '@/config'
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
    CDatePicker,
    CFormTextarea,
  },
  mounted() {
    console.log('user_authentication:', this.user.user)
    let data = { vendor_id: this.user.user.id, role: this.user.user.role }
    productService.getProductList(data).then((result) => {
      console.log('======productlist:', result.data.products)
      this.items = result.data.products
    })
    categoryService.getCategoryList().then((result) => {
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
          _style: { width: '1%' },
          sorter: false,
          filter: false,
        },
        {
          key: 'image',
          label: '',
          filter: false,
          sorter: false,
          _style: { width: '1%' },
        },
        {
          key: 'cat_name',
          label: 'Category',
          _style: { width: '7%' },
        },
        {
          key: 'name',
          label: 'Name',
          _style: { width: '10%' },
        },
        {
          key: 'price',
          label: 'Price',
          _style: { width: '5%' },
        },
        // {
        //   key: 'size',
        //   label: 'Size',
        //   filter: false,
        //   sorter: false,
        //   _style: { width: '5%' },
        // },
        {
          key: 'quality',
          label: 'Quality',
          _style: { width: '7%' },
        },
        {
          key: 'quantity',
          label: 'Quantity',
          filter: false,
          sorter: false,
          _style: { width: '5%' },
        },
        {
          key: 'receive_date',
          label: 'Receiving Date',
          _style: { width: '9%' },
          sorter: true,
        },
        {
          key: 'expiry_date',
          label: 'Expiry Date',
          _style: { width: '9%' },
        },
        // {
        //   key: 'coupon_code',
        //   label: 'Coupon',
        //   _style: { width: '7%' },
        // },
        {
          key: 'show_details',
          label: 'Details',
          _style: { width: '1%' },
          filter: false,
          sorter: false,
        },
      ],
      options: [
        {
          value: 0,
          text: 'Angular',
        },
        {
          value: 1,
          text: 'Bootstrap',
        },
        {
          value: 2,
          text: 'React.js',
        },
        {
          value: 3,
          text: 'Vue.js',
        },
      ],
      details: [],
      items: [],
      product_id: '',
      category: '',
      name: '',
      price: 1,
      size: 100,
      sizeList: '',
      email: '',
      quality: 'Normal',
      quantity: 0,
      description: '',
      mdetails: '',
      unit: 'Grams',
      receive_date: new Date(),
      expiry_date: new Date(),
      showModal: false,
      showModal1: false,
      showModal2: false,
      showModal3: false,
      preview: null,
      image: null,
      categories: [],
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
    getCouponFormat(code) {
      if (isEmpty(code)) return ''
      else return code
    },
    isEmpty(data) {
      return isEmpty(data)
    },
    getDateFormat(date) {
      return getDateFormat(date)
    },
    toggleDetails(item) {
      if (this.details.includes(item.id)) {
        this.details = this.details.filter((_item) => _item !== item.id)
        return
      }
      this.details.push(item.id)
    },
    addSizeList() {
      console.log('addSizeList')
      if (isEmpty(this.sizeList)) {
        this.sizeList = this.size + this.unit
      } else {
        this.sizeList += ',' + this.size + this.unit
      }
    },
    handleRegisterDlg() {
      console.log('register')
      this.category = null
      this.quality = null
      this.name = ''
      this.price = 1
      this.size = 100
      this.quantity = 1
      this.unit = 'Grams'
      this.quality = ''
      this.description = ''
      this.mdetails = ''
      this.image = null
      this.preview = null
      setTimeout(() => {
        this.showModal = true
      }, 1000)
    },
    handleEditDlg(item) {
      categoryService.getCategoryList().then((result) => {
        let data = result.data
        console.log('resultdata', data)
        this.categories = data.list
      })
      console.log('item====', item)
      this.preview = API_URL + item.image
      this.product_id = item.id
      this.category = item.cat_name
      this.name = item.name
      this.price = item.price
      this.sizeList = item.size
      this.quality = item.quality
      this.description = item.description
      this.mdetails = item.details
      this.receive_date = item.receive_date
      this.expiry_date = item.expiry_date
      setTimeout(() => {
        this.showModal1 = true
      }, 1500)
    },
    handleDeleteDlg(item) {
      this.product_id = item.id
      this.email = item.email
      setTimeout(() => {
        this.showModal2 = true
      }, 1100)
    },
    handleQuantityDlg(item) {
      console.log('item_edit_quantity:', item.quantity)
      this.product_id = item.id
      this.name = item.name
      this.quantity = item.quantity
      this.showModal3 = true
    },
    handleSave() {
      console.log(this.categories, this.category)
      let findCategory = this.categories.find(
        (category) => category.name == this.category,
      )
      console.log('findCategoryName', findCategory.name)
      let category_id = findCategory.id
      console.log(
        'Product saved',
        category_id,
        this.category,
        this.name,
        this.price,
        this.size,
        this.quantity,
        this.quality,
        this.description,
        this.details,
        this.receive_date,
        this.expiry_date,
        this.sizeList,
      )
      const formData = new FormData()
      if (this.image !== null) formData.append('image', this.image)
      else {
        toastr.warning('Choose an image')
        return
      }
      formData.append('category_id', category_id)
      formData.append('category', this.category)
      formData.append('name', this.name)
      formData.append('price', this.price)
      formData.append('quality', this.quality)
      formData.append('quantity', this.quantity)
      formData.append('size', this.sizeList)
      formData.append('description', this.description)
      formData.append('details', this.mdetails)
      formData.append('receive_date', this.receive_date)
      formData.append('expiry_date', this.expiry_date)

      productService.createProduct(formData).then((result) => {
        console.log('result', result)
        let data = result.data
        if (data.status == 0) {
          // this.items = [...this.items, data.product]
          this.items = data.result[1]
          toastr.success(data.message)
          this.showModal = false
        } else {
          toastr.warning(data.message)
        }
      })
    },
    handleEdit() {
      console.log(this.categories, this.category)
      let findCategory = this.categories.find(
        (category) => category.name == this.category,
      )
      console.log('findCategoryName', findCategory.name)
      let category_id = findCategory.id
      // eslint-disable-next-line no-unused-vars
      console.log(
        'Product saved',
        category_id,
        this.category,
        this.name,
        this.price,
        this.size,
        this.quality,
        this.description,
        this.details,
        this.receive_date,
        this.expiry_date,
        this.sizeList,
      )
      const formData = new FormData()
      if (this.image !== null) formData.append('image', this.image)
      formData.append('id', this.product_id)
      formData.append('category_id', category_id)
      formData.append('category', this.category)
      formData.append('name', this.name)
      formData.append('price', this.price)
      formData.append('size', this.sizeList)
      formData.append('quality', this.quality)
      formData.append('description', this.description)
      formData.append('details', this.mdetails)
      formData.append('receive_date', this.receive_date)
      formData.append('expiry_date', this.expiry_date)
      productService.editProduct(formData).then((result) => {
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
      let data = { id: this.product_id, email: this.email, role: 2 }
      console.log('handleDelete', data)
      productService.deleteProduct(data).then((result) => {
        let data = result.data
        if (data.status == 0) {
          this.items = data.result[1]
          this.showModal2 = false
        }
      })
    },
    handleQuantity() {
      let title = 'New Restock Message!'
      let content = `${this.name} quantity has been changed to ${this.quantity} `
      let data = {
        id: this.product_id,
        quantity: this.quantity,
        title: title,
        content: content,
      }
      productService.editQuantity(data).then((result) => {
        console.log('product_quantity_save:', result)
        let data = result.data
        if (data.status == 0) {
          this.items = data.result[1]
          toastr.success(data.message)
          this.showModal3 = false
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
