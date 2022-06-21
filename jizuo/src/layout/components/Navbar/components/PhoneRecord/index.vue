<template>
  <el-dropdown v-if="softphoneStore.getSoftPhoneQueueLength" id="header-translation" trigger="hover" popper-class="phonerecord-dropdown">
    <div class="phonerecord">
      <icon-softphone-phone_log1 class="text-[var(--xx-navbar-text-color)] text-[0.8rem]" />
    </div>
    <template #dropdown>
      <el-dropdown-menu class="phonerecord-translation">
        <div class="text-8px px-10px pb-8px text-[var(--xx-text-color-secondary)] box-border text-right">弹屏历史</div>
        <el-dropdown-item
          v-for="item of softphoneStore.softPhoneQueue"
          :key="item.callId"
          class="phonerecord-translation-item"
          @click="handleCurrentCall(item)"
        >
          <div>
            {{ item.type === 2 ? item.calleeNumber : item.callerNumber }}
          </div>
          <div class="time">
            {{ item.callStartTime }}
          </div>
          <icon-softphone-views class="icon-views text-[0.6rem] ml-1" />
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
  import { useSoftphoneStore } from '@/store/softphone';
  import { routerPush } from '@/hooks/useMicro';

  const softphoneStore = useSoftphoneStore();

  const handleCurrentCall = (options) => {
    routerPush(`/qishi-cc/callpopup`, {
      callId: options.callId,
      callerNumber: options.callerNumber,
      calleeNumber: options.calleeNumber,
      ccNo: options.ccNo,
      callStartTime: options.callStartTime,
      type: options.type
    });
  };
</script>
<style scoped lang="scss">
  .phonerecord {
    @apply w-8 h-full flex items-center justify-center box-border cursor-pointer;
  }
  .phonerecord:hover {
    @apply bg-[var(--xx-hover-bg-color)];
  }
</style>
<style lang="scss">
  .phonerecord-dropdown {
    font-size: inherit !important;

    .national-flag {
      @apply mr-2 text-12px;
    }

    .is-lang {
      @apply text-[var(--xx-navbar-text-color)] bg-[var(--xx-color-primary)];
    }

    .phonerecord-translation-item {
      padding: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .time {
        color: #999;
        font-size: 12px;
        margin-left: 10px;
      }

      .icon-views {
        // transition: var(--xx-transition-all);
        width: 0;
      }
      &:hover {
        .icon-views {
          width: auto;
        }
      }
    }
    // .phonerecord-translation-item:hover {
    //   .icon-views {
    //     visibility: visible;
    //   }
    // }
  }
</style>
