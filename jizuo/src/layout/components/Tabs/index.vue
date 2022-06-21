<template>
  <div class="tabs-container">
    <!-- tabs盒子 -->
    <div ref="tabsBoxRefs" class="tabs-box">
      <div
        v-for="item of cachesTabs"
        :key="item.id"
        :ref="setTabsItemRef"
        class="tabs-item"
        :class="{ 'tabs-item-active': item.id === currentTab.id }"
        :title="item.name"
        @click.prevent="activeTabs(item)"
        @click.right.prevent="(e) => rightClickTabs(e, item)"
      >
        {{ item.name }}
        <icon-ep-close v-if="cachesTabs.length > 1" class="tab-close-icon" @click.stop="removeTabs(item)" />
      </div>
    </div>
    <!-- 右侧按钮 -->
    <div class="tabs-right">
      <!-- 滚动隐藏菜单更多选项 -->
      <el-dropdown v-if="isShowHiddenTabs" trigger="hover" class="dropdown-tabmore" placement="bottom-start">
        <div v-if="isShowHiddenTabs" class="tabs-right-btn">
          <icon-ep-more class="text-[var(--xx-text-color-primary)] text-12px" />
        </div>
        <template #dropdown>
          <el-dropdown-menu class="dropdown-tabmore-box">
            <el-dropdown-item
              v-for="item in hiddenTabs"
              :key="item.id"
              class="dropdown-tabmore-item"
              :class="{ 'is-disabled': item.disabled }"
              @click="hiddenTabsMenusClick(item)"
            >
              <!-- <component :is="iconMenus[item.icon]" :key="key" class="dropdown-tabmore-icon" /> -->
              {{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 刷新选项 -->
      <!-- <div class="tabs-right-btn" @click="refreshCurrentTab">
        <icon-ep-refresh class="text-[var(--xx-text-color-primary)] text-12px" :class="{ 'animate-spin': isLoading }" />
      </div> -->
      <!-- 当前tab菜单操作 - 同右键 -->
      <el-dropdown trigger="click" class="dropdown-tabmenus" placement="bottom-start">
        <div class="tabs-right-btn">
          <icon-ep-arrow-down class="text-[var(--xx-text-color-primary)] text-12px" />
        </div>
        <template #dropdown>
          <el-dropdown-menu class="dropdown-tabmenus-box">
            <el-dropdown-item
              v-for="(item, key) in rightMenusOperationItems"
              :key="key"
              class="dropdown-tabmenus-item"
              :class="{ 'is-disabled': item.disabled }"
              @click="rightMenusItemClick(item)"
            >
              <component :is="iconMenus[item.icon]" :key="key" class="dropdown-tabmenus-icon" />
              {{ item.text }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 区域放大缩小 -->
      <div class="tabs-right-btn" @click="contentRegionToggle">
        <icon-ri-fullscreen-line v-if="!contentRegionIsFullscreen" class="text-[var(--xx-text-color-primary)] text-12px" />
        <icon-ri-fullscreen-exit-line v-else class="text-[var(--xx-text-color-primary)] text-12px" />
      </div>
    </div>

    <!-- 右键菜单 -->
    <transition name="el-zoom-in-top">
      <ul v-show="rightMenusVisible" :key="Math.random()" ref="rightMenusRefs" :style="getRightMenuStyle" class="right-menus">
        <div
          v-for="(item, key) in rightMenusOperationItems.filter((v) => !v.disabled)"
          :key="key"
          class="right-menus-item"
          :class="{ 'is-disabled': item.disabled }"
        >
          <li class="right-menus-item-box" @click="rightMenusItemClick(item)">
            <component :is="iconMenus[item.icon]" :key="key" class="right-menus-item-icon" />
            {{ item.text }}
          </li>
        </div>
      </ul>
    </transition>
  </div>
</template>

<script setup>
  import iconMenus from '@/assets/iconMenus';
  import { useTabs } from '../../hooks/useTabs';

  const {
    isLoading,
    currentTab,
    cachesTabs,
    tabsBoxRefs,
    setTabsItemRef,
    // addTabs,
    activeTabs,
    rightClickTabs,
    removeTabs,
    rightMenusVisible,
    getRightMenuStyle,
    rightMenusOperationItems,
    rightMenusRefs,
    rightMenusItemClick,
    refreshCurrentTab,
    hiddenTabs,
    isShowHiddenTabs,
    hiddenTabsMenusClick,
    contentRegionIsFullscreen,
    contentRegionToggle
  } = useTabs();
</script>
<style scoped lang="scss">
  .tabs-container {
    @apply flex items-center select-none;
    .tabs-box::-webkit-scrollbar {
      display: none;
    }
    .tabs-box {
      // @apply w-[calc(100%-152px)] h-full flex items-end overflow-y-hidden overflow-x-auto;
      @apply w-[calc(100%-114px)] h-full flex items-end overflow-y-hidden overflow-x-auto;

      .tabs-item {
        @apply flex-shrink-0 relative h-30px max-w-120px min-w-90px truncate leading-30px pl-2 pr-5 ml-2 text-[12px] text-[var(--xx-text-color-regular)] border-solid border-width-[1px] border-[var(--xx-secondary-bg-color)] border-b-w-0px cursor-pointer box-border rounded-tl-[6px] rounded-tr-[6px] shadow-[var(--xx-box-shadow-light)];
        .tab-close-icon {
          @apply hidden absolute right-6px top-[9px] text-[var(--xx-text-color-placeholder)] text-10px;
        }
      }
      .tabs-item:hover {
        @apply;
        .tab-close-icon {
          @apply block;
        }
      }
      .tabs-item-active {
        @apply bg-[var(--xx-secondary-bg-color)] text-[var(--xx-text-color-primary)];
        .tab-close-icon {
          @apply block;
        }
      }
    }
    .tabs-right {
      // @apply w-152px h-full flex justify-end items-center;
      @apply w-114px h-full flex justify-end items-center;
      .tabs-right-btn {
        @apply cursor-pointer w-38px h-38px flex justify-center items-center border-l-w-1px border-[var(--xx-secondary-bg-color)] border-solid;
      }
    }
  }
  .tabs-item,
  .tabs-right-btn,
  .tab-close-icon {
    transition: var(--xx-transition-all);
  }
  .right-menus {
    @apply absolute py-5px box-border bg-[var(--xx-bg-color)] z-1000;
    box-shadow: var(--xx-box-shadow-light);
    .right-menus-item {
      @apply w-[100%] h-30px px-10px box-border cursor-pointer text-[var(--xx-text-color-regular)];
      .right-menus-item-box {
        @apply w-full h-full text-12px flex items-center;
        .right-menus-item-icon {
          @apply text-10px mr-10px;
        }
      }
    }
    .right-menus-item:not(.is-disabled):hover {
      @apply bg-[var(--el-color-primary-light-9)] text-[var(--el-color-primary-light-3)];
    }
  }
</style>

<style lang="scss">
  .dropdown-tabmenus-box {
    .dropdown-tabmenus-item {
      @apply w-full h-30px px-10px box-border text-12px text-[var(--xx-text-color-regular)] flex items-center;
      .dropdown-tabmenus-icon {
        @apply text-10px mr-10px;
      }
    }
  }
  .right-menus .is-disabled,
  .dropdown-tabmenus-box .is-disabled {
    color: var(--xx-text-color-placeholder) !important;
    cursor: not-allowed !important;
    background: var(--xx-secondary-bg-color) !important;
  }
</style>
