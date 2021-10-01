import React from 'react';
import "../content.css";

const MatchesSummary = (props) => {
  const { selectedSelectionIndex, matchingLinksAndButtons } = props;

  if (matchingLinksAndButtons.length === 0) {
    return ''
  } else {
    return <div id={'yipyip-matches-summary'}>
      {selectedSelectionIndex + 1} / {matchingLinksAndButtons.length}
    </div>
  }
}

export default MatchesSummary;
