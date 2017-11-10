export default class Model {
  constructor (store) {
    this.store = store
  }

  newNote (payload, cb) {
    let note = this._makeNote(payload)
    this.store.insert(note)
    cb(note)
  }

  _makeNote (payload) {
    return {
      id: Date.now(),
      title: this._generateTitle(payload.data),
      content: payload.data,
      folder: payload.folder
    }
  }

  _generateTitle (data) {
    let matched = data.match(/(^.*)\n/iu)
    if (!matched || matched[1].length > 30) {
      return data.slice(0, 31)
    }
    return matched[1]
  }
}
