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
      contentCopy: qs('.content .copy'),
      createNewFolder: qs('.new-folder'),
      searchBar: qs('.search input')
    }
    this.defaultContent = {
      title: this.doms.contentTitle.innerHTML,
      body: this.doms.contentBody.innerHTML
    }
    this.expandedTree = []
    this.bindCreate()
    this.bindSelect()
    this.bindCancelOverlay()
    this.bindOverlayInput()
    this.bindFolderRename()
    this.bindCreateSubFolder()
    this.bindToggleFolder()
    // this.bindCreateNewFolder()
    this.bindContentPreview()
    this.bindSearch()
    this.bindOverlayInput()
    this.bindCancelOverlayViaEsc()
    this.bindTextareaInput()
    this.flash = true
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
      cb(this.folder)
    }, false)
  }

  recordExpandedStatus (clickedItem, id) {
    let isExpanded = clickedItem.classList.contains('expanded')
    let i = this.expandedTree.indexOf(id)
    // not record
    if (i < 0) {
      if (isExpanded) {
        this.expandedTree.push(id)
      }
    } else {
      // recorded
      if (!isExpanded) {
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
      // replay animation hack
      this.doms.textarea.classList.remove('visual-feedback')
      void this.doms.textarea.offsetWidth
      // hack end
      this.doms.textarea.classList.add('visual-feedback')
      this.editorErrorClear()
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
      let input = this.doms.textarea.value.trim()
      if (input.length === 0) {
        this.editorError()
        return
      }
      let info = {
        mode: this.doms.textarea.dataset.mode,
        id: this.doms.textarea.dataset.id
      }
      if (this.doms.selectFolder.value.match(/newfolder_/)) {
        alert('Please create a folder using the left button first.')
        return
      }
      cb(input, this.doms.selectFolder.value, info)
    }, false)
  }

  bindTextareaInput () {
    on(this.doms.textarea, 'focus', ({ target }) => {
      this.editorErrorClear()
    }, true)
  }

  editorError () {
    this.doms.textarea.classList.add('error')
  }

  editorErrorClear () {
    this.doms.textarea.classList.remove('error')
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
      } else {
        this.overlayError()
      }
    }, false)
  }

  bindConfirmOverlayViaEnter (cb) {
    delegate(this.doms.body, '.overlay input', 'keypress', evt => {
      if (evt.keyCode === 13) {
        let v = this.doms.overlayInput.value.trim()
        if (v.length > 0) {
          cb(this.parentName, this.oldName, v)
        } else {
          this.overlayError()
        }
      }
    }, false)
  }

  bindCancelOverlayViaEsc () {
    delegate(this.doms.body, '.overlay input', 'keyup', evt => {
      if (evt.keyCode === 27) {
        this.CancelOverlay()
        this.doms.overlayInput.value = ''
      }
    }, false)
  }

  bindOverlayInput () {
    on(this.doms.overlayInput, 'focus', ({ target }) => {
      this.overlayErrorClear()
    }, true)
  }
  CancelOverlay () {
    this.doms.overlay.classList.remove('active')
  }
  activeOverlay () {
    this.overlayErrorClear()
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
    this.resetTextarea()
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

  bindCreateSubFolder () {
    delegate(this.doms.body, '.create-sub', 'click', (evt) => {
      evt.preventDefault()
      this.parentName = evt.target.parentNode.parentNode.dataset.id
      if (this.expandedTree.indexOf(this.parentName) < 0) {
        this.expandedTree.push(this.parentName)
      }
      this.activeOverlay()
    }, false)
  }
  bindCreateNewFolder () {
    delegate(this.doms.tree, '.new-folder', 'click', (evt) => {
      evt.preventDefault()
      this.parentName = evt.target.dataset.root
      this.activeOverlay()
    }, false)
  }

  bindItemRemove (cb) {
    delegate(this.doms.body, '.remove-item', 'click', (evt) => {
      evt.preventDefault()
      let item = evt.target.parentNode
      cb(item.dataset.id, item.dataset.folder)
    }, false)
  }

  showItem (data, folder) {
    if (!data) {
      this.doms.textarea.value = ''
      this.doms.contentHeader.classList.add('no-content')
      this.doms.contentTitle.innerHTML = this.defaultContent.title
      this.doms.contentBody.innerHTML = this.defaultContent.body
      return
    }
    this.doms.contentHeader.classList.remove('no-content')
    this.doms.contentContainer.classList.remove('edit')
    this.doms.contentTitle.innerHTML = data.title
    this.doms.contentBody.innerHTML = this.template.contentBody(data)
    this.doms.contentHeader.dataset.id = data.id
    this.doms.contentHeader.dataset.folder = folder
  }

  bindContentPreview (cb) {
    delegate(this.doms.contentContainer, '.preview', 'click', (evt) => {
      evt.preventDefault()
      alert('This is for markdown, but it is not implemented now, maybe later.')
    })
  }

  bindEdit (cb) {
    on(this.doms.contentEdit, 'click', evt => {
      evt.preventDefault()
      let item = evt.target.parentNode.parentNode
      cb(item.dataset.id, item.dataset.folder)
    })
  }

  fillTextarea (data, folder) {
    this.doms.textarea.value = data.content
    this.doms.textarea.dataset.mode = 'edit'
    this.doms.textarea.dataset.id = data.id
    this.doms.selectFolder.value = folder
    this._fixTextareaHeight()
    this.doms.contentContainer.classList.add('edit')
  }

  resetTextarea () {
    this.doms.textarea.dataset.mode = ''
    this.doms.textarea.dataset.id = ''
    this.doms.selectFolder.value = ''
  }
  bindContentRemove (cb) {
    on(this.doms.contentRemove, 'click', evt => {
      evt.preventDefault()
      let item = evt.target.parentNode.parentNode
      cb(item.dataset.id, item.dataset.folder)
    })
  }

  bindSearch () {
    on(this.doms.searchBar, 'focus', evt => {
      if (this.flash) {
        alert('Sorry, searching is not available right now.')
        this.flash = false
      }
    }, true)
  }
}
