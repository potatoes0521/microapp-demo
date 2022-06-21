/*
 * @LastEditors: isboyjc
 * @Description: 公共方法
 * @Date: 2022-02-22 13:49:43
 * @LastEditTime: 2022-03-24 11:59:10
 * @Author: isboyjc
 */

const { toString } = Object.prototype;

export const is = (val, type) => toString.call(val) === `[object ${type}]`;

export const isDef = (val) => typeof val !== 'undefined';

export const isUnDef = (val) => !isDef(val);

export const isObject = (val) => val !== null && is(val, 'Object');

export const isNumber = (val) => is(val, 'Number');

export const isString = (val) => is(val, 'String');

export const isArray = (val) => val && Array.isArray(val);

export const isFunction = (val) => typeof val === 'function';

export const isPromise = (val) => is(val, 'Promise') && isObject(val) && isFunction(val.then) && isFunction(val.catch);

export const isBoolean = (val) => is(val, 'Boolean');

export const isRegExp = (val) => is(val, 'RegExp');

export const isDate = (val) => is(val, 'Date');

export const isNull = (val) => val === null;

export const isNullAndUnDef = (val) => isUnDef(val) && isNull(val);

export const isNullOrUnDef = (val) => isUnDef(val) || isNull(val);

export const isWindow = (val) => typeof window !== 'undefined' && is(val, 'Window');

export const isElement = (val) => isObject(val) && !!val.tagName;

export const isEmpty = (val) => {
  if (isArray(val) || isString(val)) return val.length === 0;

  if (val instanceof Map || val instanceof Set) return val.size === 0;

  if (isObject(val)) return Object.keys(val).length === 0;

  return false;
};

export const isServer = typeof window === 'undefined';

export const isClient = !isServer;

export const isUrl = (path) => {
  const reg =
    // eslint-disable-next-line no-useless-escape
    /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
  return reg.test(path);
};

// 获取元素是否在可视区域
export const isElementInViewport = (el, parentEl = document.documentElement) => {
  const rect = el.getBoundingClientRect();
  const parentRect = parentEl.getBoundingClientRect();
  return rect.top >= parentRect.top && rect.left >= parentRect.left && rect.bottom <= parentRect.bottom && rect.right <= parentRect.right;
};
