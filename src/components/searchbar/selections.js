import React from 'react';
import Selection from "./selection.js";

const Selections = (props) => {
  const { selectedSelectionIndex, matchingLinksAndButtons, refresh } = props;
  return matchingLinksAndButtons.map((node, index) => {
    const isSelected = index === selectedSelectionIndex;
    return <Selection
      key={`${refresh}${index}`}
      node={node}
      isSelected={isSelected}
    />
  })
}

export default Selections;
