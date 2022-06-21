<template>
  <div class="short-message" @click="handleShortMessage">
    <IconBxMessageSquareDetail class="text-[var(--xx-navbar-text-color)] text-[0.8rem]" />
  </div>
</template>

<script setup>
  import { routerPush } from '@/hooks/useMicro';

  const handleShortMessage = () => {
    routerPush(`/qishi-cc/shortmessagetemplate`, {
      add: true
    });
  };
</script>
<style scoped lang="scss">
  .short-message {
    @apply w-8 h-full flex items-center justify-center box-border cursor-pointer;
  }
  .short-message:hover {
    @apply bg-[var(--xx-hover-bg-color)];
  }
</style>
