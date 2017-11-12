export default class Controller {
  constructor (view, model) {
    this.view = view
    this.model = model
    this.view.bindToggleFolder()
    this.view.bindCreate(this.create)
    this.view.bindSave(this.save.bind(this))
    this.view.bindConfirmOverlay(this.saveOverlayInput.bind(this))
    this.data = this.model.data()
  }

  render () {
    this.view.updateFolder(this.data)
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

  saveOverlayInput (data) {
    this.model.newFolder(data, 0, (err, data) => {
      if (err) {
        return this.view.overlayError()
      }
      this.view.updateFolder(data)
    })
  }
}
