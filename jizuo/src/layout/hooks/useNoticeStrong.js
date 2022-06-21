/*
 * @LastEditors: 
 * @Description: 移植改造牛哥的强提醒
 * @Date: 2022-05-23 10:31:55
 * @LastEditTime: 2022-06-01 16:57:23
 * @Author: 
 */
import _orderBy from 'lodash/orderBy';
import { ElMessage } from 'element-plus';
import { routerPush } from '@/hooks/useMicro';
import { claimTask } from '@/api/modules/wo/instance';
import { noticeRead } from '@/api/modules/cc/notice';

export default function useNotifyStrong(noticeCountFn, queryMyNoticeFn, messageList) {
  let orderBj = 0;
  const noticeStrong = ref([]);
  let noticeStrongBj = [];
  let noticeStrongOther = [];

  function getStrongMessage({ messageData, dataParse }) {
    if (messageData.noticeType === 4 && dataParse.status !== 4) {
      // TODO: 这里是移植牛哥的强提醒  具体业务逻辑咨询牛哥
      // 0-报警救援、1-业务办理、2-投诉（营运类）、3-表扬
      const ifS = noticeStrong.value.map((v) => v.noticeId).includes(messageData.noticeId);
      if (!ifS) {
        if (messageData.busType === 0) {
          orderBj += 1;
          noticeStrongBj.unshift({
            ...messageData,
            order: orderBj
          });
          noticeStrongBj = _orderBy(noticeStrongBj, 'order');
        } else {
          noticeStrongOther.unshift({
            ...messageData
          });
        }
        // 排序
        noticeStrong.value = [...noticeStrongOther, ...noticeStrongBj];
      }
    } else if (messageData.noticeType === 4 && dataParse.status === 4) {
      deleteNotice(messageData);
    }
  }

  //  移植强提醒 -------
  /**
   * @Author: 
   * @Date: 2022-05-23 10:15:31
   * @description: 删除并且删除小铃铛里面的
   * @param {*} v
   */
  function deleteNotice(v) {
    // 强提醒弹框
    if (v.busType === 0) {
      noticeStrongBj.splice(
        noticeStrongBj.findIndex((item) => item.noticeId === v.noticeId),
        1
      );
    } else {
      noticeStrongOther.splice(
        noticeStrongOther.findIndex((item) => item.noticeId === v.noticeId),
        1
      );
    }
    noticeStrong.value.splice(
      noticeStrong.value.findIndex((item) => item.noticeId === v.noticeId),
      1
    );
    queryMyNoticeFn();
    noticeCountFn();
  }
  /**
   * @Author: 
   * @Date: 2022-05-23 10:45:26
   * @description: 删除强提醒的显示
   * @param {*} v
   * @return {*}
   */
  function closeNotice(v) {
    if (v.busType === 0) {
      const index = noticeStrongBj.findIndex((item) => item.noticeId === v.noticeId);
      noticeStrongBj.splice(index, 1);
    } else {
      const index = noticeStrongOther.findIndex((item) => item.noticeId === v.noticeId);
      noticeStrongOther.splice(index, 1);
    }
    const index = noticeStrong.value.findIndex((item) => item.noticeId === v.noticeId);
    noticeStrong.value.splice(index, 1);
    // 已读
    noticeReadFn(v);
  }
  function noticeReadFn(v) {
    noticeRead({
      id: v.noticeId
    }).then(() => {
      // 小铃铛已读
      const index = messageList.value.findIndex((k) => k.id === v.noticeId);
      console.log('消息列表', messageList.value, index, v.noticeId);
      if (index || index === 0) {
        if (messageList.value && messageList.value.length && messageList.value[index]?.readStatus) {
          messageList.value[index].readStatus = 1;
        }
      }
      noticeCountFn();
    });
  }
  function handleWoDetail(v) {
    noticeReadFn(v);
    claimTaskFn(v);
  }

  function claimTaskFn(v) {
    claimTask({
      taskIds: v.busId
    }).then(({ data: { jump, taskList } }) => {
      if (jump) {
        // 跳转到详情页面
        routerPush(`/qishi-wo/wodetail`, {
          workOrderNo: taskList[0].workOrderNo,
          currTaskId: taskList[0].taskId,
          source: 'todo',
          type: 'banli',
          openSource: 'notice'
        });
      } else {
        // 不跳
        ElMessage.error('工单已处理');
      }
      // 跳不跳都删除强提醒
      closeNotice(v);
    });
  }
  //  强提醒 --------

  return {
    getStrongMessage,
    handleWoDetail,
    noticeStrong,
    closeNotice
  };
}
