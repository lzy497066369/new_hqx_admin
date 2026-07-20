import type {
  EnterpriseWorkspaceEmployee,
  EnterpriseWorkspaceEmployeeInput,
  EnterpriseWorkspaceEmployeeImportPreview,
  EnterpriseWorkspaceEmployeeList,
} from '#/api';

import { shallowRef, watch } from 'vue';
import {
  createEnterpriseWorkspaceEmployeeApi,
  confirmEnterpriseWorkspaceEmployeeImportApi,
  deleteEnterpriseWorkspaceEmployeeApi,
  downloadEnterpriseWorkspaceEmployeeExportApi,
  downloadEnterpriseWorkspaceEmployeeTemplateApi,
  getEnterpriseWorkspaceEmployeesApi,
  previewEnterpriseWorkspaceEmployeeImportApi,
  updateEnterpriseWorkspaceEmployeeApi,
} from '#/api';

import { useEnterpriseContextStore } from '#/store';

export function useEnterpriseEmployees() {
  const enterpriseContextStore = useEnterpriseContextStore();
  const data = shallowRef<EnterpriseWorkspaceEmployeeList>();
  const editorOpen = shallowRef(false);
  const editingEmployee = shallowRef<EnterpriseWorkspaceEmployee>();
  const importPreview = shallowRef<EnterpriseWorkspaceEmployeeImportPreview>();
  const importPreviewOpen = shallowRef(false);
  const importUploadOpen = shallowRef(false);
  const importing = shallowRef(false);
  const loading = shallowRef(false);
  const saving = shallowRef(false);

  function getEnterpriseId() {
    return enterpriseContextStore.currentEnterpriseId ?? '';
  }

  async function load() {
    const enterpriseId = getEnterpriseId();
    if (!enterpriseId) {
      data.value = undefined;
      return;
    }
    loading.value = true;
    try {
      data.value = await getEnterpriseWorkspaceEmployeesApi(enterpriseId);
    } finally {
      loading.value = false;
    }
  }

  function openEditor(employee?: EnterpriseWorkspaceEmployee) {
    editingEmployee.value = employee;
    editorOpen.value = true;
  }

  async function saveEmployee(data: EnterpriseWorkspaceEmployeeInput) {
    const enterpriseId = getEnterpriseId();
    saving.value = true;
    try {
      if (editingEmployee.value) {
        await updateEnterpriseWorkspaceEmployeeApi(
          enterpriseId,
          editingEmployee.value.id,
          data,
        );
      } else {
        await createEnterpriseWorkspaceEmployeeApi(enterpriseId, data);
      }
      editorOpen.value = false;
      await load();
    } finally {
      saving.value = false;
    }
  }

  async function removeEmployee(employeeId: string) {
    saving.value = true;
    try {
      await deleteEnterpriseWorkspaceEmployeeApi(getEnterpriseId(), employeeId);
      await load();
    } finally {
      saving.value = false;
    }
  }

  async function downloadImportTemplate() {
    const blob = await downloadEnterpriseWorkspaceEmployeeTemplateApi(
      getEnterpriseId(),
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = '员工花名册模板.xlsx';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function downloadEmployeeExport() {
    const blob = await downloadEnterpriseWorkspaceEmployeeExportApi(
      getEnterpriseId(),
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = '员工花名册.xlsx';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }

  function openImport() {
    importUploadOpen.value = true;
  }

  async function previewImport(file: File) {
    importing.value = true;
    try {
      importPreview.value = await previewEnterpriseWorkspaceEmployeeImportApi(
        getEnterpriseId(),
        file,
      );
      importUploadOpen.value = false;
      importPreviewOpen.value = true;
    } finally {
      importing.value = false;
    }
  }

  async function confirmImport(skippedKeys: string[]) {
    const preview = importPreview.value;
    if (!preview) {
      return;
    }
    importing.value = true;
    try {
      const result = await confirmEnterpriseWorkspaceEmployeeImportApi(
        getEnterpriseId(),
        preview.materialId,
        skippedKeys,
      );
      await load();
      importPreviewOpen.value = false;
      importPreview.value = undefined;
      return result;
    } finally {
      importing.value = false;
    }
  }

  watch(
    () => enterpriseContextStore.currentEnterpriseId,
    () => void load(),
    { immediate: true },
  );

  return {
    data,
    confirmImport,
    downloadImportTemplate,
    downloadEmployeeExport,
    editingEmployee,
    editorOpen,
    importPreview,
    importPreviewOpen,
    importing,
    importUploadOpen,
    load,
    loading,
    openEditor,
    openImport,
    previewImport,
    removeEmployee,
    saveEmployee,
    saving,
  };
}
