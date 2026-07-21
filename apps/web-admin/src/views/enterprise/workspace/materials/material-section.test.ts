import { describe, expect, it } from 'vitest';

import {
  getMaterialSectionConfig,
  getMaterialSectionTarget,
  materialSections,
  materialSectionKeys,
  resolveMaterialLedgerSection,
} from './material-section';
import { materialArchiveTabs } from './material-content-tabs';

describe('material section configuration', () => {
  it('keeps business material pages and import records in the ledger', () => {
    expect(materialSectionKeys).toEqual([
      'company',
      'materials',
      'basic',
      'finance',
      'employee',
      'intellectual_property',
      'contract',
      'document',
      'certificate',
      'photo',
      'account',
    ]);
  });

  it('keeps the client directory labels in readable Chinese', () => {
    expect(materialSections.map((item) => item.title)).toEqual([
      '公司资料',
      '导入记录',
      '企业基础档案',
      '财税',
      '员工',
      '研发与知识产权',
      '合同和发票',
      '制度文件',
      '企业证书',
      '照片',
      '企业账号',
    ]);
  });

  it('keeps each archive-backed section on its matching tab', () => {
    expect(getMaterialSectionConfig('contract').archiveTab).toBe('contracts');
    expect(getMaterialSectionConfig('document').archiveTab).toBe('documents');
    expect(getMaterialSectionConfig('account').archiveTab).toBe('accounts');
  });

  it('uses separate views for each archive ledger and gallery views for media', () => {
    expect(getMaterialSectionConfig('contract').view).toBe('contracts');
    expect(getMaterialSectionConfig('document').view).toBe('documents');
    expect(getMaterialSectionConfig('account').view).toBe('accounts');
    expect(getMaterialSectionConfig('certificate').view).toBe('certificates');
    expect(getMaterialSectionConfig('photo').view).toBe('photos');
    expect(getMaterialSectionConfig('materials').view).toBe('templates');
  });

  it('keeps both client contract tabs available in the ledger', () => {
    expect(materialArchiveTabs.contract).toEqual(['contracts', 'invoices']);
  });

  it.each([
    ['finance', 'taxAudit', { section: 'finance', tab: 'taxAudit' }],
    ['property', 'intellectualProperty', { section: 'intellectual_property', tab: 'ip' }],
    ['property', 'researchProject', { section: 'intellectual_property', tab: 'rd' }],
    ['property', 'productService', { section: 'intellectual_property', tab: 'ps' }],
    ['property', 'transformation', { section: 'intellectual_property', tab: 'transformation' }],
    ['contract', 'invoices', { section: 'contract', tab: 'invoices' }],
  ])('maps %s/%s to the exact material ledger target', (moduleKey, tabKey, target) => {
    expect(getMaterialSectionTarget(moduleKey, tabKey)).toEqual(target);
  });

  it('resolves the material section from a dynamic menu route when section params are absent', () => {
    expect(resolveMaterialLedgerSection(undefined, 'EnterpriseMaterialProperties')).toBe(
      'intellectual_property',
    );
  });

  it('prefers the section route param and falls back to the company overview for unknown routes', () => {
    expect(resolveMaterialLedgerSection('finance', 'EnterpriseMaterialOverview')).toBe(
      'finance',
    );
    expect(resolveMaterialLedgerSection(undefined, 'UnknownRoute')).toBe('company');
  });

  it('redirects the legacy contacts route to the basic profile section', () => {
    expect(resolveMaterialLedgerSection('contacts')).toBe('basic');
    expect(resolveMaterialLedgerSection(undefined, 'EnterpriseMaterialContacts')).toBe('basic');
    expect(resolveMaterialLedgerSection('materials')).toBe('materials');
  });
});
