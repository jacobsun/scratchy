import {on, qs, qsa, delegate} from './module/helpers'
export default class View {
  constructor (template) {
    this.template = template
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
      overlayInput: qs('.overlay input'),
      tree: qs('.tree-container > .tree'),
      noteLists: qs('.list-container ul')
    }
    this.bindSelect()
    this.bindCancelOverlay()
    this.bindOverlayInput()
    this.bindFolderRename()
    this.bindFolderSub()
  }

  bindToggleFolder (cb) {
    delegate(this.doms.body, '.item-title', 'click', ({ target }) => {
      let $treeItem = target.parentNode.parentNode
      if (!$treeItem.classList.contains('expandable')) {
        return cb(target.dataset.name)
      }
      $treeItem.classList.toggle('expanded')
      let childItems = qsa('.tree-item', $treeItem)
      Array.prototype.forEach.call(childItems, item => {
        item.classList.remove('expanded')
      })
      cb(target.dataset.name)
    }, false)
  }

  updateNoteList (data) {
    this.doms.noteLists.innerHTML = this.template.noteLists(data)
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
      let v = this.doms.overlayInput.value.trim()
      if (v.length > 0) {
        cb(this.parentName, this.oldName, v)
      }
    }, false)
  }
  bindOverlayInput () {
    on(this.doms.overlayInput, 'input', ({ target }) => {
      this.overlayErrorClear()
    })
  }
  CancelOverlay () {
    this.doms.overlay.classList.remove('active')
  }
  activeOverlay () {
    this.doms.overlay.classList.add('active')
    this.doms.overlayInput.focus()
  }
  overlayError () {
    this.doms.overlay.classList.add('error')
  }
  overlayErrorClear () {
    this.doms.overlay.classList.remove('error')
  }
  updateFolder (data) {
    this.parentName = ''
    this.oldName = ''
    this.doms.overlayInput.value = ''
    this.CancelOverlay()
    this.doms.selectFolder.innerHTML = this.template.selectContent(data)
  }
  updateTree (data) {
    this.doms.tree.innerHTML = this.template.treeContent(data)
  }

  bindFolderRename () {
    delegate(this.doms.body, '.rename-folder', 'click', ({target}) => {
      this.oldName = target.parentNode.parentNode.dataset.name
      this.activeOverlay()
    }, false)
  }

  bindFolderRemove (cb) {
    delegate(this.doms.body, '.remove-folder', 'click', ({target}) => {
      cb(target.parentNode.parentNode.dataset.name)
    }, false)
  }

  bindFolderSub (cb) {
    delegate(this.doms.body, '.create-sub', 'click', ({ target }) => {
      this.parentName = target.parentNode.parentNode.dataset.name
      this.activeOverlay()
    }, false)
  }
}
