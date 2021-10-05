
class NodeMatchData {
  static prioritizedAttributes = [
    'innerTextStartsWithText',
    'hiddenAttributeStartsWithText',
    'innerTextStartsWithSynonym',
    'innerTextIncludesText',
    'hiddenAttributeIncludesText',
    'innerTextIncludesSynonym',
    'hiddenAttributeIncludesSynonym'
  ];

  constructor(node) {
    this.node = node;
    this.score = 0;


    
    this.containsText = false;
    this.innerTextIncludesText = false;
    this.innerTextStartsWithText = false;
    this.hiddenAttributeIncludesText = false;
    this.hiddenAttributeStartsWithText = false;
    this.innerTextIncludesSynonym = false;
    this.innerTextStartsWithSynonym = false;
    this.hiddenAttributeIncludesSynonym = false;
  }

  setInnerTextIncludes(startsWithText=false) {
    this.containsText = true;
    this.innerTextIncludesText = true;
    this.innerTextStartsWithText = startsWithText
  }

  setInnerTextIncludes(startsWithText=false) {
    this.containsText = true;
    this.innerTextIncludesText = true;
    this.innerTextStartsWithText = startsWithText
  }

  setHiddenAttributeIncludes(startsWithText=false) {
    this.containsText = true;
    this.hiddenAttributeIncludesText = true;
    this.hiddenAttributeStartsWithText = startsWithText
  }

  setInnerTextIncludesSynonym(startsWithText=false) {
    this.containsText = true;
    this.innerTextIncludesSynonym = true;
    this.innerTextStartsWithSynonym = startsWithText
  }

  setHiddenAttributeIncludesSynonym() {
    this.containsText = true;
    this.hiddenAttributeIncludesSynonym = true;
  }

  static compare(matchA, matchB) {
    for (const attribute of this.prioritizedAttributes) {
      if (matchA[attribute] && !matchB[attribute]) {
        return -1;
      } else if (!matchA[attribute] && matchB[attribute]) {
        return 1;
      }
    }

    return 0
  }
}

export default NodeMatchData;
