"use strict";

// Minimal, dependency-free fake DOM for loading the app's classic scripts in Node.
// It is NOT a browser: no layout, no CSS, no innerHTML parsing. It exists so the
// app can build `elements`, read/write classes, attributes and values, and so that
// pure logic can be unit tested. See tests/README.md for the known limits.

const VOID_TAGS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta",
  "param", "source", "track", "wbr",
]);
const RAW_TEXT_TAGS = new Set(["script", "style", "textarea", "title"]);

function camelCaseData(name) {
  return name.slice(5).replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
}

function kebabCaseData(key) {
  return `data-${key.replace(/[A-Z]/g, (ch) => `-${ch.toLowerCase()}`)}`;
}

class FakeEvent {
  constructor(type, init = {}) {
    this.type = type;
    this.bubbles = Boolean(init.bubbles);
    this.cancelable = Boolean(init.cancelable);
    this.detail = init.detail ?? null;
    this.defaultPrevented = false;
    this.target = null;
    this.currentTarget = null;
    this._stopped = false;
    Object.assign(this, init);
  }

  preventDefault() {
    this.defaultPrevented = true;
  }

  stopPropagation() {
    this._stopped = true;
  }

  stopImmediatePropagation() {
    this._stopped = true;
  }
}

class FakeCustomEvent extends FakeEvent {}

class FakeEventTarget {
  constructor() {
    this._listeners = new Map();
  }

  addEventListener(type, listener) {
    if (typeof listener !== "function" && !(listener && typeof listener.handleEvent === "function")) {
      return;
    }
    if (!this._listeners.has(type)) {
      this._listeners.set(type, []);
    }
    const list = this._listeners.get(type);
    if (!list.includes(listener)) {
      list.push(listener);
    }
  }

  removeEventListener(type, listener) {
    const list = this._listeners.get(type);
    if (list) {
      const index = list.indexOf(listener);
      if (index >= 0) {
        list.splice(index, 1);
      }
    }
  }

  dispatchEvent(event) {
    if (!event.target) {
      event.target = this;
    }
    let node = this;
    while (node) {
      event.currentTarget = node;
      for (const listener of [...(node._listeners?.get(event.type) || [])]) {
        if (typeof listener === "function") {
          listener.call(node, event);
        } else {
          listener.handleEvent(event);
        }
      }
      if (!event.bubbles || event._stopped) {
        break;
      }
      node = node.parentNode || null;
    }
    return !event.defaultPrevented;
  }

  /** Test helper: number of listeners registered for a type. */
  listenerCount(type) {
    return (this._listeners.get(type) || []).length;
  }
}

class FakeNode extends FakeEventTarget {
  constructor(ownerDocument) {
    super();
    this.ownerDocument = ownerDocument || null;
    this.parentNode = null;
    this.childNodes = [];
  }

  get parentElement() {
    return this.parentNode instanceof FakeElement ? this.parentNode : null;
  }

  get textContent() {
    return this.childNodes.map((node) => node.textContent).join("");
  }

  set textContent(value) {
    this._detachChildren();
    const text = value == null ? "" : String(value);
    if (text) {
      this._appendRaw(new FakeText(text, this.ownerDocument));
    }
  }

  _detachChildren() {
    for (const child of this.childNodes) {
      child.parentNode = null;
    }
    this.childNodes = [];
  }

  _appendRaw(node) {
    node.parentNode = this;
    this.childNodes.push(node);
  }
}

class FakeText extends FakeNode {
  constructor(text, ownerDocument) {
    super(ownerDocument);
    this.data = text;
    this.nodeType = 3;
    this.nodeName = "#text";
  }

  get textContent() {
    return this.data;
  }

  set textContent(value) {
    this.data = value == null ? "" : String(value);
  }

  remove() {
    if (this.parentNode) {
      this.parentNode.removeChild(this);
    }
  }
}

class FakeTokenList {
  constructor(element) {
    this._element = element;
    this._tokens = [];
  }

  _set(value) {
    this._tokens = String(value || "").split(/\s+/).filter(Boolean);
    this._tokens = [...new Set(this._tokens)];
  }

  get length() {
    return this._tokens.length;
  }

  get value() {
    return this._tokens.join(" ");
  }

  item(index) {
    return this._tokens[index] ?? null;
  }

  contains(token) {
    return this._tokens.includes(token);
  }

  add(...tokens) {
    for (const token of tokens) {
      if (!this._tokens.includes(token)) {
        this._tokens.push(token);
      }
    }
  }

  remove(...tokens) {
    this._tokens = this._tokens.filter((token) => !tokens.includes(token));
  }

  toggle(token, force) {
    const shouldHave = force === undefined ? !this.contains(token) : Boolean(force);
    if (shouldHave) {
      this.add(token);
    } else {
      this.remove(token);
    }
    return shouldHave;
  }

  replace(oldToken, newToken) {
    const index = this._tokens.indexOf(oldToken);
    if (index < 0) {
      return false;
    }
    this._tokens[index] = newToken;
    this._tokens = [...new Set(this._tokens)];
    return true;
  }

  forEach(callback, thisArg) {
    this._tokens.forEach((token, index) => callback.call(thisArg, token, index, this));
  }

  [Symbol.iterator]() {
    return this._tokens[Symbol.iterator]();
  }

  toString() {
    return this.value;
  }
}

function createStyle() {
  const props = {};
  return new Proxy(
    {
      setProperty(name, value) {
        props[name] = String(value);
      },
      removeProperty(name) {
        const previous = props[name] ?? "";
        delete props[name];
        return previous;
      },
      getPropertyValue(name) {
        return props[name] ?? "";
      },
    },
    {
      get(target, key) {
        if (key in target) {
          return target[key];
        }
        if (key === "cssText") {
          return Object.entries(props).map(([name, value]) => `${name}: ${value};`).join(" ");
        }
        return typeof key === "string" ? props[key] ?? "" : undefined;
      },
      set(target, key, value) {
        if (key === "cssText") {
          for (const name of Object.keys(props)) {
            delete props[name];
          }
          return true;
        }
        props[key] = value == null ? "" : String(value);
        return true;
      },
    },
  );
}

class FakeElement extends FakeNode {
  constructor(tagName, ownerDocument) {
    super(ownerDocument);
    this.nodeType = 1;
    this.tagName = String(tagName).toUpperCase();
    this.nodeName = this.tagName;
    this.localName = String(tagName).toLowerCase();
    this._attributes = new Map();
    this.classList = new FakeTokenList(this);
    this.style = createStyle();
    this.dataset = {};
    this._innerHTML = null;
    this.hidden = false;
    this.disabled = false;
    this.scrollTop = 0;
    this.scrollLeft = 0;
  }

  // ---- attributes -------------------------------------------------------
  get id() {
    return this._attributes.get("id") ?? "";
  }

  set id(value) {
    this._attributes.set("id", String(value));
  }

  get className() {
    return this.classList.value;
  }

  set className(value) {
    this.classList._set(value);
  }

  getAttribute(name) {
    const key = String(name).toLowerCase();
    if (key === "class") {
      return this.classList.length ? this.classList.value : this._attributes.has("class") ? "" : null;
    }
    if (key.startsWith("data-")) {
      const dataKey = camelCaseData(key);
      return dataKey in this.dataset ? String(this.dataset[dataKey]) : null;
    }
    return this._attributes.has(key) ? this._attributes.get(key) : null;
  }

  setAttribute(name, value) {
    const key = String(name).toLowerCase();
    const text = String(value);
    if (key === "class") {
      this._attributes.set("class", "");
      this.classList._set(text);
      return;
    }
    if (key.startsWith("data-")) {
      this.dataset[camelCaseData(key)] = text;
      return;
    }
    this._attributes.set(key, text);
    if (key === "hidden") this.hidden = true;
    if (key === "disabled") this.disabled = true;
    if (key === "checked" && "checked" in this) this.checked = true;
    if (key === "open" && "open" in this) this.open = true;
  }

  removeAttribute(name) {
    const key = String(name).toLowerCase();
    if (key === "class") {
      this._attributes.delete("class");
      this.classList._set("");
      return;
    }
    if (key.startsWith("data-")) {
      delete this.dataset[camelCaseData(key)];
      return;
    }
    this._attributes.delete(key);
    if (key === "hidden") this.hidden = false;
    if (key === "disabled") this.disabled = false;
  }

  hasAttribute(name) {
    return this.getAttribute(name) !== null;
  }

  toggleAttribute(name, force) {
    const shouldHave = force === undefined ? !this.hasAttribute(name) : Boolean(force);
    if (shouldHave) {
      this.setAttribute(name, "");
    } else {
      this.removeAttribute(name);
    }
    return shouldHave;
  }

  getAttributeNames() {
    const names = [...this._attributes.keys()].filter((name) => name !== "class");
    if (this.classList.length) names.push("class");
    for (const key of Object.keys(this.dataset)) names.push(kebabCaseData(key));
    return names;
  }

  // ---- tree -------------------------------------------------------------
  get children() {
    return this.childNodes.filter((node) => node instanceof FakeElement);
  }

  get childElementCount() {
    return this.children.length;
  }

  get firstElementChild() {
    return this.children[0] || null;
  }

  get lastElementChild() {
    const kids = this.children;
    return kids[kids.length - 1] || null;
  }

  get firstChild() {
    return this.childNodes[0] || null;
  }

  get lastChild() {
    return this.childNodes[this.childNodes.length - 1] || null;
  }

  get nextElementSibling() {
    if (!this.parentNode) return null;
    const siblings = this.parentNode.children;
    return siblings[siblings.indexOf(this) + 1] || null;
  }

  get previousElementSibling() {
    if (!this.parentNode) return null;
    const siblings = this.parentNode.children;
    return siblings[siblings.indexOf(this) - 1] || null;
  }

  get isConnected() {
    let node = this;
    while (node.parentNode) node = node.parentNode;
    return node === this.ownerDocument;
  }

  _toNode(item) {
    return item instanceof FakeNode ? item : new FakeText(String(item), this.ownerDocument);
  }

  _adopt(node) {
    if (node instanceof FakeDocumentFragment) {
      const moved = [...node.childNodes];
      node._detachChildren();
      return moved;
    }
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
    return [node];
  }

  appendChild(node) {
    for (const child of this._adopt(node)) {
      this._appendRaw(child);
    }
    this._innerHTML = null;
    return node;
  }

  append(...items) {
    for (const item of items) this.appendChild(this._toNode(item));
  }

  prepend(...items) {
    const first = this.childNodes[0] || null;
    for (const item of items) this.insertBefore(this._toNode(item), first);
  }

  insertBefore(node, reference) {
    if (!reference) return this.appendChild(node);
    const moved = this._adopt(node);
    const index = this.childNodes.indexOf(reference);
    for (const child of moved) child.parentNode = this;
    this.childNodes.splice(index < 0 ? this.childNodes.length : index, 0, ...moved);
    this._innerHTML = null;
    return node;
  }

  removeChild(node) {
    const index = this.childNodes.indexOf(node);
    if (index >= 0) {
      this.childNodes.splice(index, 1);
      node.parentNode = null;
    }
    return node;
  }

  remove() {
    if (this.parentNode) this.parentNode.removeChild(this);
  }

  replaceChildren(...items) {
    this._detachChildren();
    this._innerHTML = null;
    this.append(...items);
  }

  replaceWith(...items) {
    const parent = this.parentNode;
    if (!parent) return;
    for (const item of items) parent.insertBefore(parent._toNode(item), this);
    parent.removeChild(this);
  }

  contains(node) {
    let current = node;
    while (current) {
      if (current === this) return true;
      current = current.parentNode;
    }
    return false;
  }

  cloneNode(deep = false) {
    const copy = this.ownerDocument.createElement(this.localName);
    for (const [key, value] of this._attributes) copy._attributes.set(key, value);
    copy.classList._set(this.classList.value);
    Object.assign(copy.dataset, this.dataset);
    if ("value" in this) copy.value = this.value;
    if ("checked" in this) copy.checked = this.checked;
    copy.hidden = this.hidden;
    copy.disabled = this.disabled;
    if (deep) {
      for (const child of this.childNodes) {
        copy._appendRaw(child instanceof FakeElement ? child.cloneNode(true) : new FakeText(child.data, this.ownerDocument));
      }
      copy._innerHTML = this._innerHTML;
    }
    return copy;
  }

  // innerHTML is stored, not parsed. Setting it removes element children.
  get innerHTML() {
    return this._innerHTML ?? this.textContent;
  }

  set innerHTML(value) {
    this._detachChildren();
    this._innerHTML = value == null ? "" : String(value);
  }

  get outerHTML() {
    return `<${this.localName}>${this.innerHTML}</${this.localName}>`;
  }

  get innerText() {
    return this.textContent;
  }

  set innerText(value) {
    this.textContent = value;
  }

  insertAdjacentHTML(position, html) {
    this._innerHTML = `${this._innerHTML ?? ""}${html}`;
  }

  insertAdjacentElement(position, element) {
    if (position === "afterbegin") this.prepend(element);
    else if (position === "beforeend") this.appendChild(element);
    else if (position === "beforebegin" && this.parentNode) this.parentNode.insertBefore(element, this);
    else if (position === "afterend" && this.parentNode) this.parentNode.insertBefore(element, this.nextElementSibling);
    return element;
  }

  // ---- selectors --------------------------------------------------------
  matches(selector) {
    return matchesSelectorList(this, parseSelectorList(selector));
  }

  closest(selector) {
    const list = parseSelectorList(selector);
    let node = this;
    while (node instanceof FakeElement) {
      if (matchesSelectorList(node, list)) return node;
      node = node.parentNode;
    }
    return null;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  querySelectorAll(selector) {
    const list = parseSelectorList(selector);
    const results = [];
    walkDescendants(this, (element) => {
      if (matchesSelectorList(element, list)) results.push(element);
    });
    return makeNodeList(results);
  }

  getElementsByClassName(names) {
    return this.querySelectorAll(String(names).trim().split(/\s+/).map((name) => `.${name}`).join(""));
  }

  getElementsByTagName(tag) {
    return this.querySelectorAll(tag);
  }

  // ---- behaviour no-ops -------------------------------------------------
  focus() {
    if (this.ownerDocument) this.ownerDocument.activeElement = this;
  }

  blur() {
    if (this.ownerDocument && this.ownerDocument.activeElement === this) {
      this.ownerDocument.activeElement = this.ownerDocument.body;
    }
  }

  click() {
    this.dispatchEvent(new FakeEvent("click", { bubbles: true, cancelable: true }));
  }

  scrollIntoView() {}
  scrollTo() {}
  scrollBy() {}
  setPointerCapture() {}
  releasePointerCapture() {}
  hasPointerCapture() {
    return false;
  }

  getBoundingClientRect() {
    return { x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0, toJSON() { return this; } };
  }

  getClientRects() {
    return [];
  }

  animate() {
    return { finished: Promise.resolve(), cancel() {}, finish() {}, play() {}, pause() {}, onfinish: null, addEventListener() {} };
  }

  getAnimations() {
    return [];
  }

  get offsetWidth() { return 0; }
  get offsetHeight() { return 0; }
  get offsetTop() { return 0; }
  get offsetLeft() { return 0; }
  get offsetParent() { return null; }
  get clientWidth() { return 0; }
  get clientHeight() { return 0; }
  get scrollWidth() { return 0; }
  get scrollHeight() { return 0; }
}

class FakeHTMLElement extends FakeElement {}

class FakeHTMLInputElement extends FakeHTMLElement {
  constructor(tagName, ownerDocument) {
    super(tagName, ownerDocument);
    this.value = "";
    this.checked = false;
    this.type = "text";
    this.name = "";
  }

  select() {}
  setSelectionRange() {}
}

class FakeHTMLTextAreaElement extends FakeHTMLInputElement {}

class FakeHTMLButtonElement extends FakeHTMLElement {
  constructor(tagName, ownerDocument) {
    super(tagName, ownerDocument);
    this.type = "submit";
    this.value = "";
  }
}

class FakeHTMLOptionElement extends FakeHTMLElement {
  constructor(tagName, ownerDocument) {
    super(tagName, ownerDocument);
    this.selected = false;
    this._value = null;
  }

  get value() {
    return this._value ?? this.textContent;
  }

  set value(value) {
    this._value = String(value);
  }

  get label() {
    return this.textContent;
  }
}

class FakeHTMLSelectElement extends FakeHTMLElement {
  constructor(tagName, ownerDocument) {
    super(tagName, ownerDocument);
    this._value = null;
    this.name = "";
  }

  get options() {
    return this.querySelectorAll("option");
  }

  get selectedIndex() {
    const options = this.options;
    const index = options.findIndex((option) => option.value === this.value);
    return index;
  }

  set selectedIndex(index) {
    const option = this.options[index];
    this._value = option ? option.value : "";
  }

  get selectedOptions() {
    return makeNodeList(this.options.filter((option) => option.value === this.value));
  }

  // Real <select> derives value from its options; this fake keeps an explicit
  // value once set, otherwise the selected (or first) option's value.
  get value() {
    if (this._value !== null) return this._value;
    const options = this.options;
    const selected = options.find((option) => option.selected) || options[0];
    return selected ? selected.value : "";
  }

  set value(value) {
    this._value = String(value);
  }

  add(option) {
    this.appendChild(option);
  }
}

class FakeHTMLDialogElement extends FakeHTMLElement {
  constructor(tagName, ownerDocument) {
    super(tagName, ownerDocument);
    this.open = false;
    this.returnValue = "";
  }

  showModal() {
    this.open = true;
  }

  show() {
    this.open = true;
  }

  close(returnValue) {
    if (returnValue !== undefined) this.returnValue = String(returnValue);
    const wasOpen = this.open;
    this.open = false;
    if (wasOpen) this.dispatchEvent(new FakeEvent("close"));
  }
}

class FakeHTMLCanvasElement extends FakeHTMLElement {
  getContext() {
    return null;
  }
}

class FakeHTMLFormElement extends FakeHTMLElement {
  reset() {}
  submit() {}
  requestSubmit() {}
}

class FakeDocumentFragment extends FakeElement {
  constructor(ownerDocument) {
    super("#document-fragment", ownerDocument);
    this.nodeType = 11;
  }
}

class FakeTemplateElement extends FakeHTMLElement {
  constructor(tagName, ownerDocument) {
    super(tagName, ownerDocument);
    this.content = new FakeDocumentFragment(ownerDocument);
  }
}

const TAG_CLASSES = {
  input: FakeHTMLInputElement,
  textarea: FakeHTMLTextAreaElement,
  button: FakeHTMLButtonElement,
  select: FakeHTMLSelectElement,
  option: FakeHTMLOptionElement,
  dialog: FakeHTMLDialogElement,
  canvas: FakeHTMLCanvasElement,
  form: FakeHTMLFormElement,
  template: FakeTemplateElement,
};

function makeNodeList(items) {
  items.item = (index) => items[index] ?? null;
  return items;
}

function walkDescendants(root, visit) {
  for (const child of root.childNodes) {
    if (child instanceof FakeElement) {
      visit(child);
      walkDescendants(child, visit);
    }
  }
}

// ---- selector engine ----------------------------------------------------
// Supports: tag, *, #id, .class, [attr], [attr=v], [attr^=v], [attr$=v],
// [attr*=v], [attr~=v], :checked, :disabled, :not(<compound>), descendant
// (space) and child (>) combinators, and comma lists. Anything else throws so
// that unsupported selectors are visible instead of silently matching nothing.

const selectorCache = new Map();

function splitTopLevel(text, separator) {
  const parts = [];
  let depth = 0;
  let quote = null;
  let current = "";
  for (const ch of text) {
    if (quote) {
      if (ch === quote) quote = null;
      current += ch;
      continue;
    }
    if (ch === '"' || ch === "'") quote = ch;
    else if (ch === "(" || ch === "[") depth += 1;
    else if (ch === ")" || ch === "]") depth -= 1;
    if (ch === separator && depth === 0) {
      parts.push(current);
      current = "";
      continue;
    }
    current += ch;
  }
  parts.push(current);
  return parts;
}

function parseCompound(text, fullSelector) {
  const compound = { tag: null, ids: [], classes: [], attrs: [], pseudos: [] };
  const pattern = /^(?:(\*|[a-zA-Z][\w-]*)|#([\w-]+)|\.([\w-]+)|\[\s*([\w-]+)\s*(?:([~^$*]?=)\s*(?:"([^"]*)"|'([^']*)'|([^\]\s]+))\s*)?\]|:not\(([^)]*)\)|:([\w-]+))/;
  let rest = text;
  while (rest.length) {
    const match = rest.match(pattern);
    if (!match) {
      throw new Error(`fake-dom: unsupported selector "${fullSelector}" (near "${rest}")`);
    }
    if (match[1]) compound.tag = match[1] === "*" ? null : match[1].toLowerCase();
    else if (match[2]) compound.ids.push(match[2]);
    else if (match[3]) compound.classes.push(match[3]);
    else if (match[4]) {
      compound.attrs.push({ name: match[4].toLowerCase(), op: match[5] || null, value: match[6] ?? match[7] ?? match[8] ?? null });
    } else if (match[9] !== undefined) {
      compound.pseudos.push({ not: parseCompound(match[9].trim(), fullSelector) });
    } else if (match[10]) {
      if (!["checked", "disabled", "enabled", "selected"].includes(match[10])) {
        throw new Error(`fake-dom: unsupported pseudo-class ":${match[10]}" in "${fullSelector}"`);
      }
      compound.pseudos.push({ name: match[10] });
    }
    rest = rest.slice(match[0].length);
  }
  return compound;
}

function parseComplex(text, fullSelector) {
  // Returns [{ compound, combinator }] left-to-right; combinator links to previous.
  const tokens = text.replace(/\s*>\s*/g, " > ").trim().split(/\s+/);
  const steps = [];
  let combinator = null;
  for (const token of tokens) {
    if (token === ">") {
      combinator = ">";
      continue;
    }
    steps.push({ compound: parseCompound(token, fullSelector), combinator: steps.length ? combinator || " " : null });
    combinator = null;
  }
  return steps;
}

function parseSelectorList(selector) {
  const key = String(selector);
  if (!selectorCache.has(key)) {
    const list = splitTopLevel(key, ",")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => parseComplex(part, key));
    if (!list.length) throw new Error(`fake-dom: empty selector "${key}"`);
    selectorCache.set(key, list);
  }
  return selectorCache.get(key);
}

function matchesCompound(element, compound) {
  if (compound.tag && element.localName !== compound.tag) return false;
  for (const id of compound.ids) if (element.id !== id) return false;
  for (const cls of compound.classes) if (!element.classList.contains(cls)) return false;
  for (const attr of compound.attrs) {
    let actual = element.getAttribute(attr.name);
    if ((attr.name === "name" || attr.name === "type" || attr.name === "value") && attr.name in element && actual === null) {
      actual = element[attr.name] === "" ? null : String(element[attr.name]);
    }
    if (actual === null) return false;
    if (!attr.op) continue;
    const expected = attr.value;
    if (attr.op === "=" && actual !== expected) return false;
    if (attr.op === "^=" && !actual.startsWith(expected)) return false;
    if (attr.op === "$=" && !actual.endsWith(expected)) return false;
    if (attr.op === "*=" && !actual.includes(expected)) return false;
    if (attr.op === "~=" && !actual.split(/\s+/).includes(expected)) return false;
  }
  for (const pseudo of compound.pseudos) {
    if (pseudo.not) {
      if (matchesCompound(element, pseudo.not)) return false;
    } else if (pseudo.name === "checked") {
      if (!(element.checked === true || element.selected === true)) return false;
    } else if (pseudo.name === "selected") {
      if (element.selected !== true) return false;
    } else if (pseudo.name === "disabled") {
      if (!element.disabled) return false;
    } else if (pseudo.name === "enabled") {
      if (element.disabled) return false;
    }
  }
  return true;
}

function matchesComplex(element, steps, index = steps.length - 1) {
  if (!matchesCompound(element, steps[index].compound)) return false;
  if (index === 0) return true;
  const combinator = steps[index].combinator;
  let ancestor = element.parentElement;
  if (combinator === ">") {
    return Boolean(ancestor) && matchesComplex(ancestor, steps, index - 1);
  }
  while (ancestor) {
    if (matchesComplex(ancestor, steps, index - 1)) return true;
    ancestor = ancestor.parentElement;
  }
  return false;
}

function matchesSelectorList(element, list) {
  return list.some((steps) => matchesComplex(element, steps));
}

// ---- document -----------------------------------------------------------

class FakeDocument extends FakeNode {
  constructor() {
    super(null);
    this.ownerDocument = this;
    this.nodeType = 9;
    this.nodeName = "#document";
    this.readyState = "complete";
    this.visibilityState = "visible";
    this.hidden = false;
    this.cookie = "";
    this.title = "";
    this.activeElement = null;
  }

  get documentElement() {
    return this.childNodes.find((node) => node instanceof FakeElement) || null;
  }

  get head() {
    return this.querySelector("head");
  }

  get body() {
    return this.querySelector("body");
  }

  get children() {
    return this.childNodes.filter((node) => node instanceof FakeElement);
  }

  createElement(tagName) {
    const tag = String(tagName).toLowerCase();
    const Ctor = TAG_CLASSES[tag] || FakeHTMLElement;
    return new Ctor(tag, this);
  }

  createElementNS(namespace, tagName) {
    return this.createElement(tagName);
  }

  createTextNode(text) {
    return new FakeText(String(text), this);
  }

  createDocumentFragment() {
    return new FakeDocumentFragment(this);
  }

  createEvent() {
    return new FakeEvent("");
  }

  getElementById(id) {
    let found = null;
    walkDescendants(this, (element) => {
      if (!found && element.id === id) found = element;
    });
    return found;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  querySelectorAll(selector) {
    const list = parseSelectorList(selector);
    const results = [];
    walkDescendants(this, (element) => {
      if (matchesSelectorList(element, list)) results.push(element);
    });
    return makeNodeList(results);
  }

  getElementsByClassName(names) {
    return this.querySelectorAll(String(names).trim().split(/\s+/).map((name) => `.${name}`).join(""));
  }

  getElementsByTagName(tag) {
    return this.querySelectorAll(tag);
  }

  appendChild(node) {
    if (node.parentNode) node.parentNode.removeChild(node);
    this._appendRaw(node);
    return node;
  }

  removeChild(node) {
    return FakeElement.prototype.removeChild.call(this, node);
  }

  contains(node) {
    return FakeElement.prototype.contains.call(this, node);
  }
}

// ---- tolerant HTML parser (for the app's own hand-written index.html) ---

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&amp;/g, "&");
}

function applyParsedAttributes(element, attrText) {
  const attrPattern = /([^\s"'>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
  let match;
  while ((match = attrPattern.exec(attrText))) {
    const name = match[1].toLowerCase();
    const raw = match[2] ?? match[3] ?? match[4];
    const value = raw === undefined ? "" : decodeEntities(raw);
    element.setAttribute(name, value);
    // Reflect common IDL properties.
    if (name === "value") {
      element.value = value;
    } else if (name === "checked") {
      element.checked = true;
    } else if (name === "selected") {
      element.selected = true;
    } else if (name === "type" && "type" in element) {
      element.type = value;
    } else if (name === "name" && "name" in element) {
      element.name = value;
    } else if (name === "open" && "open" in element) {
      element.open = true;
    }
  }
}

function parseHtmlInto(document, html) {
  const tokenPattern = /<!--[\s\S]*?-->|<!doctype[^>]*>|<(\/?)([a-zA-Z][\w-]*)((?:\s+[^\s"'>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+))?)*)\s*(\/?)>|([^<]+|<)/gi;
  const stack = [document];
  let match;
  while ((match = tokenPattern.exec(html))) {
    const [token, closing, rawTag, attrText, selfClosing, text] = match;
    const parent = stack[stack.length - 1];
    if (text !== undefined) {
      if (parent !== document) parent._appendRaw(new FakeText(decodeEntities(text), document));
      continue;
    }
    if (!rawTag) continue; // comment or doctype
    const tag = rawTag.toLowerCase();
    if (closing) {
      const index = stack.map((node) => node.localName).lastIndexOf(tag);
      if (index > 0) stack.length = index;
      continue;
    }
    const element = document.createElement(tag);
    applyParsedAttributes(element, attrText || "");
    parent._appendRaw(element);
    if (VOID_TAGS.has(tag) || selfClosing) continue;
    if (RAW_TEXT_TAGS.has(tag)) {
      const endPattern = new RegExp(`</${tag}\\s*>`, "gi");
      endPattern.lastIndex = tokenPattern.lastIndex;
      const end = endPattern.exec(html);
      const rawText = html.slice(tokenPattern.lastIndex, end ? end.index : html.length);
      if (rawText) element._appendRaw(new FakeText(tag === "script" || tag === "style" ? rawText : decodeEntities(rawText), document));
      tokenPattern.lastIndex = end ? endPattern.lastIndex : html.length;
      continue;
    }
    stack.push(element);
  }
  return document;
}

function createDocument(html) {
  const document = new FakeDocument();
  parseHtmlInto(document, html || "<html><head></head><body></body></html>");
  if (!document.documentElement) {
    document.appendChild(document.createElement("html"));
  }
  if (!document.body) {
    document.documentElement.appendChild(document.createElement("body"));
  }
  document.activeElement = document.body;
  return document;
}

class FakeStorage {
  constructor(initial = {}) {
    this._data = new Map();
    for (const [key, value] of Object.entries(initial || {})) {
      this._data.set(String(key), typeof value === "string" ? value : JSON.stringify(value));
    }
  }

  get length() {
    return this._data.size;
  }

  key(index) {
    return [...this._data.keys()][index] ?? null;
  }

  getItem(key) {
    const value = this._data.get(String(key));
    return value === undefined ? null : value;
  }

  setItem(key, value) {
    this._data.set(String(key), String(value));
  }

  removeItem(key) {
    this._data.delete(String(key));
  }

  clear() {
    this._data.clear();
  }

  /** Test helper: snapshot of all entries as a plain object. */
  toJSON() {
    return Object.fromEntries(this._data);
  }
}

module.exports = {
  createDocument,
  FakeDocument,
  FakeElement,
  FakeHTMLElement,
  FakeHTMLInputElement,
  FakeHTMLTextAreaElement,
  FakeHTMLButtonElement,
  FakeHTMLSelectElement,
  FakeHTMLOptionElement,
  FakeHTMLDialogElement,
  FakeHTMLCanvasElement,
  FakeHTMLFormElement,
  FakeTemplateElement,
  FakeDocumentFragment,
  FakeNode,
  FakeText,
  FakeEvent,
  FakeCustomEvent,
  FakeEventTarget,
  FakeStorage,
};
