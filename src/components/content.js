import React from 'react';
import ReactDOM from 'react-dom';
import "../content.css";

import useWindowEvent from "../hooks/use_window_event.js";
import useDocumentEvent from "../hooks/use_document_event.js";
import useHighlights from "../hooks/use_highlights.js";
import { F_KEYCODE, ENTER_KEY, TAB_KEY, BACKSPACE_KEY, YIPYIP_ROOT_ID } from "../constants.js";

import Utils from "../lib/utils.js";
import FindInPage from "../lib/find_in_page.js";
import SearchInput from "./search_input.js";
import Selections from "./selections.js";
import MatchesSummary from "./matches_summary.js";
import DraggableContainer from "./draggable_container.js";
import InfoDropdown from "./info_dropdown.js";

const SELECTION_UPDATE_TIMEOUT_DURATION = 100;

function scrollToNodeAtIndexInList(nodeList, selectedIndex) {
  const selectedMatchingNode = nodeList.length > 0 ? nodeList[selectedIndex] : null;
  if (selectedMatchingNode) {
    selectedMatchingNode.scrollIntoViewIfNeeded()
  }
}

const YipYip = (props) => {
  const scrollOrResizeUpdateTimeout = React.useRef();
  const selectionUpdateTimeout = React.useRef();
  const searchInputRef = React.useRef();
  const [searchText, setSearchText] = React.useState('');
  const [prevSearchText, setPrevSearchText] = React.useState('');
  const [matchingNodes, setMatchingNodes] = React.useState([]);
  const [matchingLinksAndButtons, setMatchingLinksAndButtons] = React.useState([]);
  const [selectedSelectionIndex, setSelectedSelectionIndex] = React.useState(0);
  const [scrollOrResizeRefresh, setScrollOrResizeRefresh] = React.useState(false);
  const [hideSelections, setHideSelections] = React.useState(false);

  const focusSearchInput = React.useCallback(() => searchInputRef.current.focus(), [])
  const clearMatchingNodes = React.useCallback(() => {
    setMatchingNodes([])
    setMatchingLinksAndButtons([])
  }, [])

  const resetSearchTextAndMatches = React.useCallback(event => {
    setSearchText('')
    clearMatchingNodes()
    setSelectedSelectionIndex(0)
  }, [clearMatchingNodes])

  const resetSearchTextAndMatchesIfDifferentInputIsActive = React.useCallback(event => {
    if (Utils.differentInputIsActive(searchInputRef.current)) {
      resetSearchTextAndMatches()
    }
  }, [resetSearchTextAndMatches])

  const preventDefaultEventAndFocusInput = React.useCallback(event => {
    event.preventDefault();
    focusSearchInput()
  }, [focusSearchInput]);

  const clickSelectedMatchingNodeAndReset = React.useCallback(event => {
    if (matchingLinksAndButtons.length > 0) {
      event.preventDefault()
      event.stopPropagation()

      const node = matchingLinksAndButtons[selectedSelectionIndex];
      Utils.clickOrFocusNode(node)
      resetSearchTextAndMatches()
    }
  }, [matchingLinksAndButtons, selectedSelectionIndex, resetSearchTextAndMatches])

  const updateMatchingNodesAndScrollToSelectedIndex = React.useCallback(selectedIndex => {
    const { matchingNodes, matchingLinksAndButtons } = FindInPage.findNodesInPageMatchingText(searchText);
    setMatchingNodes(matchingNodes)
    setMatchingLinksAndButtons(matchingLinksAndButtons)

    if (matchingLinksAndButtons.length > 0) {
      scrollToNodeAtIndexInList(matchingLinksAndButtons, selectedIndex)
      setScrollOrResizeRefresh(!scrollOrResizeRefresh)
    }
  }, [searchText, scrollOrResizeRefresh])

  const updateSelectionPositionsAfterTimeout = React.useCallback(() => {
    setHideSelections(true)
    if (scrollOrResizeUpdateTimeout.current) { clearTimeout(scrollOrResizeUpdateTimeout.current) }
    scrollOrResizeUpdateTimeout.current = setTimeout(() => {
      setScrollOrResizeRefresh(!scrollOrResizeRefresh)
      setHideSelections(false)
    }, SELECTION_UPDATE_TIMEOUT_DURATION)
  }, [scrollOrResizeRefresh])

  const updateSelectionAndScrollToSelectedAfterTimeout = React.useCallback(() => {
    if (selectionUpdateTimeout.current) { clearTimeout(selectionUpdateTimeout.current) }
    const newSelectedSelectionIndex = 0;
    clearMatchingNodes()
    setSelectedSelectionIndex(newSelectedSelectionIndex)

    selectionUpdateTimeout.current = setTimeout(() => {
      updateMatchingNodesAndScrollToSelectedIndex(newSelectedSelectionIndex);
    }, SELECTION_UPDATE_TIMEOUT_DURATION)
  }, [clearMatchingNodes, updateMatchingNodesAndScrollToSelectedIndex])

  const preventDefaultEventAndSelectNextMatchingNode = React.useCallback((event, forward) => {
    event.preventDefault();
    event.stopPropagation();

    if (matchingLinksAndButtons.length > 1) {
      const newSelectedSelectionIndex = (selectedSelectionIndex + (forward ? 1 : (matchingLinksAndButtons.length-1))) % matchingLinksAndButtons.length;
      setSelectedSelectionIndex(newSelectedSelectionIndex)
      scrollToNodeAtIndexInList(matchingLinksAndButtons, newSelectedSelectionIndex)
      setScrollOrResizeRefresh(!scrollOrResizeRefresh)
    }
  }, [matchingLinksAndButtons, selectedSelectionIndex, scrollOrResizeRefresh])

  const preventDefaultAndClearSearchText = React.useCallback(event => {
    event.preventDefault();
    event.stopPropagation();
    setSearchText('')
  }, [])

  const handleKeyEvent = React.useCallback(event => {
    const differentInputIsActive = Utils.differentInputIsActive(searchInputRef.current);
    if (event.code === F_KEYCODE && event.altKey) {
      preventDefaultEventAndFocusInput(event)
    } else if (event.key === ENTER_KEY) {
      clickSelectedMatchingNodeAndReset(event)
    } else if (event.key === TAB_KEY && (document.activeElement === searchInputRef.current || !differentInputIsActive)) {
      preventDefaultEventAndSelectNextMatchingNode(event, !event.shiftKey)
    } else if (!differentInputIsActive && Utils.keyValidForFocus(event.key) && !event.metaKey && !event.altKey) {
      focusSearchInput()
    } else if (event.key === BACKSPACE_KEY && event.metaKey && !differentInputIsActive) {
      preventDefaultAndClearSearchText(event)
    }
  }, [preventDefaultEventAndFocusInput, clickSelectedMatchingNodeAndReset,
    preventDefaultEventAndSelectNextMatchingNode, focusSearchInput,
    preventDefaultAndClearSearchText
  ])

  React.useEffect(() => {
    if (searchText !== prevSearchText) {
      setPrevSearchText(searchText)
      updateSelectionAndScrollToSelectedAfterTimeout()
    }
  }, [searchText, prevSearchText, updateSelectionAndScrollToSelectedAfterTimeout])

  const hasMatchingLinksOrButtons = React.useMemo(() => matchingLinksAndButtons.length > 0, [matchingLinksAndButtons])
  useWindowEvent('scroll', hasMatchingLinksOrButtons, updateSelectionPositionsAfterTimeout)
  useWindowEvent('wheel', hasMatchingLinksOrButtons, updateSelectionPositionsAfterTimeout)
  useWindowEvent('resize', hasMatchingLinksOrButtons, updateSelectionPositionsAfterTimeout)
  useDocumentEvent('click', true, resetSearchTextAndMatchesIfDifferentInputIsActive)
  useDocumentEvent('keydown', true, handleKeyEvent)

  useHighlights({ searchText, matchingNodes })

  return (
    <>
      { !hideSelections && <Selections
          refresh={scrollOrResizeRefresh}
          selectedSelectionIndex={selectedSelectionIndex}
          matchingLinksAndButtons={matchingLinksAndButtons}
        />
      }
      <DraggableContainer>
        <SearchInput
          inputRef={searchInputRef}
          searchText={searchText}
          updateSearchText={setSearchText}
        />
        <MatchesSummary
          selectedSelectionIndex={selectedSelectionIndex}
          matchingLinksAndButtons={matchingLinksAndButtons}
        />
        <InfoDropdown />
      </DraggableContainer>
    </>
  )
}

const app = document.createElement('div');
app.id = YIPYIP_ROOT_ID;
document.body.appendChild(app);
ReactDOM.render(<YipYip />, app);
