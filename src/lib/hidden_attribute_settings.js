import Utils from "./utils.js";
import { LINK_OR_BUTTON_OR_INPUT_TYPES, LINK_OR_BUTTON_ROLE_VALUES } from "../constants.js";
import hiddenAttributesByNodeName from '../data/hidden_attributes_by_node_name.json';

class HiddenAttributeSettings {
  static nodesWithHiddenAttributesQuerySelector = this.hiddenAttributeSettingsByNodeNameToQuerySelector();

  static hiddenAttributesForNode(node) {
    return hiddenAttributesByNodeName[node.nodeName]
  }

  static hiddenAttributeSettingsByNodeNameToQuerySelector() {
    return Object.keys(hiddenAttributesByNodeName)
      .map(nodeName => this.selectorsForNodeTypeWithHiddenAttributes(nodeName))
      .join(', ');
  }

  static selectorsForNodeTypeWithHiddenAttributes(nodeName) {
    if (LINK_OR_BUTTON_OR_INPUT_TYPES.includes(nodeName)) {
      return nodeName.toLowerCase()
    } else {
      return LINK_OR_BUTTON_ROLE_VALUES.map(roleAttributeValue => {
        return `${nodeName.toLowerCase()}[role="${roleAttributeValue}"]`
      })
      .join(', ')
    }
  }
}

export default HiddenAttributeSettings;
