<template>
  <n-card bordered title="航次管理">
    <div class="toolbar" style="margin-bottom: 16px; display: flex; justify-content: space-between;">
      <n-space>
        <n-select v-model:value="searchShipId" :options="shipOptions" placeholder="选择船舶" clearable style="width: 180px" filterable />
        <n-button type="primary" @click="fetchData">查询</n-button>
      </n-space>
      <n-button type="primary" color="#18a058" @click="openModal">新建航次</n-button>
    </div>

    <n-data-table remote :columns="columns" :data="data" :loading="loading" :pagination="pagination" @update:page="handlePageChange"/>

    <n-modal v-model:show="showModal" preset="card" title="新建航次" style="width: 600px">
      <n-form ref="formRef" :model="formValue" :rules="rules" label-width="auto">
        <n-form-item label="执行船舶" path="shipId">
          <n-select v-model:value="formValue.shipId" :options="shipOptions" filterable />
        </n-form-item>
        <n-space>
          <n-form-item label="始发港" path="startPort">
            <n-input v-model:value="formValue.startPort" />
          </n-form-item>
          <n-form-item label="目的港" path="endPort">
            <n-input v-model:value="formValue.endPort" />
          </n-form-item>
        </n-space>
        <n-form-item label="开航时间" path="startTime">
          <n-date-picker v-model:value="formValue.startTime" type="datetime" style="width: 100%"/>
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button type="primary" @click="handleSubmit" :loading="submitting">提交开航</n-button>
      </template>
    </n-modal>
  </n-card>
</template>

<script setup>
import { ref, reactive, onMounted, h } from 'vue'
import { NButton, NTag, useMessage } from 'naive-ui'
import request from '../../utils/request'

const message = useMessage()
const loading = ref(false)
const data = ref([])
const shipOptions = ref([])
const searchShipId = ref(null)

const pagination = reactive({ page: 1, pageSize: 10, itemCount: 0 })

const columns = [
  { title: '船舶', key: 'shipId', render(row) { return shipOptions.value.find(s=>s.value===row.shipId)?.label || row.shipId } },
  { title: '始发港', key: 'startPort' },
  { title: '目的港', key: 'endPort' },
  { title: '开航时间', key: 'startTime' },
  { title: '结束时间', key: 'endTime', render(row){ return row.endTime || '-' } },
  { title: '状态', key: 'status', render(row){
      return h(NTag, { type: row.status === '已完成' ? 'success' : 'warning' }, { default: () => row.status || '进行中' })
  }},
  { title: '操作', key: 'action', render(row) {
      if (row.status !== '已完成') {
        return h(NButton, { size: 'small', type: 'primary', onClick: ()=>handleFinish(row) }, { default:()=>'完工' })
      }
      return h(NTag, { type: 'success', size: 'small' }, { default:()=>'已归档' })
  }}
]

const fetchShips = async () => {
  const res = await request.get('/ship', { params: { pageNum: 1, pageSize: 100 } })
  shipOptions.value = res.data.records.map(s => ({ label: s.name, value: s.id }))
}

const fetchData = async () => {
  loading.value = true
  const res = await request.get('/voyages', { params: { pageNum: pagination.page, pageSize: pagination.pageSize, shipId: searchShipId.value } })
  data.value = res.data.records
  pagination.itemCount = res.data.total
  loading.value = false
}

const showModal = ref(false)
const submitting = ref(false)
const formRef = ref(null)
const formValue = ref({ shipId: null, startPort: '', endPort: '', startTime: null })
const rules = { shipId: {required:true, type:'number'}, startPort:{required:true}, startTime:{required:true, type:'number', message:'请选择时间'} }

const openModal = () => { formValue.value = {shipId:null}; showModal.value=true }

const handleSubmit = () => {
  formRef.value?.validate(async (errors) => {
    if(!errors) {
      submitting.value = true
      try {
        await request.post('/voyages', formValue.value)
        message.success('开航成功')
        showModal.value = false
        fetchData()
      } catch(e) { message.error(e.message) }
      finally { submitting.value = false }
    }
  })
}

const handleFinish = async (row) => {
  if(!confirm('确认结束该航次？')) return
  await request.patch('/voyages/finish', null, { params: { id: row.id } })
  message.success('航次已完工')
  fetchData()
}

const handlePageChange = (p) => { pagination.page = p; fetchData() }

onMounted(() => { fetchShips(); fetchData() })
</script>