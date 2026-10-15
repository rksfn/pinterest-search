document.addEventListener("keydown", (event) => {
  if (
    event.key !== "/" ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    event.isComposing ||
    event.defaultPrevented
  ) {
    return;
  }

  if (
    event.composedPath().some(
      (element) =>
        element.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName),
    )
  ) {
    return;
  }

  const search = [...document.querySelectorAll(
    'input[data-test-id="search-box-input"], input[name="searchBoxInput"], input[type="search"]',
  )].find((input) => !input.disabled && input.getClientRects().length);

  if (search) {
    event.preventDefault();
    search.focus();
  }
});
