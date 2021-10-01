import React from 'react';
import "../content.css";
import Utils from "../utils.js";
import { YIPYIP_HIGHLIGHT_CLASS } from "../constants.js"

function matchDataFromNodeTextMatchingRegex(node, textRegex) {
  const nodeText = Utils.getTextContentOfNode(node)
  // Use a regular expression to check if this text node contains the target text.
  return textRegex.exec(nodeText);
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
  const replacementTextNode = document.createTextNode(highlightNodeText)
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
      const matchingNodesAndMatchData = findChildNodeAndMatchDataWithTextMatchingRegex(node, textRegex)
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


// let nodeText;
// const nodeStack = [];
//
// // Remove empty text nodes and combine adjacent text nodes.
// node.normalize();
//
// // Iterate through the node's child elements, looking for text nodes.
// var currentChildNode = node.firstChild;
// while (currentChildNode != null) {
//   if (currentChildNode.nodeType == Node.TEXT_NODE) {
//     // Get node text in a cross-browser compatible fashion.
//     if (typeof currentChildNode.textContent == 'string') {
//       nodeText = currentChildNode.textContent;
//     } else {
//       nodeText = currentChildNode.innerText;
//     }
//
//     // Use a regular expression to check if this text node contains the target text.
//     const match = textRegex.exec(nodeText);
//     if (match != null) {
//       // Create a document fragment to hold the new nodes.
//       const fragment = document.createDocumentFragment();
//
//       // Create a new text node for any preceding text.
//       fragment.appendChild(document.createTextNode(match[1]));
//
//       // Create the wrapper span and add the matched text to it.
//       const spanNode = document.createElement('span');
//       spanNode.setAttribute('style', HIGHLIGHT_STYLE)
//       spanNode.setAttribute('class', HIGHLIGHT_CLASS)
//       spanNode.appendChild(document.createTextNode(match[2]));
//       fragment.appendChild(spanNode);
//
//       // Create a new text node for any following text.
//       fragment.appendChild(document.createTextNode(match[3]));
//
//       // Replace the existing text node with the fragment.
//       currentChildNode.parentNode.replaceChild(fragment, currentChildNode);
//       currentChildNode = spanNode;
//     }
//   } else if (currentChildNode.nodeType == Node.ELEMENT_NODE && currentChildNode.firstChild != null) {
//     nodeStack.push(currentChildNode);
//     currentChildNode = currentChildNode.firstChild;
//     // Skip the normal node advancement code.
//     continue;
//   }
//
//   // If there's no more siblings at this level, pop back up the stack until we find one.
//   while (currentChildNode != null && currentChildNode.nextSibling == null) {
//     currentChildNode = nodeStack.pop();
//   }
//
//   // If currentChildNode is null, that means we've completed our scan of the DOM tree.
//   // If not, we need to advance to the next sibling.
//   if (currentChildNode != null) {
//     currentChildNode = currentChildNode.nextSibling;
//   }
// }
