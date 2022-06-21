/*
 * @LastEditors: NiuNiu
 * @Description: ...
 * @Date: 2022-04-24 18:56:29
 * @LastEditTime: 2022-06-15 11:10:04
 * @Author: 
 */
import { queryMyNotice, noticeCount, noticeAllRead, requestPushAgain } from '@/api/modules/cc/notice';
import { useNotifyStore } from '@/store/notify';
import { getConfig } from '@/config';
import { routerPush } from '@/hooks/useMicro';
import useNotifyStrong from './useNoticeStrong';

export function useNotify() {
  const showPopover = ref(false);
  const pageNum = ref(1);
  const pageSize = ref(6);
  const totalNum = ref(0);
  const readNum = ref(0);
  const unreadNum = ref(0);
  const messageList = ref([]);
  const infiniteScrollEl = ref(null);
  const infiniteLoading = ref(false);
  const infiniteScrollDisabled = ref(false);
  const noData = ref(false);
  let ElNotificationInstan = null;

  const notifyStrong = useNotifyStrong(noticeCountFn, queryMyNoticeFn, messageList);

  const notifyStore = useNotifyStore();

  const targetPopover = ref(null);
  onClickOutside(targetPopover, () => (showPopover.value = false));

  async function initWs() {
    const webscoket = await notifyStore.webScoketInit(getConfig('wxMessageApi'));
    webscoket.subscribe('message', (data) => {
      console.log(data, 666);
      const dataParse = JSON.parse(data.data);
      const messageData = JSON.parse(dataParse.data);
      /**
       * 接口数据成功, 右下角显示弹框
       * noticeType: 1 系统消息, 2 计划任务
       * TODO: 2022-05-20 11:29:19 刘洋修改强提醒
       */
      if ([1, 2, 3].includes(messageData.noticeType)) {
        ElNotificationInstan && ElNotificationInstan.close();
        ElNotificationInstan = ElNotification({
          title: '消息',
          message: messageData.title,
          position: 'bottom-right'
        });
      } else {
        notifyStrong.getStrongMessage({
          messageData,
          dataParse
        });
      }

      pageNum.value = 1;
      messageList.value = [];
      // 消息列表加载
      queryMyNoticeFn();
      // 已读未读统计
      noticeCountFn();
    });
  }

  // 消息列表加载
  async function queryMyNoticeFn() {
    infiniteScrollDisabled.value = false;
    infiniteLoading.value = true;
    const res = await queryMyNotice({
      pageNum: pageNum.value,
      pageSize: pageSize.value
    });
    infiniteLoading.value = false;
    totalNum.value = res.data.totalNum;
    noData.value = totalNum.value <= 0;
    if (res.data.rows && res.data.rows.length) {
      pageNum.value++;
      messageList.value = messageList.value.concat(res.data.rows);
      console.log(messageList, 555);
    } else {
      infiniteScrollDisabled.value = true;
    }
  }

  // 已读未读统计
  async function noticeCountFn() {
    const res = await noticeCount();
    readNum.value = res.data.readNum;
    unreadNum.value = res.data.unreadNum;
  }

  // 全部已读
  async function toAllList() {
    showPopover.value = false;
    routerPush(`/qishi-cc/notifylist`);
  }

  // 去详情
  async function toDetail(item, index) {
    routerPush('/qishi-cc/notifydetail', {
      id: item.id
    });
    messageList.value[index].readStatus = 1;
    showPopover.value = false;
    // setTimeout(() => noticeCountFn(), 1000);
    noticeCountFn();
  }

  // 全部已经读
  async function noticeAllReadFn() {
    await noticeAllRead();
    pageNum.value = 1;
    messageList.value = [];
    // 消息列表加载
    await queryMyNoticeFn();
    // 已读未读统计
    await noticeCountFn();
  }

  async function init() {
    // 初始化ws
    await initWs();
    // 初次消息列表加载
    await queryMyNoticeFn();
    // 重推通知失败的消息
    await requestPushAgain();
    // 已读未读统计
    await noticeCountFn();
  }

  onMounted(() => {
    init();
  });

  return {
    showPopover,
    pageNum,
    pageSize,
    totalNum,
    readNum,
    unreadNum,
    messageList,
    infiniteScrollEl,
    infiniteLoading,
    infiniteScrollDisabled,
    noData,
    targetPopover,

    noticeCountFn,
    queryMyNoticeFn,
    toAllList,
    toDetail,
    noticeAllReadFn,

    ...notifyStrong
  };
}
