// import {qsa} from './module/helpers'
export default class Controller {
  constructor (view, model) {
    this.view = view
    this.model = model
    this.view.bindToggleFolder()
    this.view.bindCreate(this.create)
    this.view.bindSave(this.save.bind(this))
    this.view.bindComfirmOverlay(this.saveOverlayInput.bind(this))
  }

  render (id) {
    console.log('id: ', id)
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
    console.log(data)
  }
}
