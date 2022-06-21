<template>
  <div class="logo-wrapper">
    <img :src="logo" class="logo" />
    <div v-if="!props.collapse" class="text">{{ navProjectName }}</div>
  </div>
</template>

<script setup>
  import navLogo from '@/assets/img/login/navLogo.png';
  // import { ref } from "vue"
  import { getConfig } from '@/config/index.js';

  const navLogoImg = getConfig('navLogo');
  const logo = ref(navLogoImg || navLogo);
  const props = defineProps({
    collapse: {
      type: Boolean,
      default: false
    }
  });

  const navProjectName = ref(getConfig('navProjectName'));
</script>

<style lang="scss" scoped>
  .logo-wrapper {
    @apply flex h-full items-center;

    .logo {
      @apply w-9 w-[26px];
    }

    .text {
      @apply font-bold text-shadow-md text-light-50 text-[22px] whitespace-nowrap;
    }
  }
</style>
