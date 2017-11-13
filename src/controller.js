export default class Controller {
  constructor (view, model) {
    this.view = view
    this.model = model
    this.view.bindToggleFolder()
    this.view.bindCreate(this.create)
    this.view.bindSave(this.save.bind(this))
    this.view.bindConfirmOverlay(this.saveOverlayInput.bind(this))
    this.view.bindFolderRemove(this.folderRemove.bind(this))
    this.data = this.model.data()
  }

  render (data) {
    this.view.updateFolder(data)
    this.view.updateTree(data)
  }

  create (target) {

  }

  createFolder (title) {

  }
  save (raw, folder) {
    let data = raw.trim()
    if (data.length < 1) return
    this.model.newNote({data, folder}, note => {
      this.render(note.id)
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
