<template>
  <div class="people-num-wrapper">
    <el-popover placement="bottom" width="400" height="400" trigger="click">
      <el-table :data="queueList" size="small" border>
        <el-table-column property="phoneNum" label="号码"></el-table-column>
        <el-table-column property="coType" label="VIP"></el-table-column>
        <el-table-column property="sK" label="技能"></el-table-column>
      </el-table>
      <template #reference>
        <div class="p-n-w-button">
          <icon-softphone-people class="people-svg-icon" />
          <!--  x-icon(iconClass="@people" className="people-svg-icon") -->
          <span>{{ queueList.length }}</span>
        </div>
      </template>
    </el-popover>
  </div>
</template>

<script>
  // import { XIcon } from '@xiaoshi/xiaoshi-components';

  export default {
    name: 'PeopleNumButton',
    // components: {
    //   XIcon
    // },
    props: {
      queueList: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {};
    }
  };
</script>
<style scoped lang="scss">
  .people-num-wrapper {
    .p-n-w-button {
      height: 42px;
      background: #f3f6fd;
      color: #06d186;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 21px;
      padding: 0 18px;
      box-sizing: border-box;
      cursor: pointer;
      .people-svg-icon {
        color: #06d186;
        margin-right: 8px;
      }
      span {
        font-size: 14px;
      }
    }
  }
</style>
