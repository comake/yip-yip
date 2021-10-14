class Selector {
  constructor(data) {
    this.nodeName = data.nodeName;
    this.attributes = data.attributes || {};
  }

  toQueryString() {
    return `${this.nodeName.toLowerCase()}${this.attributesToQueryString()}`
  }

  attributesToQueryString() {
    return Object.entries(this.attributes)
      .map(([attributeName, attributeValue]) => `[${attributeName}="${attributeValue}"]`)
      .join('');
  }

  nodeMatches(node) {
    return node.nodeName === this.nodeName && this.nodeMatchesAllAttributes(node)
  }

  nodeMatchesAllAttributes(node) {
    return Object.entries(this.attributes).every(([attributeName, attributeValue]) => {
      return node.getAttribute(attributeName) == attributeValue
    })
  }
}

export default Selector
