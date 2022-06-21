<template>
  <div class="phone-control-wrapper">
    <div class="p-c-box mr-10">
      <div v-if="isMonitorControl" class="p-c-b-item" @click="$emit('monitorControl')">
        <icon-softphone-setting class="p-c-b-i-svg-icon"></icon-softphone-setting>
        <span>班长控制</span>
      </div>
      <div v-if="isQutwardDialing" class="p-c-b-item" @click="$emit('qutwardDialing')">
        <icon-softphone-phone3 class="p-c-b-i-svg-icon"></icon-softphone-phone3>
        <span>外拨</span>
      </div>
      <div v-if="isQutwardDialingGetReady" class="p-c-b-item" @click="$emit('qutwardDialingGetReady')">
        <icon-softphone-phone3_true class="p-c-b-i-svg-icon"></icon-softphone-phone3_true>
        <span>取消外拨</span>
      </div>
      <div v-if="isCancelQutwardDialing" class="p-c-b-item" @click="$emit('cancelQutwardDialing')">
        <icon-softphone-phone3_true class="p-c-b-i-svg-icon"></icon-softphone-phone3_true>
        <span>取消外拨</span>
      </div>
      <div v-if="isInternalCall" class="p-c-b-item" @click="$emit('internalCall')">
        <icon-softphone-phone4 class="p-c-b-i-svg-icon"></icon-softphone-phone4>
        <span>内呼</span>
      </div>
      <div v-if="isInternalCallGetReady" class="p-c-b-item" @click="$emit('internalCallGetReady')">
        <icon-softphone-phone4_true class="p-c-b-i-svg-icon"></icon-softphone-phone4_true>
        <span>取消内呼</span>
      </div>
      <div v-if="isCancelInternalCall" class="p-c-b-item" @click="$emit('cancelInternalCall')">
        <icon-softphone-phone4_true class="p-c-b-i-svg-icon"></icon-softphone-phone4_true>
        <span>取消内呼</span>
      </div>
      <div v-if="isExternalConsultation" class="p-c-b-item" @click="$emit('externalConsultation')">
        <icon-softphone-phone3 class="p-c-b-i-svg-icon"></icon-softphone-phone3>
        <span>外部咨询</span>
      </div>
      <div v-if="isHelTransferOut" class="p-c-b-item" @click="$emit('helTransferOut')">
        <icon-softphone-zhuanjie class="p-c-b-i-svg-icon"></icon-softphone-zhuanjie>
        <span>求助转出</span>
      </div>
      <div v-if="isKeepTheOutsideLine" class="p-c-b-item" @click="$emit('keepTheOutsideLine')">
        <icon-softphone-suspended class="p-c-b-i-svg-icon"></icon-softphone-suspended>
        <span>保持外线</span>
      </div>
      <div v-if="isGetTheOutsideLineBack" class="p-c-b-item" @click="$emit('getTheOutsideLineBack')">
        <icon-softphone-suspend class="p-c-b-i-svg-icon"></icon-softphone-suspend>
        <span>取回外线</span>
      </div>
      <div v-if="isEndHelp" class="p-c-b-item" @click="$emit('endHelp')">
        <icon-softphone-phone5 class="p-c-b-i-svg-icon"></icon-softphone-phone5>
        <span>结束求助</span>
      </div>
      <div v-if="isInternalConsultation" class="p-c-b-item" @click="$emit('internalConsultation')">
        <icon-softphone-phone4 class="p-c-b-i-svg-icon"></icon-softphone-phone4>
        <span>内部咨询</span>
      </div>
      <div v-if="isKeepConsultation" class="p-c-b-item" @click="$emit('keepConsultation')">
        <icon-softphone-suspended class="p-c-b-i-svg-icon"></icon-softphone-suspended>
        <span>保持咨询</span>
      </div>
      <div v-if="isCancelKeepConsultation" class="p-c-b-item" @click="$emit('cancelKeepConsultation')">
        <icon-softphone-suspend class="p-c-b-i-svg-icon"></icon-softphone-suspend>
        <span>取消保持</span>
      </div>
      <div v-if="isEndConsultation" class="p-c-b-item" @click="$emit('endConsultation')">
        <icon-softphone-phone5 class="p-c-b-i-svg-icon"></icon-softphone-phone5>
        <span>结束咨询</span>
      </div>
      <div v-if="isCancelEndConsultation" class="p-c-b-item" @click="$emit('cancelEndConsultation')">
        <icon-softphone-phone5 class="p-c-b-i-svg-icon"></icon-softphone-phone5>
        <span>取消咨询</span>
      </div>
      <div v-if="isConsultTransfer" class="p-c-b-item" @click="$emit('consultTransfer')">
        <icon-softphone-zhuanjie class="p-c-b-i-svg-icon"></icon-softphone-zhuanjie>
        <span>咨询转接</span>
      </div>
      <div v-if="isKeep" class="p-c-b-item" @click="$emit('keep')">
        <icon-softphone-suspended class="p-c-b-i-svg-icon"></icon-softphone-suspended>
        <span>保持</span>
      </div>
      <div v-if="isCancelKeep" class="p-c-b-item" @click="$emit('cancelKeep')">
        <icon-softphone-suspend class="p-c-b-i-svg-icon"></icon-softphone-suspend>
        <span>取消保持</span>
      </div>
      <!--  .p-c-b-item(v-if="isMonitor" @click="$emit('monitor')") -->
      <!--    x-icon(iconClass="@monitor" className="p-c-b-i-svg-icon") -->
      <!--    icon-softphone-monitor(class="p-c-b-i-svg-icon") --><!--    span 监听 -->
      <!--  //  取消监听准备 --><!--  .p-c-b-item(v-if="isCancelMonitorPreparation" @click="$emit('cancelMonitorPreparation')") -->
      <!--    x-icon(iconClass="@monitor_false" className="p-c-b-i-svg-icon") -->
      <!--    icon-softphone-monitor_false(class="p-c-b-i-svg-icon") -->
      <!--    span 取消监听 --><!--  //  取消监听 -->
      <!--  .p-c-b-item(v-if="isCancelMonitor" @click="$emit('cancelMonitor')") -->
      <!--    x-icon(iconClass="@monitor_false" className="p-c-b-i-svg-icon") -->
      <!--    icon-softphone-monitor_false(class="p-c-b-i-svg-icon") -->
      <!--    span 取消监听 -->
      <div v-if="isForcedDemolition" class="p-c-b-item" @click="$emit('forcedDemolition')">
        <icon-softphone-qiangchai class="p-c-b-i-svg-icon"></icon-softphone-qiangchai>
        <span>强拆</span>
      </div>
      <div v-if="isStrongBlock" class="p-c-b-item" @click="$emit('strongBlock')">
        <icon-softphone-qianglan class="p-c-b-i-svg-icon"></icon-softphone-qianglan>
        <span>强拦</span>
      </div>
      <div v-if="isStrongInsertion" class="p-c-b-item" @click="$emit('strongInsertion')">
        <icon-softphone-qiangcha class="p-c-b-i-svg-icon"></icon-softphone-qiangcha>
        <span>强插</span>
      </div>
      <div v-if="isEndListening" class="p-c-b-item" @click="$emit('endListening')">
        <icon-softphone-monitor_false class="p-c-b-i-svg-icon"></icon-softphone-monitor_false>
        <span>结束监听</span>
      </div>
      <div v-if="isLeaveTheChair" class="p-c-b-item" @click="$emit('leaveTheChair')">
        <icon-softphone-huiyi class="p-c-b-i-svg-icon"></icon-softphone-huiyi>
        <span>结束会议</span>
      </div>
      <el-popover v-if="isTransfer" placement="bottom" width="100" trigger="click" popper-class="transfer-popover"
        ><div class="transfer-box">
          <span v-for="item of transferSubItems" :key="item" @click="$emit('transferSubItemClick', item)">{{ getTransferSubItemsName(item) }}</span>
        </div>
        <template #reference>
          <div class="p-c-b-item">
            <icon-softphone-zhuanjie class="p-c-b-i-svg-icon"></icon-softphone-zhuanjie>
            <span>转接</span>
          </div>
        </template>
      </el-popover>
    </div>
    <div v-if="telType == 0" class="p-c-box">
      <div class="p-c-b-item" @click="$emit('autoAnswer')">
        <icon-softphone-auto_true v-if="isAutoAnswer" class="p-c-b-i-svg-icon size20"></icon-softphone-auto_true>
        <icon-softphone-auto_false v-if="!isAutoAnswer" class="p-c-b-i-svg-icon size20"></icon-softphone-auto_false>
        <span>自动接听</span>
      </div>
      <div class="p-c-b-item" @click="$emit('setMute')">
        <icon-softphone-yuyin1 v-if="!isMute" class="p-c-b-i-svg-icon"></icon-softphone-yuyin1>
        <icon-softphone-yuyin2 v-if="isMute" class="p-c-b-i-svg-icon"></icon-softphone-yuyin2><span>麦克风</span>
      </div>
      <el-popover v-model:visible="dialKeyboardVisible" placement="bottom" trigger="manual" popper-class="dial-keyboard-popover">
        <div ref="dialRef" class="dial-keyboard-box">
          <DialKeyboard v-model="dialKeyboardValue" :is-true="dialKeyboardVisible" @changeKey="(n) => $emit('changeKey', n)"></DialKeyboard>
        </div>
        <template #reference>
          <div class="p-c-b-item" @click="handleDialToggle">
            <icon-softphone-jianpan_true v-if="!dialKeyboardVisible" class="p-c-b-i-svg-icon"></icon-softphone-jianpan_true>
            <icon-softphone-jianpan_false v-else class="p-c-b-i-svg-icon"></icon-softphone-jianpan_false><span>拨号盘</span>
          </div>
        </template>
      </el-popover>
    </div>
  </div>
</template>

<script>
  // import { XIcon } from '@xiaoshi/xiaoshi-components';
  // import DialKeyboard from '@/components/DialKeyboard/index.vue';

  export default {
    name: 'PhoneControlButton',
    // components: {
    //   // XIcon,
    //   // 拨号盘
    //   DialKeyboard
    // },
    props: {
      agentWorkMode: {
        type: [String, Number],
        default: 0
      },
      // 是否为自动应答（接听）
      isAutoAnswer: {
        type: Boolean,
        default: false
      },
      // 是否为静音状态
      isMute: {
        type: Boolean,
        default: false
      },
      // 建议按纽
      proposalButton: {
        type: Array,
        default: () => []
      },
      // 转接按钮数组
      transferSubItems: {
        type: Array,
        default: () => []
      },
      // 0-自动注册 1-IP话机
      telType: {
        type: [String, Number],
        default: '0'
      }
    },
    emits: [
      'monitorControl',
      'qutwardDialing',
      'qutwardDialingGetReady',
      'cancelQutwardDialing',
      'internalCall',
      'internalCallGetReady',
      'cancelInternalCall',
      'externalConsultation',
      'helTransferOut',
      'keepTheOutsideLine',
      'getTheOutsideLineBack',
      'endHelp',
      'internalConsultation',
      'keepConsultation',
      'cancelKeepConsultation',
      'endConsultation',
      'cancelEndConsultation',
      'consultTransfer',
      'keep',
      'cancelKeep',
      'forcedDemolition',
      'strongBlock',
      'strongInsertion',
      'endListening',
      'leaveTheChair',
      'transferSubItemClick',
      'autoAnswer',
      'setMute',
      'changeKey'
    ],
    data() {
      return {
        // 拨号盘
        dialKeyboardVisible: false,
        dialKeyboardValue: ''
      };
    },
    computed: {
      // 获取转接项name
      getTransferSubItemsName() {
        return (transferType) => {
          if (transferType === 'IVR') {
            return 'IVR';
          }
          if (transferType === 'Skill') {
            return '技能';
          }
          if (transferType === 'OutLine') {
            return '外线';
          }
          if (transferType === 'Agent') {
            return '坐席';
          }
        };
      },
      // 班长控制
      isMonitorControl() {
        return this.proposalButton.some((v) => v.id === 68 && v.enabled) && this.agentWorkMode == 4;
      },
      // 结束会议
      isLeaveTheChair() {
        return this.proposalButton.some((v) => v.id === 48 && v.enabled);
      },
      // 咨询转接是否显示
      isConsultTransfer() {
        return this.proposalButton.some((v) => v.id === 15 && v.enabled);
      },
      // 结束咨询是否显示
      isEndConsultation() {
        return this.proposalButton.some((v) => v.id === 14 && v.enabled);
      },
      // 取消咨询是否显示
      isCancelEndConsultation() {
        return this.proposalButton.some((v) => v.id === 13 && v.enabled);
      },
      // 外部咨询是否显示
      isExternalConsultation() {
        return this.proposalButton.some((v) => v.id === 8 && v.enabled);
      },
      // 外部咨询求助转出是否显示
      isHelTransferOut() {
        return this.proposalButton.some((v) => v.id === 21 && v.enabled);
      },
      // 外部咨询求助结束是否显示
      isEndHelp() {
        return this.proposalButton.some((v) => v.id === 22 && v.enabled);
      },
      // 外部咨询保持是否显示
      isKeepTheOutsideLine() {
        return this.proposalButton.some((v) => v.id === 20 && v.enabled);
      },
      // 外部咨询取回保持是否显示
      isGetTheOutsideLineBack() {
        return this.proposalButton.some((v) => v.id === 23 && v.enabled);
      },
      // 内部咨询是否显示
      isInternalConsultation() {
        return this.proposalButton.some((v) => v.id === 7 && v.enabled);
      },
      // 外拨取消是否显示
      isCancelQutwardDialing() {
        return this.proposalButton.some((v) => v.id === 12 && v.enabled);
      },
      // 取消外拨准备是否显示
      isQutwardDialingGetReady() {
        return this.proposalButton.some((v) => v.id === 38 && v.enabled);
      },
      // 外拨是否显示
      isQutwardDialing() {
        return this.proposalButton.some((v) => v.id === 3 && v.enabled);
      },
      // 取消内呼准备是否显示
      isInternalCallGetReady() {
        return this.proposalButton.some((v) => v.id === 40 && v.enabled);
      },
      // 内呼是否显示
      isInternalCall() {
        return this.proposalButton.some((v) => v.id === 4 && v.enabled);
      },
      // 取消内呼是否显示
      isCancelInternalCall() {
        return this.proposalButton.some((v) => v.id === 35 && v.enabled);
      },
      // 监听是否显示
      isMonitor() {
        return this.proposalButton.some((v) => v.id === 5 && v.enabled);
      },
      // 取消监听准备是否显示
      isCancelMonitorPreparation() {
        return this.proposalButton.some((v) => v.id === 39 && v.enabled);
      },
      // 取消监听是否显示
      isCancelMonitor() {
        return this.proposalButton.some((v) => v.id === 24 && v.enabled);
      },
      // 强拆是否显示
      isForcedDemolition() {
        return this.proposalButton.some((v) => v.id === 25 && v.enabled);
      },
      // 强拦是否显示
      isStrongBlock() {
        return this.proposalButton.some((v) => v.id === 26 && v.enabled);
      },
      // 强插是否显示
      isStrongInsertion() {
        return this.proposalButton.some((v) => v.id === 27 && v.enabled);
      },
      // 取消监听是否显示
      isEndListening() {
        return this.proposalButton.some((v) => v.id === 28 && v.enabled);
      },
      // 保持是否显示
      isKeep() {
        return this.proposalButton.some((v) => v.id === 6 && v.enabled);
      },
      // 取消保持是否显示
      isCancelKeep() {
        return this.proposalButton.some((v) => v.id === 11 && v.enabled);
      },
      // 保持咨询是否显示
      isKeepConsultation() {
        return this.proposalButton.some((v) => v.id === 16 && v.enabled);
      },
      // 取消保持咨询是否显示
      isCancelKeepConsultation() {
        return this.proposalButton.some((v) => v.id === 18 && v.enabled);
      },
      // 转接是否显示
      isTransfer() {
        return this.proposalButton.some((v) => v.id === 9 && v.enabled);
      }
      // // 禁/启音量是否显示 2-禁音 1-启动 -1-不显示
      // isVolume() {
      //   if (this.proposalButton.some((v) => v.id === 60 && v.enabled)) return 2
      //   if (this.proposalButton.some((v) => v.id === 61 && v.enabled)) return 1
      //   return -1
      // },
      // // 键盘是否显示
      // isKeyboard() {
      //   return this.proposalButton.some((v) => v.id === 62 && v.enabled)
      // }
    },
    mounted() {
      onClickOutside(this.$refs.dialRef, () => (this.dialKeyboardValue = false));
    },
    methods: {
      // 键盘按钮点击
      handleDialToggle() {
        this.dialKeyboardValue = '';
        this.dialKeyboardVisible = !this.dialKeyboardVisible;
      }
    }
  };
</script>
<style lang="scss">
  .dial-keyboard-popover {
    width: auto !important;
  }
  .transfer-popover {
    padding: 0 !important;
  }
  .transfer-box {
    width: 100%;
    display: flex;
    flex-direction: column;
    span {
      display: inline-block;
      width: 100%;
      padding: 10px 10px;
      cursor: pointer;
      border-bottom: 1px solid #f7f7f7;
      box-sizing: border-box;
    }
    span:hover {
      background: #f7f7f7;
    }
  }
</style>
<style scoped lang="scss">
  .phone-control-wrapper {
    display: flex;
    .p-c-box {
      background: rgba(243, 246, 253, 0.6983);
      border-radius: 21px;
      box-sizing: border-box;
      overflow: hidden;
      display: flex;
      .p-c-b-item {
        transition: all 0.3s;
        cursor: pointer;
        flex-shrink: 0;
        width: 55px;
        height: 42px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .p-c-b-i-svg-icon {
          font-size: 20px;
          color: #004785;
          margin-bottom: 4px;
        }
        .size20 {
          font-size: 23px !important;
          margin-bottom: 2px;
          margin-top: -2px;
        }
        span {
          font-size: 12px;
          transform: scale(0.85, 0.85);
          color: #004785;
        }
      }
      .p-c-b-item:first-child {
        padding-left: 12px;
        width: 75px;
        box-sizing: border-box;
      }
      .p-c-b-item:last-child {
        padding-right: 12px;
        width: 75px;
        box-sizing: border-box;
      }
      .p-c-b-item:hover {
        background-color: #fff;
        .p-c-b-i-svg-icon {
          color: #34acff;
        }
        span {
          color: #34acff;
        }
      }
    }
  }
  .mr-10 {
    margin-right: 10px;
  }
</style>
