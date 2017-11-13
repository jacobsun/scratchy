export default class Model {
  constructor (store) {
    this.store = store
    this.initDb()
  }
  initDb () {
    let items = this.store.find({ _name: 'scrachy' })
    if (items.length === 0) {
      this.store.insert({
        _name: 'scrachy',
        root: []
      })
    }
  }
  newNote (payload, cb) {
    let note = this._makeNote(payload)
    let data = this.data()
    if (payload.folder === 'root') {
      data.root.push(note)
    } else {
      this.findFolder(data, payload.folder, folder => {
        console.log('folder', folder)
        folder.root.push(note)
      })
    }
    this.sync(data)
    cb(data)
  }

  findFolder (data, folder, cb) {
    let keys = Object.keys(data)
    for (let i = keys.length - 1; i >= 0; i--) {
      let key = keys[i]
      if (folder === key) {
        cb(data[key])
      } else if (Object.keys(data[key]).length > 1) {
        return this.findFolder(data[key], folder, cb)
      }
    }
    return null
  }

  _makeNote (payload) {
    return {
      id: Date.now(),
      title: this._generateTitle(payload.data),
      content: payload.data
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
    folder[title] = {
      root: []
    }
    if (Object.keys(this.data()).indexOf(title) !== -1) {
      return cb(new Error('Duplicate name.'), null)
    }
    if (parent === 0) {
      this.store.update({ _name: 'scrachy' }, folder)
      cb(null, this.data())
    }
  }

  renameFolder (old, newName, cb) {
    let data = this.data()
    let ret = this._rename(old, newName, data)
    this.sync(data)
    cb(ret, data)
  }

  _rename (old, newName, data) {
    let error = null
    let keys = Object.keys(data)
    for (let i = keys.length - 1; i >= 0; i--) {
      let key = keys[i]
      if (key === old) {
        if (data[newName]) {
          error = new Error('Duplicate name')
          break
        } else {
          data[newName] = data[key]
          delete data[key]
          break
        }
      } else if (Object.keys(data[key]).length > 1) {
        this._rename(old, newName, data[key])
      }
    }
    return error
  }

  removeFolder (name, cb) {
    let data = this.data()
    let ret = this._remove(name, data)
    if (!ret) this.sync(data)
    cb(ret, data)
  }

  _remove (name, data) {
    let error = null
    let keys = Object.keys(data)
    for (let i = keys.length - 1; i >= 0; i--) {
      let key = keys[i]
      if (key === name) {
        delete data[key]
        break
      } else if (Object.keys(data[key]).length > 1) {
        this._remove(name, data[key])
      }
    }
    return error
  }

  createSub (parent, name, cb) {
    let data = this.data()
    let ret = this._createSub(parent, name, data)
    if (!ret) this.sync(data)
    cb(ret, data)
  }

  filterFolder (name) {
    let data = this.data()
    return this._filterFolder(data, name)
  }

  _filterFolder (data, name) {
    let keys = Object.keys(data)
    for (let i = keys.length - 1; i >= 0; i--) {
      let key = keys[i]
      if (name === key) {
        return data[key]
      } else if (Object.keys(data[key]).length > 1) {
        return this._filterFolder(data[key], name)
      }
    }
    return null
  }

  _createSub (parent, name, data) {
    let error = null
    let keys = Object.keys(data)
    for (let i = keys.length - 1; i >= 0; i--) {
      let key = keys[i]
      if (key === parent) {
        if (data[name]) {
          error = new Error('Duplicate name')
          break
        } else {
          data[key][name] = {
            root: []
          }
          break
        }
      } else if (Object.keys(data[key]).length > 1) {
        this._createSub(parent, name, data[key])
      }
    }
    return error
  }

  sync (data) {
    this.store.remove({_name: 'scrachy'})
    this.store.insert(data)
  }
}
