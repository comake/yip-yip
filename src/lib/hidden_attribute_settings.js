import { LINK_OR_BUTTON_OR_INPUT_TYPES, LINK_OR_BUTTON_ROLE_VALUES } from "../constants.js";
import Utils from './utils.js';
import hiddenAttributesByNodeName from '../data/hidden_attributes_by_node_name.json';
import ButtonSelectors from './button_selectors.js';

class HiddenAttributeSettings {
  constructor(appSpecificAdditionalButtonSelectors=[]) {
    this.additionalButtonSelectors = appSpecificAdditionalButtonSelectors;
  }

  hiddenAttributeSettingsByNodeNameToQuerySelector() {
    const defaultButtonOrLinkQuerySelectors =  Object.keys(hiddenAttributesByNodeName)
      .map(nodeName => this.selectorsForNodeTypeWithHiddenAttributes(nodeName));

    const additionalButtonQuerySelectors = this.additionalButtonSelectors
      .map(selector => ButtonSelectors.selectorToQueryString(selector));

    return [
      ...defaultButtonOrLinkQuerySelectors,
      ...additionalButtonQuerySelectors
    ].join(', ');
  }

  selectorsForNodeTypeWithHiddenAttributes(nodeName) {
    if (LINK_OR_BUTTON_OR_INPUT_TYPES.includes(nodeName)) {
      return nodeName.toLowerCase()
    } else {
      return LINK_OR_BUTTON_ROLE_VALUES.map(roleAttributeValue => {
        return `${nodeName.toLowerCase()}[role="${roleAttributeValue}"]`
      })
      .join(', ')
    }
  }

  isLinkOrButtonOrInput(node) {
    return (
      (
        LINK_OR_BUTTON_OR_INPUT_TYPES.includes(node.nodeName) ||
        LINK_OR_BUTTON_ROLE_VALUES.includes(node.getAttribute('role'))
      ) ||
      this.additionalButtonSelectors.some(selector => Utils.nodeMatchesSelector(node, selector))
    );
  }

  static hiddenAttributesForNode(node) {
    return hiddenAttributesByNodeName[node.nodeName]
  }
}

export default HiddenAttributeSettings;
