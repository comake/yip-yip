import gmailRelevantSelectorsData from '../data/relevant_selectors/gmail.json';

class RelevantSelectors {
  static relevantSelectorsByDomain = {
    'mail.google.com': gmailRelevantSelectorsData
  };

  static getRelevantSelectorsForDomain(domain) {
    return this.relevantSelectorsByDomain[domain] || [];
  }
}

export default RelevantSelectors;
