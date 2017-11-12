export default class Template {
  /*
  data:
  {
    _name: 'scrachy',
    root: [],
    folder1: {
      root: []
      folder1_1: {},
      folder1_2: {},
      folder1_3: {},
    },
    folder2: {},
    folder3: {}
  }

  */
  selectContent (data) {
    let str = ''
    let i = 0
    return '<option value="root" selected>Root</option>' + this.option(str, i, data) + '<option value="__new_folder__">New Folder</option>'
  }

  option (str, i, data) {
    Object.keys(data).forEach(k => {
      if (k === '_name' || k === 'root') return
      let pad = ''
      for (let j = i * 2; j > 0; j--) {
        pad += '-'
      }
      str += `<option value="${k}">${pad} ${k}</option>`
      this.option(str, i + 1, data[k])
    })
    return str
  }
}
