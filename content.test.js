const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const vm = require("node:vm");

const source = readFileSync(`${__dirname}/content.js`, "utf8");

function press({ event = {}, inputs = [], path = [] } = {}) {
  let listener;
  let prevented = false;
  vm.runInNewContext(source, {
    document: {
      addEventListener(type, callback) {
        assert.equal(type, "keydown");
        listener = callback;
      },
      querySelectorAll(selector) {
        assert.ok(selector.includes('input[data-test-id="search-box-input"]'));
        return inputs;
      },
    },
  });
  listener({
    key: "/",
    composedPath: () => path,
    preventDefault: () => { prevented = true; },
    ...event,
  });
  return prevented;
}

function input(overrides = {}) {
  return {
    disabled: false,
    focused: false,
    getClientRects: () => [{}],
    focus() { this.focused = true; },
    ...overrides,
  };
}

test("/ focuses the visible search bar and prevents inserting a slash", () => {
  const search = input();
  assert.equal(press({ inputs: [search] }), true);
  assert.equal(search.focused, true);
});

test("ignores typing fields, including editable ancestors", () => {
  for (const element of [
    { tagName: "INPUT" },
    { tagName: "TEXTAREA" },
    { tagName: "SELECT" },
    { isContentEditable: true },
  ]) {
    const search = input();
    assert.equal(press({ inputs: [search], path: [{ tagName: "SPAN" }, element] }), false);
    assert.equal(search.focused, false);
  }
});

test("ignores other keys, modified shortcuts, composition, and handled events", () => {
  for (const event of [
    { key: "a" },
    { ctrlKey: true },
    { metaKey: true },
    { altKey: true },
    { isComposing: true },
    { defaultPrevented: true },
  ]) {
    const search = input();
    assert.equal(press({ inputs: [search], event }), false);
    assert.equal(search.focused, false);
  }
});

test("skips hidden and disabled search inputs", () => {
  const hidden = input({ getClientRects: () => [] });
  const disabled = input({ disabled: true });
  const visible = input();
  assert.equal(press({ inputs: [hidden, disabled, visible] }), true);
  assert.equal(hidden.focused, false);
  assert.equal(disabled.focused, false);
  assert.equal(visible.focused, true);
});

test("leaves / alone when no usable search bar exists", () => {
  assert.equal(press(), false);
  assert.equal(press({ inputs: [input({ disabled: true })] }), false);
});
