<template>
  <el-dropdown id="header-translation" trigger="hover" class="userinfo-dropdown">
    <div class="component-wrapper">
      <div class="wrapper">
        <div class="userinfo">
          <div class="userinfo-img">
            <IconUserKefunv v-if="!userInfo.img" style="font-size: 20px" />
            <img v-else :src="userInfo.img" />
          </div>
          <div class="userinfo-info">
            <div class="userinfo-name">{{ userInfo.uname }}</div>
            <div class="userinfo-other">{{ userInfo.workNo }}</div>
          </div>
          <!-- <div class="el-icon-arrow-down icon"></div> -->
        </div>
      </div>
    </div>
    <template #dropdown>
      <el-dropdown-menu class="userinfo-translation">
        <!-- <el-dropdown-item> {{ t('Personal') }}</el-dropdown-item>
        <el-divider class="my-0px"></el-divider>
        <el-dropdown-item> {{ t('Feedback') }} </el-dropdown-item>
        <el-dropdown-item> {{ t('Update Log') }} </el-dropdown-item>
        <el-divider class="my-0px"></el-divider> -->
        <template v-if="showPunch">
          <el-dropdown-item @click.stop="handlePunch">打卡</el-dropdown-item>
        </template>
        <el-dropdown-item @click.stop="changePassword"> {{ t('password') }} </el-dropdown-item>
        <el-dropdown-item @click.stop="logOut"> {{ t('Logout') }} </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <ChangePassword ref="changePasswordRef" />
</template>

<script setup>
  import ChangePassword from './components/ChangePassword/index.vue';
  import { useUserStore } from '@/store/user';
  import { loginOut } from '@/api/modules/this';
  import usePunch from './hooks/punch';

  const { t } = useI18n();
  const userStore = useUserStore();
  const userInfo = computed(() => userStore.userInfo || {});

  function logOut() {
    loginOut().then(() => {
      userStore.logout();
    });
  }

  const changePasswordRef = ref(null);
  function changePassword() {
    // console.log('🚀 > file: index.vue > line 56 > changePasswordRef', changePasswordRef.value);
    changePasswordRef.value.openDialog();
  }
  const { showPunch, handlePunch } = usePunch();
</script>
<style scoped lang="scss">
  .component-wrapper {
    @apply flex h-full text-[#fff] items-center justify-center box-border;
    .wrapper {
      @apply cursor-pointer flex h-full items-center;

      .userinfo {
        @apply cursor-pointer flex h-full py-0 px-2.5 w-32 items-center box-border;

        .userinfo-img {
          @apply flex bg-light-50 rounded-1/2 flex-shrink-0 h-7.5 w-7.5 justify-center items-center overflow-hidden;
        }
        .userinfo-info {
          @apply ml-2 w-[calc(100%-38px)] overflow-hidden;
          .userinfo-name {
            @apply font-500 w-full text-light-50 text-[14px] truncate;
          }
          .userinfo-other {
            @apply font-400 mt-1 text-light-900 text-[10px] truncate;
          }
        }
      }
      .userinfo:hover {
        @apply bg-[var(--xx-hover-bg-color)];
      }
    }
  }
  .drop-down {
    @apply w-full;

    .drop-down-item {
      @apply cursor-pointer rounded-2px h-30px pl-10px leading-30px;

      &:hover {
        @apply bg-[#f5f7fa];
      }
    }
  }
</style>
