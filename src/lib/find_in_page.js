import {
  YIPYIP_ROOT_ID,
  LINK_OR_BUTTON_TYPES,
  LINK_OR_BUTTON_ROLE_VALUES,
  DO_NOT_SEARCH_NODE_TYPES
} from "../constants.js";

import Utils from "./utils.js";
import Synonyms from './synonyms.js';
import hiddenAttributeSettingsByNodeName from '../data/hidden_attribute_settings.json';

const NODES_WITH_HIDDEN_ATTRIBUTES_QUERY_SELECTOR = Object.keys(hiddenAttributeSettingsByNodeName)
  .map(nodeName => selectorsForNodeTypeWithHiddenAttributes(nodeName))
  .join(', ');

function selectorsForNodeTypeWithHiddenAttributes(nodeName) {
  const nodeNameSettings = hiddenAttributeSettingsByNodeName[nodeName];
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
    const matchingNodes = findMatchesInNode(text, document.body);
    const matchingLinksAndButtons = matchingNodes.filter(node => isLinkOrButton(node));
    return { matchingNodes, matchingLinksAndButtons }
  } else {
    return { matchingNodes: [], matchingLinksAndButtons: [] }
  }
}

function findMatchesInNode(text, node, parentNode=null, matches=[]) {
  if (!canSearchNode(node)) { return matches }

  if (node.nodeType === Node.TEXT_NODE && nodeContainsTextOrSynonym(node, text) && parentNode && !matches.includes(parentNode)) {
    matches.push(parentNode)
  } else if (node.nodeType === Node.ELEMENT_NODE && isVisible(node)) {
    matches.concat(findMatchesInElement(text, node, matches))
  }

  return matches
}

function findMatchesInElement(text, element, matches=[]) {
  const containsText = nodeContainsTextOrSynonym(element, text);
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

function nodeContainsTextOrSynonym(node, text) {
  const synonyms = getSynonyms(text);
  return nodeInnerTextContainsStringInList(node, synonyms) || nodeContainsStringInListInHiddenAttribute(node, synonyms)
}

function getSynonyms(text) {
  const domain = window.location.host;
  const synonymsForDomain = Synonyms.getSynonymsByDomain(domain)
  const synonymWord = synonymsForDomain && Object.keys(synonymsForDomain).find(word => word.includes(text))
  if (synonymWord) {
    return [text].concat(synonymsForDomain[synonymWord])
  } else {
    return [text]
  }
}

function nodeInnerTextContainsStringInList(node, strings) {
  const lowercaseText = Utils.getTextContentOfNode(node).slice().toLowerCase();
  return lowercaseText && strings.some(string => {
    return lowercaseText.includes(string) || lowercaseText.replace(/\s/g, '').includes(string)
  })
}

function nodeContainsStringInListInHiddenAttribute(node, strings) {
  const hiddenAttributesSettingsForNodeName = hiddenAttributeSettingsByNodeName[node.nodeName];
  return hiddenAttributesSettingsForNodeName && hiddenAttributesSettingsForNodeName.attributes.some(attributeName => {
    return nodeAttributeContainsStringInList(node, attributeName, strings)
  })
}

function nodeAttributeContainsStringInList(node, attributeName, strings) {
  const attributeValue = node.getAttribute(attributeName);
  return attributeValue != null && strings.some(string => attributeValue.toLowerCase().includes(string))
}

function canSearchNode(node) {
  return !DO_NOT_SEARCH_NODE_TYPES.includes(node.nodeName) && node.id !== YIPYIP_ROOT_ID
}

function isLinkOrButton(node) {
  return LINK_OR_BUTTON_TYPES.includes(node.nodeName) || LINK_OR_BUTTON_ROLE_VALUES.includes(node.getAttribute('role'));
}

function isVisible(node) {
  const computedStyle = window.getComputedStyle(node);
  return !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length || computedStyle.display === 'contents') &&
    computedStyle.visibility !== "hidden" && computedStyle.opacity !== '0'
}

const FindInPage = { findNodesInPageMatchingText }
export default FindInPage;
