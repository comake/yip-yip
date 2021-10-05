import { INPUT_NODE_TYPES, KEYS_VALID_FOR_FOCUS_REGEX } from "../constants.js";

function differentInputIsActive(inputElement) {
  return document.activeElement &&
      document.activeElement !== inputElement &&
      (
        document.activeElement.isContentEditable ||
        INPUT_NODE_TYPES.includes(document.activeElement.nodeName)
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

const Utils = {
  differentInputIsActive,
  clickOrFocusNode,
  keyValidForFocus,
  regexpMatchingTextAtStartOrEndOrSurroundedByNonWordChars,
  getTextContentOfNode,
  clampNumber,
  stringContainsSubstringInList,
  stringContainsSubstringWithOrWithoutSpaces,
  compareDescending
}

export default Utils
