<template>
  <div class="button-wrapper">
    <!--  等待 -->
    <div v-if="!isComplete && !isHangUp && !isAnswer" class="button-wait center box-size-42 cursor">
      <div class="button-wait-content box-size-40 center click-active transition">
        <icon-softphone-phone1 class="text-[var(--xx-text-color-regular)] text-[0.8rem]" />
      </div>
    </div>
    <!--  完成 -->
    <div v-if="isComplete" class="button-over center box-size-42 cursor" @click="$emit('complete')">
      <div class="button-over-content box-size-40 center click-active transition">
        <icon-softphone-dui class="text-[var(--xx-text-color-regular)] text-[0.8rem]" />
      </div>
    </div>
    <!--  挂断 -->
    <div v-if="isHangUp" class="button-hangup center box-size-42 cursor" @click="$emit('hangUp')">
      <div class="button-hangup-content box-size-40 center click-active transition">
        <icon-softphone-phone2 class="text-[var(--xx-text-color-regular)] text-[0.8rem]" />
      </div>
    </div>
    <!--  接听 -->
    <div v-if="isAnswer" class="button-answer center box-size-42 cursor" @click="$emit('answer')">
      <div class="button-answer-shadow1 box-size-38 center animation1">
        <div class="button-answer-shadow2 box-size-31 center animation2">
          <div class="button-answer-content box-size-29 center click-active transition animation0">
            <icon-softphone-phone1 class="text-[var(--xx-text-color-regular)] text-[0.8rem]" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // import { XIcon } from '@xiaoshi/xiaoshi-components';

  export default {
    name: 'ConversationButton',
    // components: {
    //   XIcon
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
      }
    },
    emits: ['complete', 'hangUp', 'answer'],
    data() {
      return {};
    },
    computed: {
      // 完成
      isComplete() {
        return this.proposalButton.some((v) => v.id === 31 && v.enabled);
      },
      // 挂断
      isHangUp() {
        return this.proposalButton.some((v) => v.id === 10 && v.enabled);
      },
      // 接听
      isAnswer() {
        return this.proposalButton.some((v) => v.id === 42 && v.enabled);
      }
    },
    watch: {
      proposalButton: {
        handler(n) {
          console.log(111111111111111, n);
        }
      }
    }
  };
</script>
<style scoped lang="scss">
  .button-wrapper {
    display: flex;
    .button-wait {
      background: #f3f6fd;
      .button-wait-content {
        background-color: #e6e6e6;
        color: #999999;
      }
    }
    .button-hangup {
      background: #f3f6fd;
      .button-hangup-content {
        font-size: 24px;
        background-color: #f6504d;
        color: #ffffff;
      }
    }
    .button-over {
      background: #f3f6fd;
      .button-over-content {
        font-size: 22px;
        background-color: #06d186;
        color: #ffffff;
      }
    }
    .button-answer {
      background: #f3f6fd;
      position: relative;
      .button-answer-shadow1 {
        position: absolute;
        background-color: rgba(6, 209, 134, 0.3);
        // box-shadow: 0 0 2px 0 #06d186;
      }
      .button-answer-shadow2 {
        position: absolute;
        background-color: rgba(6, 209, 134, 0.4);
        // box-shadow: 0 0 2px 0 #06d186;
      }
      .button-answer-content {
        position: absolute;
        background-color: #06d186;
        color: #ffffff;
        box-shadow: 0 0 2px 0 #06d186;
      }
    }
  }
  .animation0 {
    animation: butan0 1s infinite reverse;
  }
  .animation1 {
    animation: butan1 2s infinite;
  }
  .animation2 {
    animation: butan1 2s 0.6s infinite;
  }
  @keyframes butan0 {
    0% {
      transform: scale(1, 1);
    }
    50% {
      transform: scale(0.95, 0.95) rotateZ(20deg);
    }
    100% {
      transform: scale(1, 1);
    }
  }
  @keyframes butan1 {
    0% {
      width: 0;
      height: 0;
      background: rgba(6, 209, 134, 0.6);
    }
    100% {
      width: 70px;
      height: 70px;
      background: rgba(6, 209, 134, 0.05);
    }
  }
  .transition {
    transition: all 0.3s;
  }
  .click-active:active {
    transform: scale(0.95, 0.95);
  }
  .mr-10 {
    margin-right: 10px;
  }
  .cursor {
    cursor: pointer;
  }
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .box-size-42 {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    overflow: hidden;
  }
  .box-size-38 {
    width: 38px;
    height: 38px;
    border-radius: 50%;
  }
  .box-size-40 {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  .box-size-31 {
    width: 31px;
    height: 31px;
    border-radius: 50%;
  }
  .box-size-29 {
    width: 29px;
    height: 29px;
    border-radius: 50%;
  }
  .box-size-32 {
    width: 32px;
    height: 32px;
    border-radius: 50%;
  }
</style>
