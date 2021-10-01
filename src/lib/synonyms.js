import gmailSynonymsData from '../data/synonyms/gmail.json';

function mergeMutualSynonymsIntoDirected(synonymsData) {
  return {
    ...mutualSynonymSetsToDirected(synonymsData.mutual),
    ...synonymsData.directed
  }
}

function mutualSynonymSetsToDirected(mutualSynonymSets) {
  return mutualSynonymSets.reduce((obj, synonymSet) => {
    synonymSet.forEach((word, index) => {
      const otherWordsInSet = synonymSet.filter(otherWordInSet => word !== otherWordInSet);
      if (obj.hasOwnProperty(word)) {
        obj[word] = obj[word].concat(otherWordsInSet);
      } else {
        obj[word] = otherWordsInSet;
      }
    })

    return obj
  }, {})
}

class Synonyms {
  constructor() {
    this.synonymsByDomain = {
      'mail.google.com': mergeMutualSynonymsIntoDirected(gmailSynonymsData)
    };
  }

  getSynonymsByDomain(domain) {
    return this.synonymsByDomain[domain];
  }
}

export default new Synonyms();
