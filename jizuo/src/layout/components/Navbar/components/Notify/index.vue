<template>
  <div class="notify">
    <el-popover v-model:visible="showPopover" trigger="click" placement="bottom" :width="320" popper-class="notify-popover" @show="queryMyNoticeFn">
      <div ref="targetPopover" class="notify-tab">
        <div class="notify-tab-header">
          <span class="notify-tab-title">消息</span>
          <span class="notify-tab-option" @click="noticeAllReadFn">全部已读</span>
        </div>
        <ul v-if="!noData" ref="infiniteScrollEl" class="notify-infinite-list" style="overflow: auto">
          <li
            v-for="(item, i) in messageList"
            :key="item.id"
            class="notify-infinite-list-item"
            :class="{ 'notify-infinite-list-item-active': item.readStatus }"
            @click="toDetail(item, i)"
          >
            <el-badge :is-dot="item.readStatus === 0" class="n-i-l-mark">
              <div class="n-i-l-item">
                <div class="n-i-l-item-title">{{ item.title }}</div>
                <div class="n-i-l-item-date">{{ item.issueTime }}</div>
              </div>
            </el-badge>
          </li>
          <li v-if="infiniteLoading" class="flex h-30px w-full justify-center items-center">
            <IconEosIconsThreeDotsLoading class="text-[var(--xx-text-color-secondary)] text-[1.3rem]" />
          </li>
          <li v-if="infiniteScrollDisabled" class="flex h-34px w-full text-10px justify-center items-center">没有更多了</li>
        </ul>
        <div v-if="!noData" class="notify-tab-all-data" @click="toAllList">
          查看全部 <IconIcOutlineArrowCircleRight class="text-[var(--xx-text-color-regular)] ml-2px text-[0.9rem] n-t-a-icon" />
        </div>
        <div v-if="noData" class="notify-tab-no-data">
          <el-empty description="暂无数据" :image-size="50" />
        </div>
      </div>
      <template #reference>
        <div class="notify" @click="showPopover = !showPopover">
          <el-badge :value="unreadNum" :max="99" :hidden="unreadNum == 0" :is-dot="false">
            <IconEpBell class="text-[var(--xx-navbar-text-color)] text-[0.8rem]" />
          </el-badge>
        </div>
      </template>
    </el-popover>
    <!-- ==========================公告========================== -->
    <div v-if="noticeStrong && noticeStrong.length" class="notice-wrapper" :style="heightPX(noticeStrong.length)">
      <div v-for="(v, i) in noticeStrong" :key="v.noticeId" class="notice-item" :style="bottomPX(i)" :class="noticeItemClass(v.busType)">
        <div class="notice-title">
          <span>{{ v.title }}</span>
          <span class="notice-close" @click="closeNotice(v)"> × </span>
        </div>
        <div class="notice-desc">
          {{ v.content }}
        </div>
        <div v-if="auth('handle', '/stronghandle')" class="notice-btn" @click="handleWoDetail(v)">去处理</div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useNotify } from '@/layout/hooks/useNotify';
  import useStyle from './hooks/style';
  import useAuth from '@/hooks/useAuth';

  const { auth } = useAuth();

  const {
    showPopover,
    unreadNum,
    messageList,
    infiniteScrollEl,
    infiniteLoading,
    infiniteScrollDisabled,
    noData,
    targetPopover,
    queryMyNoticeFn,
    toAllList,
    toDetail,
    noticeAllReadFn,
    noticeStrong,
    closeNotice,
    handleWoDetail
  } = useNotify();
  const { noticeItemClass, bottomPX, heightPX } = useStyle();
</script>
<style scoped lang="scss">
  .notify {
    @apply cursor-pointer flex h-full w-12.5 items-center justify-center box-border;
  }
  .notify:hover {
    @apply bg-[var(--xx-hover-bg-color)];
  }
  .notice-wrapper {
    position: fixed;
    // height: calc(100% - 54px);
    width: 440px;
    bottom: 0px;
    right: 0;
    z-index: 999999;
    overflow-y: auto;
    .notice-item-bj {
      background: url(data:image/png;base64,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)
        no-repeat center !important;
      .notice-btn {
        color: #f6504d !important;
      }
    }
    .notice-item-ts {
      background: url(data:image/png;base64,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)
        no-repeat center !important;
      .notice-btn {
        color: #44a8ff !important;
      }
    }
    .notice-item-by {
      background: url(data:image/png;base64,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)
        no-repeat center !important;
      color: #333333 !important;
      .notice-btn {
        color: #ffffff !important;
        background: linear-gradient(to right, #ffd830, #ffb700) !important;
      }
    }
    .notice-item {
      width: 100%;
      height: 162px;
      background: url(data:image/png;base64,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)
        no-repeat center;
      box-shadow: 0px 1px 7px 0px rgba(38, 38, 38, 0.2);
      border-radius: 4px;
      margin-bottom: 20px;
      color: #ffffff;
      padding: 24px 24px 20px 95px;
      position: absolute;
      .notice-title {
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 5px;
        display: flex;
        justify-content: space-between;
        .notice-close {
          font-weight: 500;
          font-size: 20px;
          cursor: pointer;
        }
      }
      .notice-desc {
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2; /* 这里是超出几行省略 */
        overflow: hidden;
      }
      .notice-btn {
        width: 82px;
        height: 36px;
        text-align: center;
        line-height: 36px;
        background: #ffffff;
        border-radius: 3px;
        font-size: 14px;
        cursor: pointer;
        float: right;
        margin-top: 14px;
        color: #44a8ff;
      }
    }
  }
</style>
<style lang="scss">
  .notify-popover {
    padding: 0 !important;

    .notify-tab {
      @apply;

      .notify-tab-header {
        @apply border-b-[var(--xx-secondary-bg-color)] border-solid flex border-b-width-1px h-46px px-20px justify-between items-center box-border;
        .notify-tab-title {
          @apply font-600 text-16px text-[#333333];
        }
        .notify-tab-option {
          @apply cursor-pointer text-[var(--xx-color-primary)] text-14px;
        }
      }

      .notify-infinite-list {
        @apply h-[400px] m-0 w-full p-0;

        .notify-infinite-list-item {
          @apply cursor-pointer flex w-full px-20px justify-center items-center box-border;

          .n-i-l-mark {
            @apply w-full;
            .el-badge__content {
              @apply top-1/2;
            }
          }

          .n-i-l-item {
            @apply flex flex-col w-full min-h-80px py-20px pr-5px justify-between items-start box-border;
            .n-i-l-item-title {
              @apply font-400 mb-8px text-14px text-[#333333] leading-5;
            }
            .n-i-l-item-date {
              @apply font-400 text-12px text-[#999999];
            }
          }
        }

        .notify-infinite-list-item:hover {
          @apply bg-[#F7F7F7];
        }

        .notify-infinite-list-item-active {
          // @apply bg-[#F7F7F7];
          .n-i-l-item-title {
            color: #999999 !important;
          }
        }
      }

      .notify-tab-all-data {
        @apply border-t-[var(--xx-secondary-bg-color)] border-solid cursor-pointer flex border-t-width-1px h-40px w-full justify-center items-center box-border;
      }
      .notify-tab-all-data:hover {
        @apply text-[var(--xx-color-primary)];
        .n-t-a-icon {
          @apply text-[var(--xx-color-primary)];
        }
      }

      .notify-tab-no-data {
      }
    }
  }

  .notify {
    .el-badge__content.is-fixed {
      transform: translateY(-50%) translateX(100%) scale(0.75);
    }
  }
</style>
