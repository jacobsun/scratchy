import {on, qs, qsa, delegate} from './module/helpers'
export default class View {
  constructor () {
    this.doms = {
      body: qs('body'),
      create: qs('.create'),
      contentContainer: qs('.content-container'),
      textarea: qs('textarea'),
      save: qs('.save'),
      selectFolder: qs('.select-folder'),
      overlay: qs('.overlay'),
      overlayCancel: qs('.overlay-cancel'),
      overlayConfirm: qs('.overlay-confirm'),
      overlayInput: qs('input', this.doms.overlay)
    }
    this.bindCancelOverlay()
  }

  bindToggleFolder (cb) {
    delegate(this.doms.body, '.item-title', 'click', ({ target }) => {
      let $treeItem = target.parentNode.parentNode
      $treeItem.classList.toggle('expanded')
      let childItems = qsa('.tree-item', $treeItem)
      Array.prototype.forEach.call(childItems, item => {
        item.classList.remove('expanded')
      })
    }, false)
  }

  bindCreate (cb) {
    on(this.doms.create, 'click', ({target}) => {
      this.doms.contentContainer.classList.add('edit')
      this._fixTextareaHeight()
      cb(target)
    }, false)
  }

  _fixTextareaHeight () {
    let wh = parseInt(window.innerHeight)
    this.doms.textarea.style.minHeight = (wh - 188) + 'px'
  }

  bindSave (cb) {
    on(this.doms.save, 'click', (evt) => {
      cb(this.doms.textarea.value, this.doms.selectFolder.value)
    }, false)
  }

  bindSelect () {
    on(this.doms.selectFolder, 'change', ({target}) => {
      if (target.value === '__new_folder__') {
        this.activeOverlay()
      }
    })
  }

  bindCancelOverlay () {
    on(this.doms.overlayCancel, 'click', (evt) => {
      this.CancelOverlay()
    }, false)
  }

  bindConfirmOverlay (cb) {
    on(this.doms.overlayConfirm, 'click', (evt) => {
      this.CancelOverlay()
      cb(this.doms.overlayInput.value)
    }, false)
  }
  CancelOverlay () {
    this.doms.overlay.classList.remove('active')
  }
  activeOverlay () {
    this.doms.overlay.classList.add('active')
  }
}
