import Utils from '../utils.js';

const mutualSynonymSets = [
  ['delete', 'trash', 'discard']
];

const GmailSynonyms = {
  ...Utils.synonymSetsToHash(mutualSynonymSets),
  'new': ['compose'],
  'tag': ['label'],
  'last': ['newer'],
  'previous': ['newer'],
  'next': ['older']
};

export default GmailSynonyms;
