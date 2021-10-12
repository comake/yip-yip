class ButtonSelectors {
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

export default ButtonSelectors;
