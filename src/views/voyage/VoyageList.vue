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
          <el-button type="success" icon="Plus" @click="openDialog">新建航次</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="tableData" v-loading="loading" border stripe style="width: 100%">
      <el-table-column prop="shipId" label="船舶">
        <template #default="{ row }">{{ getShipName(row.shipId) }}</template>
      </el-table-column>
      <el-table-column prop="startPort" label="始发港" />
      <el-table-column prop="endPort" label="目的港" />
      <el-table-column prop="startTime" label="开航时间" width="180" >
        <template #default="{ row }">{{ row.startTime.replace('T', ' ') }}</template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="180" >
        <template #default="{ row }">{{ row.endTime ? row.endTime.replace('T', ' ') : '-' }}</template> 
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.status === '已完成' ? 'success' : 'warning'">{{ row.status || '进行中' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center" fixed="right">
        <template #default="{ row }">
          <el-button v-if="row.status !== '已完成'" type="primary" size="small" @click="handleFinish(row)">完工</el-button>
          <el-tag v-else type="success" size="small">已归档</el-tag>
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

    <el-dialog v-model="dialogVisible" title="新建航次" width="500px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="执行船舶" prop="shipId">
          <el-select v-model="form.shipId" filterable style="width: 100%">
            <el-option v-for="item in shipOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="始发港" prop="startPort">
          <el-input v-model="form.startPort" />
        </el-form-item>
        <el-form-item label="目的港" prop="endPort">
          <el-input v-model="form.endPort" />
        </el-form-item>
        <el-form-item label="开航时间" prop="startTime">
          <el-date-picker v-model="form.startTime" type="datetime" style="width: 100%" value-format="YYYY-MM-DD HH:mm:ss" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">提交开航</el-button>
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
const form = ref({ shipId: null, startPort: '', endPort: '', startTime: null })

const rules = {
  shipId: [{ required: true, message: '请选择船舶', trigger: 'change' }],
  startPort: [{ required: true, message: '请输入始发港', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择时间', trigger: 'change' }]
}

const fetchShips = async () => {
  const res = await request.get('/ship', { params: { pageNum: 1, pageSize: 100 } })
  shipOptions.value = res.data.records.map(s => ({ label: s.name, value: s.id }))
}

const fetchData = async () => {
  loading.value = true
  const res = await request.get('/voyages', { params: { ...pagination, ...searchForm } })
  tableData.value = res.data.records
  pagination.total = res.data.total
  loading.value = false
}

const handleSearch = () => { pagination.pageNum = 1; fetchData() }

const openDialog = () => {
  form.value = { shipId: null, startPort: '', endPort: '', startTime: null }
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        await request.post('/voyages', form.value)
        ElMessage.success('开航成功')
        dialogVisible.value = false
        fetchData()
      } catch (e) {}
      finally { submitting.value = false }
    }
  })
}

const handleFinish = (row) => {
  ElMessageBox.confirm('确认结束该航次？', '提示', { type: 'warning' }).then(async () => {
    await request.patch('/voyages/finish', null, { params: { id: row.id } })
    ElMessage.success('航次已完工')
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