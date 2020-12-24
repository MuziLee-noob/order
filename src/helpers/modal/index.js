import modalContainer from './modalContainer'
import Vue from 'vue'
import './modal.less'

const Modal = {
  dynamicContainer: null,
  event: new Vue(),
  dialog: {
    _setDynamicContainer(container) {
      Modal.dynamicContainer = container
    },

    /**
     *
     * clear all ModalComponent
     */
    clear() {
      if (
        Modal.dynamicContainer &&
        Modal.dynamicContainer.modals &&
        Modal.dynamicContainer.modals.length
      ) {
        Modal.dynamicContainer.modals = []
      }
    },

    /**
     *
     * @param {Object} modalComponent : 组件选项对象
     * @param {Object} props
     */
    openWindow(modalComponent, props) {
      return new Promise((resolve, reject) => {
        Modal.dynamicContainer.add(modalComponent, props, {
          resolve: resolve,
          reject: reject
        })
      })
    }
  }
}

const modal = {
  install: function(Vue) {
    Vue.prototype.modalService = Modal.dialog
    /** 注册并挂载 <modalContainer/> */
    const modalsContainer = document.createElement('div')
    document.body.appendChild(modalsContainer)
    new Vue({
      render: h => h(modalContainer)
    }).$mount(modalsContainer)
  }
}

export { modal as default, Modal }
