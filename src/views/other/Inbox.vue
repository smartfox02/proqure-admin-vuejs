<template>
  <!-- <CLoadingButton
    color="primary"
    style="float: right"
    :timeout="1000"
    @click="handleRegisterDlg"
    >Compose</CLoadingButton
  > -->
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
    class="inbox_table"
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
    <template #segment_name="{ item }">
      <td>
        <CBadge :color="getSegmentColor(item.segment_name)">
          {{ getSegmentFormat(item.segment_name) }}
        </CBadge>
      </td>
    </template>
    <template #expiry_date="{ item }">
      <td>
        {{ getDateTimeFormat(item.expiry_date) }}
      </td>
    </template>
    <template #is_read="{ item }">
      <td>
        <CBadge :color="getStatusFormat(item.is_read)">
          {{ getStatusFormatStr(item.is_read) }}
        </CBadge>
      </td>
    </template>
    <template #show_details="{ item, index }">
      <td class="py-2">
        <CLoadingButton
          size="sm"
          color="info"
          class="mr-1"
          spinnerType="grow"
          :timeout="1100"
          @click="handleShowDlg(item, index)"
        >
          Show
        </CLoadingButton>
        <CLoadingButton
          size="sm"
          color="danger"
          class=""
          spinnerType="grow"
          :timeout="1100"
          @click="handleDeleteDlg(item, index)"
        >
          Delete
        </CLoadingButton>
      </td>
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
    <CForm @submit.prevent="handleShow">
      <CModalHeader>
        <CIcon
          icon="cil-cursor"
          height="48"
          alt="Logo"
          style="width: 35px; margin-right: 10px"
        />
        <CModalTitle>Show Message</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormInput
          type="text"
          label="From Name"
          placeholder="Email"
          v-model="from_email"
          required
        />
        <CFormInput
          type="text"
          label="Title"
          placeholder="Title"
          class="mb-3"
          v-model="title"
          required
        />
        <CFormFloating class="mb-3">
          <CFormTextarea
            placeholder="Content"
            id="floatingTextarea2"
            floatingLabel="Content"
            style="height: 100px"
            v-model="content"
            required
          ></CFormTextarea>
        </CFormFloating>
      </CModalBody>
      <CModalFooter>
        <CLoadingButton
          type="submit"
          style="background-color: #003b5c; color: white"
          :timeout="1000"
        >
          Ok
        </CLoadingButton>
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
import inboxService from '@/services/Inbox.Service'
// import userService from '@/services/Users.Service'
import segmentServie from '@/services/Segment.Service'
import { CButton, CFormFloating } from '@coreui/vue'
import { CFormTextarea } from '@coreui/vue-pro'
import { getDateTimeFormat, toastr, isEmpty } from '@/utils'
import { API_URL } from '@/config'
import {
  CSmartTable,
  // CAvatar,
  CBadge,
  CLoadingButton,
} from '@coreui/vue-pro'
export default {
  components: {
    CSmartTable,
    // CAvatar,
    CBadge,
    CLoadingButton,
    CButton,
    CFormTextarea,
    CFormFloating,
  },
  mounted() {
    inboxService.getInboxList().then((result) => {
      console.log('======inboxlist:', result.data.list)
      this.items = result.data.list
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
          sorter: false,
          filter: false,
        },
        {
          key: 'from_name',
          label: 'From Name',
          _style: { width: '12%' },
          sorter: true,
        },
        {
          key: 'from_email',
          label: 'From Email',
          _style: { width: '15%' },
          sorter: true,
        },
        {
          key: 'title',
          label: 'Title',
          _style: { width: '10%' },
        },
        {
          key: 'content',
          label: 'Content',
          _style: { width: '25%' },
        },
        {
          key: 'created_at',
          label: 'Created Date',
          _style: { width: '15%' },
        },
        {
          key: 'is_read',
          label: 'Status',
          _style: { width: '5%' },
          sorter: false,
          filter: false,
        },
        {
          key: 'show_details',
          label: 'Details',
          _style: { width: '20%' },
          filter: false,
          sorter: false,
        },
      ],
      categories: [],
      details: [],
      items: [],
      inbox_id: '',
      title: '',
      content: '',
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
    isEmpty(data) {
      return isEmpty(data)
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
    getStatusFormat(data) {
      if (data == 1) {
        return 'success'
      } else {
        return 'danger'
      }
    },
    getStatusFormatStr(data) {
      console.log('data:', data)
      if (data == 1) return 'Readed'
      else return 'Unread'
    },
    getSegmentColor(data) {
      if (!isEmpty(data)) {
        return 'success'
      } else {
        return 'primary'
      }
    },
    getSegmentFormat(data) {
      if (isEmpty(data)) {
        return 'All'
      } else {
        return data
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
      this.title = ''
      this.content = ''
      this.category = 'all'
      setTimeout(() => {
        this.showModal = true
      }, 1000)
    },
    handleShowDlg(item) {
      console.log('item====', item)
      let data = { id: item.id, from_email: item.from_email }
      let result_data = ''
      inboxService.makeReadInbox(data).then((result) => {
        console.log('resultdata', result)
        result_data = result.data
      })
      this.from_name = item.from_name
      this.from_email = item.from_email
      this.title = item.title
      this.content = item.content
      setTimeout(() => {
        this.items = result_data.result[1]
        this.showModal1 = true
      }, 1100)
    },
    handleDeleteDlg(item) {
      this.inbox_id = item.id
      this.email = item.email
      setTimeout(() => {
        this.showModal2 = true
      }, 1100)
    },
    handleSave() {
      console.log('Inbox saved', this.name, this.description)
      const formData = new FormData()
      if (this.category == 'all') {
        formData.append('segment_id', 'all')
      } else {
        let findCategory = this.categories.find(
          (category) => category.name == this.category,
        )
        let segment_id = findCategory.id
        formData.append('segment_id', segment_id)
      }
      formData.append('title', this.title)
      formData.append('content', this.content)
      inboxService.createInbox(formData).then((result) => {
        console.log('result', result)
        let data = result.data
        if (data.status == 0) {
          this.items = data.result[1]
          toastr.success(data.message)
        } else {
          toastr.warning(data.message)
        }
      })
      setTimeout(() => {
        this.showModal = false
      }, 1800)
    },
    handleShow() {
      setTimeout(() => {
        this.showModal1 = false
      }, 1000)
    },
    handleDelete() {
      let data = { id: this.inbox_id, email: this.email, role: 2 }
      console.log('handleDelete', data)
      inboxService.deleteInbox(data).then((result) => {
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
.inbox_table td {
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.inbox_details {
  white-space: break-spaces !important;
}
</style>
