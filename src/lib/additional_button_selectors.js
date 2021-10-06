import gmailAdditionalButtonSelectorsData from '../data/additional_button_selectors/gmail.json';

class AdditionalButtonSelectors {
  static additionalButtonSelectorsByDomain = {
    'mail.google.com': gmailAdditionalButtonSelectorsData
  };

  static getAdditionalButtonSelectorsByDomain(domain) {
    return this.additionalButtonSelectorsByDomain[domain] || [];
  }

  static selectorToQueryString(selector) {
    if (!selector.attributes) {
      return selector.nodeName.toLowerCase()
    } else {
      return `${selector.nodeName.toLowerCase()}${this.selectorAttributesToQueryString(selector)}`
    }
  }

  static selectorAttributesToQueryString(selector) {
    return Object.entries(selector.attributes)
      .map(([attributeName, attributeValue]) => `[${attributeName}="${attributeValue}"]`)
      .join('');
  }
}

export default AdditionalButtonSelectors;
