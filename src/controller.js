export default class Controller {
  constructor (view, model) {
    this.view = view
    this.model = model
    this.view.bindSelectFolderList(this.filterNotes.bind(this))
    this.view.bindSave(this.save.bind(this))
    this.view.bindConfirmOverlay(this.saveOverlayInput.bind(this))
    this.view.bindFolderRemove(this.removeFolder.bind(this))
    this.view.bindItemRemove(this.removeItem.bind(this))
    this.view.bindContentRemove(this.removeItem.bind(this))
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
      //  else {
      //   this.view.updateNoteList(data)
      //   this.showNote(data)
      // }
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
      this.view.showItem(data)
    })
  }

  save (raw, folder) {
    let data = raw.trim()
    if (data.length < 1) return
    this.model.newNote({data, folder}, note => {
      let hash = `#/${folder}/${note.id}`
      window.history.pushState(null, null, hash)
      this.render()
    })
  }

  saveOverlayInput (parent, old, newName) {
    if (old) {
      this.model.renameFolder(old, newName, data => {
        this.render()
      })
    } else {
      this.model.newFolder(newName, parent, data => {
        this.render()
      })
    }
  }

  removeFolder (name) {
    this.model.removeFolder(name, data => {
      this.render()
    })
  }

  removeItem (id) {
    this.uri.splice(1, 1)
    console.log(this.uri)
    this.model.removeItem(this.uri[0], id, (data) => {
      window.history.pushState(null, null, '#/' + this.uri[0])
      this.render()
    })
  }
}
