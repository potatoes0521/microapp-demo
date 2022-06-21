<template>
  <el-dropdown id="header-translation" trigger="hover" popper-class="light-dark-dropdown">
    <div class="light-dark" @click="switchTheme()">
      <IconEpMonitor v-if="isFollow" class="text-[var(--xx-navbar-text-color)] text-[0.8rem]" />
      <IconEpSunrise v-if="theme === 'light'" class="text-[var(--xx-navbar-text-color)] text-[0.8rem]" />
      <IconEpMoonNight v-if="theme === 'dark'" class="text-[var(--xx-navbar-text-color)] text-[0.8rem]" />
    </div>
    <template #dropdown>
      <el-dropdown-menu class="light-dark-translation">
        <el-dropdown-item :class="{ 'is-lang': theme === 'light' }" @click="switchTheme('light')">
          <IconEpSunrise class="text-[0.7rem] mr-2" /> {{ t('Light Theme') }}
        </el-dropdown-item>
        <el-dropdown-item :class="{ 'is-lang': theme === 'dark' }" @click="switchTheme('dark')">
          <IconEpMoonNight class="text-[0.7rem] mr-2" /> {{ t('Dark Theme') }}
        </el-dropdown-item>
        <el-dropdown-item :class="{ 'is-lang': isFollow }" @click="switchTheme('follow')">
          <IconEpMonitor class="text-[0.7rem] mr-2" /> {{ t('Follow System') }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
  import { useNav } from '@/layout/hooks/useNav';

  const { t } = useI18n();

  const { switchTheme, isFollow, theme } = useNav();
</script>
<style scoped lang="scss">
  .light-dark {
    @apply w-8 h-full flex items-center justify-center box-border cursor-pointer;
  }
  .light-dark:hover {
    @apply bg-[var(--xx-hover-bg-color)];
  }
</style>
<style lang="scss">
  .light-dark-dropdown {
    .is-lang {
      @apply text-[var(--xx-navbar-text-color)] bg-[var(--xx-color-primary)];
    }
  }
</style>
