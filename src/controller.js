export default class Controller {
  constructor (view, model) {
    this.view = view
    this.model = model
    this.view.bindToggleFolder(this.filterNotes.bind(this))
    this.view.bindCreate(this.create)
    this.view.bindSave(this.save.bind(this))
    this.view.bindConfirmOverlay(this.saveOverlayInput.bind(this))
    this.view.bindFolderRemove(this.removeFolder.bind(this))
  }

  init () {
    this.model.getData(data => {
      this.view.updateSelectFolder(data)
      this.view.updateTree(data)
      this.view.updateNoteList(data)
    })
  }
  render (data) {
    this.view.updateSelectFolder(data)
    this.view.updateTree(data)
    this.view.updateNoteList(data)
  }

  create (target) {

  }

  filterNotes (id) {
    this.model.getFolder(id, folder => {
      this.view.updateNoteList(folder)
    })
  }

  save (raw, folder) {
    let data = raw.trim()
    if (data.length < 1) return
    this.model.newNote({data, folder}, data => {
      this.render(data)
    })
  }

  saveOverlayInput (parent, old, newName) {
    if (old) {
      this.model.renameFolder(old, newName, data => {
        this.render(data)
      })
    } else {
      this.model.newFolder(newName, parent, data => {
        this.render(data)
      })
    }
  }

  removeFolder (name) {
    this.model.removeFolder(name, data => {
      this.render(data)
    })
  }
}
