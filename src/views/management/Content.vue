<template>
  <CLoadingButton
    color="primary"
    style="float: right"
    :timeout="1000"
    @click="handleRegisterDlg"
    >New Segment</CLoadingButton
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
    :sorterValue="{ column: 'created_at', state: 'desc' }"
    pagination
    class="segment_table"
  >
    <template #image="{ item }">
      <td>
        <CAvatar :src="withBase(item.image)" />
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
          <h6 class="segment_details">{{ item.description }}</h6>
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
        <CModalTitle>Create Segment</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormFloating class="mb-3">
          <CFormInput
            type="text"
            id="floatingInput"
            placeholder="Name"
            v-model="name"
          />
          <CFormLabel for="floatingInput">Name</CFormLabel>
        </CFormFloating>
        <CFormFloating class="mb-3">
          <CFormTextarea
            placeholder="Description"
            id="floatingTextarea2"
            floatingLabel="Description"
            style="height: 100px"
            v-model="description"
          ></CFormTextarea>
        </CFormFloating>
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
        <CModalTitle>Edit Segment</CModalTitle>
      </CModalHeader>
      <CModalBody>
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
import segmentService from '@/services/Segment.Service'
import { CButton, CFormFloating } from '@coreui/vue'
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
    CFormFloating,
  },
  mounted() {
    segmentService.getSegmentList().then((result) => {
      console.log('======segmentlist:', result.data.list)
      this.items = result.data.list
    })
  },
  data() {
    return {
      columns: [
        {
          key: 'id',
          label: 'No',
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
          label: 'Created Date',
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
      name: '',
      description: '',
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
      setTimeout(() => {
        this.showModal = true
      }, 1500)
    },
    handleEditDlg(item) {
      console.log('item====', item)
      this.preview = API_URL + item.image
      this.segment_id = item.id
      this.name = item.name
      this.description = item.description
      setTimeout(() => {
        this.showModal1 = true
      }, 1100)
    },
    handleDeleteDlg(item) {
      this.segment_id = item.id
      this.email = item.email
      setTimeout(() => {
        this.showModal2 = true
      }, 1100)
    },
    handleSave() {
      console.log('Segment saved', this.name, this.description)
      const formData = new FormData()
      formData.append('name', this.name)
      formData.append('description', this.description)
      segmentService.createSegment(formData).then((result) => {
        console.log('result', result)
        let data = result.data
        if (data.status == 0) {
          this.items = [...this.items, data.segment]
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
        'Segment saved',
        this.segment,
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
      formData.append('id', this.segment_id)
      formData.append('name', this.name)
      formData.append('description', this.description)
      segmentService.editSegment(formData).then((result) => {
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
      let data = { id: this.segment_id, email: this.email, role: 2 }
      console.log('handleDelete', data)
      segmentService.deleteSegment(data).then((result) => {
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
.segment_table td {
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.segment_details {
  white-space: break-spaces !important;
}
</style>
