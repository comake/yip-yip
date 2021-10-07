import { INPUT_NODE_TYPES, KEYS_VALID_FOR_FOCUS_REGEX, MAC_OS_PLATFORMS } from "../constants.js";

function differentInputIsActive(inputElement) {
  return document.activeElement &&
    document.activeElement !== inputElement &&
    (
      elementIsEditable(document.activeElement) ||
      elementHasEditableShadowRoot(document.activeElement)
    )
}

function elementIsEditable(element) {
  return element.isContentEditable || INPUT_NODE_TYPES.includes(element.nodeName)
}

function elementHasEditableShadowRoot(element) {
  return element.shadowRoot && element.shadowRoot.activeElement &&
    (
      elementIsEditable(element.shadowRoot.activeElement) ||
      elementHasEditableShadowRoot(element.shadowRoot.activeElement)
    )
}

function clickOrFocusNode(node) {
  if (INPUT_NODE_TYPES.includes(node.nodeName)) {
    node.focus();
  } else {
    const eventConfig = {
      'view': window,
      'bubbles': true,
      'cancelable': true
    };

    var mouseoverEvent = new MouseEvent('mouseover', eventConfig);
    var mousedownEvent = new MouseEvent('mousedown', eventConfig);
    var mouseupEvent = new MouseEvent('mouseup', eventConfig);
    var mouseoutEvent = new MouseEvent('mouseout', eventConfig);

    node.dispatchEvent(mouseoverEvent);
    node.dispatchEvent(mousedownEvent);
    node.dispatchEvent(mouseupEvent);
    node.dispatchEvent(mouseoutEvent);

    node.click();
  }
}

function keyValidForFocus(key) {
  return KEYS_VALID_FOR_FOCUS_REGEX.test(key);
}

function regexpMatchingTextAtStartOrEndOrSurroundedByNonWordChars(text) {
  // Construct a regular expression that matches text at the start or end of a string or surrounded by non-word characters.
  // Escape any special regex characters in text.
  return new RegExp(`(^|.*)(${text.replace(/[\\^$*+.?[\]{}()|]/, '\\$&')})($|.*)`, 'im');
}

function getTextContentOfNode(node) {
  if (typeof node.textContent == 'string') {
    return node.textContent;
  } else {
    return node.innerText;
  }
}

function clampNumber(number, min, max) {
  return Math.min(Math.max(number, min), max);
}

function stringContainsSubstringInList(string, substrings) {
  return substrings.some(substring => stringContainsSubstringWithOrWithoutSpaces(string, substring))
}

function stringContainsSubstringWithOrWithoutSpaces(string, substring) {
  return string.includes(substring) || string.replace(/\s/g, '').includes(substring)
}

function compareDescending(a, b) {
  return b - a
}

function nodeMatchesSelector(node, selector) {
  return node.nodeName === selector.nodeName &&
    (!selector.attributes || nodeMatchesAllSelectorAttributes(node, selector))
}

function nodeMatchesAllSelectorAttributes(node, selector) {
  return Object.entries(selector.attributes).every(([attributeName, attributeValue]) => {
    return node.getAttribute(attributeName) === attributeValue
  })
}

function isMacOS() {
  const platform = window.navigator.platform;
  return MAC_OS_PLATFORMS.includes(platform)
}

function nodeIsInViewport(node) {
  const element = node.nodeType === Node.TEXT_NODE ? node.parentNode : node
  const boundingRect = element.getBoundingClientRect();
  return (
    boundingRect.top >= 0 &&
    boundingRect.left >= 0 &&
    boundingRect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    boundingRect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

const Utils = {
  differentInputIsActive,
  clickOrFocusNode,
  keyValidForFocus,
  regexpMatchingTextAtStartOrEndOrSurroundedByNonWordChars,
  getTextContentOfNode,
  clampNumber,
  stringContainsSubstringInList,
  stringContainsSubstringWithOrWithoutSpaces,
  compareDescending,
  nodeMatchesSelector,
  isMacOS,
  nodeIsInViewport
}

export default Utils
