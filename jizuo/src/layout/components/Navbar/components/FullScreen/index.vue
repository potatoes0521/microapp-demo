<template>
  <div class="fullscreen" @click="toggle">
    <icon-ic-round-fullscreen v-if="!isFullscreen" class="text-[var(--xx-navbar-text-color)] text-[0.9rem]" />
    <icon-ic-round-fullscreen-exit v-else class="text-[var(--xx-navbar-text-color)] text-[0.9rem]" />
  </div>
</template>

<script setup>
  const { toggle, isFullscreen } = useFullscreen();
</script>
<style scoped lang="scss">
  .fullscreen {
    @apply w-8 h-full flex items-center justify-center box-border cursor-pointer;
  }
  .fullscreen:hover {
    @apply bg-[var(--xx-hover-bg-color)];
  }
</style>
