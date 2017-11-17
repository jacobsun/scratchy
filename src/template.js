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
    let selected = location.hash.replace(/^#\//, '')
    let _o = (str, i, data) => {
      let pad = ''
      for (let j = i * 2; j > 0; j--) {
        pad += '·'
      }
      str += `<option ${selected === String(data.id) ? 'selected' : ''} value="${data.id}">${pad}${data.name}</option>`
      data.child.forEach(folder => {
        str = _o(str, i + 1, folder)
      })
      return str
    }
    return _o('', 0, data) + `<option value="newfolder_${data.id}">New Folder</option>`
  }

  treeContent (data, expanded) {
    let selectedFolder = location.hash.replace(/^#\//, '').split('/')[0]
    let _i = (str, data) => {
      let hasSub = data.child.length > 0
      str += `
      <li class="tree-item ${hasSub ? 'expandable' : ''} ${hasSub && expanded.indexOf(String(data.id)) > -1 ? 'expanded' : ''}">
      <div class="tree-node">
      <a href="#/${data.id}" data-id="${data.id}" class="item-title ${selectedFolder === String(data.id) ? 'selectedFolder' : ''}">${data.name}<div class="folder-control"><i class="rename-folder"></i><i class="create-sub"></i><i class="remove-folder"></i></div></a>
      </div>`
      if (hasSub) {
        data.child.forEach(folder => {
          str += '<div class="sub-node"><ul class="tree">'
          str = _i(str, folder)
          str += '</ul></div>'
        })
      }
      str += '</li>'
      return str
    }
    return _i('', data)
  }

  noteLists (data) {
    let selectedNote = location.hash.replace(/^#\//, '').split('/')[1]
    return data.note.reduce((cnt, note) => {
      cnt += `<li class="note ${selectedNote === String(note.id) ? 'selectedNote' : ''} " data-folder="${data.id}" data-id="${note.id}"><a href="#/${data.id + '/' + note.id}">${note.title}</a><span class="create-date">${new Date(Date.now()).toLocaleDateString()}</span></span><button class="remove-item"></button></li>
`
      return cnt
    }, '')
  }

  contentBody (data) {
    return `<p>${data.content}</p>`
  }
}
