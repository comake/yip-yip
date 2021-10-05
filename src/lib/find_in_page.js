import {
  YIPYIP_ROOT_ID,
  LINK_OR_BUTTON_OR_INPUT_TYPES,
  LINK_OR_BUTTON_ROLE_VALUES,
  DO_NOT_SEARCH_NODE_TYPES
} from "../constants.js";

import NodeScorer from './node_scorer.js';
import HiddenAttributeSettings from './hidden_attribute_settings.js';

class FindInPage {
  constructor(searchText) {
    this.searchText = searchText.trim();
    this.nodeScorer = new NodeScorer(this.searchText);
  }

  findMatches() {
    if (this.searchText.length > 1) {
      const matches = this.findMatchesInNode(document.body);
      const matchingNodes = matches.map(match => match.node);
      const matchesWhereNodeIsLinkOrButtons = matches.filter(match => this.isLinkOrButtonOrInput(match.node));
      console.debug(matchesWhereNodeIsLinkOrButtons);
      const matchingLinksAndButtons = matchesWhereNodeIsLinkOrButtons.map(match => match.node);
      const bestMatchingLinkOrButtonIndex = this.findIndexOfBestMatch(matchesWhereNodeIsLinkOrButtons);
      return { matchingNodes, matchingLinksAndButtons, bestMatchingLinkOrButtonIndex }
    } else {
      return { matchingNodes: [], matchingLinksAndButtons: [], bestMatchingLinkOrButtonIndex: null }
    }
  }

  findMatchesInNode(node, parentNode=null, parentNodeScore=0, matches=[]) {
    if (!this.canSearchNode(node)) { return matches }

    const score = this.nodeScorer.scoreNode(node);
    if (node.nodeType === Node.TEXT_NODE && score > 0 &&
      parentNode && !matches.some(match => match.node === parentNode)
    ) {
      matches.push({ score, node: parentNode });
    } else if (node.nodeType === Node.TEXT_NODE && parentNodeScore > 0 &&
      parentNode && !matches.some(match => match.node === parentNode)
    ) {
      matches.push({ score: parentNodeScore, node: parentNode });
    } else if (node.nodeType === Node.ELEMENT_NODE && this.isVisible(node)) {
      matches.concat(this.findMatchesInElement(node, parentNode, parentNodeScore, matches));
    }

    return matches
  }

  findMatchesInElement(element, parentNode=null, parentNodeScore=0, matches=[]) {
    const score = this.nodeScorer.scoreNode(element)
    const elementHasChildren = element.childNodes && element.childNodes.length > 0;
    const searchableChildren = element.querySelectorAll(HiddenAttributeSettings.nodesWithHiddenAttributesQuerySelector);
    const elementHasSearchableChildren = elementHasChildren && searchableChildren.length > 0;
    if (score > 0 && (!elementHasChildren || this.isLinkOrButtonOrInput(element))) {
      matches.push({ score, node: element });
    } else if (score > 0 || elementHasSearchableChildren) {
      const newParentNode = score > 0 ? element : parentNode;
      const newParentNodeScore = score > 0 ? score : parentNodeScore;
      [...element.childNodes].forEach(childNode => {
        this.findMatchesInNode(childNode, newParentNode, newParentNodeScore, matches)
      })
    }

    return matches
  }

  findIndexOfBestMatch(matches) {
    if (matches.length > 0) {
      const sortedMatchesWithIndex = matches
        .map((match, index) => ({ ...match, index }))
        .sort((a, b) => b.score - a.score);

      return sortedMatchesWithIndex[0].index;
    } else {
      return 0;
    }
  }

  canSearchNode(node) {
    return !DO_NOT_SEARCH_NODE_TYPES.includes(node.nodeName) && node.id !== YIPYIP_ROOT_ID
  }

  isLinkOrButtonOrInput(node) {
    return LINK_OR_BUTTON_OR_INPUT_TYPES.includes(node.nodeName) || LINK_OR_BUTTON_ROLE_VALUES.includes(node.getAttribute('role'));
  }

  isVisible(node) {
    const computedStyle = window.getComputedStyle(node);
    return !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length || computedStyle.display === 'contents') &&
      computedStyle.visibility !== "hidden" && computedStyle.opacity !== '0'
  }
}

export default FindInPage;
