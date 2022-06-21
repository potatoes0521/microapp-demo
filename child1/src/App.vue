<template>
  <div class="container-app">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive v-if="isKeepAlive" :include="cachedViews">
          <component :is="Component" :key="key" />
        </keep-alive>
        <component :is="Component" v-else :key="key" />
      </transition>
    </router-view>
  </div>
</template>

<script>
export default {
  computed: {
    cachedViews() {
      return this.$store.getters.getCachesTabs.map((v) => v.id);
    },
    key() {
      // const timer = new Date()
      return this.$route.fullPath;
    },
    isKeepAlive() {
      // console.log(this.$route, this.$route)
      return true;
    },
  },
};
</script>

<style lang="scss">
.container-app {
  background: #f2f2f2;
}
</style>
