import Utils from "./utils.js";
import { FIELD_BOOSTS, SEARCH_TERM_BOOSTS, STARTS_WITH_BOOST, RELEVANT_WORD_BOOST } from "../constants.js";
import Synonyms from './synonyms.js';
import NodeMatchData from './node_match_data.js';
import HiddenAttributeSettings from './hidden_attribute_settings.js';

// TODO star over starred

const startsWithTextBoost = (indexOfWord, totalWords) => {
  return 1 + (0.5 / (Math.sqrt(indexOfWord + 1) * Math.sqrt(totalWords)))
}

const WHITESPACE_SPLIT_REGEX = /[\s,\/-]+/;

class NodeScorer {
  constructor(searchText, synonyms, relevantWords) {
    this.searchText = searchText;
    this.synonyms = synonyms;
    this.relevantWords = relevantWords;
  }

  scoreNode(node) {
    const lowercaseNodeText = Utils.getTextContentOfNode(node).slice().toLowerCase().trim();
    const attributeValues = this.getSearchableHiddenAttributeValuesForNodeType(node);
    return this.score(lowercaseNodeText, attributeValues)
  }

  getSearchableHiddenAttributeValuesForNodeType(node) {
    const hiddenAttributesForNode = HiddenAttributeSettings.hiddenAttributesForNode(node);
    if (hiddenAttributesForNode) {
      return hiddenAttributesForNode
        .map(attributeName => node.getAttribute(attributeName))
        .filter(Boolean)
        .map(attributeValue => attributeValue.toLowerCase());
    } else {
      return []
    }
  }

  score(innerText, attributeTextValues) {
    let score = 0;

    if (innerText && innerText.length > 0) {
      score += this.fieldScore(innerText, this.searchText, FIELD_BOOSTS.innerText, FIELD_BOOSTS.searchText)
    }

    if (attributeTextValues.length > 0) {
      const highestAttributeScore = this.getHighestAttributeScore(attributeTextValues, this.searchText)
      if (highestAttributeScore > score) {
        score = highestAttributeScore;
      }
    }

    if (score == 0) {
      if (innerText && innerText.length > 0) {
        score += this.getHighestSynonymScore(innerText)
      }

      if (attributeTextValues.length > 0) {
        const highestSynonymAttributePairScore = this.getHighestSynonymAttributePairScore(attributeTextValues)
        if (highestSynonymAttributePairScore > score) {
          score = highestSynonymAttributePairScore;
        }
      }
    }

    return score
  }

  fieldScore(fieldText, queryText, fieldBoost=1, queryTermBoost=1) {
    let score = 0;

    if (!fieldText || fieldText.length == 0) { return 0 }

    if (fieldText.includes(queryText)) {
      score += fieldBoost * queryTermBoost;
    }

    const fieldWords = fieldText.trim().split(WHITESPACE_SPLIT_REGEX);
    const indexOfWordStartingWithQueryText = fieldWords.findIndex(word => word.startsWith(queryText));
    if (indexOfWordStartingWithQueryText !== -1) {
      score = score * startsWithTextBoost(indexOfWordStartingWithQueryText, fieldWords.length);
    }

    if (this.relevantWords.some(word => fieldWords.includes(word))) {
      score = score * RELEVANT_WORD_BOOST;
    }

    return score;
  }

  getHighestAttributeScore(attributeTextValues, queryText, queryIsSynonym=false) {
    // Only get the highest attribute score
    const attributeScores = attributeTextValues.map(attributeValue => {
      return this.fieldScore(
        attributeValue,
        queryText,
        FIELD_BOOSTS.attribute,
        queryIsSynonym ? FIELD_BOOSTS.synonym : FIELD_BOOSTS.searchText
      )
    });
    return this.getHighestScore(attributeScores);
  }

  getHighestSynonymScore(innerText) {
    const synonymScores = this.synonyms.map(synonym => {
      return this.fieldScore(
        innerText,
        synonym,
        FIELD_BOOSTS.innerText,
        FIELD_BOOSTS.synonym
      )
    });
    return this.getHighestScore(synonymScores);
  }

  getHighestSynonymAttributePairScore(attributeTextValues) {
    // Only get the highest synonym & attribute pair score
    const synonymScores = this.synonyms.map(synonym => {
      return this.getHighestAttributeScore(attributeTextValues, synonym, true)
    });
    return this.getHighestScore(synonymScores);
  }

  getHighestScore(scores) {
    return scores.sort(Utils.compareDescending)[0];
  }
}

export default NodeScorer;
