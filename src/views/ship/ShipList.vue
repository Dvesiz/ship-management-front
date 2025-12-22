<template>
  <div class="page-container">
    <n-card bordered :content-style="{ padding: '0' }">
      <div class="toolbar">
        <n-space>
          <n-input v-model:value="searchName" placeholder="搜索船名" clearable />
          <n-select 
            v-model:value="searchStatus" 
            placeholder="状态" 
            :options="statusOptions" 
            clearable 
            style="width: 140px" 
          />
          <n-button type="primary" @click="fetchData">
            <template #icon><n-icon><Search /></n-icon></template>
            查询
          </n-button>
        </n-space>
        <n-button type="primary" color="#18a058" @click="openModal('add')">
          <template #icon><n-icon><Add /></n-icon></template>
          新增船舶
        </n-button>
      </div>

      <n-data-table
        remote
        :columns="columns"
        :data="data"
        :loading="loading"
        :pagination="pagination"
        @update:page="handlePageChange"
      />
    </n-card>

    <n-modal v-model:show="showModal" preset="card" :title="modalTitle" style="width: 600px">
      <n-form ref="formRef" :model="formValue" :rules="rules" label-placement="left" label-width="auto">
        <n-form-item label="船舶名称" path="name">
          <n-input v-model:value="formValue.name" placeholder="请输入船舶名称" />
        </n-form-item>
        
        <n-form-item label="船舶类型" path="categoryId">
          <n-select 
            v-model:value="formValue.categoryId" 
            :options="categoryOptions" 
            placeholder="请选择类型" 
          />
        </n-form-item>

        <n-form-item label="吨位" path="tonnage">
          <n-input-number v-model:value="formValue.tonnage" placeholder="单位：吨" style="width: 100%" />
        </n-form-item>

        <n-form-item label="状态" path="status">
          <n-select v-model:value="formValue.status" :options="statusOptions" />
        </n-form-item>

        <n-form-item label="船舶照片">
           <n-upload
             :custom-request="customUpload"
             list-type="image-card"
             :max="1"
           >
             点击上传
           </n-upload>
           <div v-if="formValue.coverImg" style="margin-left: 10px;">
              <n-image width="100" :src="formValue.coverImg" />
           </div>
        </n-form-item>
      </n-form>
      
      <template #footer>
        <n-space justify="end">
          <n-button @click="showModal = false">取消</n-button>
          <n-button type="primary" @click="handleSubmit" :loading="submitting">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, h } from 'vue'
import { NButton, NTag, NSpace, useMessage, NImage, NIcon } from 'naive-ui'
import { SearchOutline as Search, AddOutline as Add } from '@vicons/ionicons5'
// 引入封装好的 request，它会自动处理 Token
import request from '../../utils/request'

const message = useMessage()

// ============ 数据定义 ============
const loading = ref(false)
const data = ref([])
const searchName = ref('')
const searchStatus = ref(null)

// 分页配置
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: (page) => { pagination.page = page; fetchData() },
  onUpdatePageSize: (pageSize) => { pagination.pageSize = pageSize; pagination.page = 1; fetchData() }
})

const statusOptions = [
  { label: '在役', value: 'IN_SERVICE' },
  { label: '维修中', value: 'MAINTENANCE' },
  { label: '停运', value: 'STOPPED' },
  { label: '航行中', value: 'RUNNING' }
]

// 假设分类数据
const categoryOptions = ref([
  { label: '散货船', value: 1 },
  { label: '集装箱船', value: 2 },
  { label: '油轮', value: 3 },
  { label: '液化气船', value: 4 }
])

// ============ 表格列定义 ============
const columns = [
  {
    title: '封面',
    key: 'coverImg',
    render(row) {
      return row.coverImg ? h(NImage, { width: 50, src: row.coverImg }) : '无'
    }
  },
  { title: '船名', key: 'name' },
  { 
    title: '类型', 
    key: 'categoryId',
    render(row) {
      const cat = categoryOptions.value.find(c => c.value === row.categoryId)
      return cat ? cat.label : row.categoryId
    }
  },
  { title: '吨位 (T)', key: 'tonnage' },
  { 
    title: '状态', 
    key: 'status',
    render(row) {
      let type = 'default'
      if (row.status === 'IN_SERVICE' || row.status === '在役') type = 'success'
      if (row.status === 'MAINTENANCE' || row.status === '维修中') type = 'warning'
      if (row.status === 'RUNNING' || row.status === '航行中') type = 'info'
      // 兼容中英文显示
      const label = statusOptions.find(s => s.value === row.status)?.label || row.status
      return h(NTag, { type, bordered: false }, { default: () => label })
    }
  },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return h(NSpace, null, {
        default: () => [
          h(NButton, { size: 'small', onClick: () => openModal('edit', row) }, { default: () => '编辑' }),
          h(NButton, { size: 'small', type: 'error', onClick: () => handleDelete(row) }, { default: () => '删除' })
        ]
      })
    }
  }
]

// ============ 获取数据 ============
const fetchData = async () => {
  loading.value = true
  try {
    const res = await request.get('/ship', {
      params: {
        pageNum: pagination.page,
        pageSize: pagination.pageSize,
        name: searchName.value,
        status: searchStatus.value
      }
    })
    data.value = res.data.records
    pagination.itemCount = res.data.total
  } catch (error) {
    message.error('数据加载失败')
  } finally {
    loading.value = false
  }
}

// ============ 增删改逻辑 ============
const showModal = ref(false)
const modalTitle = ref('新增')
const submitting = ref(false)
const formRef = ref(null)
const formValue = ref({ id: null, name: '', categoryId: null, tonnage: 0, status: 'IN_SERVICE', coverImg: '' })

const rules = {
  name: { required: true, message: '请输入船名', trigger: 'blur' },
  categoryId: { required: true, type: 'number', message: '请选择类型', trigger: 'blur' }
}

const openModal = (type, row) => {
  if (type === 'add') {
    modalTitle.value = '新增船舶'
    formValue.value = { id: null, name: '', categoryId: null, tonnage: 0, status: 'IN_SERVICE', coverImg: '' }
  } else {
    modalTitle.value = '编辑船舶'
    formValue.value = { ...row } 
  }
  showModal.value = true
}

// 【关键修改】自定义上传函数，使用 request.js 自动携带 Token
const customUpload = ({ file, onFinish, onError }) => {
  const formData = new FormData()
  formData.append('file', file.file)
  
  // 这里直接使用 /upload，request 会自动加上 baseURL (/api) 和 Authorization headers
  request.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }).then((res) => {
     // 根据 request.js 的拦截器，res 可能是 data 或者包含 code 的对象
     // 假设后端 FileUploadController 返回 Result<String>
     if(res.code === 0) {
        formValue.value.coverImg = res.data
        message.success('上传成功')
        onFinish()
     } else {
        message.error(res.message || '上传失败')
        onError()
     }
  }).catch((error) => {
    message.error('上传出错')
    onError()
  })
}

const handleSubmit = (e) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      submitting.value = true
      try {
        if (formValue.value.id) {
          await request.put('/ship', formValue.value)
          message.success('更新成功')
        } else {
          await request.post('/ship', formValue.value)
          message.success('创建成功')
        }
        showModal.value = false
        fetchData()
      } catch (error) {
        message.error(error.message || '操作失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

const handleDelete = async (row) => {
  // eslint-disable-next-line no-restricted-globals
  if (!confirm(`确认删除船舶 "${row.name}" 吗？`)) return
  try {
    await request.delete('/ship', { params: { id: row.id } })
    message.success('删除成功')
    fetchData()
  } catch (error) {
    message.error('删除失败')
  }
}

// 初始化
onMounted(() => {
  fetchData()
})

const handlePageChange = (page) => {
  pagination.page = page
  fetchData()
}
</script>

<style scoped>
.page-container {
  /* 页面容器样式 */
}
.toolbar {
  padding: 16px;
  border-bottom: 1px solid #efeff5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>