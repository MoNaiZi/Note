export const NODE_KEY = '$treeNodeId';
// import Vue from 'vue';
// import deepmerge from 'deepmerge';


export const markNodeData = function (node, data) {
  if (!data || data[NODE_KEY]) return;
  Object.defineProperty(data, NODE_KEY, {
    value: node.id,
    enumerable: false,
    configurable: false,
    writable: false
  });
};

export const getNodeKey = function (key, data) {
  if (!key) return data[NODE_KEY];
  return data[key];
};

export const findNearestComponent = (element, componentName) => {
  let target = element;
  while (target && target.tagName !== 'BODY') {
    if (target.__vue__ && target.__vue__.$options.name === componentName) {
      return target.__vue__;
    }
    target = target.parentNode;
  }
  return null;
};

let lang = {};
let merged = false;
let i18nHandler = function () {
  return { merged }
  // const vuei18n = Object.getPrototypeOf(this);
  // if (typeof vuei18n === 'function' && !!Vue.locale) {
  //   if (!merged) {
  //     merged = true;
  //     Vue.locale(
  //       Vue.config.lang,
  //       deepmerge(lang, Vue.locale(Vue.config.lang) || {}, { clone: true })
  //     );
  //   }
  //   return vuei18n.apply(this, arguments);
  // }
};

export const t = function (path) {//options
  let value = i18nHandler.apply(this, arguments);
  if (value !== null && value !== undefined) return value;

  const array = path.split('.');
  let current = lang;

  for (let i = 0, j = array.length; i < j; i++) {
    const property = array[i];
    value = current[property];
    // if (i === j - 1) return format(value, options);
    if (!value) return '';
    current = value;
  }
  return '';
};

const trim = function (string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
}

export function hasClass(el, cls) {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
}

export function addClass(el, cls) {
  if (!el) return;
  var curClass = el.className;
  var classes = (cls || '').split(' ');

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName;
    }
  }
  if (!el.classList) {
    el.setAttribute('class', curClass);
  }
}

export function removeClass(el, cls) {
  if (!el || !cls) return;
  var classes = cls.split(' ');
  var curClass = ' ' + el.className + ' ';

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ');
    }
  }
  if (!el.classList) {
    el.setAttribute('class', trim(curClass));
  }
}