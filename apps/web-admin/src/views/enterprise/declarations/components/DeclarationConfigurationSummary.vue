<script setup lang="ts">
import type { EnterpriseWorkspaceDeclarationConfiguration } from '#/api';

import { Tag } from 'antdv-next';

defineOptions({ name: 'DeclarationConfigurationSummary' });

defineProps<{
  configuration: EnterpriseWorkspaceDeclarationConfiguration;
}>();

const operatorLabelMap: Record<string, string> = {
  eq: '=',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
};

function formatValue(value: null | number, valueType: 'boolean' | 'number', unit: string) {
  if (value === null) return '未提供';
  if (valueType === 'boolean') return value === 1 ? '是' : '否';
  return `${value}${unit}`;
}

function presetLabel(preset: EnterpriseWorkspaceDeclarationConfiguration['qualification']['preset']) {
  return preset ? `${preset.name} ${preset.version}` : '方案内置规则';
}
</script>

<template>
  <div class="declaration-configuration-summary">
    <div class="declaration-configuration-summary__scheme">
      <div>
        <span>申报方案</span>
        <strong>{{ configuration.scheme.name }}</strong>
      </div>
      <Tag color="blue">{{ configuration.scheme.version }}</Tag>
    </div>

    <div class="declaration-configuration-summary__head">
      <div>
        <strong>准入规则</strong>
        <p>{{ presetLabel(configuration.qualification.preset) }}</p>
      </div>
      <Tag :color="configuration.qualification.status === 'eligible' ? 'green' : 'orange'">
        {{ configuration.qualification.status === 'eligible' ? '已满足' : '存在缺口' }}
      </Tag>
    </div>

    <div class="declaration-configuration-summary__rules">
      <article
        v-for="rule in configuration.qualification.rules"
        :key="`${rule.type}-${rule.key}`"
        class="declaration-configuration-summary__rule"
      >
        <div>
          <strong>{{ rule.label }}</strong>
          <p>{{ rule.source }}</p>
        </div>
        <div class="declaration-configuration-summary__values">
          <span>要求 {{ operatorLabelMap[rule.operator] ?? rule.operator }} {{ formatValue(rule.expected, rule.valueType, rule.unit) }}</span>
          <span>实际 {{ formatValue(rule.actual, rule.valueType, rule.unit) }}</span>
        </div>
        <Tag :color="rule.passed ? 'green' : 'orange'">
          {{ rule.passed ? '满足' : '待补齐' }}
        </Tag>
      </article>
    </div>
  </div>
</template>

<style scoped>
.declaration-configuration-summary,
.declaration-configuration-summary__rules {
  display: grid;
  gap: 12px;
}

.declaration-configuration-summary__scheme,
.declaration-configuration-summary__head,
.declaration-configuration-summary__rule,
.declaration-configuration-summary__values {
  display: flex;
  gap: 12px;
  align-items: center;
}

.declaration-configuration-summary__scheme,
.declaration-configuration-summary__head,
.declaration-configuration-summary__rule {
  justify-content: space-between;
}

.declaration-configuration-summary__scheme,
.declaration-configuration-summary__rule {
  padding: 12px;
  border: 1px solid #e5e7eb;
}

.declaration-configuration-summary__scheme span,
.declaration-configuration-summary__head p,
.declaration-configuration-summary__rule p,
.declaration-configuration-summary__values {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

.declaration-configuration-summary__scheme strong {
  display: block;
  margin-top: 2px;
}

.declaration-configuration-summary__values {
  flex: 1;
  justify-content: flex-end;
}

@media (max-width: 760px) {
  .declaration-configuration-summary__rule,
  .declaration-configuration-summary__head,
  .declaration-configuration-summary__scheme {
    align-items: flex-start;
    flex-direction: column;
  }

  .declaration-configuration-summary__values {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
</style>
