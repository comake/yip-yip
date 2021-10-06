import gmailSynonymsData from '../data/synonyms/gmail.json';

class Synonyms {
  static synonymsByDomain = {
    'mail.google.com': mergeMutualSynonymsIntoDirected(gmailSynonymsData)
  };

  static getSynonymsByDomain(domain) {
    return this.synonymsByDomain[domain] || [];
  }

  static getSynonymsForTextInDomain(domain, text) {
    const synonymsForDomain = this.getSynonymsByDomain(domain)
    const synonymWord = synonymsForDomain && Object.keys(synonymsForDomain).find(word => word.includes(text))
    if (synonymWord) {
      return synonymsForDomain[synonymWord]
    } else {
      return []
    }
  }
}

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

export default Synonyms;
