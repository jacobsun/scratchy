export default class Model {
  constructor (store) {
    this.store = store
    this.initDb()
  }
  initDb () {
    let items = this.store.find({_name: 'scrachy'})
    if (items.length === 0) {
      this.store.insert({
        _name: 'scrachy',
        root: []
      })
    }
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

  data () {
    return this.store.find({ _name: 'scrachy' })[0]
  }

  newFolder (title, parent, cb) {
    let folder = {}
    folder[title] = {}
    if (Object.keys(this.data()).indexOf(title) !== -1) {
      return cb(new Error('Duplicate name.'), null)
    }
    if (parent === 0) {
      this.store.update({ _name: 'scrachy' }, folder)
      cb(null, this.data())
    }
  }
}
