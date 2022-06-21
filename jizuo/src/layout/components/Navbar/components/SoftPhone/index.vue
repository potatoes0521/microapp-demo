<template>
  <div v-if="isShow" class="soft-phone-control-wrapper">
    <!--  软电话下拉 -->
    <div class="soft-phone-control-item">
      <SelectBox
        :proposal-button="proposalButton"
        :leave-reason-settings="leaveReasonSettings"
        :agent-work-mode="agentWorkMode"
        :work-mode-settings="workModeSettings"
        :cur-state-i-d="curStateID"
        :cur-state-name="curStateName"
        :ins="ins"
        :time-length="timeLength"
        :user-phone="userPhone"
        :tel-type="telType"
        :tel-nos="telNos"
        @login="loginFn"
        @leaveFn="leave"
        @reinstatement="callSPFunction(34)"
        @reduction="reduction"
        @setWorkMode="setWorkMode"
      ></SelectBox>
    </div>
    <!--  在线人数 -->
    <div v-if="isLogin === 2" class="soft-phone-control-item"><PeopleNumButton :queue-list="queueList"></PeopleNumButton></div>
    <!--  软电话接听/挂断按钮 -->
    <div v-if="isLogin === 2" class="soft-phone-control-item">
      <ConversationButton
        :cur-state-i-d="curStateID"
        :proposal-button="proposalButton"
        @answer="callSPFunction(42)"
        @hangUp="callSPFunction(10)"
        @complete="callSPFunction(31)"
      ></ConversationButton>
    </div>
    <!--  软电话功能按钮条 -->
    <div v-if="isLogin === 2" class="soft-phone-control-item">
      <PhoneControlButton
        :agent-work-mode="agentWorkMode"
        :is-mute="isMute"
        :is-auto-answer="isAutoAnswer"
        :proposal-button="proposalButton"
        :transfer-sub-items="transferSubItems"
        :tel-type="telType"
        @monitor="callSPFunction(5)"
        @cancelMonitor="callSPFunction(24)"
        @cancelMonitorPreparation="callSPFunction(39)"
        @endListening="callSPFunction(28)"
        @forcedDemolition="callSPFunction(25)"
        @strongBlock="callSPFunction(26)"
        @strongInsertion="callSPFunction(27)"
        @leaveTheChair="callSPFunction(48)"
        @consultTransfer="callSPFunction(15)"
        @endConsultation="callSPFunction(14)"
        @helTransferOut="callSPFunction(21)"
        @endHelp="callSPFunction(22)"
        @keepTheOutsideLine="callSPFunction(20)"
        @getTheOutsideLineBack="callSPFunction(23)"
        @cancelEndConsultation="callSPFunction(13)"
        @externalConsultation="callSPFunction(8)"
        @internalConsultation="callSPFunction(7)"
        @keepConsultation="callSPFunction(16)"
        @cancelKeepConsultation="callSPFunction(18)"
        @qutwardDialing="callSPFunction(3)"
        @qutwardDialingGetReady="callSPFunction(38)"
        @cancelQutwardDialing="callSPFunction(12)"
        @internalCall="callSPFunction(4)"
        @internalCallGetReady="callSPFunction(40)"
        @cancelInternalCall="callSPFunction(35)"
        @keep="callSPFunction(6)"
        @cancelKeep="callSPFunction(11)"
        @monitorControl="callSPFunction(68)"
        @setMute="setMute"
        @autoAnswer="setAutoAnswer"
        @transferSubItemClick="transferSubItemClick"
        @changeKey="dialFn"
      ></PhoneControlButton>
    </div>
    <DialogAgentList ref="DialogAgentList" :agent-list-type="agentListType" :agent-list="agentList"></DialogAgentList>
    <DialogMonitorControl ref="DialogMonitorControl" :agent-list-type="agentListType" :agent-list="agentList"></DialogMonitorControl>
  </div>
</template>

<script>
  import SoftPhoneExternal from './utils/external';
  import { getConfig } from '@/config';
  import { getSoftphone } from '@/api/modules/cc/softPhone';
  import { addHistory, updateHistory, serHistory } from '@/api/modules/cc/call';
  import { lossCallBack } from '@/api/modules/cc/lossLog';
  import { mapState, mapActions } from 'pinia';
  import { useUserStore } from '@/store/user';
  import { useSoftphoneStore } from '@/store/softphone';
  import SelectBox from './components/SelectBox.vue';
  // let userList = ['001', '002', '003']
  // let user = userList[Math.floor(Math.random() * userList.length)]
  import { defineAsyncComponent } from 'vue';

  import asyncQueue from '@/utils/asyncQueue';
  import { routerPush } from '@/hooks/useMicro';

  export default {
    name: 'SoftPhone',
    data() {
      return {
        autoLogin: false,
        callPopup: null,
        isShow: false,
        agentId: '',
        agentName: '',
        agentWorkMode: 0,
        ins: 'INS_WAIT_FOR_DISPATCH',
        delegatorId: '',
        curStateID: '', // 当前状态ID
        curStateName: '', // 当前状态Name
        wsServerIp: '',
        objectName: 'spui',
        devType: 'EXT', // EXT 或者PSTN
        serverUri: getConfig('baseSoftPhoneSocket'),
        serverUri2: '',
        divId: 'div_softphonecontainer',
        workModeSettings: null, // 工作模式按钮数组
        leaveReasonSettings: null, // 离席按钮数组
        transferSubItems: null, // 转接按钮数组
        customInitParams: null,
        autoReconnect: true,
        saveLocalLog: true,
        isAutoAnswer: false, // 自动应答
        softPhoneCode: '',
        showStateTimeLength: true, // 显示状态持续时长
        timeLength: '', // 持续时常
        isConnectIpt: true, // 连接ipt服务
        tryConnectionServer: false, // 是否尝试重新连接Server
        tryConnectIpt: false, // 是否尝试重新连接Server
        isWorking: false, // 工作状态
        timerSource: null, // 定时器
        showUserPhone: true, // 用户手机是否显示
        userPhone: '', // 用户手机
        loginType: false, // false-未登录 true-已登录
        proposalButton: [], // 建议按钮列表
        queueList: [], // 等待队列
        isMute: false, // 是否是静音状态
        agentListType: '',
        agentList: [],
        telType: '0', // 0-自动注册 1-IP话机
        telNos: [] // IP话机列表
      };
    },
    components: {
      // 软电话下拉
      SelectBox,
      // 在线人数
      PeopleNumButton: defineAsyncComponent(() => import('./components/PeopleNumButton.vue')),
      // 软电话接听按钮
      ConversationButton: defineAsyncComponent(() => import('./components/ConversationButton.vue')),
      // 软电话功能按钮条
      PhoneControlButton: defineAsyncComponent(() => import('./components/PhoneControlButton.vue')),
      // 坐席列表弹框
      DialogAgentList: defineAsyncComponent(() => import('./components/DialogAgentList.vue')),
      // 班长控制弹框
      DialogMonitorControl: defineAsyncComponent(() => import('./components/DialogMonitorControl.vue'))
    },
    computed: {
      ...mapState(useUserStore, ['userInfo']),
      // 是否显示登录/退出 1-登录 2-登出 -1-不显示
      isLogin() {
        if (this.proposalButton.some((v) => v.id === 1 && v.enabled)) return 1;
        if (this.proposalButton.some((v) => v.id === 2 && v.enabled)) return 2;
        return -1;
      }
    },
    watch: {
      userInfo(n) {
        if (n) this.init();
      }
    },
    mounted() {
      this.init();
      // 测试软电话来电接听弹框
      // setTimeout(() => {
      //   this.callPopup = this.$call({ phone: "13800138000" });
      // }, 5000);
      // setTimeout(() => {
      //   if (this.callPopup) {
      //     this.callPopup.hide();
      //   }
      // }, 15000);
    },
    methods: {
      // ...mapActions(useUserStore, ['phoneQueueAction', 'actionsCurrentPhoneData'])
      ...mapActions(useSoftphoneStore, ['softPhoneQueuePush', 'softPhoneCurrentDataUpdate']),
      // 创建软电话实例
      createWSSoftPhone() {
        console.log('createWSSoftPhone', 1111111111111111);
        this.isShow = true;
        // 设置自定义参数
        let initParams = new window.CustomInitParms();
        initParams.agentWrapupSeconds = 10;

        if (!window.wssp) {
          window.wssp = new window.WSSoftPhone(
            {
              agentId: this.agentId,
              agentName: this.agentName,
              ins: this.ins,
              serverUri: this.serverUri,
              serverUri2: this.serverUri2,
              delegatorId: this.delegatorId,
              workModeSettings: this.workModeSettings,
              customInitParams: this.customInitParams,
              saveLocalLog: this.saveLocalLog,
              isAutoAnswer: this.isAutoAnswer,
              isConnectIpt: this.isConnectIpt,
              softPhoneCode: this.softPhoneCode
            },
            {
              // 初始化结束事件
              // eslint-disable-next-line no-unused-vars
              onInited: (delegatorId) => {
                console.log(`初始化结束事件，获取delegatorId:${delegatorId}`);

                // eslint-disable-next-line eqeqeq
                if (window.wssp.agentState != '0' && window.wssp.agentState != '1') {
                  // 如果状态为登录，则需要连接ipt
                  if (this.isConnectIpt) {
                    window.wssp.connectIpt();
                  }
                }

                this.delegatorId = window.wssp.delegatorId;
                this.wsServerIp = window.wssp.wsServerIp;
              },
              onError: (resp) => {
                console.log('错误事件', resp);
              },
              // 通知设置
              onNotifySettings: () => {},
              // 登录成功
              // eslint-disable-next-line no-unused-vars
              onLogonSucc: (ins) => {
                console.log(`登录成功监听:${ins}`);
                if (this.isConnectIpt) {
                  // 登录成功后，才初始化ipt
                  console.log('登录成功,连接 Ipt...');
                  window.wssp.connectIpt();
                }
                this.delegatorId = window.wssp.delegatorId;
                this.loginType = true;
              },
              // 登录失败
              onLogonFailed: (ins, errNum, errDesc) => {
                console.log('登录失败：', ins, errNum, errDesc);
              },
              // 退出成功
              onLogoffSucc: (ins) => {
                console.log('退出成功：', ins);
                // 签出并关闭ipt连接
                this.tryConnectIpt = false;
                window.wssp.closeIpt(true);
              },
              // 班长监控
              onMonitorContorled: (params) => {
                // 1-强制签出
                if (params.controlType === '1') {
                  // 被强制签出，需要关闭ipt
                  this.tryConnectIpt = false;
                  window.wssp.closeIpt(true);
                }
              },
              // 消息监控
              // eslint-disable-next-line no-unused-vars
              onTrace: (strmsg) => {
                // console.log(strmsg)
              },
              // ws打开
              onWSOpen: () => {
                this.tryConnectionServer = false;
              },
              // ws关闭
              onWSClose: (e) => {
                if (e) {
                  console.log(`onWSClose:${+e.code} ${e.reason} ${e.wasClean}`);
                }
                // 刷新状态
                this.refreshStatus();
                // TODO 禁用按钮
                // this.disableButtonsUI()

                // 自动重新连接
                if (this.autoReconnect) {
                  if (this.isWorking) {
                    this.tryConnectServer = true;
                    // 3秒钟后重试
                    setTimeout(function () {
                      if (window.wssp) {
                        window.wssp.connectServer();
                      }
                    }, 3000);
                  }
                }
              },
              // ws连接失败
              onWSConnectFailed: () => {
                console.log('连接Server失败，请检查网络状态');
              },
              // 状态改变事件
              onStateChange: async (state) => {
                console.log(`状态改变:${state}`, parseInt(state) === 9);

                // 刷新状态
                this.refreshStatus();
                // TODO 刷新操作Button
                this.refreshButtonsUI();

                // eslint-disable-next-line eqeqeq
                if (state == window.ESPState.AGENTSTATE_IDLE) {
                  this.refreshUserPhone();
                  // 空闲时，执行主叫号码滚动
                  let newANI = window.wssp.rollANI();
                  console.log(`rollANI=${newANI}`);
                }

                // 显示时长
                if (this.showStateTimeLength) {
                  this.timeLength = window.wssp.stateTimeLength;
                }

                // 设置IVR按钮
                // eslint-disable-next-line eqeqeq
                let isEnabled = state == window.ESPState.AGENTSTATE_TALK;
                console.log('TODO: IVR按钮启用禁用', isEnabled);
                // TODO isEnabled为true，设置IVR按钮启用，反之禁用
              },
              // 工作模式改变
              onWorkModeChange: (workmode) => {
                console.log('onWorkModeChange:', workmode);
                this.agentWorkMode = window.wssp.agentWorkMode;
                // 刷新状态
                this.refreshStatus();
                // TODO 刷新操作Button
                this.refreshButtonsUI();
              },
              // 队列更改
              onQueueChange: (queueList) => {
                console.log('queueChange：', queueList);
                // 刷新等待队列消息
                this.queueList = queueList;
              },
              // 提示
              onShowTip: (info) => {
                console.log('onShowTip:', info);
                if (info === '语音通道已关闭！') return;

                if (info.indexOf('成功') !== -1) {
                  ElNotification({
                    // title: '成功',
                    message: info,
                    // type: 'success',
                    position: 'bottom-right',
                    duration: 3000,
                    offset: 20
                  });
                } else if (info.indexOf('失败') !== -1) {
                  ElNotification({
                    // title: '失败',
                    message: info,
                    // type: 'error',
                    position: 'bottom-right',
                    duration: 3000,
                    offset: 20
                  });
                } else {
                  ElNotification({
                    // title: '消息',
                    message: info,
                    // type: 'info',
                    position: 'bottom-right',
                    duration: 3000,
                    offset: 20
                  });
                }
              },
              // 来电振铃
              onCallArrive: async (coInfos) => {
                // 进行弹屏处理
                console.log('onCallArrive', coInfos);
                let _this = this;
                this.callPopup = this.$call({ phone: coInfos.ANI });

                asyncQueue.add(async () => {
                  let { ccNo } = await addHistory({
                    callerNumber: coInfos.ANI,
                    calleeNumber: coInfos.DNIS,
                    callStartTime: coInfos.IT,
                    callId: coInfos.COID,
                    callType: coInfos['17'],
                    ivrRoot: coInfos.IVRROOT,
                    callResult: 1,
                    sk: coInfos.SK
                  });
                  console.log(ccNo);

                  _this.softPhoneQueuePush({
                    callId: coInfos.COID,
                    callerNumber: coInfos.ANI,
                    ccNo,
                    callStartTime: coInfos.IT,
                    type: 1
                  });
                  _this.softPhoneCurrentDataUpdate({
                    callId: coInfos.COID,
                    callerNumber: coInfos.ANI,
                    ccNo,
                    callStartTime: coInfos.IT,
                    type: 1
                  });

                  routerPush(`/qishi-cc/callpopup`, {
                    callId: coInfos.COID,
                    callerNumber: coInfos.ANI,
                    ccNo,
                    callStartTime: coInfos.IT,
                    type: 1
                  });

                  // _this
                  //   .phoneQueueAction({
                  //     callId: coInfos.COID,
                  //     callerNumber: coInfos.ANI,
                  //     ccNo,
                  //     callStartTime: coInfos.IT,
                  //     type: 1
                  //   })
                  //   .then(() => {
                  //     return _this.actionsCurrentPhoneData({
                  //       callId: coInfos.COID,
                  //       callerNumber: coInfos.ANI,
                  //       ccNo,
                  //       callStartTime: coInfos.IT,
                  //       type: 1
                  //     });
                  //   })
                  //   .then(() => {
                  //     _this.$router.push({
                  //       path: `/callpopup`,
                  //       query: {
                  //         callId: coInfos.COID,
                  //         callerNumber: coInfos.ANI,
                  //         ccNo,
                  //         callStartTime: coInfos.IT,
                  //         type: 1
                  //       }
                  //     });
                  //   });
                });

                // 刷新用户手机
                this.refreshUserPhone();
              },
              onHarassConfirm: (checkHarassResult) => {
                console.log('onHarassConfirm', checkHarassResult);
                ElMessageBox.confirm(
                  `用户号码：${checkHarassResult.phoneNum}在${checkHarassResult.recentDays}天拨打了${checkHarassResult.recentCallCount}次，已经被标识为防骚扰电话，是否继续执行外拨操作?`,
                  '警告',
                  {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'Warning'
                  }
                )
                  .then(() => {
                    window.wssp.harassConfirm(1);
                  })
                  .catch(() => {
                    window.wssp.harassConfirm(0);
                  });
              },
              // 准备拨号
              onPrepareDialSucc: () => {
                // TODO 进行号码输入界面或者通讯录显示
                ElMessageBox.prompt('请输入号码', '提示', {
                  confirmButtonText: '呼叫',
                  cancelButtonText: '取消'
                  // inputPattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
                  // inputErrorMessage: '号码格式不正确'
                })
                  .then(({ value }) => {
                    window.wssp.dial(value);
                  })
                  .catch((err) => {
                    console.log('取消拨号:', err);
                    window.wssp.cancelPrepareDial();
                  });
              },
              // 准备呼叫
              onPrepareCallOutSucc: () => {
                // 显示号码输入界面或者通讯录显示
                // TODO
                ElMessageBox.prompt('请输入号码', '提示', {
                  confirmButtonText: '呼叫',
                  cancelButtonText: '取消'
                  // inputPattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
                  // inputErrorMessage: '号码格式不正确'
                })
                  .then(({ value }) => {
                    window.wssp.callout(value);
                  })
                  .catch(() => {
                    window.wssp.cancelPrepareDial();
                  });
              },
              // 外拨开始
              onDialBegin: async (coInfos) => {
                let _this = this;
                // 进行外拨信息显示
                console.log('外拨开始：', coInfos);
                if (coInfos.DNIS) {
                  console.log(`DNIS=${coInfos.DNIS}`);
                }
                if (coInfos.TASKPR) {
                  console.log(`TASKPR=${coInfos.TASKPR}`);
                }

                asyncQueue.add(async () => {
                  try {
                    let ccNo = '';
                    if (window.isCallbackLogId) {
                      let res = await lossCallBack({
                        logId: window.isCallbackLogId,
                        callerNumber: coInfos.ANI,
                        calleeNumber: coInfos.DNIS,
                        callStartTime: coInfos.IT,
                        callId: coInfos.COID,
                        callType: coInfos['17'],
                        ivrRoot: coInfos.IVRROOT,
                        sk: coInfos.SK,
                        callResult: 1
                      });
                      ccNo = res.ccNo;
                    } else {
                      let res = await addHistory({
                        callerNumber: coInfos.ANI,
                        calleeNumber: coInfos.DNIS,
                        callStartTime: coInfos.IT,
                        callId: coInfos.COID,
                        callType: coInfos['17'],
                        ivrRoot: coInfos.IVRROOT,
                        sk: coInfos.SK
                      });
                      ccNo = res.ccNo;
                    }

                    _this.softPhoneQueuePush({
                      callId: coInfos.COID,
                      callerNumber: coInfos.ANI,
                      calleeNumber: coInfos.DNIS,
                      ccNo,
                      callStartTime: coInfos.IT,
                      type: 2
                    });
                    _this.softPhoneCurrentDataUpdate({
                      callId: coInfos.COID,
                      callerNumber: coInfos.ANI,
                      calleeNumber: coInfos.DNIS,
                      ccNo,
                      callStartTime: coInfos.IT,
                      type: 2
                    });
                    routerPush(`/qishi-cc/callpopup`, {
                      callId: coInfos.COID,
                      callerNumber: coInfos.ANI,
                      calleeNumber: coInfos.DNIS,
                      ccNo,
                      callStartTime: coInfos.IT,
                      type: 2
                    });

                    console.log(ccNo);
                    // await _this.phoneQueueAction({
                    //   callId: coInfos.COID,
                    //   callerNumber: coInfos.ANI,
                    //   calleeNumber: coInfos.DNIS,
                    //   ccNo,
                    //   callStartTime: coInfos.IT,
                    //   type: 2
                    // });

                    // _this.actionsCurrentPhoneData({
                    //   callId: coInfos.COID,
                    //   callerNumber: coInfos.ANI,
                    //   calleeNumber: coInfos.DNIS,
                    //   ccNo,
                    //   callStartTime: coInfos.IT,
                    //   type: 2
                    // });

                    // _this.$router.push({
                    //   path: `/callpopup`,
                    //   query: {
                    //     callId: coInfos.COID,
                    //     callerNumber: coInfos.ANI,
                    //     calleeNumber: coInfos.DNIS,
                    //     ccNo,
                    //     callStartTime: coInfos.IT,
                    //     type: 2
                    //   }
                    // });
                  } catch (e) {
                    console.log(e);
                    window.isCallbackLogId = '';
                  }
                });

                // 刷新用户手机
                this.refreshUserPhone();
              },
              // 外拨成功
              onDialSucc: async (coInfos) => {
                // 进行外拨成功的业务逻辑操作
                console.log('do some CRM operation for DialSucc');

                asyncQueue.add(async () => {
                  window.isCallbackLogId = '';
                  let res = await addHistory({
                    callerNumber: coInfos.ANI,
                    calleeNumber: coInfos.DNIS,
                    callStartTime: coInfos.IT,
                    callId: coInfos.COID,
                    callType: coInfos['17'],
                    ivrRoot: coInfos.IVRROOT,
                    callResult: 1,
                    sk: coInfos.SK
                  });
                  console.log(res);
                });
              },
              // 外拨失败
              onDialFailed: async (errorCode) => {
                console.log(window.wssp.coInfos);
                console.log(errorCode, 'do some CRM operation for DialFailed');

                asyncQueue.add(async () => {
                  window.isCallbackLogId = '';
                  let res = await addHistory({
                    callerNumber: window.wssp.coInfos.ANI,
                    calleeNumber: window.wssp.coInfos.DNIS,
                    callStartTime: window.wssp.coInfos.IT,
                    callId: window.wssp.coInfos.COID,
                    callType: window.wssp.coInfos['17'],
                    ivrRoot: window.wssp.coInfos.IVRROOT,
                    callResult: 0,
                    sk: window.wssp.coInfos.SK
                  });
                  console.log(res);
                });
              },
              // 已经被同样连接替换，显示还原按钮
              onWebSocketReplaced: () => {
                // 屏蔽软电话界面，仅显示重新创建的按钮
                this.tryConnectIpt = false;
                window.wssp.closeIpt(true);
                this.stopTimer();
                ElMessageBox.confirm('检测您的连接已被顶替，是否还原？', '确认信息', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                }).then(() => {
                  this.createWSSoftPhone();
                  window.wssp.init();
                });
              },
              // 存在已有连接，确认是否需要顶替
              onConfirmReplaceWebSocket: () => {
                // 存在已有连接，确认是否需要顶替
                ElMessageBox.confirm('检测到已经存在相同的软电话连接，请确认是否顶替？', '确认信息', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消'
                })
                  .then(() => {
                    window.wssp.init();
                  })
                  .catch((action) => {
                    console.log(action);
                  });
              },
              // 刷新坐席列表成功
              onRefreshAgentListSucc: (agentList) => {
                // 显示坐席列表供选择
                console.log(agentList);
                let { agentListType, items } = agentList;
                this.agentListType = agentListType;
                this.agentList = items;

                // 班长控制采用特殊界面
                // eslint-disable-next-line eqeqeq
                if (agentList.agentListType === window.EAgentListType.AGENTLISTTYPE_MONITORCONTROL) {
                  // TODO 班长弹框
                  // return this.showMonitorControl(agentList)
                  this.$refs.DialogMonitorControl.open();
                } else {
                  // TODO 普通弹框
                  // return this.showAgentList(agentList)
                  this.$refs.DialogAgentList.open();
                }
              },
              onDevConnected: () => {},
              onDevDisconnected: () => {},
              // 咨询开始
              // eslint-disable-next-line no-unused-vars
              onConsultStart: (coInfos) => {
                this.refreshUserPhone();
              },
              // 咨询成功
              // eslint-disable-next-line no-unused-vars
              onConsultSucc: (coInfos) => {
                this.refreshUserPhone();
              },
              // 咨询失败
              // eslint-disable-next-line no-unused-vars
              onConsultFailed: (coInfos) => {
                this.refreshUserPhone();
              },
              // eslint-disable-next-line no-unused-vars
              onConsultOver: (coInfos) => {
                this.refreshUserPhone();
              },
              // 接通开关监听
              onFunctionSwitch: (Code, isSupport, isOn) => {
                console.log(Code, isSupport, isOn);
                // TODO
              },
              // ws消息通知
              onWSHello: (resp) => {
                // console.log(resp)

                // 显示时长
                if (this.showStateTimeLength) {
                  this.timeLength = resp.datas.stateTimeLength;
                }
              },
              onIptWSOpen: () => {
                console.log('onIptWSOpen');
                this.tryConnectIpt = false;
              },
              onIptWSClose: () => {
                console.log('onIptWSClose');
                // TODO - refreshIptStatus
                // this.refreshIptStatus()

                if (this.autoReconnect) {
                  this.tryConnectIpt = true;
                }
              },
              onIptWSConnectFailed: () => {
                console.log('连接Ipt失败，请检查IP软终端服务状态');
              },
              onIptStateChange: (st, isMute) => {
                console.log(`onIptStateChange:${st},${isMute}`);
                // TODO - refreshIptStatus
                // this.refreshIptStatus()
              },
              onOneStepTransferSucc: (coInfos) => {
                console.log(`onOneStepTransferSucc:${coInfos.CCIVR_TRANSFERTYPE}:${coInfos.CCIVR_TRANSFERDEST}`);
              },
              onConsultTransferSucc: (coInfos) => {
                console.log(`onConsultTransferSucc:${coInfos.CCIVR_TRANSFERTYPE}:${coInfos.CCIVR_TRANSFERDEST}`);
              },
              onTransferSucc: (coInfos) => {
                console.log(`onTransferSucc:${coInfos.CCIVR_TRANSFERTYPE}:${coInfos.CCIVR_TRANSFERDEST}`);
              }
            }
          );
          window.wssp.connectServer();
          // 启动定时器
          this.startTimer();
          console.log('创建成功!');

          // 设置默认工作模式为普通模式
          // window.wssp.agentWorkMode = 0
        }
      },
      // 销毁实例
      disposeWSSoftPhone() {
        if (window.wssp) {
          window.wssp.close();
          this.stopTimer();
          window.wssp = null;
        }
      },
      // 登录登出方法
      loginFn(n, telNo) {
        if (telNo) {
          this.ins = telNo;
          this.disposeWSSoftPhone();
          this.autoLogin = true;
          this.createWSSoftPhone();
          return;
        }
        console.log(this.ins);
        this.callSPFunction(n);
      },
      // 01新增热线服务历史(授权)
      // async addHistory({ callerNumber, calleeNumber, callStartTime, callId, callType, ivrRoot, callResult, sk }) {
      //   return await addHistory({
      //     callerNumber,
      //     calleeNumber,
      //     callStartTime,
      //     callId,
      //     callType,
      //     ivrRoot,
      //     callResult,
      //     sk
      //   });
      // },
      // 02更新热线服务历史(授权)
      // async updateHistory({ callType, ccNo, callId }) {
      //   return await updateHistory({ callType, ccNo, callId });
      // },
      // 03查询服务历史(授权)
      // async serHistory({ startTime, callId }) {
      //   return await serHistory({ startTime, callId });
      // },
      // 刷新用户手机
      refreshUserPhone() {
        let userPhone = '';
        if (window.wssp.coInfos && this.showUserPhone) {
          if (window.wssp.coInfos.CN0_UserPhoneNum) userPhone = window.wssp.coInfos.CN0_UserPhoneNum;

          if (window.wssp.coInfos.CN2_ChannelANI) {
            // eslint-disable-next-line eqeqeq
            if (window.wssp.coInfos.CN2_ChannelANI != '') {
              userPhone = window.wssp.coInfos.CN2_ChannelANI;
            }
          }
        }
        this.userPhone = userPhone;
        return userPhone;
      },
      // 刷新状态
      async refreshStatus() {
        if (window.wssp) {
          this.isMute = window.wssp.isMute;
          this.agentWorkMode = window.wssp.agentWorkMode;
          this.curStateID = window.wssp.agentState;
          this.curStateName = window.wssp.getCurStateName();
          console.log(this.curStateName, this.curStateID, window.wssp.coInfos);
          // if (this.curStateID === "6") {
          //   // 通话
          //   let coInfos = window.wssp.coInfos;
          //   console.log(window.wssp.coInfos);
          // }
          // if(this.curStateID == "27" && this.callPopup){
          //   console.log( window.wssp.coInfos, 1111111111)
          //   this.callPopup = this.$call({ phone: window.wssp.coInfos.ANI });
          // }

          if (this.curStateID != '5' && this.curStateID != '27' && this.callPopup) {
            // 取消来电弹框
            console.log('取消来电弹框');
            this.callPopup.hide();
          }
          if (this.curStateID === '2') {
            console.log('检查电话');
          }

          // 话后
          if (this.curStateID === '19') {
            asyncQueue.add(async () => {
              let { ccNo, callResult } = await serHistory({
                startTime: window.wssp.coInfos.IT,
                callId: window.wssp.coInfos.COID
              });
              if (ccNo) {
                await updateHistory({
                  callType: window.wssp.coInfos['17'],
                  ccNo,
                  callId: window.wssp.coInfos.COID,
                  callResult
                });
              }
            });
          }
          let ins = `${window.wssp.ins}`;
          if (ins.startsWith('RP_')) {
            ins = ins.substring(4);
          }
          this.ins = ins;
        }
      },
      // 刷新操作按钮
      refreshButtonsUI() {
        if (window.wssp) {
          let setting = window.wssp.getStateSetting();
          console.log(setting);
          this.curStateID = window.wssp.agentState;
          if (this.curStateID != '27') this.proposalButton = setting.functions;
          console.log(this.proposalButton);
          this.workModeSettings = window.wssp.workModeSettings;
          this.leaveReasonSettings = window.wssp.leaveReasonSettings;
          this.transferSubItems = window.wssp.transferSubItems;
          if (setting && setting.functions && Array.isArray(setting.functions)) {
            for (let i = 0; i < setting.functions.length; i++) {
              let func = setting.functions[i];
              if (func.id === 36) {
                // 工作模式
                // this.genWorkModeButton(func)
              } else if (func.id === 9) {
                // this.genTransferButton(func)
              } else if (func.id === 33) {
                // this.genLeaveButton(func)
              } else {
                // this.genButtonHtml(func)
              }
            }
          }
        }
      },
      // 开启定时
      startTimer() {
        // 先确认停止Timer
        this.stopTimer();
        // 设置工作标识，启动Timer
        this.isWorking = true;
        this.timerSource = setInterval(this.onTimer, 1000);
      },
      // 停止定时
      stopTimer() {
        // 复位工作标识
        this.isWorking = false;
        // 尝试停止并释放Timer
        if (this.timerSource) {
          clearTimeout(this.timerSource);
          this.timerSource = null;
        }
      },
      // 定时回调
      onTimer() {
        if (this.isWorking) window.wssp.wsHello('');

        if (this.isWorking && this.isConnectIpt && window.wssp.isLogon) window.wssp.iptHeartBeat('');

        if (this.tryConnectIpt) window.wssp.connectIpt();

        if (!window.wssp.isLogon && this.ins != 'INS_WAIT_FOR_DISPATCH' && this.autoLogin) {
          this.callSPFunction(1);
          this.autoLogin = false;
        }
      },
      // 已被替换，还原连接
      reduction() {
        this.createWSSoftPhone();
        window.wssp.init();
      },
      // 转接点击事件
      transferSubItemClick(type) {
        if (type === 'IVR') {
          // TODO IVR转接
          // this.showTransferIVRList()
        } else if (type === 'Skill') {
          // TODO 技能转接
          // this.showTransferSkillList()
        } else if (type === 'OutLine') {
          ElMessageBox.prompt('请输入转接号码', '号码输入', {
            confirmButtonText: '呼叫',
            cancelButtonText: '取消'
          })
            .then(({ value }) => {
              let transferInfo = new window.SPOneStepTransferInfo();
              transferInfo.destType = 'OUT';
              transferInfo.destIns = value;

              window.wssp.oneStepTransfer(transferInfo);
            })
            .catch(() => {});
        } else if (type === 'Agent') {
          window.wssp.refreshTransferAgentList();
        }
      },
      // 设置开启/取消自动接听
      setAutoAnswer() {
        if (!this.isAutoAnswer) {
          this.isAutoAnswer = true;
          window.wssp.isAutoAnswer = true;
          window.wssp.showTip('开启自动应答');
        } else {
          this.isAutoAnswer = false;
          window.wssp.isAutoAnswer = false;
          window.wssp.showTip('取消自动应答');
        }
      },
      // 设置开启/禁用声音
      setMute() {
        if (this.isMute) {
          this.isMute = false;
          window.wssp.iptMute(false);
          window.wssp.showTip('声音启用');
        } else {
          this.isMute = true;
          window.wssp.iptMute(true);
          window.wssp.showTip('声音禁用');
        }
      },
      // 拨号盘按键
      dialFn(n) {
        console.log('拨号盘按键', n);
        window.wssp.iptDeviceDtmf(n);
      },
      // 离席
      leave(n) {
        if (!n) n = 0;
        window.wssp.leave(n);
      },
      // 软电话方法 n 对应操作 wsSoftPhoneLocale 中 SPFunc_ID
      callSPFunction(n) {
        window.wssp.callSPFunction(n);
      },
      // 设置模式
      setWorkMode(wkmd) {
        window.wssp.setWorkMode(wkmd);
      },
      // 查询用户软电话权限
      async queryUserJurisdiction() {
        try {
          let { userId, uname, workNo } = this.userInfo;
          this.agentId = workNo;
          this.agentName = uname;
          let data = await getSoftphone({ userId });
          let { rows, telType, telNos } = data.data;
          this.telType = telType;
          this.telNos = telNos;
          // 软电话
          if (rows.some((v) => v.skCode === 'SP_SOFTPHONE')) this.createWSSoftPhone();
        } catch (err) {
          console.log(err);
        }
      },
      // 初始化
      init() {
        this.queryUserJurisdiction();
        // 创建软电话实例
        // this.createWSSoftPhone()
      }
    }
  };
</script>
<style scoped lang="scss">
  .soft-phone-control-wrapper {
    position: relative;
    display: flex;
    @apply flex ml-3 items-center;
    .soft-phone-control-item {
      width: 100%;
      height: 100%;
      height: 42px;
      margin-left: 10px;
    }
    // .soft-phone-control-item:first-child {
    //   margin-left: 25px;
    // }
  }
</style>
