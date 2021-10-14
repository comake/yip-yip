import { YIPYIP_ROOT_ID, YIPYIP_INPUT_ID, DO_NOT_SEARCH_NODE_TYPES, KNOWLEDGE_OS_ROOT_ID } from "../constants.js";

import AppSpecificSettings from './app_specific_settings.js';
import Synonyms from './synonyms.js';
import NodeScorer from './node_scorer.js';
import SearchableAttributeSettings from './searchable_attribute_settings.js';

const DO_NOT_SEARCH_IDS = [YIPYIP_ROOT_ID, YIPYIP_INPUT_ID, KNOWLEDGE_OS_ROOT_ID];

class FindInPage {
  constructor(searchText) {
    this.searchText = searchText.toLowerCase().trimStart();
    const host = window.location.host;
    const appSpecificSettings = AppSpecificSettings.getSettingsForHost(host)
    const appSpecificSynonyms = Synonyms.mergeMutualSynonymsIntoDirected(appSpecificSettings.synonyms || {});
    const appSpecificRelevantWords = appSpecificSettings.relevant_words || [];

    const appSpecificRelevantSelectors = (appSpecificSettings.relevant_selectors || [])
      .map(selectorData => selectorData.selector);

    const appSpecificAdditionalButtonSelectors = (appSpecificSettings.additional_button_selectors || [])
      .map(selectorData => selectorData.selector);

    const appSecificAdditionalSearchableAttributesByNodeName = appSpecificSettings.additional_searchable_attributes_by_node_name || {};

    this.searchableAttributeSettings = new SearchableAttributeSettings(appSpecificAdditionalButtonSelectors, appSecificAdditionalSearchableAttributesByNodeName);
    this.nodeScorer = new NodeScorer(this.searchText, appSpecificSynonyms, appSpecificRelevantWords, appSpecificRelevantSelectors, this.searchableAttributeSettings);
    this.nodesWithSearchableAttributesQuerySelector = this.searchableAttributeSettings.searchableAttributeSettingsByNodeNameToQuerySelector();
  }

  findMatches() {
    if (this.searchText.length > 1) {
      const matchingNodes = this.findMatchesInNode(document.body);
      const matchingLinksAndButtons = matchingNodes.filter(node => this.searchableAttributeSettings.isLinkOrButtonOrInput(node));
      const bestMatchingLinkOrButtonIndex = this.findIndexOfBestMatchingNode(matchingLinksAndButtons);
      return { matchingNodes, matchingLinksAndButtons, bestMatchingLinkOrButtonIndex }
    } else {
      return { matchingNodes: [], matchingLinksAndButtons: [], bestMatchingLinkOrButtonIndex: null }
    }
  }

  findMatchesInNode(node, parentNode=null, matches=[]) {
    if (!this.canSearchNode(node)) { return matches }

    if (node.nodeType === Node.TEXT_NODE && parentNode &&
      parentNode !== document.body && !matches.some(match => match === parentNode)
    ) {
      matches.push(parentNode);
    } else if (node.nodeType === Node.ELEMENT_NODE && this.isVisible(node)) {
      matches.concat(this.findMatchesInElement(node, parentNode, matches));
    }

    return matches
  }

  findMatchesInElement(element, parentNode=null, matches=[]) {
    if (!this.canSearchNode(element)) { return matches }

    const matchesSearch = this.nodeScorer.nodeMatches(element)
    const elementHasChildren = element.childNodes && element.childNodes.length > 0;
    const searchableChildren = element.querySelectorAll(this.nodesWithSearchableAttributesQuerySelector);
    if (matchesSearch && element !== document.body &&
      (!elementHasChildren || this.searchableAttributeSettings.isLinkOrButtonOrInput(element))
    ) {
      matches.push(element);
    } else if (matchesSearch) {
      [...element.childNodes].forEach(childNode => {
        this.findMatchesInNode(childNode, element, matches)
      })
    } else if (searchableChildren.length > 0) {
      [...searchableChildren].forEach(childNode => {
        this.findMatchesInNode(childNode, parentNode, matches)
      })
    }

    return matches
  }

  findIndexOfBestMatchingNode(nodes) {
    if (nodes.length > 0) {
      const sortedMatchesWithIndex = nodes
        .map((node, index) => ({ node, index, score: this.nodeScorer.scoreNode(node) }))
        .sort((a, b) => b.score - a.score);

      return sortedMatchesWithIndex[0].index;
    } else {
      return 0;
    }
  }

  canSearchNode(node) {
    return !DO_NOT_SEARCH_NODE_TYPES.includes(node.nodeName) && !DO_NOT_SEARCH_IDS.includes(node.id);
  }

  isVisible(node) {
    const computedStyle = window.getComputedStyle(node);
    return !!(node.offsetWidth || node.offsetHeight || node.getClientRects().length || computedStyle.display === 'contents') &&
      computedStyle.visibility !== "hidden" && computedStyle.opacity !== '0'
  }
}

export default FindInPage;
