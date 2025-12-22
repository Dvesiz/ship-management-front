<template>
  <el-card shadow="never" class="page-card">
    <div class="toolbar">
      <el-button type="primary" icon="Plus" @click="openDialog('add')">新增类型</el-button>
    </div>

    <el-table :data="tableData" v-loading="loading" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" align="center" sortable />
      <el-table-column prop="name" label="类型名称" />
      <el-table-column prop="alias" label="类型别名/代码" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="{ row }">
          <el-button type="primary" link icon="Edit" @click="openDialog('edit', row)">编辑</el-button>
          <el-button type="danger" link icon="Delete" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="400px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="例如：散货船" />
        </el-form-item>
        <el-form-item label="别名" prop="alias">
          <el-input v-model="form.alias" placeholder="例如：BULK_CARRIER" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '../../utils/request'

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitting = ref(false)
const formRef = ref(null)
const form = ref({ id: null, name: '', alias: '' })

const rules = { name: [{ required: true, message: '请输入名称', trigger: 'blur' }] }

const fetchData = async () => {
  loading.value = true
  try {
    const res = await request.get('/ship-categories')
    // 【修复】手动按 ID 升序排列 (从小到大)
    if (res.data && Array.isArray(res.data)) {
      tableData.value = res.data.sort((a, b) => a.id - b.id)
    } else {
      tableData.value = []
    }
  } finally { loading.value = false }
}

const openDialog = (type, row) => {
  dialogTitle.value = type === 'add' ? '新增类型' : '编辑类型'
  form.value = type === 'add' ? { id: null, name: '', alias: '' } : { ...row }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        if (form.value.id) await request.put('/ship-categories', form.value)
        else await request.post('/ship-categories', form.value)
        ElMessage.success('保存成功')
        dialogVisible.value = false
        fetchData()
      } catch (e) {}
      finally { submitting.value = false }
    }
  })
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除?', '警告', { type: 'warning' }).then(async () => {
    await request.delete('/ship-categories', { params: { id: row.id } })
    ElMessage.success('删除成功')
    fetchData()
  })
}

onMounted(fetchData)
</script>

<style scoped>
.page-card { min-height: calc(100vh - 120px); }
.toolbar { margin-bottom: 16px; }
</style>