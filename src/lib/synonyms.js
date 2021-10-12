class Synonyms {
  static getSynonymsForTextFromSettings(text, synonyms={}) {
    const synonymWord = Object.keys(synonyms).find(word => word.includes(text))
    if (synonymWord) {
      return synonyms[synonymWord]
    } else {
      return []
    }
  }

  static mergeMutualSynonymsIntoDirected(synonymsData) {
    return {
      ...mutualSynonymSetsToDirected(synonymsData.mutual || []),
      ...synonymsData.directed
    }
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
