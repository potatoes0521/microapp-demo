/*
 * @LastEditors: isboyjc
 * @Description: log
 * @Date: 2022-02-25 11:30:31
 * @LastEditTime: 2022-04-20 10:42:15
 * @Author: isboyjc
 */

export function logRed(name, ...arg) {
  console.log(`%c[${name}]`, 'color: red; font-style: italic', '\n', ...arg);
}

export function logGreen(name, ...arg) {
  console.log(`%c[${name}]`, 'color: green; font-style: italic', '\n', ...arg);
}

export function logYellow(name, ...arg) {
  console.log(`%c[${name}]`, 'color: yellow; font-style: italic', '\n', ...arg);
}

export const log = logRed;
