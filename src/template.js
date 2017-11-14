export default class Template {
  /*
  data schema
  ----------------
{
  id: '1',
  name: 'Root',
  note: [],
  child: [
    {
      id: '2',
      name: 'Folder 1',
      note: [],
      child: [
        {
          id: '3',
          name: 'Folder 1 1',
            note: [],
            child: [
          ]
        }
      ]
    },
    {
      id: '4',
      name: 'Folder 1',
      note: [],
      child: [
        {
          id: '5',
          name: 'Folder 1 1',
            note: [],
            child: [
          ]
        }
      ]
    }
  ]
}

  */
  selectContent (data) {
    let _o = (str, i, data) => {
      let pad = ''
      for (let j = i * 2; j > 0; j--) {
        pad += '-'
      }
      str += `<option value="${data.id}">${pad}${data.name}</option>`
      data.child.forEach(c => {
        str = _o(str, i + 1, c)
      })
      return str
    }
    return _o('', 0, data) + `<option value="newfolder_${data.id}">New Folder</option>`
  }

  treeContent (data) {
    let _i = (str, data) => {
      let hasSub = data.child.length > 0
      str += `
<li class="tree-item ${hasSub ? 'expandable' : ''}">
<div class="tree-node">
  <a href="#" data-id="${data.id}" class="item-title">${data.name}<div class="folder-control"><i class="rename-folder"></i><i class="create-sub"></i><i class="remove-folder"></i></div></a>
</div>`
      if (hasSub) {
        str += '<div class="sub-node"><ul class="tree">'
        data.child.forEach(c => {
          str = _i(str, c)
        })
        str += '</ul></div>'
      }
      str += '</li>'
      return str
    }
    return _i('', data)
  }

  noteLists (data) {
    return data.note.reduce((cnt, note) => {
      cnt += `<li><a href="#" data-id="${note.id}">${note.title}</a><span class="create-date">${new Date(Date.now()).toLocaleDateString()}</span></span><button class="remove"></button></li>
`
      return cnt
    }, '')
  }
}
