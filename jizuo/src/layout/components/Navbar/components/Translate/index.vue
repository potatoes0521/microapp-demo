<template>
  <el-dropdown id="header-translation" trigger="hover" popper-class="translate-dropdown">
    <div class="translate">
      <icon-ic-baseline-translate class="text-[var(--xx-navbar-text-color)] text-[0.8rem]" />
    </div>
    <template #dropdown>
      <el-dropdown-menu class="translate-translation">
        <el-dropdown-item :class="{ 'is-lang': isI18nLocale('zh-CN') }" @click="i18nLocale = 'zh-CN'">
          <span class="mr-2 text-12px">🇨🇳</span>
          {{ t('Chinese Simplified') }}
        </el-dropdown-item>
        <el-dropdown-item :class="{ 'is-lang': isI18nLocale('en') }" @click="i18nLocale = 'en'">
          <span class="mr-2 text-12px">🇺🇸</span>
          {{ t('English American') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
  import { useNav } from '@/layout/hooks/useNav.js';

  const { isI18nLocale, i18nLocale } = useNav();
  const { t } = useI18n();
</script>
<style scoped lang="scss">
  .translate {
    @apply w-8 h-full flex items-center justify-center box-border cursor-pointer;
  }
  .translate:hover {
    @apply bg-[var(--xx-hover-bg-color)];
  }
</style>
<style lang="scss">
  .translate-dropdown {
    font-size: inherit !important;

    .national-flag {
      @apply mr-2 text-12px;
    }

    .is-lang {
      @apply text-[var(--xx-navbar-text-color)] bg-[var(--xx-color-primary)];
    }
  }
</style>
