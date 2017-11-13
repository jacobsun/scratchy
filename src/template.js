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

  treeContent (data) {
    let str = ''
    return this.treeItems(str, data)
  }

  treeItems (str, data) {
    Object.keys(data).forEach(k => {
      if (k === '_name' || k === 'root') return
      let hasSub = Object.keys(data[k]).length > 1
      str += `
<li class="tree-item ${hasSub ? 'expandable' : ''}">
  <div class="tree-node">
    <a href="#" data-name="${k}" class="item-title">${k}<div class="folder-control"><i class="rename-folder"></i><i class="create-sub"></i><i class="remove-folder"></i></div></a>
  </div>`
      if (hasSub) {
        str += '<div class="sub-node"><ul class="tree">'
        str = this.treeItems(str, data[k])
        str += '</ul></div>'
      }
      str += '</li>'
    })
    return str
  }

  noteLists (data) {
    console.log(data)
    return data.root.reduce((cnt, note) => {
      cnt += `<li><a href="#" data-id="${note.id}">${note.title}</a><span class="create-date">${new Date(Date.now()).toLocaleDateString()}</span></span><button class="remove"></button></li>
`
      return cnt
    }, '')
  }
}
