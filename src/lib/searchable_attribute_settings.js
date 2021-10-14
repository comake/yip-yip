import { LINK_OR_BUTTON_OR_INPUT_TYPES, LINK_OR_BUTTON_ROLE_VALUES } from "../constants.js";
import Utils from './utils.js';
import defaultSearchableAttributesByNodeName from '../data/searchable_attributes_by_node_name.json';

const defaultButtonOrLinkQuerySelectors = Object.keys(defaultSearchableAttributesByNodeName)
  .map(nodeName => selectorsForNodeTypeWithSearchableAttributes(nodeName));

function selectorsForNodeTypeWithSearchableAttributes(nodeName) {
  if (LINK_OR_BUTTON_OR_INPUT_TYPES.includes(nodeName)) {
    return nodeName.toLowerCase()
  } else {
    return LINK_OR_BUTTON_ROLE_VALUES.map(roleAttributeValue => {
      return `${nodeName.toLowerCase()}[role="${roleAttributeValue}"]`
    })
    .join(', ')
  }
}

class SearchableAttributeSettings {
  constructor(appSpecificAdditionalButtonSelectors=[], appSecificAdditionalSearchableAttributesByNodeName={}) {
    this.additionalButtonSelectors = appSpecificAdditionalButtonSelectors;
    this.additionalSearchableAttributesByNodeName = appSecificAdditionalSearchableAttributesByNodeName;
  }

  searchableAttributeSettingsByNodeNameToQuerySelector() {
    return [
      ...defaultButtonOrLinkQuerySelectors,
      ...(this.additionalButtonSelectors)
    ].join(', ');
  }

  isLinkOrButtonOrInput(node) {
    return (
      (
        LINK_OR_BUTTON_OR_INPUT_TYPES.includes(node.nodeName) ||
        LINK_OR_BUTTON_ROLE_VALUES.includes(node.getAttribute('role'))
      ) ||
      this.additionalButtonSelectors.some(selector => node.matches(selector))
    );
  }

  searchableAttributeValuesForNode(node) {
    const searchableAttributesForNode = this.searchableAttributesForNode(node);
    return this.lowercaseAttributeValuesForAttributesOfNode(node, searchableAttributesForNode)
  }

  searchableAttributesForNode(node) {
    return [
      ...(defaultSearchableAttributesByNodeName[node.nodeName] || []),
      ...(this.additionalSearchableAttributesByNodeName[node.nodeName] || [])
    ]
  }

  lowercaseAttributeValuesForAttributesOfNode(node, attributeNames) {
    return attributeNames
      .reduce((arr, attributeName) => {
        const attributeValue = node.getAttribute(attributeName)
        if (attributeValue) {
          arr.push(attributeValue.toLowerCase())
        }
        return arr
      }, []);
  }
}

export default SearchableAttributeSettings;
