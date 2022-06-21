<template>
  <div class="theme" @click="themeDrawer = !themeDrawer">
    <IconAntDesignSkinOutlined class="text-[var(--xx-navbar-text-color)] text-[0.8rem]" />
  </div>

  <el-drawer v-model="themeDrawer" custom-class="theme-drawer" title="主题" direction="rtl" :before-close="handleClose">
    <div class="theme-drawer-box">
      <div class="theme-drawer-box-item">
        <el-card :body-style="{ padding: '0px' }" shadow="hover">
          <div class="card-top"></div>
          <div class="card-bottom">
            <span>基础色</span>
            <el-button type="text" class="button">当前使用</el-button>
          </div>
        </el-card>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
  const handleClose = (done) => {
    done();
  };
  const themeDrawer = ref(false);
</script>
<style scoped lang="scss">
  .theme {
    @apply w-8 h-full flex items-center justify-center box-border cursor-pointer;
  }
  .theme:hover {
    @apply bg-[var(--xx-hover-bg-color)];
  }
</style>
<style lang="scss">
  .theme-drawer {
    width: 400px !important;

    .el-drawer__header {
      margin-bottom: 0;
    }
    .el-drawer__body {
      padding: 0;
    }

    .theme-drawer-box {
      @apply w-full h-full flex flex-col justify-start p-5 box-border overflow-x-hidden overscroll-y-auto;

      .theme-drawer-box-item {
        .card-top {
          @apply w-full h-[170px];
          background: var(--xx-navbar-bg-color);
        }

        .card-bottom {
          @apply w-full h-10 flex justify-between items-center px-3;
        }
      }
    }
  }
</style>
