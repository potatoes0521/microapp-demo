/*
 * @LastEditors: 
 * @Description: ...
 * @Date: 2022-04-29 17:08:53
 * @LastEditTime: 2022-06-09 09:59:16
 * @Author: 
 */
import { getPunchState, punch } from '@/api/modules/ss/attend';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import useAuth from '@/hooks/useAuth';

export default function usePunch() {
  const showPunch = ref(false);

  /**
   * @Author: 
   * @Date: 2022-04-29 17:30:35
   * @description: 获取打卡状态
   * @param {*}
   * @return {*}
   */
  function checkPunchState() {
    getPunchState().then((res) => {
      console.log('🚀 > file: punch.js > line 16 > getPunchState > res', res.message, res.message.punchStatus, +res.message.punchStatus);
      if (+res.message.punchStatus !== 1) {
        showPunch.value = true;
      }
    });
  }
  const { auth } = useAuth();
  if (auth('punch', '/punch')) {
    checkPunchState();
  }

  /**
   * @Author: 
   * @Date: 2022-04-29 17:30:48
   * @description: 处理打卡
   * @param {*}
   * @return {*}
   */
  function handlePunch() {
    punch().then(() => {
      ElMessage.success('打卡成功');
      checkPunchState();
    });
  }
  return {
    showPunch,
    handlePunch
  };
}
