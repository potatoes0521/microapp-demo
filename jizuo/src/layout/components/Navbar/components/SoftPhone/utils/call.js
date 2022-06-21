/*
 * @LastEditors: 
 * @Description: ...
 * @Date: 2021-12-22 14:18:13
 * @LastEditTime: 2022-04-14 11:57:27
 * @Author: 
 */
import { createVNode, render, isVNode } from 'vue';

import Call from '../components/Call.vue';

export default {
  install(app) {
    app.config.globalProperties.$call = function (options) {
      const comp = create(Call, options);
      comp.show();
      return comp;
    };
  }
};

function create(Component, props) {
  const container = document.createElement('div');

  const vm = createVNode(
    Component,
    props,
    isVNode(props.phone)
      ? {
        default: () => props.phone
      }
      : null
  );

  render(vm, container);
  document.body.appendChild(container.firstElementChild);

  vm.props.onDestroy = () => {
    render(null, container);
  };

  return {
    hide: () => {
      vm.component.proxy.hide();
    },
    show: () => {
      vm.component.proxy.show();
    }
  };
}
