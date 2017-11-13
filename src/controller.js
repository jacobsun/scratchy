export default class Controller {
  constructor (view, model) {
    this.view = view
    this.model = model
    this.view.bindToggleFolder(this.filterNotes.bind(this))
    this.view.bindCreate(this.create)
    this.view.bindSave(this.save.bind(this))
    this.view.bindConfirmOverlay(this.saveOverlayInput.bind(this))
    this.view.bindFolderRemove(this.folderRemove.bind(this))
    this.data = this.model.data()
  }

  render (data) {
    this.view.updateFolder(data)
    this.view.updateTree(data)
    this.view.updateNoteList(data)
  }

  create (target) {

  }

  filterNotes (name) {
    this.view.updateNoteList(this.model.filterFolder(name))
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
      this.model.renameFolder(old, newName, (err, data) => {
        if (err) return this.view.overlayError()
        this.render(data)
      })
    } else if (parent) {
      this.model.createSub(parent, newName, (err, data) => {
        if (err) return this.view.overlayError()
        this.render(data)
      })
    } else {
      this.model.newFolder(newName, 0, (err, data) => {
        if (err) {
          return this.view.overlayError()
        }
        this.render(data)
      })
    }
  }

  folderRemove (name) {
    this.model.removeFolder(name, (err, data) => {
      if (err) return
      this.render(data)
    })
  }
}
