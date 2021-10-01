import GmailSynonyms from './gmail.js';

class Synonyms {
  constructor() {
    this.synonymsByDomain ={
      'mail.google.com': GmailSynonyms
    };
  }

  getSynonymsByDomain(domain) {
    return this.synonymsByDomain[domain];
  }
}

export default new Synonyms();
