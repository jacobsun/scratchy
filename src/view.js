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
      noteLists: qs('.list-container ul'),
      contentTitle: qs('.content .title'),
      contentBody: qs('.content-body'),
      contentHeader: qs('.content header'),
      contentPreview: qs('.content .preview'),
      contentSave: qs('.content .save'),
      contentEdit: qs('.content .edit'),
      contentRemove: qs('.content .remove'),
      contentCopy: qs('.content .copy')
    }
    this.expandedTree = []
    this.bindCreate()
    this.bindSelect()
    this.bindCancelOverlay()
    this.bindOverlayInput()
    this.bindFolderRename()
    this.bindCreateSubFolder()
    this.bindToggleFolder()
  }

  bindToggleFolder () {
    delegate(this.doms.body, '.item-title', 'dblclick', ({ target }) => {
      let $treeItem = target.parentNode.parentNode
      if (!$treeItem.classList.contains('expandable')) return
      $treeItem.classList.toggle('expanded')
      this.recordExpandedStatus($treeItem, target.dataset.id)
      let childItems = qsa('.tree-item', $treeItem)
      Array.prototype.forEach.call(childItems, item => {
        item.classList.remove('expanded')
      })
    }, false)
  }
  bindSelectFolderList (cb) {
    delegate(this.doms.body, '.item-title', 'click', ({ target }) => {
      let items = qsa('.item-title')
      items.forEach(item => item.classList.remove('selectedFolder'))
      target.classList.add('selectedFolder')
      // this.selectedFolder = target.dataset.id
      cb(this.folder)
    }, false)
  }

  recordExpandedStatus (clickedItem, id) {
    let isExpanded = clickedItem.classList.contains('expanded')
    let i = this.expandedTree.indexOf(id)
    // not record
    if (i < 0) {
      if (isExpanded) {
        console.log('push', id)
        this.expandedTree.push(id)
      }
    } else {
      // recorded
      if (!isExpanded) {
        console.log('remove', id)
        this.expandedTree.splice(i, 1)
      }
    }
  }

  updateNoteList (data) {
    this.doms.noteLists.innerHTML = this.template.noteLists(data)
  }

  bindCreate () {
    on(this.doms.create, 'click', (evt) => {
      evt.preventDefault()
      this.doms.textarea.value = ''
      this.doms.contentContainer.classList.add('edit')
      this._fixTextareaHeight()
    }, false)
  }

  _fixTextareaHeight () {
    let wh = parseInt(window.innerHeight)
    this.doms.textarea.style.minHeight = (wh - 188) + 'px'
  }

  bindSave (cb) {
    on(this.doms.save, 'click', (evt) => {
      evt.preventDefault()
      cb(this.doms.textarea.value, this.doms.selectFolder.value)
    }, false)
  }

  bindSelect () {
    on(this.doms.selectFolder, 'change', ({target}) => {
      let v = target.value.split('_')
      if (v[0] === 'newfolder') {
        this.parentName = v[1]
        this.activeOverlay()
      }
    })
  }

  bindCancelOverlay () {
    on(this.doms.overlayCancel, 'click', (evt) => {
      evt.preventDefault()
      this.CancelOverlay()
    }, false)
  }

  bindConfirmOverlay (cb) {
    on(this.doms.overlayConfirm, 'click', (evt) => {
      evt.preventDefault()
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
  updateSelectFolder (data) {
    this.doms.selectFolder.innerHTML = this.template.selectContent(data)
  }
  clearStatus () {
    this.parentName = ''
    this.oldName = ''
    this.doms.overlayInput.value = ''
    this.CancelOverlay()
  }
  updateTree (data) {
    this.doms.tree.innerHTML = this.template.treeContent(data, this.expandedTree)
  }

  bindFolderRename () {
    delegate(this.doms.body, '.rename-folder', 'click', (evt) => {
      evt.preventDefault()
      this.oldName = evt.target.parentNode.parentNode.dataset.id
      this.activeOverlay()
    }, false)
  }

  bindFolderRemove (cb) {
    delegate(this.doms.body, '.remove-folder', 'click', (evt) => {
      evt.preventDefault()
      cb(evt.target.parentNode.parentNode.dataset.id)
    }, false)
  }

  bindCreateSubFolder (cb) {
    delegate(this.doms.body, '.create-sub', 'click', (evt) => {
      evt.preventDefault()
      this.parentName = evt.target.parentNode.parentNode.dataset.id
      if (this.expandedTree.indexOf(this.parentName) < 0) {
        this.expandedTree.push(this.parentName)
      }
      this.activeOverlay()
    }, false)
  }

  bindItemRemove (cb) {
    delegate(this.doms.body, '.remove-item', 'click', (evt) => {
      evt.preventDefault()
      cb(evt.target.parentNode.dataset.id)
    }, false)
  }

  showItem (data) {
    if (!data) {
      this.doms.textarea.value = ''
      this.doms.contentContainer.classList.add('edit')
      this._fixTextareaHeight()
      return
    }
    this.doms.contentContainer.classList.remove('edit')
    this.doms.contentTitle.innerHTML = data.title
    this.doms.contentHeader.dataset.id = data.id
    this.doms.contentBody.innerHTML = this.template.contentBody(data)
  }

  // bindContentPreview (cb) {
  //   on(this.doms.contentPreview, 'click', (evt) => {
  //     evt.preventDefault()
  //     cb(this.doms.textarea.value)
  //   })
  // }

  // bindEdit (cb) {
  //   on(this.doms.contentEdit, 'click', evt => {
  //     evt.preventDefault()
  //     cb()
  //   })
  // }

  // fillTextarea (data) {
  //   this.doms.textarea.value = data
  //   this._fixTextareaHeight()
  //   this.doms.contentContainer.classList.add('edit')
  // }
  bindContentRemove (cb) {
    on(this.doms.contentRemove, 'click', evt => {
      evt.preventDefault()
      cb(evt.target.parentNode.parentNode.dataset.id)
    })
  }
}
