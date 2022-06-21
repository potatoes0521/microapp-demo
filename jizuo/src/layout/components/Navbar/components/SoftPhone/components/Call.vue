<template>
  <div class="call-content" :class="{ 'call-in': visible }">
    <div class="call-content-title">
      <img src="@/assets/img/user.png" alt="" />
    </div>
    <div class="call-content-phone">{{ phone || '未获取来电号码' }}</div>
    <div class="call-content-loading">
      <div class="bounce1"></div>
      <div class="bounce2"></div>
      <div class="bounce3"></div>
    </div>
    <div class="call-content-call animation1" @click="callFn">
      <img class="animation0" src="@/assets/img/phone.png" alt="" />
    </div>
  </div>
</template>

<script>
  export default defineComponent({
    name: 'Call',
    props: {
      phone: {
        type: [String, Number],
        default: '未获取来电号码'
      }
    },
    emits: ['destroy'],
    setup(props, { emit }) {
      const visible = ref(false);
      const show = () => {
        visible.value = true;
      };
      const hide = () => {
        visible.value = false;
        emit('destroy');
      };

      const callFn = () => {
        if (!window.wssp) hide();
        window.wssp.callSPFunction(42);
        hide();
      };
      return {
        visible,
        show,
        hide,
        callFn
      };
    }
  });
</script>
<style scoped lang="scss">
  .call-content {
    transition: all 0.3s;
    position: absolute;
    left: 50%;
    top: 74px;
    z-index: 9999;
    transform: translateX(-50%);
    width: 259px;
    height: 258px;
    border-radius: 4px;
    background: linear-gradient(170deg, #5dd9aa 0%, #0095ff 100%);
    box-shadow: 0 0 30px 0px rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .call-content-title {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .call-content-phone {
      color: #fff;
      text-align: center;
      font-size: 17px;
      letter-spacing: 1px;
      margin-top: 15px;
    }
    .call-content-loading {
      margin: 5px auto;
      width: 100%;
      text-align: center;
      div {
        width: 10px;
        height: 10px;
        background-color: #fff;
        border-radius: 100%;
        display: inline-block;
        -webkit-animation: bouncedelay 1.4s infinite ease-in-out;
        animation: bouncedelay 1.4s infinite ease-in-out;
        /* Prevent first frame from flickering when animation starts */
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
        margin: 0 4px;
      }
      .bounce1 {
        -webkit-animation-delay: -0.32s;
        animation-delay: -0.32s;
      }
      .bounce2 {
        -webkit-animation-delay: -0.16s;
        animation-delay: -0.16s;
      }
    }
    .call-content-call {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      background-color: #fff;
      margin-top: 15px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 55%;
        height: 55%;
      }
    }
  }
  @-webkit-keyframes bouncedelay {
    0%,
    80%,
    100% {
      -webkit-transform: scale(0);
      opacity: 0;
    }
    40% {
      -webkit-transform: scale(1);
      opacity: 0.9;
    }
  }
  @keyframes bouncedelay {
    0%,
    80%,
    100% {
      transform: scale(0);
      -webkit-transform: scale(0);
      opacity: 0;
    }
    40% {
      transform: scale(1);
      -webkit-transform: scale(1);
      opacity: 0.9;
    }
  }
  .animation0 {
    animation: butan0 1s infinite reverse;
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
  .animation1 {
    animation: butan1 2s infinite;
  }
  @keyframes butan1 {
    0% {
      transform: scale(1, 1);
    }
    50% {
      transform: scale(1.1, 1.1);
    }
  }
  .call-in {
    transform: translate(-50%, 0px);
    opacity: 1;
    animation: callin 0.3s;
  }
  @keyframes callin {
    0% {
      transform: translate(-50%, -500px);
      opacity: 0;
    }
    100% {
      transform: translate(-50%, 0px);
      opacity: 1;
    }
  }
</style>
