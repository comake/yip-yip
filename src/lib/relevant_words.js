import gmailRelevantWordsData from '../data/relevant_words/gmail.json';

class RelevantWords {
  static relevantWordsByDomain = {
    'mail.google.com': gmailRelevantWordsData
  };

  static getRelevantWordsForDomain(domain) {
    return this.relevantWordsByDomain[domain];
  }
}

export default RelevantWords;
