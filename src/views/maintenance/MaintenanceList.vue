<template>
  <el-card shadow="never" class="page-card">
    <div class="toolbar">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-select v-model="searchForm.shipId" placeholder="选择船舶" clearable filterable style="width: 180px">
            <el-option v-for="item in shipOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleSearch">查询</el-button>
          <el-button type="warning" icon="Tools" @click="openDialog">新增维修记录</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="tableData" v-loading="loading" border stripe style="width: 100%">
      <el-table-column prop="shipId" label="船舶">
        <template #default="{ row }">{{ getShipName(row.shipId) }}</template>
      </el-table-column>
      <el-table-column prop="description" label="维修内容" show-overflow-tooltip />
      <el-table-column prop="cost" label="费用 (元)">
        <template #default="{ row }">¥ {{ row.cost }}</template>
      </el-table-column>
      <el-table-column prop="maintenanceTime" label="时间" width="180" >
        <template #default="{ row }">{{ row.maintenanceTime.replace('T', ' ') }}</template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center" fixed="right">
        <template #default="{ row }">
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

    <el-dialog v-model="dialogVisible" title="登记维修" width="500px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="维修船舶" prop="shipId">
          <el-select v-model="form.shipId" filterable style="width: 100%">
            <el-option v-for="item in shipOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="维修内容" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请描述维修详情" />
        </el-form-item>
        <el-form-item label="费用" prop="cost">
          <el-input-number v-model="form.cost" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="维修时间" prop="maintenanceTime">
          <el-date-picker v-model="form.maintenanceTime" type="datetime" style="width: 100%" value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">保存记录</el-button>
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
const submitting = ref(false)
const formRef = ref(null)

const searchForm = reactive({ shipId: null })
const pagination = reactive({ pageNum: 1, pageSize: 10, total: 0 })
const form = ref({ shipId: null, description: '', cost: 0, maintenanceTime: null })

const rules = {
  shipId: [{ required: true, message: '请选择船舶', trigger: 'change' }],
  description: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  cost: [{ required: true, message: '请输入费用', trigger: 'blur' }]
}

const fetchShips = async () => {
  const res = await request.get('/ship', { params: { pageNum: 1, pageSize: 100 } })
  shipOptions.value = res.data.records.map(s => ({ label: s.name, value: s.id }))
}

const fetchData = async () => {
  loading.value = true
  const res = await request.get('/maintenance', { params: { ...pagination, ...searchForm } })
  tableData.value = res.data.records
  pagination.total = res.data.total
  loading.value = false
}

const handleSearch = () => { pagination.pageNum = 1; fetchData() }

const openDialog = () => {
  form.value = { shipId: null, description: '', cost: 0, maintenanceTime: null }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        await request.post('/maintenance', form.value)
        ElMessage.success('登记成功')
        dialogVisible.value = false
        fetchData()
      } catch (e) {}
      finally { submitting.value = false }
    }
  })
}

const handleDelete = (row) => {
  ElMessageBox.confirm('确认删除此记录？', '提示', { type: 'warning' }).then(async () => {
    await request.delete('/maintenance', { params: { id: row.id } })
    ElMessage.success('删除成功')
    fetchData()
  })
}

const getShipName = (id) => shipOptions.value.find(s => s.value === id)?.label || id

onMounted(() => { fetchShips(); fetchData() })
</script>

<style scoped>
.page-card { min-height: calc(100vh - 120px); }
.toolbar { margin-bottom: 16px; }
.pagination { margin-top: 16px; display: flex; justify-content: flex-end; }
</style>