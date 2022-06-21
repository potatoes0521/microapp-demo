/*
 * @LastEditors: liu yang
 * @Description: ...
 * @Date: 2022-01-26 18:11:38
 * @LastEditTime: 2022-06-21 13:43:20
 * @Author:
 */
import { useRoute } from 'vue-router';

export default function useAuth() {
  const route = useRoute();
  const auth = (value, currentPath) => {
    return Array.isArray(value) ? value.map((v) => isCheck(currentPath || route, v)) : isCheck(currentPath || route, value);
  };

  return {
    auth
  };
}

const isCheck = (route, key) => {
  let authList = getSession('authList');
  if (!authList) return;
  if (!route) return false;

  let path = '';
  if (typeof route === 'string') {
    path = route;
  } else {
    path = route.path;
  }

  // 校验页面base-默认功能单元 不存在直接返回false
  if (authList.findIndex((v) => v.slice(-`${path}/base`.length) === `${path}/base`) === -1) return false;

  if (!key) return false;
  const keyStr = `${path}/${key}`;

  return authList.findIndex((v) => v.slice(-keyStr.length) === keyStr) !== -1;
};
