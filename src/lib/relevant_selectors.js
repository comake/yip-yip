import gmailRelevantSelectorsData from '../data/relevant_selectors/gmail.json';

class RelevantSelectors {
  static relevantSelectorsByDomain = {
    'mail.google.com': gmailRelevantSelectorsData
  };

  static getRelevantSelectorsForDomain(domain) {
    return this.relevantSelectorsByDomain[domain];
  }

  static nodeMatchesSelector(node, selector) {
    return node.nodeName === selector.nodeName &&
      (!selector.attributes || this.nodeMatchesAllSelectorAttributes(node, selector))
  }

  static nodeMatchesAllSelectorAttributes(node, selector) {
    return Object.entries(selector.attributes).every(([attributeName, attributeValue]) => {
      return node.getAttribute(attributeName) === attributeValue
    })
  }
}

export default RelevantSelectors;
