/*
 * @LastEditors: 
 * @Description: ...
 * @Date: 2022-04-11 14:58:49
 * @LastEditTime: 2022-06-15 16:59:33
 * @Author: 
 */
import _differenceBy from 'lodash/differenceBy';

export const whiteList = ['/login', '/500', '/403', '/sso'];

export const getDefaultRouter = (RouterList) => {
  const whiteListMap = whiteList.map((item) => ({
    path: item
  }));
  const arr = _differenceBy([...RouterList], whiteListMap, 'path')[0] || {};
  let defaultRouter = arr.path;
  if (arr.children) {
    defaultRouter = arr.children[0].path;
  }
  return defaultRouter;
};
