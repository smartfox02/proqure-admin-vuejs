<template>
  <CLoadingButton
    color="primary"
    style="float: right"
    :timeout="1000"
    @click="handleRegisterDlg"
    >New Category</CLoadingButton
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
    class="category_table"
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
    <template #created_at="{ item }">
      <td>
        {{ getDateTimeFormat(item.created_at) }}
      </td>
    </template>
    <template #updated_at="{ item }">
      <td>
        {{ getDateTimeFormat(item.updated_at) }}
      </td>
    </template>
    <template #expiry_date="{ item }">
      <td>
        {{ getDateTimeFormat(item.expiry_date) }}
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
          <h6 class="category_details">{{ item.description }}</h6>
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
        <CModalTitle>Create Category</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="row mb-3">
          <div class="col-12 text-center">
            <h4>Category Image</h4>
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
        <CFormInput
          type="text"
          label="Name"
          placeholder="Enter name"
          v-model="name"
          autoComplete="name"
          required
        />
        <CFormTextarea
          type="text"
          label="Description"
          placeholder="Enter description"
          v-model="description"
          autoComplete="description"
          required
        ></CFormTextarea>
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
        <CModalTitle>Edit Category</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="row mb-3">
          <div class="col-12 text-center">
            <h4>Category Image</h4>
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
        <CFormInput
          type="text"
          label="Name"
          placeholder="Enter name"
          v-model="name"
          autoComplete="name"
          required
        />
        <CFormTextarea
          type="text"
          label="Description"
          placeholder="Enter description"
          v-model="description"
          autoComplete="description"
          required
        ></CFormTextarea>
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
import categoryService from '@/services/Category.Service'
import { CButton } from '@coreui/vue'
import { CFormTextarea } from '@coreui/vue-pro'
import { getDateTimeFormat, toastr } from '@/utils'
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
    CButton,
    CFormTextarea,
  },
  mounted() {
    categoryService.getCategoryList().then((result) => {
      console.log('======categorylist:', result.data.list)
      this.items = result.data.list
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
          key: 'name',
          label: 'Name',
          _style: { width: '10%' },
        },
        {
          key: 'description',
          label: 'Description',
          _style: { width: '25%' },
        },
        {
          key: 'created_at',
          label: 'Registration Date',
          _style: { width: '15%' },
          sorter: true,
        },
        {
          key: 'updated_at',
          label: 'Updated Date',
          _style: { width: '15%' },
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
      category_id: '',
      category: '',
      name: '',
      price: 1,
      size: 1,
      email: '',
      quality: 'Normal',
      description: '',
      mdetails: '',
      receive_date: new Date(),
      expiry_date: new Date(),
      showModal: false,
      showModal1: false,
      showModal2: false,
      preview: null,
      image: null,
    }
  },
  computed: {
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
    getDateTimeFormat(date) {
      return getDateTimeFormat(date)
    },
    toggleDetails(item) {
      if (this.details.includes(item.id)) {
        this.details = this.details.filter((_item) => _item !== item.id)
        return
      }
      this.details.push(item.id)
    },
    handleRegisterDlg() {
      this.name = ''
      this.description = ''
      this.image = null
      this.preview = null
      setTimeout(() => {
        this.showModal = true
      }, 1000)
    },
    handleEditDlg(item) {
      console.log('item====', item)
      this.preview = API_URL + item.image
      this.category_id = item.id
      this.name = item.name
      this.description = item.description
      setTimeout(() => {
        this.showModal1 = true
      }, 1100)
    },
    handleDeleteDlg(item) {
      this.category_id = item.id
      this.email = item.email
      setTimeout(() => {
        this.showModal2 = true
      }, 1100)
    },
    handleSave() {
      console.log('Category saved', this.name, this.description)
      const formData = new FormData()
      if (this.image !== null) formData.append('image', this.image)
      else {
        toastr.warning('Choose an image')
        return
      }
      formData.append('name', this.name)
      formData.append('description', this.description)
      categoryService.createCategory(formData).then((result) => {
        console.log('result', result)
        let data = result.data
        if (data.status == 0) {
          this.items = [...this.items, data.category]
          this.showModal = false
        }
      })
    },
    handleEdit() {
      // eslint-disable-next-line no-unused-vars
      console.log(
        'Category saved',
        this.category,
        this.name,
        this.price,
        this.size,
        this.quality,
        this.description,
        this.details,
        this.receive_date,
        this.expiry_date,
      )
      const formData = new FormData()
      if (this.image !== null) formData.append('image', this.image)
      formData.append('id', this.category_id)
      formData.append('name', this.name)
      formData.append('description', this.description)
      categoryService.editCategory(formData).then((result) => {
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
      let data = { id: this.category_id, email: this.email, role: 2 }
      console.log('handleDelete', data)
      categoryService.deleteCategory(data).then((result) => {
        let data = result.data
        if (data.status == 0) {
          this.items = data.result[1]
          this.showModal2 = false
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
.category_table td {
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.category_details {
  white-space: break-spaces !important;
}
</style>
