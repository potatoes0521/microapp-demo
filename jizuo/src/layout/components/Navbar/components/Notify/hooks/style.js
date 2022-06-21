/*
 * @LastEditors: 
 * @Description: ...
 * @Date: 2022-05-20 11:01:08
 * @LastEditTime: 2022-05-20 11:04:46
 * @Author: 
 */

export default function useStyle() {
  const noticeClassList = {
    0: 'notice-item-bj',
    2: 'notice-item-ts',
    3: 'notice-item-by'
  };
  function noticeItemClass(busType) {
    return noticeClassList[busType];
  }

  function bottomPX(i) {
    return `bottom:${i * 10}px`;
  }

  function heightPX(length) {
    return `height:${162 + length * 10}px`;
  }

  return {
    noticeItemClass,
    bottomPX,
    heightPX
  };
}
