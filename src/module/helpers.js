export function qs (selector, scope = document) {
  return scope.querySelector(selector)
}

export function qsa (selector, scope = document) {
  return scope.querySelectorAll(selector)
}

export function on (target, type, cb, capture = false) {
  if (typeof target === 'string') target = document.querySelector(target)
  target.addEventListener(type, cb, capture)
}

export function delegate (target, selector, type, handler, capture = false) {
  if (typeof target === 'string') target = document.querySelector(target)
  let dispatchEvent = event => {
    let targetEl = event.target
    let potentialEl = target.querySelectorAll(selector)
    let i = potentialEl.length
    while (i--) {
      if (potentialEl[i] === targetEl) {
        handler.call(targetEl, event)
        break
      }
    }
  }
  on(target, type, dispatchEvent, capture)
}
export const toEntity = s => s.replace(/[&<]/g, c => {
  if (s === '&') return '&amp;'
  if (s === '<') return '&lt;'
  if (s === '>') return '&gt;'
})

export const when = selector => ({
  _selector: selector,
  do (cb) {
    this._do = cb
    return this
  },
  isChanged () {
    this._action = 'change'
    return this
  },
  isClicked () {
    this._action = 'click'
    return this
  },

  isDoubleClicked () {
    this._action = 'dblclick'
    return this
  },

  isBlur () {
    this._action = 'blur'
    return this
  },

  isKeyPressed (keyCode) {
    this._action = 'keypress'
    this._keyCode = keyCode
    return this
  },

  isKeyUp (keyCode) {
    this._action = 'keyup'
    this._keyCode = keyCode
    return this
  },
  from (selector) {
    this._from = selector
    return this
  },

  lastly (cb) {
    this._lastly = cb
    return this
  }
})

export const activate = arr => {
  arr.forEach(feature => {
    if (feature._from) {
      delegate(feature._selector, feature._from, feature._action, (evt) => {
        if (feature._keyCode && feature._keyCode !== evt.keyCode) return
        feature._do(evt)
        if (feature._lastly) feature._lastly(evt)
      }, feature._action === 'blur')
    } else {
      on(feature._selector, feature._action, (evt) => {
        if (feature._keyCode && feature._keyCode !== evt.keyCode) return
        feature._do(evt)
        if (feature._lastly) feature._lastly(evt)
      }, feature._action === 'blur')
    }
  })
}
