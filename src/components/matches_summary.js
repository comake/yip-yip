import React from 'react';
import "../content.css";

const MatchesSummary = (props) => {
  const { selectedSelectionIndex, matchingLinksAndButtons } = props;
  return (
    <div id={'yipyip-matches-summary'}>
      { matchingLinksAndButtons.length > 0 &&
        `${selectedSelectionIndex + 1} / ${matchingLinksAndButtons.length}`
      }
    </div>
  )
}

export default MatchesSummary;
