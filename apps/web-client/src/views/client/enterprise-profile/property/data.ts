import type {
  EnterpriseOption,
  EnterpriseTableColumn,
} from '../components/table-types';

export const ipTypeOptions: EnterpriseOption[] = [
  { label: '发明专利', value: 1 },
  { label: '实用新型', value: 2 },
  { label: '软件著作权', value: 3 },
  { label: '外观设计', value: 4 },
];

export const ipStatusOptions: EnterpriseOption[] = [
  { color: 'processing', label: '审核中', value: 1 },
  { color: 'success', label: '已下证', value: 2 },
];

export const yesNoOptions: EnterpriseOption[] = [
  { color: 'green', label: '是', value: 1 },
  { color: 'default', label: '否', value: 0 },
];

export const projectStatusOptions: EnterpriseOption[] = [
  { color: 'processing', label: '立项中', value: 1 },
  { color: 'success', label: '已结题', value: 3 },
  { color: 'default', label: '已终止', value: 4 },
];

export const fundSourceOptions: EnterpriseOption[] = [
  { label: '国家级', value: 1 },
  { label: '省级', value: 2 },
  { label: '市级', value: 3 },
  { label: '企业自筹', value: 4 },
  { label: '合作项目', value: 5 },
  { label: '其他', value: 6 },
];

export const intellectualPropertyColumns: EnterpriseTableColumn[] = [
  { field: 'ip_code', minWidth: 100, readonly: true, title: 'IP编号' },
  { field: 'soft_work_name', minWidth: 180, title: '知识产权名称' },
  {
    customType: 'tag',
    field: 'soft_work_type',
    minWidth: 140,
    options: ipTypeOptions,
    title: '类型',
  },
  {
    customType: 'tag',
    field: 'soft_work_status',
    minWidth: 120,
    options: ipStatusOptions,
    title: '状态',
  },
  { field: 'soft_work_num', minWidth: 180, title: '登记号/专利号' },
  { field: 'apply_date', minWidth: 130, title: '申请日期' },
  { field: 'authorize_date', minWidth: 130, title: '授权日期' },
  { field: 'ip_level', minWidth: 100, title: 'I/II类' },
  { field: 'right_holder', minWidth: 160, title: '权利人' },
  { field: 'obtain_method', minWidth: 130, title: '获得方式' },
  { field: 'inventor', minWidth: 140, title: '发明人/著作权人' },
  {
    customType: 'tag',
    field: 'is_core_ip',
    minWidth: 110,
    options: yesNoOptions,
    title: '核心IP',
  },
  { field: 'advanced_degree', minWidth: 180, title: '技术先进程度' },
  { field: 'support_effect', minWidth: 180, title: '核心支持程度' },
  { editorType: 'multiSelect', field: 'related_rd_ids', minWidth: 150, title: '关联RD' },
  { editorType: 'multiSelect', field: 'related_ps_ids', minWidth: 150, title: '关联PS' },
  { editorType: 'multiSelect', field: 'related_transformation_ids', minWidth: 160, title: '关联成果' },
  {
    customType: 'file',
    field: 'soft_work_file',
    minWidth: 120,
    title: '软著原件',
  },
  { field: 'remark', minWidth: 180, title: '备注' },
];

export const researchProjectColumns: EnterpriseTableColumn[] = [
  { field: 'ky_project_name', minWidth: 180, title: '项目名称' },
  { field: 'ky_project_num', minWidth: 150, readonly: true, title: '项目编号' },
  {
    customType: 'tag',
    field: 'ky_project_status',
    minWidth: 120,
    options: projectStatusOptions,
    title: '项目状态',
  },
  { field: 'init_date', minWidth: 130, title: '立项日期' },
  { field: 'end_date', minWidth: 130, title: '结题日期' },
  { field: 'ky_project_leader', minWidth: 130, title: '项目负责人' },
  { field: 'project_type', minWidth: 130, title: '项目类型' },
  {
    customType: 'tag',
    field: 'fund_source',
    minWidth: 130,
    options: fundSourceOptions,
    title: '资金来源',
  },
  { field: 'fund_amount', minWidth: 130, title: '项目经费' },
  {
    customType: 'file',
    field: 'lxbg_file',
    minWidth: 130,
    title: '研发立项报告',
  },
  { field: 'ky_project_des', minWidth: 220, title: '研发立项报告正文' },
  { field: 'rd_budget', minWidth: 130, title: '研发预算' },
  { field: 'rd_expense_total', minWidth: 140, title: '研发费用' },
  { field: 'rd_organization_method', minWidth: 220, title: '组织实施方式' },
  { field: 'core_technology', minWidth: 220, title: '核心技术' },
  { field: 'innovation_points', minWidth: 220, title: '创新点' },
  { field: 'stage_result', minWidth: 220, title: '阶段成果' },
  { editorType: 'multiSelect', field: 'related_ip_ids', minWidth: 150, title: '关联IP' },
  { editorType: 'multiSelect', field: 'related_ps_ids', minWidth: 150, title: '关联PS' },
  {
    editorType: 'multiSelect',
    field: 'related_transformation_ids',
    minWidth: 160,
    readonly: true,
    title: '关联成果',
  },
];

export const productServiceColumns: EnterpriseTableColumn[] = [
  { field: 'ps_code', minWidth: 120, title: 'PS编号' },
  { field: 'ps_name', minWidth: 180, title: '产品/服务名称' },
  { field: 'tech_field', minWidth: 160, title: '技术领域' },
  { field: 'tech_source', minWidth: 160, title: '技术来源' },
  { field: 'last_year_income', minWidth: 140, title: '上年度收入' },
  { field: 'high_tech_income', minWidth: 140, title: '高新收入' },
  { field: 'tech_description', minWidth: 220, title: '关键技术' },
  { field: 'tech_index', minWidth: 220, title: '技术指标' },
  { field: 'competitive_advantage', minWidth: 220, title: '竞争优势' },
  { editorType: 'multiSelect', field: 'related_rd_ids', minWidth: 150, title: '关联RD' },
  { editorType: 'multiSelect', field: 'related_ip_ids', minWidth: 150, title: '关联IP' },
  { editorType: 'multiSelect', field: 'related_transformation_ids', minWidth: 160, title: '关联成果' },
  { editorType: 'multiSelect', field: 'related_contract_ids', minWidth: 160, title: '关联合同' },
  { editorType: 'multiSelect', field: 'related_invoice_ids', minWidth: 160, title: '关联发票' },
  {
    customType: 'file',
    field: 'proof_files',
    minWidth: 130,
    title: '证明材料',
  },
  { field: 'remark', minWidth: 180, title: '备注' },
];

export const transformationColumns: EnterpriseTableColumn[] = [
  { field: 'transformation_code', minWidth: 130, readonly: true, title: '成果编号' },
  { field: 'transformation_name', minWidth: 180, title: '成果名称' },
  { field: 'transformation_year', minWidth: 120, title: '转化年度' },
  { field: 'transformation_method', minWidth: 150, title: '转化方式' },
  { field: 'transformation_income', minWidth: 140, title: '转化收入' },
  { field: 'customer_name', minWidth: 160, title: '客户名称' },
  { field: 'application_scene', minWidth: 220, title: '应用场景' },
  { editorType: 'multiSelect', field: 'related_rd_ids', minWidth: 150, title: '关联RD' },
  { editorType: 'multiSelect', field: 'related_ip_ids', minWidth: 150, title: '关联IP' },
  { editorType: 'multiSelect', field: 'related_ps_ids', minWidth: 150, title: '关联PS' },
  { editorType: 'multiSelect', field: 'related_contract_ids', minWidth: 160, title: '关联合同' },
  { editorType: 'multiSelect', field: 'related_invoice_ids', minWidth: 160, title: '关联发票' },
  {
    customType: 'file',
    field: 'proof_files',
    minWidth: 130,
    title: '证明材料',
  },
  { field: 'remark', minWidth: 180, title: '备注' },
];
