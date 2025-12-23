<template>
  <el-card shadow="never" class="page-card">
    <div class="toolbar">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-input v-model="searchForm.name" placeholder="搜索船名" clearable prefix-icon="Search" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.status" placeholder="状态" clearable style="width: 140px">
            <el-option label="在役" value="IN_SERVICE" />
            <el-option label="维修中" value="MAINTENANCE" />
            <el-option label="停运" value="STOPPED" />
            <el-option label="航行中" value="RUNNING" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleSearch">查询</el-button>
          <el-button type="success" icon="Plus" @click="openDialog('add')">新增船舶</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="tableData" v-loading="loading" border stripe style="width: 100%">
      <el-table-column label="封面" width="100" align="center">
        <template #default="{ row }">
          <el-image 
            v-if="row.coverImg" 
            :src="row.coverImg" 
            :preview-src-list="[row.coverImg]" 
            style="width: 50px; height: 50px; border-radius: 4px"
            preview-teleported
            fit="cover"
          />
          <span v-else class="text-gray">无</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="船名" />
      <el-table-column prop="categoryId" label="类型">
        <template #default="{ row }">{{ getCategoryName(row.categoryId) }}</template>
      </el-table-column>
      <el-table-column prop="tonnage" label="吨位 (T)" />
      <el-table-column prop="status" label="状态" align="center">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ getStatusLabel(row.status) }}</el-tag>
        </template>
      </el-table-column>
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
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchData"
        @current-change="fetchData"
        background
      />
    </div>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px" destroy-on-close>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="船舶名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入船名" />
        </el-form-item>
        <el-form-item label="类型" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择类型" style="width: 100%">
            <el-option v-for="c in categoryOptions" :key="c.value" :label="c.label" :value="c.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="吨位" prop="tonnage">
          <el-input-number v-model="form.tonnage" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="在役" value="IN_SERVICE" />
            <el-option label="维修中" value="MAINTENANCE" />
            <el-option label="停运" value="STOPPED" />
            <el-option label="航行中" value="RUNNING" />
          </el-select>
        </el-form-item>
        <el-form-item label="船舶照片">
          <el-upload
            action="#"
            :http-request="customUpload"
            :show-file-list="false"
            class="avatar-uploader"
          >
            <img v-if="form.coverImg" :src="form.coverImg" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
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
import { Plus, Search, Edit, Delete } from '@element-plus/icons-vue' // 确保引入图标

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitting = ref(false)
const formRef = ref(null)

const categoryOptions = ref([]) 

const searchForm = reactive({ name: '', status: '' })
const pagination = reactive({ pageNum: 1, pageSize: 10, total: 0 })
const form = ref({ id: null, name: '', categoryId: null, tonnage: 0, status: 'IN_SERVICE', coverImg: '' })

const rules = {
  name: [{ required: true, message: '请输入船名', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择类型', trigger: 'change' }]
}

const fetchCategories = async () => {
  try {
    const res = await request.get('/ship-categories')
    if (res.code === 0) {
      categoryOptions.value = res.data.map(item => ({
        label: item.name,
        value: item.id
      }))
    }
  } catch(e) {
    console.error('获取分类失败', e)
  }
}

const fetchData = async () => {
  loading.value = true
  try {
    const res = await request.get('/ship', {
      params: { ...pagination, ...searchForm }
    })
    tableData.value = res.data.records
    pagination.total = res.data.total
  } finally { loading.value = false }
}

const handleSearch = () => { pagination.pageNum = 1; fetchData() }

const openDialog = (type, row) => {
  dialogTitle.value = type === 'add' ? '新增船舶' : '编辑船舶'
  form.value = type === 'add' 
    ? { id: null, name: '', categoryId: null, tonnage: 0, status: 'IN_SERVICE', coverImg: '' }
    : { ...row }
  dialogVisible.value = true
}

const customUpload = async ({ file }) => {
  const fd = new FormData()
  fd.append('file', file)
  try {
    const res = await request.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' }})
    form.value.coverImg = res.data
    ElMessage.success('上传成功')
  } catch(e) { ElMessage.error('上传失败') }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true
      try {
        if (form.value.id) await request.put('/ship', form.value)
        else await request.post('/ship', form.value)
        ElMessage.success('操作成功')
        dialogVisible.value = false
        fetchData()
      } catch(e) {} 
      finally { submitting.value = false }
    }
  })
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确认删除船舶 "${row.name}" 吗？`, '警告', { type: 'warning' })
    .then(async () => {
      await request.delete('/ship', { params: { id: row.id } })
      ElMessage.success('删除成功')
      fetchData()
    })
}

const getCategoryName = (id) => {
  const found = categoryOptions.value.find(c => c.value === id)
  return found ? found.label : id 
}

const getStatusLabel = (s) => ({ 'IN_SERVICE': '在役', 'MAINTENANCE': '维修中', 'STOPPED': '停运', 'RUNNING': '航行中' }[s] || s)

// 【修复核心】：如果没有匹配到状态，默认返回 'primary'，不能返回空字符串
const getStatusType = (s) => ({ 
  'IN_SERVICE': 'success', 
  'MAINTENANCE': 'warning', 
  'STOPPED': 'danger', 
  'RUNNING': 'info' 
}[s] || 'primary')

onMounted(() => {
  fetchCategories()
  fetchData()
})
</script>

<style scoped>
.page-card { min-height: calc(100vh - 120px); }
.toolbar { margin-bottom: 16px; }
.pagination { margin-top: 16px; display: flex; justify-content: flex-end; }
.avatar-uploader .el-upload { border: 1px dashed #d9d9d9; border-radius: 6px; cursor: pointer; position: relative; overflow: hidden; }
.avatar-uploader .el-upload:hover { border-color: #409EFF; }
.avatar-uploader-icon { font-size: 28px; color: #8c939d; width: 100px; height: 100px; text-align: center; line-height: 100px; }
.avatar { width: 100px; height: 100px; display: block; object-fit: cover; }
.text-gray { color: #909399; font-size: 12px; }
</style>