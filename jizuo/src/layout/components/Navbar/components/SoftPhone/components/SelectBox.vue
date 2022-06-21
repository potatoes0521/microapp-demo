<template>
  <div
    class="select-wrapper"
    :class="{ 'active-select-wrapper': selectStatus }"
    :style="selectStatus ? `height:${60 + 37 * selectNum}px;` : ''"
    @click.stop="() => {}"
  >
    <div class="select-box" @click="selectStatus = !selectStatus">
      <div class="s-b-icon-left">
        <!--  x-icon(iconClass="@tonghua" className="s-b-svg-style") -->
        <icon-softphone-tonghua class="s-b-svg-style"></icon-softphone-tonghua>
      </div>
      <div class="s-b-content">
        <span v-if="!selectStatus">{{ stateList[timerIdx] || '正在加载' }}</span>
        <template v-else>
          <span v-for="item of stateList" :key="item">{{ item }}</span>
        </template>
      </div>
      <div class="s-b-icon-right">
        <i :class="selectStatus ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
      </div>
    </div>
    <div class="select-list">
      <!--  模式 -->
      <div v-if="isMode" class="select-list-model">
        <div
          v-for="item of workModeSettingsData"
          :key="item.serviceWorkMode"
          class="s-l-m-item"
          :class="{ selected: mode == item.serviceWorkMode }"
          @click="setWorkMode(item.serviceWorkMode)"
        >
          <span>{{ item.serviceWorkModeName }}</span>
          <!--  x-icon(iconClass="@dui" className="s-l-m-i-svg-icon") -->
          <icon-softphone-dui class="s-l-m-i-svg-icon"></icon-softphone-dui>
        </div>
      </div>
      <!--  离席复席 -->
      <div v-if="isLeave === 2" class="select-list-model">
        <div class="s-l-m-item" @click="reinstatementFn"><span>复席</span></div>
      </div>
      <div v-if="isLeave === 1 && agentWorkMode != 1" class="select-list-model">
        <div v-for="item of leaveReasonSettingsData" :key="item.reasonId" class="s-l-m-item" @click="leaveFn(item.reasonId)">
          <span>{{ item.reasonName }}</span>
        </div>
      </div>
      <div class="select-list-model no-border-bottom">
        <div v-if="isLogin === 1" class="s-l-m-item" @click="loginFn(1)">登录</div>
        <div v-if="isLogin === 2" class="s-l-m-item" @click="loginFn(2)">退出</div>
        <div v-if="isReduction" class="s-l-m-item" @click="reductionFn">还原</div>
      </div>
    </div>

    <el-dialog v-model="loginDialog" title="请选择分机号" width="400px" :append-to-body="true">
      <el-select v-model="telNo" placeholder="选择分机号">
        <el-option v-for="item in telNos" :key="item.telNo" :label="item.telNo" :value="item.telNo" />
      </el-select>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="loginDialog = false">取消</el-button>
          <el-button type="primary" @click="loginConfirm">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  // import { XIcon } from '@xiaoshi/xiaoshi-components';

  export default {
    name: 'SelectBox',
    // components: {
    //   XIcon,
    //   TextScroll: () => import('@components/TextScroll')
    // },
    props: {
      // 建议按纽
      proposalButton: {
        type: Array,
        default: () => []
      },
      // 当前状态ID
      curStateID: {
        type: [String, Number],
        default: ''
      },
      // 当前状态Name
      curStateName: {
        type: String,
        default: ''
      },
      // 客服号
      ins: {
        type: [String, Number],
        default: '未分配'
      },
      // 模式
      agentWorkMode: {
        type: [String, Number],
        default: 0
      },
      // 模式按钮
      workModeSettings: {
        type: Array,
        default: () => []
      },
      // 离席按钮
      leaveReasonSettings: {
        type: Array,
        default: () => []
      },
      // 持续时长
      timeLength: {
        type: String,
        default: ''
      },
      // 用户手机
      userPhone: {
        type: [String, Number],
        default: ''
      },
      // 0-自动注册 1-IP话机
      telType: {
        type: [String, Number],
        default: '0'
      },
      // IP话机列表
      telNos: {
        type: [String, Number],
        default: '0'
      }
    },
    data() {
      return {
        selectNum: 0,
        // 下拉状态
        selectStatus: 0,
        // 模式 普通-0 外拨-3 下班-1
        mode: '',
        // 小休-0 开会-1 就餐-2 其他工作-3
        leave: -1,
        classOption: {
          singleHeight: 14,
          waitTime: 2000
        },
        timer: null,
        timerIdx: 0,
        loginDialog: false,
        telNo: ''
      };
    },
    computed: {
      // 头部状态数据列表
      stateList() {
        let data = [];
        if (this.curStateName && this.getWorkModeName) {
          data.push(
            `${this.curStateName || '请登录'} ${this.curStateName === '初始化' ? '| 未登录' : ''} | ${
              this.timeLength ? `${this.timeLength} | ${this.getWorkModeNameJian}` : this.getWorkModeNameJian
            }`
          );
        }
        if (this.curStateName === '离席') {
          data = [
            `${this.curStateName || '请登录'} ${this.curStateName === '初始化' ? '| 未登录' : ''} ${
              this.curStateName === '离席' ? `(${wssp.getLeaveReasonName(this.leave >= 0 ? this.leave : parseInt(wssp.leaveReason))})` : ''
            } | ${this.timeLength ? `${this.timeLength} | ${this.getWorkModeNameJian}` : this.getWorkModeNameJian}`
          ];
        }
        // if (this.curStateName && this.getWorkModeName) {
        //   data.push(
        //     `${this.curStateName || "请登录"} ${
        //       this.curStateName === "初始化" ? "| 未登录" : ""
        //     } ${this.curStateName === "离席" ? "" : ""} | ${this.timeLength ? this.timeLength + ' | ' + this.getWorkModeNameJian : this.getWorkModeNameJian }`
        //   );
        // }
        // if (this.ins && this.getWorkModeName) {
        //   data.push(
        //     `${this.ins === "INS_WAIT_FOR_DISPATCH" ? "分配中..." : this.ins} | ${
        //       this.getWorkModeNameJian
        //     }`
        //   );
        // }
        // if (this.userPhone) data.push(this.userPhone);

        return data;
      },
      // 是否是空闲态
      isFree() {
        return parseInt(this.curStateID) === parseInt(3);
      },
      // 显示工作模式数组
      workModeSettingsData() {
        return this.workModeSettings.filter((v) => v.visible && v.serviceWorkMode !== 1);
      },
      // 显示离席按钮数组
      leaveReasonSettingsData() {
        return this.leaveReasonSettings.filter((v) => v.visible);
      },
      // 通过模式ID获取模式Name
      getWorkModeName() {
        return window.getWorkModeName(this.agentWorkMode);
      },
      // 通过模式ID获取模式Name 简称
      getWorkModeNameJian() {
        let hash = {
          0: '普通',
          1: '下班',
          2: '非实时',
          3: '外拨',
          4: '班长',
          5: '预览',
          6: '离开',
          7: '闭塞',
          8: '接线'
        };
        return hash[this.agentWorkMode];
      },
      // 是否显示还原 true-显示 false-不显示
      isReduction() {
        return this.proposalButton.length > 0 && this.proposalButton.every((v) => v.id === 0);
      },
      // 是否显示离席/复席状态 1-离席 2-复席 -1-不显示
      isLeave() {
        if (this.proposalButton.some((v) => v.id === 33 && v.enabled)) return 1;
        if (this.proposalButton.some((v) => v.id === 34 && v.enabled)) return 2;
        return -1;
      },
      // 是否显示模式 true-显示 false-不显示
      isMode() {
        return this.proposalButton.some((v) => v.id === 36 && v.enabled);
      },
      // 是否显示登录/退出 1-登录 2-登出 -1-不显示
      isLogin() {
        if (this.proposalButton.some((v) => v.id === 1 && v.enabled)) return 1;
        if (this.proposalButton.some((v) => v.id === 2 && v.enabled)) return 2;
        return -1;
      }
    },
    watch: {
      selectStatus(n) {
        if (n) {
          this.stopRotation();
        } else {
          this.startRotation();
        }
      },
      'stateList.length': {
        handler() {
          this.refreshButtonsUI();
        }
      },
      isLeave() {
        this.refreshButtonsUI();
      },
      isLogin() {
        this.refreshButtonsUI();
      },
      isMode() {
        this.refreshButtonsUI();
      },
      isReduction() {
        this.refreshButtonsUI();
      },
      agentWorkMode: {
        handler(n) {
          this.mode = n;
        },
        immediate: true
      }
    },
    mounted() {
      this.startRotation();
      this.monitorFn();
    },
    beforeUnmount() {
      this.stopRotation();
      this.cancelMonitorFn();
    },
    methods: {
      // 轮播启动
      startRotation() {
        this.stopRotation();
        this.timer = setInterval(() => {
          let n = this.timerIdx;
          n++;
          if (this.stateList.length <= n) n = 0;
          this.timerIdx = n;
        }, 5000);
      },
      // 轮播暂停
      stopRotation() {
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
        }
      },
      // 根据建议按钮列表刷新按钮
      refreshButtonsUI() {
        let n = 0;

        n = (this.stateList.length - 1) * 0.65;

        if (this.isReduction) {
          n += 1;
        } else {
          // 是否登录
          [1, 2].includes(this.isLogin) && n++;
          // 离席按钮
          this.isLeave === 1 ? (n += this.leaveReasonSettingsData.length) : this.isLeave === 2 ? (n += 1) : null;
          // 模式按钮
          if (this.isMode) n += this.workModeSettingsData.length;
        }
        if (this.agentWorkMode == 1) {
          n -= this.leaveReasonSettingsData.length;
        }
        this.selectNum = n;
      },
      // 离席 小休-0 开会-1 就餐-2 其他工作-3
      leaveFn(n) {
        this.leave = n;
        this.$emit('leaveFn', n);
      },
      // 复席
      reinstatementFn() {
        this.$emit('reinstatement');
      },
      // 已被替换，还原连接
      reductionFn() {
        this.$emit('reduction');
      },
      // 登录登出 1-登录 2-退出
      loginFn(n) {
        // eslint-disable-next-line eqeqeq
        if (n == 1 && this.telType == 1) {
          this.loginDialog = true;
          return;
        }
        this.$emit('login', n);
        this.selectStatus = 0;
      },
      // IP话机登录确认
      loginConfirm() {
        if (!this.telNo) return ElMessage.info('请选择分机号后登录');
        this.$emit('login', 1, this.telNo);
        this.loginDialog = false;
        this.selectStatus = 0;
      },
      // 设置模式
      setWorkMode(n) {
        this.mode = n;
        this.$emit('setWorkMode', n);
      },
      // 开启监听
      monitorFn() {
        document.addEventListener('click', () => {
          this.selectStatus = 0;
        });
      },
      // 取消监听
      cancelMonitorFn() {
        document.removeEventListener('click', () => {
          this.selectStatus = 0;
        });
      }
    }
  };
</script>
<style scoped lang="scss">
  .select-wrapper {
    background: #f3f6fd;
    border-radius: 22px;
    opacity: 0.6983;
    height: 42px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    transition: all 0.4s;
    overflow: hidden;
    .select-box {
      width: 260px;
      height: 42px;
      cursor: pointer;
      flex-shrink: 0;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 0 15px;
      box-sizing: border-box;
      .s-b-content {
        width: 78%;
        height: 42px;
        line-height: 42px;
        font-size: 14px;
        color: #004785;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
      }
      .s-b-icon-left {
        height: 42px;
        .s-b-svg-style {
          height: 100%;
          font-size: 21px;
          color: #004785;
        }
      }
      .s-b-icon-right {
        height: 42px;
        line-height: 42px;
        color: #004785;
      }
    }
    .select-list {
      flex-shrink: 0;
      width: 100%;
      box-sizing: border-box;
      .select-list-model {
        width: 100%;
        border-bottom: 1px solid #eee;
        box-sizing: border-box;
        .s-l-m-item {
          width: 100%;
          padding: 12px 15px;
          font-size: 14px;
          color: #262626;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .s-l-m-i-svg-icon {
            opacity: 0;
          }
        }
        .s-l-m-item:hover {
          background: #f7f7f7;
        }
        .selected {
          color: #44a8ff;
          position: relative;
          .s-l-m-i-svg-icon {
            opacity: 1;
          }
        }
      }
    }
  }
  .active-select-wrapper {
    background: #fff;
    opacity: 1;
    box-shadow: 0px 10px 32px 0px rgba(38, 38, 38, 0.18);
    .select-box {
      // height: 90px;
      height: auto;
      border-bottom: 1px solid #eee;
      box-sizing: border-box;
      .s-b-content {
        height: 100%;
        display: flex;
        flex-direction: column;
        span:first-child {
          display: inline-block;
          margin-top: 9px;
        }
        span {
          display: inline-block;
          height: 24px;
          line-height: 24px;
        }
        span:last-child {
          margin-bottom: 7px;
        }
      }
    }
  }
  .no-border-bottom {
    border-bottom: none !important;
  }
</style>
