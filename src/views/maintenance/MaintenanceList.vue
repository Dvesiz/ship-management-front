<template>
  <div class="page-container">
    <n-card bordered>
      <div class="toolbar" style="margin-bottom: 16px">
         <n-space>
           <n-select v-model:value="searchShipId" :options="shipOptions" placeholder="选择船舶" clearable filterable />
           <n-button type="primary" @click="fetchData">查询</n-button>
           <n-button type="warning" @click="openModal">新增维修记录</n-button>
         </n-space>
      </div>

      <n-data-table remote :columns="columns" :data="data" :loading="loading" :pagination="pagination" @update:page="handlePageChange"/>
    </n-card>

    <n-modal v-model:show="showModal" preset="card" title="登记维修" style="width: 600px">
      <n-form ref="formRef" :model="formValue" :rules="rules" label-width="auto">
        <n-form-item label="维修船舶" path="shipId">
           <n-select v-model:value="formValue.shipId" :options="shipOptions" filterable />
        </n-form-item>
        <n-form-item label="维修内容" path="description">
           <n-input v-model:value="formValue.description" type="textarea" placeholder="请描述维修详情" />
        </n-form-item>
        <n-form-item label="维修费用" path="cost">
           <n-input-number v-model:value="formValue.cost" placeholder="金额" style="width: 100%">
             <template #prefix>￥</template>
           </n-input-number>
        </n-form-item>
        <n-form-item label="维修时间" path="maintenanceTime">
           <n-date-picker v-model:value="formValue.maintenanceTime" type="datetime" style="width: 100%"/>
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button type="primary" @click="handleSubmit" :loading="submitting">保存记录</n-button>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, h } from 'vue'
import { 
  NButton, 
  NTag, 
  NSpace, 
  useMessage, 
  NImage, 
  NIcon, 
  NCard, 
  NInput, 
  NSelect, 
  NDataTable, 
  NModal, 
  NForm, 
  NFormItem, 
  NInputNumber, 
  NUpload 
} from 'naive-ui'
import request from '../../utils/request'

const message = useMessage()
const loading = ref(false)
const data = ref([])
const shipOptions = ref([])
const searchShipId = ref(null)
const pagination = reactive({ page: 1, pageSize: 10, itemCount: 0 })

const columns = [
  { title: '船舶', key: 'shipId', render(row) { return shipOptions.value.find(s=>s.value===row.shipId)?.label || row.shipId } },
  { title: '维修内容', key: 'description', ellipsis: { tooltip: true } },
  { title: '费用 (元)', key: 'cost', render(row) { return `¥ ${row.cost}` } },
  { title: '时间', key: 'maintenanceTime' },
  { title: '操作', key: 'action', render(row) {
      return h(NButton, { size: 'small', type: 'error', onClick: ()=>handleDelete(row) }, { default:()=>'删除' })
  }}
]

const fetchShips = async () => {
  const res = await request.get('/ship', { params: { pageNum: 1, pageSize: 100 } })
  shipOptions.value = res.data.records.map(s => ({ label: s.name, value: s.id }))
}

const fetchData = async () => {
  loading.value = true
  const res = await request.get('/maintenance', { params: { pageNum: pagination.page, pageSize: pagination.pageSize, shipId: searchShipId.value } })
  data.value = res.data.records
  pagination.itemCount = res.data.total
  loading.value = false
}

const showModal = ref(false)
const submitting = ref(false)
const formRef = ref(null)
const formValue = ref({})
const rules = { shipId: {required:true, type:'number'}, description: {required:true}, cost: {required:true, type:'number'} }

const openModal = () => { formValue.value = {shipId: null, cost: 0}; showModal.value = true }

const handleSubmit = () => {
  formRef.value?.validate(async (errors) => {
    if(!errors) {
      submitting.value = true
      try {
        await request.post('/maintenance', formValue.value)
        message.success('登记成功')
        showModal.value = false
        fetchData()
      } catch(e) { message.error(e.message) }
      finally { submitting.value = false }
    }
  })
}

const handleDelete = async (row) => {
  if(!confirm('确认删除此记录？')) return
  await request.delete('/maintenance', { params: { id: row.id } })
  message.success('删除成功')
  fetchData()
}

const handlePageChange = (p) => { pagination.page = p; fetchData() }
onMounted(() => { fetchShips(); fetchData() })
</script>