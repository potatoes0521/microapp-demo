<template>
  <el-dialog
    v-model="isModel"
    title="请选择坐席控制"
    width="500px"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="beforeClose"
    custom-class="dialog-agent"
  >
    <div class="dialog-agent-box">
      <div class="list-search">
        <el-input v-model="inp" :placeholder="`请输入${tab == 1 ? '坐席' : '分机'}号搜索`" :prefix-icon="Search"></el-input>
      </div>
      <!--  .list-title//  .list-title-tab(@click="changeTab(1)" :class="{'tab-active': tab == 1}") 坐席列表
        .list-title-tab(@click="changeTab(2)" :class="{'tab-active': tab == 2}") 分机列表 -->
      <div v-if="tab == 1" class="list-content">
        <div v-if="sitDownList.length === 0" class="list-no-data">暂无数据</div>
        <div v-for="(item, i) of sitDownList" :key="i" class="list-item">
          <div class="l-i-lef">
            <span>{{ item.ins }}</span>
            <span>{{ item.agentName }} {{ item.workID }}</span>
          </div>
          <div class="l-i-cen">
            <span>{{ getWorkModeStateName(item.workMode, item.state) }}</span>
          </div>
          <div class="l-i-bot">
            <!--  监听 -->
            <template v-if="item.state == '6'">
              <el-popover v-model:visible="item.visible1" placement="top" width="160" trigger="hover">
                <p>请确认是否进行监听?</p>
                <div style="text-align: right; margin: 0">
                  <el-button type="text" @click="item.visible1 = false">取消</el-button
                  ><el-button type="primary" @click="handleOperation(item, 0)">确定</el-button>
                </div>
                <template #reference>
                  <!-- <x-icon v-if="item.state == '6'" icon-class="@monitor" class-name="l-i-bot-svg-icon"></x-icon> -->
                  <icon-softphone-monitor v-if="item.state == '6'" class="l-i-bot-svg-icon" />
                </template>
              </el-popover>
            </template>
            <!--  强制完成 -->
            <template v-if="item.state == '19'">
              <el-popover v-model:visible="item.visible2" placement="top" width="160" trigger="hover">
                <p>请确认是否强制完成话后模式?</p>
                <div style="text-align: right; margin: 0">
                  <el-button type="text" @click="item.visible2 = false">取消</el-button
                  ><el-button type="primary" @click="handleOperation(item, 4)">确定</el-button>
                </div>
                <template #reference>
                  <!-- <x-icon v-if="item.state == '19'" icon-class="@success" class-name="l-i-bot-svg-icon"></x-icon> -->
                  <icon-softphone-success v-if="item.state == '19'" class="l-i-bot-svg-icon" />
                </template>
              </el-popover>
            </template>
            <!--  强制签出 -->
            <template v-if="signOutShow(item.state)">
              <el-popover v-model:visible="item.visible3" placement="top" width="160" trigger="hover">
                <p>请确认是否强制签退该坐席?</p>
                <div style="text-align: right; margin: 0">
                  <el-button type="text" @click="item.visible3 = false">取消</el-button
                  ><el-button type="primary" @click="handleOperation(item, 1)">确定</el-button>
                </div>
                <template #reference>
                  <icon-softphone-qianchu v-if="signOutShow(item.state)" class="l-i-bot-svg-icon" />
                  <!-- <x-icon v-if="signOutShow(item.state)" icon-class="@qianchu" class-name="l-i-bot-svg-icon"></x-icon> -->
                </template>
              </el-popover>
            </template>
          </div>
        </div>
      </div>
      <div v-if="tab == 2" class="list-content">
        <div v-if="extensionList.length === 0" class="list-no-data">暂无数据</div>
        <div v-for="(item, i) of extensionList" :key="i" class="list-item">
          <div class="l-i-lef">
            <span>{{ item.ins }}</span>
            <span>{{ item.devowner }}</span>
          </div>
          <div class="l-i-cen"><span>内部分机-空闲</span></div>
          <div class="l-i-bot">
            <!--  监听 -->
            <template v-if="item.state == '6'">
              <el-popover v-model:visible="item.visible1" placement="top" width="160" trigger="hover">
                <p>请确认是否进行监听?</p>
                <div style="text-align: right; margin: 0">
                  <el-button type="text" @click="item.visible1 = false">取消</el-button>
                  <el-button type="primary" @click="handleOperation(item, 0)">确定</el-button>
                </div>
                <template #reference>
                  <icon-softphone-monitor v-if="item.state == '6'" class="l-i-bot-svg-icon" />
                  <!-- <x-icon v-if="item.state == '6'" icon-class="@monitor" class-name="l-i-bot-svg-icon"></x-icon> -->
                </template>
              </el-popover>
            </template>
            <!--  强制完成 -->
            <template v-if="item.state == '19'">
              <el-popover v-model:visible="item.visible2" placement="top" width="160" trigger="hover">
                <p>请确认是否强制进入话后模式?</p>
                <div style="text-align: right; margin: 0">
                  <el-button type="text" @click="item.visible2 = false">取消</el-button>
                  <el-button type="primary" @click="handleOperation(item, 4)">确定</el-button>
                </div>
                <template #reference>
                  <icon-softphone-success v-if="item.state == '19'" class="l-i-bot-svg-icon" />
                  <!-- <x-icon v-if="item.state == '19'" icon-class="@success" class-name="l-i-bot-svg-icon"></x-icon> -->
                </template>
              </el-popover>
            </template>
            <!--  强制签出 -->
            <template v-if="signOutShow(item.state)">
              <el-popover v-model:visible="item.visible3" placement="top" width="160" trigger="hover">
                <p>请确认是否强制签退该坐席?</p>
                <div style="text-align: right; margin: 0">
                  <el-button type="text" @click="item.visible3 = false">取消</el-button>
                  <el-button type="primary" @click="handleOperation(item, 1)">确定</el-button>
                </div>
                <template #reference>
                  <icon-softphone-qianchu v-if="signOutShow(item.state)" class="l-i-bot-svg-icon" />
                  <!-- <x-icon v-if="signOutShow(item.state)" icon-class="@qianchu" class-name="l-i-bot-svg-icon"></x-icon> -->
                </template>
              </el-popover>
            </template>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  // import { XIcon } from '@xiaoshi/xiaoshi-components';
  import { Search } from '@element-plus/icons-vue';

  export default {
    name: 'AgentListDialog',
    // components: {
    //   XIcon
    // },
    props: {
      // 类型
      agentListType: {
        type: String,
        default: ''
      },
      // 列表
      agentList: {
        type: Array,
        default: () => []
      }
    },
    setup() {
      return {
        Search
      };
    },
    data() {
      return {
        isModel: false,
        tab: 1,
        inp: '',
        sitDownList: [],
        extensionList: []
      };
    },
    computed: {
      // 强制签退是否显示
      signOutShow() {
        return (state) => {
          return ['2', '3', '19', '23'].includes(state);
        };
      }
      // sitDownList() {
      //   return this.agentList.filter((v) => v.itemType === '1' && v.ins.indexOf(this.inp) !== -1)
      // },
      // extensionList() {
      //   return this.agentList.filter((v) => v.itemType !== '1' && v.ins.indexOf(this.inp) !== -1)
      // }
    },
    watch: {
      agentList(n) {
        if (Array.isArray(n) && n.length > 0) {
          let sitDownList = [];
          let extensionList = [];
          this.agentList.map((v) => {
            if (v.itemType === '1' && v.ins.indexOf(this.inp) !== -1) {
              sitDownList.push({
                ...v,
                visible1: false,
                visible2: false,
                visible3: false
              });
            }
            if (v.itemType !== '1' && v.ins.indexOf(this.inp) !== -1) {
              extensionList.push({
                ...v,
                visible1: false,
                visible2: false,
                visible3: false
              });
            }
          });
          this.sitDownList = sitDownList;
          this.extensionList = extensionList;
        }
      }
    },
    methods: {
      // 获取状态Name及工作模式Name
      getWorkModeStateName(workMode, state) {
        return window.getWorkModeStateName(workMode, state);
      },
      // 操作
      handleOperation(item, action) {
        item.visible1 = false;
        item.visible2 = false;
        item.visible3 = false;
        let { ins } = item;
        if (!ins) return this.close();
        let destIns = ins;
        let destType = this.tab === 1 ? 'AGT' : 'EXT';

        if (action === -1) return this.close();

        let controlParam = '';
        if (action === 5) {
          controlParam = '0'; // 普通模式
        } else if (action === 6) {
          action = 5;
          controlParam = '6'; // 离席模式
        }
        console.log(action, destIns, controlParam);

        if (action === 0) {
          window.wssp.monitorAgent(destType, destIns);
        } else {
          window.wssp.monitorControl(action, destIns, controlParam);
        }

        this.close();
      },
      // 切换Tab
      changeTab(n) {
        this.inp = '';
        this.tab = n;
      },
      // 关闭前回调
      beforeClose() {
        this.close();
      },
      // 打开弹框
      open() {
        this.isModel = true;
      },
      // 关闭弹框
      close() {
        this.isModel = false;
      }
    }
  };
</script>
<style lang="scss">
  .dialog-agent {
    .el-dialog__body {
      padding: 15px 0 !important;
    }
  }
</style>
<style scoped lang="scss">
  .dialog-agent {
    .dialog-agent-box {
      .list-search {
        padding: 0 24px;
        box-sizing: border-box;
      }
      .list-title {
        width: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        font-size: 14px;
        font-weight: bold;
        color: #222222;
        padding: 0 24px;
        border-bottom: 1px solid #e6e6e6;
        box-sizing: border-box;
        .list-title-tab {
          height: 40px;
          line-height: 40px;
          cursor: pointer;
        }
        .tab-active {
          color: #44a8ff;
          border-bottom: 3px solid #44a8ff;
          box-sizing: border-box;
        }
      }
      .list-content {
        width: 100%;
        min-height: 300px;
        max-height: 500px;
        overflow-x: hidden;
        overflow-y: scroll;
        padding: 0 24px;
        box-sizing: border-box;
        .list-no-data {
          width: 100%;
          height: 200px;
          text-align: center;
          line-height: 200px;
          color: #999;
          font-size: 14px;
        }
        .list-item {
          border-bottom: 1px solid #e6e6e6;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          box-sizing: border-box;
          .l-i-lef {
            display: flex;
            flex-direction: column;
            width: 30%;
            span:first-child {
              font-size: 14px;
              font-weight: 500;
            }
            span:last-child {
              font-size: 12px;
              font-weight: 400;
              color: #999999;
              margin-top: 6px;
            }
          }
          .l-i-cen {
            width: 40%;
            display: flex;
            justify-content: center;
            align-items: center;
            span {
              display: inline-block;
              background-color: rgba(6, 209, 134, 0.1);
              color: #06d186;
              font-size: 14px;
              font-weight: 400;
              height: 24px;
              line-height: 24px;
              padding: 0 10px;
              border-radius: 14px;
              box-sizing: border-box;
            }
          }
          .l-i-bot {
            width: 30%;
            display: flex;
            justify-content: flex-end;
            .l-i-bot-svg-icon {
              font-size: 16px;
              color: #999999;
              cursor: pointer;
              margin-left: 10px;
            }
          }
        }
      }
    }
  }
</style>
