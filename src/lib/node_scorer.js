import Utils from "./utils.js";
import { FIELD_BOOSTS, SEARCH_TERM_BOOSTS, STARTS_WITH_BOOST, RELEVANT_WORD_BOOST,
  RELEVANT_SELECTOR_BOOST
} from "../constants.js";

import Synonyms from './synonyms.js';
import RelevantWords from './relevant_words.js';
import RelevantSelectors from './relevant_selectors.js';
import HiddenAttributeSettings from './hidden_attribute_settings.js';

// TODO star over starred

const startsWithTextBoost = (indexOfWord, totalWords) => {
  return 1 + (0.5 / (Math.sqrt(indexOfWord + 1) * Math.sqrt(totalWords)))
}

const WHITESPACE_SPLIT_REGEX = /[\s,\/-]+/;

class NodeScorer {
  constructor(searchText) {
    this.searchText = searchText;

    this.domain = window.location.host;
    this.synonyms = Synonyms.getSynonymsForTextInDomain(this.domain, searchText);
    this.relevantWords = RelevantWords.getRelevantWordsForDomain(this.domain);
    this.relevantSelectors = RelevantSelectors.getRelevantSelectorsForDomain(this.domain);
  }

  scoreNode(node) {
    const lowercaseNodeText = Utils.getTextContentOfNode(node).slice().toLowerCase().trim();
    const attributeValues = this.getSearchableHiddenAttributeValuesForNodeType(node);
    return this.score(node, lowercaseNodeText, attributeValues)
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

  score(node, innerText, attributeTextValues) {
    let score = 0;

    if (innerText && innerText.length > 0) {
      score += this.fieldScore(innerText, this.searchText, FIELD_BOOSTS.innerText, SEARCH_TERM_BOOSTS.searchText)
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

    if (score > 0 && this.relevantSelectors.some(selector => RelevantSelectors.nodeMatchesSelector(node, selector))) {
      score = score * RELEVANT_SELECTOR_BOOST;
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
        queryIsSynonym ? SEARCH_TERM_BOOSTS.synonym : SEARCH_TERM_BOOSTS.searchText
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
        SEARCH_TERM_BOOSTS.synonym
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
