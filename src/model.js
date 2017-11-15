export default class Model {
  constructor (store) {
    this.store = store
    let localData = this.store.get()
    if (!localData) {
      this.data = {
        id: String(Date.now()),
        name: 'Root',
        note: [],
        child: []
      }
      this.sync()
    } else {
      this.data = localData
    }
  }

  getData (cb) {
    cb(this.data)
  }

  newNote (payload, cb) {
    let note = this._makeNote(payload)
    this.findFolder(this.data, payload.folder, (folder, parent) => {
      folder.note.push(note)
    })
    this.sync()
    cb(note)
  }

  // callback(folderObj, parentObj)
  findFolder (data, folder, cb) {
    let _f = (data, parent, folder) => {
      if (String(data.id) === String(folder)) return cb(data, parent)
      for (let i = data.child.length - 1; i >= 0; i--) {
        let child = data.child[i]
        _f(child, data, folder)
      }
    }
    _f(data, data, folder)
  }

  _makeNote (payload) {
    return {
      id: String(Date.now()),
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

  newFolder (title, parent, cb) {
    this.findFolder(this.data, parent, (folder, parent) => {
      folder.child.push(this._generateFolder(title))
      this.sync()
      cb(this.data)
    })
  }
  _generateFolder (title) {
    return {
      id: String(Date.now()),
      name: title,
      note: [],
      child: []
    }
  }
  renameFolder (old, newName, cb) {
    this.findFolder(this.data, old, (folder, parent) => {
      folder.name = newName
      this.sync()
      return cb(this.data)
    })
  }

  removeFolder (id, cb) {
    this.findFolder(this.data, id, (folder, parent) => {
      parent.child = parent.child.filter(folder => {
        return String(folder.id) !== String(id)
      })
      this.sync()
      return cb(this.data)
    })
  }

  removeItem (folderId, id, cb) {
    this.findFolder(this.data, folderId, (folder, parent) => {
      folder.note = folder.note.filter(note => {
        return String(note.id) !== String(id)
      })
    })
    this.sync()
    return cb(this.data)
  }

  getItem (folder, item, cb) {
    this.findFolder(this.data, folder, (folder, parent) => {
      cb(folder.note.find(note => note.id === item))
    })
  }

  getFolder (id, cb) {
    this.findFolder(this.data, id, (folder, parent) => {
      cb(folder)
    })
  }

  sync () {
    this.store.set(this.data)
  }
}
