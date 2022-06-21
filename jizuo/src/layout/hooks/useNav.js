/*
 * @LastEditors: 
 * @Description: navber hooks
 * @Date: 2022-03-06 19:54:20
 * @LastEditTime: 2022-03-11 14:41:30
 * @Author: 
 */
// import { storeToRefs } from 'pinia'; 解构
import { useLayout } from './useLayout';
import { useSystemStore } from '@/store/system';

export function useNav() {
  const { isCollapse } = useLayout();
  // userinfo

  // translate
  const { locale } = useI18n();
  const systemStore = useSystemStore();
  // 校验是否为某语言
  const isI18nLocale = (i18n) => systemStore.getI18n === i18n;
  const i18nLocale = computed({
    get: () => {
      return systemStore.getI18n;
    },
    set: (i18n) => {
      locale.value = i18n;
      systemStore.setI18n(i18n);
    }
  });

  // theme
  // systemStore.isFollow
  // systemStore.getTheme
  const switchTheme = (th) => {
    if (!th) {
      if (systemStore.isFollow) {
        th = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      } else {
        th = systemStore.getTheme === 'light' ? 'dark' : 'light';
        systemStore.setTheme(th);
      }
    } else {
      systemStore.setTheme(th);
    }

    [...document.documentElement.classList].map((v) => document.documentElement.classList.remove(v));
    if (systemStore.isFollow) th = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', th);
    document.documentElement.classList.add(th);
  };
  switchTheme(systemStore.getTheme);

  const logout = () => { };

  return {
    logout,
    isCollapse,
    // translate
    i18nLocale,
    isI18nLocale,
    // theme
    switchTheme,
    theme: storeToRefs(systemStore).getTheme,
    isFollow: storeToRefs(systemStore).isFollow
  };
}
