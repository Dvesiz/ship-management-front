<template>
  <n-card bordered title="船舶类型管理">
    <div class="toolbar" style="margin-bottom: 16px">
      <n-button type="primary" @click="openModal('add')">
        <template #icon><n-icon><Add /></n-icon></template> 新增类型
      </n-button>
    </div>

    <n-data-table :columns="columns" :data="data" :loading="loading" />

    <n-modal v-model:show="showModal" preset="card" :title="modalTitle" style="width: 500px">
      <n-form ref="formRef" :model="formValue" :rules="rules">
        <n-form-item label="类型名称" path="name">
          <n-input v-model:value="formValue.name" placeholder="例如：散货船" />
        </n-form-item>
        <n-form-item label="类型别名/代码" path="alias">
          <n-input v-model:value="formValue.alias" placeholder="例如：BULK_CARRIER" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showModal = false">取消</n-button>
          <n-button type="primary" @click="handleSubmit" :loading="submitting">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </n-card>
</template>

<script setup>
import { ref, onMounted, h } from 'vue'
import { NButton, NSpace, useMessage, NIcon } from 'naive-ui'
import { AddOutline as Add } from '@vicons/ionicons5'
import request from '../../utils/request'

const message = useMessage()
const loading = ref(false)
const data = ref([])
const showModal = ref(false)
const modalTitle = ref('')
const submitting = ref(false)
const formRef = ref(null)
const formValue = ref({ id: null, name: '', alias: '' })

const rules = { name: { required: true, message: '请输入名称', trigger: 'blur' } }

const columns = [
  { title: 'ID', key: 'id', width: 80 },
  { title: '名称', key: 'name' },
  { title: '别名', key: 'alias' },
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

const fetchData = async () => {
  loading.value = true
  try {
    const res = await request.get('/ship-categories')
    data.value = res.data
  } finally {
    loading.value = false
  }
}

const openModal = (type, row) => {
  modalTitle.value = type === 'add' ? '新增类型' : '编辑类型'
  formValue.value = type === 'add' ? { id: null, name: '', alias: '' } : { ...row }
  showModal.value = true
}

const handleSubmit = () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      submitting.value = true
      try {
        if (formValue.value.id) {
          await request.put('/ship-categories', formValue.value)
        } else {
          await request.post('/ship-categories', formValue.value)
        }
        message.success('操作成功')
        showModal.value = false
        fetchData()
      } catch (e) {
        message.error(e.message || '失败')
      } finally {
        submitting.value = false
      }
    }
  })
}

const handleDelete = async (row) => {
  if (!confirm('确认删除?')) return
  try {
    await request.delete('/ship-categories', { params: { id: row.id } })
    message.success('删除成功')
    fetchData()
  } catch (e) {
    message.error('删除失败')
  }
}

onMounted(fetchData)
</script>