import React from 'react';
import "../content.css";
import Utils from "../lib/utils.js";
import { YIPYIP_HIGHLIGHT_CLASS } from "../constants.js"

function matchDataFromNodeTextMatchingRegex(node, textRegex) {
  const nodeText = Utils.getTextContentOfNode(node)
  // Use a regular expression to check if this text node contains the target text.
  return nodeText.length > 0 ? textRegex.exec(nodeText) : null;
}

function findChildNodeAndMatchDataWithTextMatchingRegex(node, textRegex, matches=[]) {
  if (node.nodeType === Node.TEXT_NODE) {
    const match = matchDataFromNodeTextMatchingRegex(node, textRegex)
    if (match != null) {
      matches.push({ node, match })
    }
  } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes.length > 0) {
    [...node.childNodes].forEach(childNode => {
      findChildNodeAndMatchDataWithTextMatchingRegex(childNode, textRegex, matches)
    })
  }

  return matches
}

function removeHighlights() {
  const highlights = [...document.getElementsByClassName(YIPYIP_HIGHLIGHT_CLASS)]
  for (let i = 0; i < highlights.length; i++) {
    removeHighlight(highlights[i])
  }
}

function removeHighlight(highlightNode) {
  const highlightNodeText = Utils.getTextContentOfNode(highlightNode)
  const replacementTextNode = document.createTextNode(highlightNodeText);
  highlightNode.parentNode.replaceChild(replacementTextNode, highlightNode);
  replacementTextNode.parentNode.normalize();
}

function highlightNodeWithMatchData(node, match) {
  // Create a document fragment to hold the new nodes.
  const fragment = document.createDocumentFragment();
  // Create a new text node for any preceding text.
  fragment.appendChild(document.createTextNode(match[1]));

  // Create the wrapper span and add the matched text to it.
  const spanNode = document.createElement('span');
  spanNode.setAttribute('class', YIPYIP_HIGHLIGHT_CLASS)
  spanNode.appendChild(document.createTextNode(match[2]));
  fragment.appendChild(spanNode);

  // Create a new text node for any following text.
  fragment.appendChild(document.createTextNode(match[3]));

  // Replace the existing text node with the fragment.
  node.parentNode.replaceChild(fragment, node);
}

const useHighlights = (props) => {
  const { searchText, matchingNodes } = props;

  const textRegex = React.useMemo(() => Utils.regexpMatchingTextAtStartOrEndOrSurroundedByNonWordChars(searchText), [searchText])

  React.useEffect(() => {
    matchingNodes.forEach(node => {
      node.normalize();
      const matchingNodesAndMatchData = findChildNodeAndMatchDataWithTextMatchingRegex(node, textRegex);
      matchingNodesAndMatchData.forEach(matchingNodeAndMatchData => {
        highlightNodeWithMatchData(matchingNodeAndMatchData.node, matchingNodeAndMatchData.match)
      })
    })

    return () => {
      removeHighlights()
    }
  }, [matchingNodes, textRegex])
}

export default useHighlights;
