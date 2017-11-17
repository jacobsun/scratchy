export default class Controller {
  constructor (view, model) {
    this.view = view
    this.model = model
    this.view.bindSelectFolderList(this.filterNotes.bind(this))
    this.view.bindSave(this.save.bind(this))
    this.view.bindConfirmOverlay(this.saveOverlayInput.bind(this))
    this.view.bindConfirmOverlayViaEnter(this.saveOverlayInput.bind(this))
    this.view.bindFolderRemove(this.removeFolder.bind(this))
    this.view.bindItemRemove(this.removeItem.bind(this))
    this.view.bindContentRemove(this.removeItem.bind(this))
    this.view.bindEdit(this.edit.bind(this))
  }

  render () {
    this.view.clearStatus()
    this.showNote(undefined)
    this.model.getData(data => {
      this.view.updateSelectFolder(data)
      this.view.updateTree(data)
      if (location.hash.length > 2) {
        this.route()
      }
    })
  }

  route () {
    let hash = location.hash.replace(/^#\//, '')
    this.uri = hash.split('/')
    this.filterNotes(this.uri[0])
    if (this.uri.length > 1) {
      this.showNote(this.uri)
    }
  }

  filterNotes (id) {
    this.model.getFolder(id, folder => {
      this.view.updateNoteList(folder)
    })
  }

  showNote (uri) {
    if (!uri) return this.view.showItem(undefined)
    this.model.getItem(uri[0], uri[1], data => {
      this.view.showItem(data, uri[0])
    })
  }

  save (raw, folder, {mode, id}) {
    let data = raw.trim()
    if (data.length < 1) return
    if (mode === 'edit') {
      this.model.editNote({data, folder, id}, note => {
        let hash = `#/${folder}/${note.id}`
        window.history.pushState(null, null, hash)
        this.render()
      })
    } else {
      this.model.newNote({ data, folder }, note => {
        let hash = `#/${folder}/${note.id}`
        window.history.pushState(null, null, hash)
        this.render()
      })
    }
  }

  saveOverlayInput (parent, old, newName) {
    if (old) {
      this.model.renameFolder(old, newName, data => {
        this.render()
      })
    } else {
      this.model.newFolder(newName, parent, (data, newFolder) => {
        let hash = `#/${newFolder.id}`
        window.history.pushState(null, null, hash)
        this.render(data)
      })
    }
  }

  removeFolder (name) {
    this.model.removeFolder(name, data => {
      this.render()
    })
  }

  removeItem (id, folder) {
    this.model.removeItem(id, folder, (data) => {
      window.history.pushState(null, null, '#/' + this.uri[0])
      this.render()
    })
  }

  edit (id, folder) {
    this.model.getItem(folder, id, note => {
      this.view.fillTextarea(note, folder)
    })
  }
}
