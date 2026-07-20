<script setup lang="ts">
import type { EnterpriseWorkspaceEmployee } from '#/api';

import { Button, Empty, Table, Tag } from 'antdv-next';

interface Props { employees: EnterpriseWorkspaceEmployee[]; saving: boolean; }

defineProps<Props>();
const emit = defineEmits<{ create: []; downloadExport: []; downloadTemplate: []; edit: [employee: EnterpriseWorkspaceEmployee]; import: []; preview: [employee: EnterpriseWorkspaceEmployee, path: string]; remove: [employee: EnterpriseWorkspaceEmployee] }>();
const columns = [
  { dataIndex: 'ygName', key: 'ygName', title: '姓名', width: 110 },
  { dataIndex: 'department', key: 'department', title: '部门 / 岗位', width: 170 },
  { dataIndex: 'ygSex', key: 'ygSex', title: '性别', width: 82 },
  { dataIndex: 'ygLx', key: 'ygLx', title: '员工类型', width: 120 },
  { dataIndex: 'isActive', key: 'isActive', title: '状态', width: 82 },
  { dataIndex: 'isKjyf', key: 'isKjyf', title: '科技人员', width: 100 },
  { dataIndex: 'attachment', key: 'attachment', title: '证明材料', width: 260 },
  { key: 'actions', title: '操作', width: 132 },
];
const employeeTypes: Record<number, string> = { 1: '在职人员', 2: '兼职人员', 3: '临时兼职', 4: '临时聘用' };

function attachments(employee: EnterpriseWorkspaceEmployee) {
  return [
    ['综合', employee.ygFiles], ['合同', employee.laborContractFile], ['社保', employee.socialSecurityFile], ['学历', employee.educationFile], ['职称', employee.titleFile],
  ].filter((item): item is [string, string] => Boolean(item[1]));
}
</script>

<template>
  <div class="enterprise-employee-list__toolbar"><p>维护企业员工基础信息和证明材料，统计将按在职和科技人员状态自动更新。</p><div class="enterprise-employee-list__actions"><Button @click="emit('downloadTemplate')">下载模板</Button><Button @click="emit('downloadExport')">导出名册</Button><Button @click="emit('import')">导入名册</Button><Button type="primary" @click="emit('create')">新增员工</Button></div></div>
  <Table v-if="employees.length" :columns="columns" :data-source="employees" :loading="saving" :pagination="false" :row-key="(record) => record.id" size="small"><template #bodyCell="{ column, record }"><template v-if="column.key === 'department'">{{ record.department || '-' }} / {{ record.position || '-' }}</template><template v-else-if="column.key === 'ygSex'">{{ record.ygSex === 1 ? '男' : record.ygSex === 2 ? '女' : '-' }}</template><template v-else-if="column.key === 'ygLx'">{{ record.ygLx ? employeeTypes[record.ygLx] : '-' }}</template><template v-else-if="column.key === 'isActive'"><Tag :color="record.isActive ? 'green' : 'default'">{{ record.isActive ? '在职' : '离职' }}</Tag></template><template v-else-if="column.key === 'isKjyf'">{{ record.isKjyf ? '是' : '否' }}</template><template v-else-if="column.key === 'attachment'"><div class="enterprise-employee-list__attachments"><Button v-for="[label, path] in attachments(record)" :key="path" size="small" type="link" @click="emit('preview', record, path)">{{ label }}</Button><span v-if="attachments(record).length === 0">-</span></div></template><template v-else-if="column.key === 'actions'"><Button size="small" type="link" @click="emit('edit', record)">编辑</Button><Button danger size="small" type="link" @click="emit('remove', record)">删除</Button></template></template></Table>
  <Empty v-else :image="Empty.PRESENTED_IMAGE_SIMPLE" description="暂无员工记录"><Button type="primary" @click="emit('create')">新增员工</Button></Empty>
</template>

<style scoped>
.enterprise-employee-list__toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }.enterprise-employee-list__toolbar p { margin: 0; color: #6b7280; }.enterprise-employee-list__actions, .enterprise-employee-list__attachments { display: flex; flex-wrap: wrap; gap: 8px; }@media (max-width: 640px) { .enterprise-employee-list__toolbar { align-items: stretch; flex-direction: column; } }
</style>
