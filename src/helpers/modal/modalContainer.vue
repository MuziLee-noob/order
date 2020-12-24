<template>
  <div class="modal-container" ref="modal">
    <div :key="modal.id" class="modal-container-box" v-for="modal in modals">
      <Modal :value.sync="modal.visible" @on-cancel="remove(modal.id)" v-bind="modal.config">
        <component
          :is="modal.component"
          @cancel="remove(modal.id)"
          @close="close(modal.id, $event)"
          v-bind="modal.contentConfig"
          v-on="$listeners"
        ></component>
      </Modal>
    </div>
  </div>
</template>

<script>
import * as _ from 'lodash'

export default {
  data() {
    return {
      uid: 0,
      modals: []
    }
  },
  beforeMount() {},
  created() {
    this.modalService._setDynamicContainer(this)
  },
  methods: {
    add(modal, config = {}, promise) {
      let id = this.uid++
      if (modal) {
        let contentConfig = _.cloneDeep(config)
        delete contentConfig.title
        let modalDefaultOptions = {
          maskClosable: false,
          footerHide: true,
          transfer: false,
          zIndex: 2000
        }
        config = _.extend(modalDefaultOptions, config, {
          className: config.className ? `one-fusion-modal ${config.className}` : 'one-fusion-modal'
        })
        this.modals.push({
          id: id,
          visible: true,
          config: config,
          contentConfig: contentConfig,
          component: modal,
          promise: promise
        })
      }
    },
    remove(id, params = {}) {
      for (let i in this.modals) {
        if (this.modals[i].id === id) {
          this.modals.splice(i, 1)
          return
        }
      }
    },
    close(id, $event) {
      for (let i in this.modals) {
        if (this.modals[i].id === id) {
          let { resolve, reject } = this.modals[i].promise
          let reParams = _.cloneDeep($event)
          resolve({
            data: reParams,
            props: this.modals[i].contentConfig,
            close: () => {
              this.modals.splice(i, 1)
            }
          })
          return
        }
      }
    }
    // closeModal(id, $event) {
    //   for (let i in this.modals) {
    //     if (this.modals[i].id === id) {
    //       let { resolve, reject } = this.modals[i].promise
    //       let reParams = _.extend({ type: type }, $event)
    //       resolve(reParams)
    //       this.modals.splice(i, 1)
    //       return
    //     }
    //   }
    // }
  }
}
</script>

<style></style>
