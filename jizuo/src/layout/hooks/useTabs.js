/*
 * @LastEditors: 
 * @Description: tabs 方法
 * @Date: 2022-03-22 18:22:12
 * @LastEditTime: 2022-04-25 18:49:50
 * @Author: 
 */
import { isElementInViewport } from '@/utils/index';
import { useCachesTabsStore } from '@/store/tabs';
import { TransitionPresets } from '@vueuse/core';
import { routerPush } from '@/hooks/useMicro';

// ------- tabs右侧全屏操作 -------
const contentRegionRefs = ref(null);
const { isFullscreen: contentRegionIsFullscreen, toggle: contentRegionToggle } = useFullscreen(contentRegionRefs);
const currentTab = ref({});

export function useTabs() {
  // ------- tabs项操作 -------
  const cachesTabsStore = useCachesTabsStore();
  const tabsBoxRefs = ref(null);
  const { x, y, isScrolling } = useScroll(tabsBoxRefs);
  let tabsItemRefs = ref([]);
  const setTabsItemRef = (el) => (el ? tabsItemRefs.value.push(el) : null);

  // 点击tab菜单项
  const activeTabs = (data, noJump) => {
    if (data.id === currentTab.value?.id) return;
    currentTab.value = data;
    const pathArr = window.location.pathname.match(/\/qishi-.+/);
    const curRouterPath = pathArr ? pathArr[0].replace(/\/$/, '') : '/';
    console.log(`/qishi-${data.ssCode + data.fullPath}`, curRouterPath);
    if (curRouterPath !== `/qishi-${data.ssCode + data.fullPath}` && !noJump) {
      routerPush(`/qishi-${data.ssCode + data.fullPath}`);
    }
  };
  // 添加tabs菜单项
  const addTabs = (data, noJump) => {
    if (cachesTabsStore.cachesTabs.length >= 20) return console.log('最多储存20个页面');
    activeTabs(data, noJump);
    cachesTabsStore.addCachesTabs(data);
  };
  // 删除tabs菜单项
  const removeTabs = (data, noJump) => {
    console.log('removeTabs', data);
    if (cachesTabsStore.cachesTabs.length <= 1) return console.log('删除失败，至少保留一个菜单项');
    cachesTabsStore.removeCachesTabs(data);
    nextTick(() => {
      if (currentTab.value.id === data.id && !noJump) {
        activeTabs(cachesTabsStore.cachesTabs[0]);
      }
    });
  };
  const isLoading = ref(false);
  // 刷新当前TabsMenu页面
  const refreshCurrentTab = async () => {
    isLoading.value = true;
    let item = {};
    if (rightMenusCurrentTab.value) {
      item = rightMenusCurrentTab.value;
    } else {
      item = currentTab.value;
    }
    const idx = cachesTabsStore.cachesTabs.findIndex((v) => v.id === item.id);
    console.log('refreshCurrentTab', idx, item);
    // window.location.reload();

    // 延迟加载
    useTimeoutFn(() => {
      isLoading.value = false;
    }, 2000);
  };

  // ------- tabs隐藏菜单项操作 -------
  // 当前隐藏的tabs菜单项
  const hiddenTabs = ref([]);
  const isShowHiddenTabs = computed(() => hiddenTabs.value.length > 0);
  // 刷新当前隐藏的tabs菜单项
  const hiddenTabsMenusRefresh = () => {
    let htArr = [];
    tabsItemRefs.value.map((el, i) => {
      if (!isElementInViewport(el, tabsBoxRefs.value)) {
        htArr.push(cachesTabsStore.cachesTabs[i]);
      }
    });
    hiddenTabs.value = htArr;
    // console.log('hiddenTabsMenusRefresh!!!!!', hiddenTabs.value);
  };
  // 隐藏tabs菜单项点击
  const hiddenTabsMenusClick = (item) => {
    const idx = cachesTabsStore.cachesTabs.findIndex((v) => v.id === item.id);
    const curEl = tabsItemRefs.value[idx];
    const curElRect = curEl.getBoundingClientRect();
    const toX = ref(x.value);
    const toXValue = useTransition(toX, {
      duration: 500,
      transition: TransitionPresets.easeOutExpo
    });

    // 计算滚动位置赋值
    toX.value = curElRect.width * idx;
    const unwatchFn = watch(toXValue, (data) => {
      tabsBoxRefs.value.scrollTo(data, y);
    });
    setTimeout(() => unwatchFn(), 1000);
    activeTabs(cachesTabsStore.cachesTabs[idx]);
  };
  // 监听tabs以及tabs容器滚动
  watch(
    [() => cachesTabsStore.cachesTabs, isScrolling],
    () => {
      nextTick(() => {
        hiddenTabsMenusRefresh();
      });
    },
    {
      deep: true,
      immediate: true
    }
  );
  // 挂载时监听窗口改变 - 刷新当前隐藏的tabs菜单项
  onMounted(() => {
    window.addEventListener(
      'resize',
      useThrottleFn(() => hiddenTabsMenusRefresh(), 1000)
    );
  });
  // 卸载前删除监听窗口改变
  onBeforeUnmount(() => {
    window.removeEventListener(
      'resize',
      useThrottleFn(() => hiddenTabsMenusRefresh(), 1000)
    );
  });
  // 更新前置空tab项refs元素
  onBeforeUpdate(() => {
    tabsItemRefs.value = [];
  });

  // ------- tabs右键菜单操作 -------
  // 右键菜单显示隐藏
  const rightMenusVisible = ref(false);
  // 右键菜单元素
  const rightMenusRefs = ref(null);
  // 右键菜单位置
  const rightMenusLeft = ref(0);
  const rightMenusTop = ref(0);
  // 当前右键选中菜单项
  const rightMenusCurrentTab = ref(null);
  // 右键菜单显示项
  const rightMenusOperationItems = computed(() => {
    const { t } = useI18n();
    // 处理非当前项右键点击、右侧下拉点击后选项
    let item = {};
    if (rightMenusCurrentTab.value) {
      item = rightMenusCurrentTab.value;
    } else {
      item = currentTab.value;
    }
    const idx = cachesTabsStore.cachesTabs.findIndex((v) => v.id === item.id);
    let disableds = [];
    if (idx === 0) {
      disableds.push('closeLeft');
    }
    if (idx === cachesTabsStore.cachesTabs.length - 1) {
      disableds.push('closeRight');
    }
    if (cachesTabsStore.cachesTabs.length === 1) {
      disableds.push('closeOther', 'closeAll', 'close');
    }

    return [
      // {
      //   type: 'refresh',
      //   icon: 'IconEpRefresh',
      //   text: t('buttons.reload'),
      //   disabled: false
      // },
      {
        type: 'close',
        icon: 'IconEpClose',
        text: t('buttons.closeCurrentTab'),
        disabled: false
      },
      {
        type: 'closeLeft',
        icon: 'IconRadixIconsPinLeft',
        text: t('buttons.closeLeftTabs'),
        disabled: false
      },
      {
        type: 'closeRight',
        icon: 'IconRadixIconsPinRight',
        text: t('buttons.closeRightTabs'),
        disabled: false
      },
      {
        type: 'closeOther',
        icon: 'IconAntDesignSplitCellsOutlined',
        text: t('buttons.closeOtherTabs'),
        disabled: false
      }
      // {
      //   type: 'closeAll',
      //   icon: 'IconMdiValveClosed',
      //   text: t('buttons.closeAllTabs'),
      //   disabled: false
      // }
    ].map((v) => {
      if (disableds.findIndex((j) => j === v.type) > -1) {
        v.disabled = true;
      }
      return v;
    });
  });
  // 获取右键菜单位置样式
  const getRightMenuStyle = computed(() => {
    return { left: `${rightMenusLeft.value}px`, top: `${rightMenusTop.value}px` };
  });
  // tabs右键点击
  const rightClickTabs = (e, item) => {
    // console.log('rightClickTabs', e, item);
    rightMenusCurrentTab.value = item;
    rightMenusVisible.value = true;
    rightMenusLeft.value = e.pageX;
    rightMenusTop.value = e.pageY;
  };
  // 右键菜单外部点击回调函数
  const rightMenusClickOutsideFn = () => {
    rightMenusVisible.value = false;
    rightMenusCurrentTab.value = null;
  };
  // 监听元素外部的点击
  onClickOutside(rightMenusRefs, rightMenusClickOutsideFn);
  // 右键菜单选中某项点击
  const rightMenusItemClick = (rightMenusItem) => {
    let item = {};
    if (rightMenusCurrentTab.value) {
      item = rightMenusCurrentTab.value;
    } else {
      item = currentTab.value;
    }
    let idx = cachesTabsStore.cachesTabs.findIndex((v) => v.id === item.id);
    switch (rightMenusItem.type) {
      case 'refresh':
        refreshCurrentTab();
        break;
      case 'close':
        removeTabs(item);
        break;
      case 'closeLeft':
        while (idx > 0) {
          idx--;
          removeTabs(cachesTabsStore.cachesTabs[idx]);
        }
        break;
      case 'closeRight':
        while (cachesTabsStore.cachesTabs.length - 1 > idx) removeTabs(cachesTabsStore.cachesTabs[cachesTabsStore.cachesTabs.length - 1]);
        break;
      case 'closeOther':
        cachesTabsStore.cachesTabs.map((v, i) => (i !== idx ? removeTabs(v) : null));
        break;
      case 'closeAll':
        cachesTabsStore.cachesTabs.map((v) => removeTabs(v));
        break;
      default:
      // console.log('rightMenusItemClick', rightMenusItem);
    }
    // 关闭菜单
    rightMenusClickOutsideFn();
  };

  const { cachesTabs } = storeToRefs(cachesTabsStore);
  return {
    // tabs操作
    isLoading,
    currentTab,
    cachesTabs,
    tabsBoxRefs,
    tabsItemRefs,
    setTabsItemRef,
    addTabs,
    activeTabs,
    rightClickTabs,
    removeTabs,
    refreshCurrentTab,
    // 右键菜单操作
    rightMenusVisible,
    rightMenusOperationItems,
    getRightMenuStyle,
    rightMenusRefs,
    rightMenusItemClick,
    // 隐藏菜单项操作
    hiddenTabs,
    isShowHiddenTabs,
    hiddenTabsMenusClick,
    // tabs右侧全屏操作
    contentRegionRefs,
    contentRegionIsFullscreen,
    contentRegionToggle
  };
}
