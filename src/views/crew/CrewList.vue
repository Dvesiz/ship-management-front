<template>
  <div class="page-container">
    <n-card bordered>
      <div class="toolbar" style="margin-bottom: 16px; display: flex; justify-content: space-between;">
        <n-space>
          <n-input v-model:value="searchName" placeholder="船员姓名" clearable />
          <n-select 
             v-model:value="searchShipId" 
             placeholder="所属船舶" 
             :options="shipOptions" 
             clearable 
             style="width: 160px" 
             filterable
          />
          <n-button type="primary" @click="fetchData">查询</n-button>
        </n-space>
        <n-button type="primary" color="#18a058" @click="openModal('add')">新增船员</n-button>
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
        <n-form-item label="姓名" path="name">
          <n-input v-model:value="formValue.name" placeholder="船员姓名" />
        </n-form-item>
        <n-form-item label="职位" path="position">
          <n-input v-model:value="formValue.position" placeholder="例如：船长、大副" />
        </n-form-item>
        <n-form-item label="所属船舶" path="shipId">
          <n-select v-model:value="formValue.shipId" :options="shipOptions" placeholder="请选择船舶" filterable />
        </n-form-item>
        <n-form-item label="联系电话" path="phone">
          <n-input v-model:value="formValue.phone" placeholder="手机号" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showModal = false">取消</n-button>
          <n-button type="primary" @click="handleSubmit" :loading="submitting">保存</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, h } from 'vue'
import { NButton, NSpace, useMessage, NTag } from 'naive-ui'
import request from '../../utils/request'

const message = useMessage()
const loading = ref(false)
const data = ref([])
const shipOptions = ref([]) // 存储船舶下拉数据
const searchName = ref('')
const searchShipId = ref(null)

const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  onChange: (page) => { pagination.page = page; fetchData() }
})

const columns = [
  { title: '姓名', key: 'name' },
  { title: '职位', key: 'position', render(row){ return h(NTag, {type: 'info', bordered: false}, {default:()=>row.position}) } },
  { 
    title: '所属船舶', 
    key: 'shipId',
    render(row) {
      // 通过 ID 找 Name
      const ship = shipOptions.value.find(s => s.value === row.shipId)
      return ship ? ship.label : '未分配'
    }
  },
  { title: '电话', key: 'phone' },
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

// 获取所有船舶用于下拉框
const fetchShips = async () => {
  try {
    // 假设 /ship 接口支持返回所有数据，或者设置一个较大的 pageSize
    // 这里偷懒直接请求第一页 100 条，实际应该有一个专门的 list 接口
    const res = await request.get('/ship', { params: { pageNum: 1, pageSize: 100 } })
    shipOptions.value = res.data.records.map(s => ({ label: s.name, value: s.id }))
  } catch(e) {}
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await request.get('/crew', {
      params: {
        pageNum: pagination.page,
        pageSize: pagination.pageSize,
        name: searchName.value,
        shipId: searchShipId.value
      }
    })
    data.value = res.data.records
    pagination.itemCount = res.data.total
  } finally {
    loading.value = false
  }
}

const showModal = ref(false)
const modalTitle = ref('')
const submitting = ref(false)
const formRef = ref(null)
const formValue = ref({})
const rules = {
  name: { required: true, message: '请输入姓名', trigger: 'blur' },
  shipId: { required: true, type: 'number', message: '请选择船舶', trigger: 'blur' }
}

const openModal = (type, row) => {
  modalTitle.value = type === 'add' ? '新增船员' : '编辑船员'
  formValue.value = type === 'add' ? { name: '', position: '', shipId: null, phone: '' } : { ...row }
  showModal.value = true
}

const handleSubmit = () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      submitting.value = true
      try {
        if (formValue.value.id) await request.put('/crew', formValue.value)
        else await request.post('/crew', formValue.value)
        message.success('保存成功')
        showModal.value = false
        fetchData()
      } catch (e) { message.error(e.message) }
      finally { submitting.value = false }
    }
  })
}

const handleDelete = async (row) => {
  if(!confirm(`确认删除 ${row.name}?`)) return
  await request.delete('/crew', {params: {id: row.id}})
  message.success('删除成功')
  fetchData()
}

const handlePageChange = (page) => { pagination.page = page; fetchData() }

onMounted(() => {
  fetchShips()
  fetchData()
})
</script>