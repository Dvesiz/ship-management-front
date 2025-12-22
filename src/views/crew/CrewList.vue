<template>
  <el-card shadow="never" class="page-card">
    <div class="toolbar">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-input v-model="searchForm.name" placeholder="船员姓名" clearable prefix-icon="Search" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.shipId" placeholder="所属船舶" clearable filterable style="width: 160px">
            <el-option v-for="item in shipOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleSearch">查询</el-button>
          <el-button type="success" icon="Plus" @click="openDialog('add')">新增船员</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="tableData" v-loading="loading" border stripe style="width: 100%">
      <el-table-column prop="name" label="姓名" />
      <el-table-column prop="position" label="职位">
        <template #default="{ row }"><el-tag type="info">{{ row.position }}</el-tag></template>
      </el-table-column>
      <el-table-column prop="shipId" label="所属船舶">
        <template #default="{ row }">{{ getShipName(row.shipId) }}</template>
      </el-table-column>
      <el-table-column prop="phone" label="联系电话" />
      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link icon="Edit" @click="openDialog('edit', row)">编辑</el-button>
          <el-button type="danger" link icon="Delete" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="pagination.pageNum"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, prev, pager, next"
        @current-change="fetchData"
        background
      />
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input v-model="form.position" placeholder="例如：船长" />
        </el-form-item>
        <el-form-item label="所属船舶" prop="shipId">
          <el-select v-model="form.shipId" filterable placeholder="请选择船舶" style="width: 100%">
            <el-option v-for="item in shipOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" />
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '../../utils/request'

const loading = ref(false)
const tableData = ref([])
const shipOptions = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitting = ref(false)
const formRef = ref(null)

const searchForm = reactive({ name: '', shipId: null })
const pagination = reactive({ pageNum: 1, pageSize: 10, total: 0 })
const form = ref({ id: null, name: '', position: '', shipId: null, phone: '' })

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  shipId: [{ required: true, message: '请选择船舶', trigger: 'change' }]
}

const fetchShips = async () => {
  try {
    const res = await request.get('/ship', { params: { pageNum: 1, pageSize: 100 } })
    shipOptions.value = res.data.records.map(s => ({ label: s.name, value: s.id }))
  } catch (e) {}
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await request.get('/crew', {
      params: { ...pagination, ...searchForm }
    })
    tableData.value = res.data.records
    pagination.total = res.data.total
  } finally { loading.value = false }
}

const handleSearch = () => { pagination.pageNum = 1; fetchData() }

const openDialog = (type, row) => {
  dialogTitle.value = type === 'add' ? '新增船员' : '编辑船员'
  form.value = type === 'add' 
    ? { id: null, name: '', position: '', shipId: null, phone: '' } 
    : { ...row }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        if (form.value.id) await request.put('/crew', form.value)
        else await request.post('/crew', form.value)
        ElMessage.success('保存成功')
        dialogVisible.value = false
        fetchData()
      } catch (e) {}
      finally { submitting.value = false }
    }
  })
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除 ${row.name}?`, '警告', { type: 'warning' }).then(async () => {
    await request.delete('/crew', { params: { id: row.id } })
    ElMessage.success('删除成功')
    fetchData()
  })
}

const getShipName = (id) => shipOptions.value.find(s => s.value === id)?.label || '未分配'

onMounted(() => {
  fetchShips()
  fetchData()
})
</script>

<style scoped>
.page-card { min-height: calc(100vh - 120px); }
.toolbar { margin-bottom: 16px; }
.pagination { margin-top: 16px; display: flex; justify-content: flex-end; }
</style>