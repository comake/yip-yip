import { YIPYIP_ROOT_ID } from "./constants.js";
import Utils from "./utils.js";

const LINK_OR_BUTTON_TYPES = ['BUTTON', 'A', 'LINK', 'INPUT'];
const LINK_OR_BUTTON_ROLE_VALUES = ['link', 'button'];
const DO_NOT_SEARCH_NODE_TYPES = ['SCRIPT'];

const HIDDEN_ATTRIBUTES_SETTINGS_BY_NODENAME = {
  'A': {
    attributes: ['title', 'aria-label', 'href']
  },
  'INPUT': {
    attributes: ['name', 'placeholder', 'value', 'aria-label']
  },
  'SELECT': {
    attributes: ['name'],
  },
  'TEXTAREA': {
    attributes: ['name', 'placeholder']
  },
  'BUTTON': {
    attributes: ['name', 'aria-label']
  },
  'DIV': {
    attributeFilter: 'role',
    attributeFilterValues: ['link', 'button'],
    attributes: ['title', 'aria-label', 'data-tooltip']
  },
  'SPAN': {
    attributeFilter: 'role',
    attributeFilterValues: ['link', 'button'],
    attributes: ['title', 'aria-label', 'data-tooltip']
  },
};

const NODES_WITH_HIDDEN_ATTRIBUTES_QUERY_SELECTOR = Object.keys(HIDDEN_ATTRIBUTES_SETTINGS_BY_NODENAME)
  .map(nodeName => selectorsForNodeTypeWithHiddenAttributes(nodeName))
  .join(', ');

function selectorsForNodeTypeWithHiddenAttributes(nodeName) {
  const nodeNameSettings = HIDDEN_ATTRIBUTES_SETTINGS_BY_NODENAME[nodeName];
  if (!nodeNameSettings.attributeFilter) {
    return nodeName.toLowerCase()
  } else {
    return nodeNameSettings.attributeFilterValues.map(attributeValue => {
      return `${nodeName.toLowerCase()}[${nodeNameSettings.attributeFilter}="${attributeValue}"]`
    })
    .join(', ')
  }
}

function findNodesInPageMatchingText(text) {
  if (text.length > 1) {
    const matchingNodes = findMatchesInNode(text, document.body)
    const matchingLinksAndButtons = matchingNodes.filter(node => isLinkOrButton(node));
    return { matchingNodes, matchingLinksAndButtons }
  } else {
    return { matchingNodes: [], matchingLinksAndButtons: [] }
  }
}

function findMatchesInNode(text, node, parentNode=null, matches=[]) {
  if (!canSearchNode(node)) { return matches }


  if (node.nodeType === Node.TEXT_NODE && nodeContainsText(node, text) && parentNode && !matches.includes(parentNode)) {
    matches.push(parentNode)
  } else if (node.nodeType === Node.ELEMENT_NODE && isVisible(node)) {
    matches.concat(findMatchesInElement(text, node, parentNode, matches))
  }

  return matches
}

function findMatchesInElement(text, element, parentNode=null, matches=[]) {
  const containsText = nodeContainsText(element, text);
  const elementHasChildren = element.childNodes && element.childNodes.length > 0;
  const searchableChildren = element.querySelectorAll(NODES_WITH_HIDDEN_ATTRIBUTES_QUERY_SELECTOR);
  const elementHasSearchableChildren = elementHasChildren && searchableChildren.length > 0;
  if (containsText && (!elementHasChildren || isLinkOrButton(element))) {
    matches.push(element)
  } else if (element.nodeType === Node.ELEMENT_NODE && (containsText || elementHasSearchableChildren)) {
    [...element.childNodes].forEach(childNode => {
      findMatchesInNode(text, childNode, element, matches)
    })
  }

  return matches
}

function nodeContainsText(node, text) {
  return nodeInnerTextContainsText(node, text) || nodeContainsTextInHiddenAttribute(node, text)
}

function nodeInnerTextContainsText(node, text) {
  const lowercaseText = Utils.getTextContentOfNode(node).slice().toLowerCase();
  return lowercaseText && (lowercaseText.includes(text) || lowercaseText.replace(/\s/g, '').includes(text))
}

function nodeContainsTextInHiddenAttribute(node, text) {
  const hiddenAttributesSettingsForNodeName = HIDDEN_ATTRIBUTES_SETTINGS_BY_NODENAME[node.nodeName];
  return hiddenAttributesSettingsForNodeName && hiddenAttributesSettingsForNodeName.attributes.some(attributeName => {
    return nodeAttributeContainsText(node, attributeName, text)
  })
}

function nodeAttributeContainsText(node, attributeName, text) {
  const attributeValue = node.getAttribute(attributeName);
  return attributeValue != null && attributeValue.toLowerCase().includes(text)
}

function canSearchNode(node) {
  return !DO_NOT_SEARCH_NODE_TYPES.includes(node.nodeName) && node.id !== YIPYIP_ROOT_ID
}

function isLinkOrButton(node) {
  return LINK_OR_BUTTON_TYPES.includes(node.nodeName) || LINK_OR_BUTTON_ROLE_VALUES.includes(node.getAttribute('role'));
}

function isVisible(node) {
  const computedStyle = window.getComputedStyle(node);
  return !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length) &&
    computedStyle.visibility !== "hidden" && computedStyle.opacity !== '0'
}

const FindInPage = { findNodesInPageMatchingText }
export default FindInPage;
