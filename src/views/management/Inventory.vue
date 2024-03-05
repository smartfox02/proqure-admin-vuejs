<template>
  <CLoadingButton
    color="primary"
    style="float: right"
    :timeout="1000"
    @click="handleRegisterDlg"
    >Compose</CLoadingButton
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
    class="sent_table"
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
    <template #show_details="{ item, index }">
      <td class="py-2">
        <CLoadingButton
          size="sm"
          color="info"
          class="mr-1"
          spinnerType="grow"
          :timeout="1000"
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
    :visible="showModal"
    @close="
      () => {
        showModal = false
      }
    "
  >
    <CForm @submit.prevent="handleSave">
      <CModalHeader>
        <CIcon
          icon="cil-cursor"
          height="48"
          alt="Logo"
          style="width: 35px; margin-right: 10px"
        />
        <CModalTitle>New Message</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormSelect label="To" v-model="category" required class="mb-3">
          <option value="all">All</option>
          <option
            v-for="dcategory in categories"
            :key="dcategory.id"
            :value="dcategory.name"
          >
            {{ dcategory.name }}
          </option>
        </CFormSelect>
        <CFormFloating class="mb-3">
          <CFormInput
            type="title"
            id="floatingInput"
            placeholder="Title"
            v-model="title"
            required
          />
          <CFormLabel for="floatingInput">Title</CFormLabel>
        </CFormFloating>
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
        <CLoadingButton
          type="submit"
          style="background-color: #003b5c; color: white"
          :timeout="1800"
        >
          Send
        </CLoadingButton>
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
          label="To"
          placeholder="To"
          v-model="segment_name"
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
import sentService from '@/services/Sent.Service'
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
    sentService.getSentList().then((result) => {
      console.log('======sentlist:', result.data.list)
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
        // {
        //   key: 'id',
        //   label: 'No',
        //   filter: false,
        //   sorter: false,
        //   _style: { width: '1%' },
        // },
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
          key: 'segment_name',
          label: 'To',
          _style: { width: '15%' },
          sorter: true,
        },
        {
          key: 'created_at',
          label: 'Created Date',
          _style: { width: '15%' },
        },
        {
          key: 'show_details',
          label: 'Details',
          _style: { width: '12%' },
          filter: false,
          sorter: false,
        },
      ],
      categories: [],
      details: [],
      items: [],
      sent_id: '',
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
      if (isEmpty(item.segment_name)) {
        this.segment_name = 'All'
      } else {
        this.segment_name = item.segment_name
      }
      this.title = item.title
      this.content = item.content
      setTimeout(() => {
        this.showModal1 = true
      }, 1100)
    },
    handleDeleteDlg(item) {
      this.sent_id = item.id
      this.email = item.email
      setTimeout(() => {
        this.showModal2 = true
      }, 1100)
    },
    handleSave() {
      console.log('Sent saved', this.name, this.description)
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
      sentService.createSent(formData).then((result) => {
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
      let data = { id: this.sent_id, email: this.email, role: 2 }
      console.log('handleDelete', data)
      sentService.deleteSent(data).then((result) => {
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
.sent_table td {
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sent_details {
  white-space: break-spaces !important;
}
</style>
