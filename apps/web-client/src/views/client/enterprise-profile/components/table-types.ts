export interface EnterpriseOption {
  color?: string;
  label: string;
  value: number | string;
}

export interface EnterpriseTableColumn {
  customType?: 'file' | 'tag';
  editorType?: 'multiSelect' | 'select';
  field: string;
  minWidth?: number;
  options?: EnterpriseOption[];
  readonly?: boolean;
  title: string;
  width?: number;
}

export interface EnterpriseRecordTab {
  columns: EnterpriseTableColumn[];
  description?: string;
  emptyDescription: string;
  key: string;
  records: Record<string, unknown>[];
  title: string;
}
