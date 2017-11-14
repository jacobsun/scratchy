export default class Store {
  constructor (storage, name = 'db') {
    this.name = name
    if (!storage.getItem || !storage.setItem || !storage.removeItem) {
      this.inMemory = true
      this.ls = {
        data: {},
        getItem (key) {
          return this.data[key]
        },
        setItem (key, value) {
          this.data[key] = value
        },
        removeItem (key) {
          delete this.data[key]
        }
      }
    } else {
      this.inMemory = false
      this.ls = storage
    }
    this.items = JSON.parse(this.ls.getItem(name) || '[]')
  }

  set (data) {
    this.ls.setItem(this.name, JSON.stringify(data))
  }

  get () {
    return JSON.parse(this.ls.getItem(this.name))
  }

  remove () {
    this.ls.removeItem(this.name)
  }

  isInMemory () {
    return this.inMemory
  }

  name () {
    return this.name
  }
}
