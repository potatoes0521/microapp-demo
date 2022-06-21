/*
 * @LastEditors: 
 * @Description: sidebar hooks
 * @Date: 2022-03-06 19:54:20
 * @LastEditTime: 2022-03-07 13:41:45
 * @Author: 
 */
import { useLayout } from './useLayout';

export function useSidebar() {
  const { isCollapse } = useLayout();

  return {
    isCollapse
  };
}
