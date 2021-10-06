import React from 'react';
import "../content.css";

import useWindowEvent from "../hooks/use_window_event.js";
import useDocumentEvent from "../hooks/use_document_event.js";
import useHighlights from "../hooks/use_highlights.js";
import { F_KEYCODE, ENTER_KEY, TAB_KEY, BACKSPACE_KEY } from "../constants.js";

import Utils from "../lib/utils.js";
import FindInPage from "../lib/find_in_page.js";
import SearchInput from "./search_input.js";
import Selections from "./selections.js";
import MatchesSummary from "./matches_summary.js";
import DraggableContainer from "./draggable_container.js";
import InfoDropdown from "./info_dropdown.js";
import VisibilityButton from "./visibility_button.js";

const SCROLL_OR_RESIZE_UPDATE_TIMEOUT_DURATION = 100;
const SEARCH_TEXT_UPDATE_TIMEOUT_DURATION = 150;

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

  const [isHidden, setIsHidden] = React.useState(false);
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

  const hide = React.useCallback(() => {
    setIsHidden(true)
    resetSearchTextAndMatches()
  }, [resetSearchTextAndMatches])

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
    const { matchingNodes, matchingLinksAndButtons, bestMatchingLinkOrButtonIndex } = new FindInPage(searchText).findMatches();
    setMatchingNodes(matchingNodes)
    setMatchingLinksAndButtons(matchingLinksAndButtons)
    setSelectedSelectionIndex(bestMatchingLinkOrButtonIndex)

    if (matchingLinksAndButtons.length > 0) {
      scrollToNodeAtIndexInList(matchingLinksAndButtons, bestMatchingLinkOrButtonIndex)
      setScrollOrResizeRefresh(!scrollOrResizeRefresh)
    }
  }, [searchText, scrollOrResizeRefresh])

  const updateSelectionPositionsAfterTimeout = React.useCallback(() => {
    setHideSelections(true)
    if (scrollOrResizeUpdateTimeout.current) { clearTimeout(scrollOrResizeUpdateTimeout.current) }
    scrollOrResizeUpdateTimeout.current = setTimeout(() => {
      setScrollOrResizeRefresh(!scrollOrResizeRefresh)
      setHideSelections(false)
    }, SCROLL_OR_RESIZE_UPDATE_TIMEOUT_DURATION)
  }, [scrollOrResizeRefresh])

  const updateSelectionAndScrollToSelectedAfterTimeout = React.useCallback(() => {
    if (selectionUpdateTimeout.current) { clearTimeout(selectionUpdateTimeout.current) }
    clearMatchingNodes()

    selectionUpdateTimeout.current = setTimeout(() => {
      updateMatchingNodesAndScrollToSelectedIndex();
    }, SEARCH_TEXT_UPDATE_TIMEOUT_DURATION)
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
    if (isHidden && event.code === F_KEYCODE && event.altKey) {
      setIsHidden(false)
      preventDefaultEventAndFocusInput(event)
    } else if (!isHidden && event.code === F_KEYCODE && event.altKey) {
      hide()
    } else if (!isHidden && event.key === ENTER_KEY) {
      clickSelectedMatchingNodeAndReset(event)
    } else if (!isHidden && event.key === TAB_KEY && (document.activeElement === searchInputRef.current || !differentInputIsActive)) {
      preventDefaultEventAndSelectNextMatchingNode(event, !event.shiftKey)
    } else if (!isHidden && !differentInputIsActive && Utils.keyValidForFocus(event.key) && !event.metaKey && !event.altKey) {
      focusSearchInput()
    } else if (!isHidden && event.key === BACKSPACE_KEY && event.metaKey && !differentInputIsActive) {
      preventDefaultAndClearSearchText(event)
    }
  }, [preventDefaultEventAndFocusInput, clickSelectedMatchingNodeAndReset,
    preventDefaultEventAndSelectNextMatchingNode, focusSearchInput,
    preventDefaultAndClearSearchText, isHidden, hide
  ])

  React.useEffect(() => {
    if (searchText !== prevSearchText) {
      setPrevSearchText(searchText)
      updateSelectionAndScrollToSelectedAfterTimeout()
    }
  }, [searchText, prevSearchText, updateSelectionAndScrollToSelectedAfterTimeout])

  const hasMatchingLinksOrButtons = React.useMemo(() => matchingLinksAndButtons.length > 0, [matchingLinksAndButtons])
  useWindowEvent('scroll', !isHidden && hasMatchingLinksOrButtons, updateSelectionPositionsAfterTimeout)
  useWindowEvent('wheel', !isHidden && hasMatchingLinksOrButtons, updateSelectionPositionsAfterTimeout)
  useWindowEvent('resize', !isHidden && hasMatchingLinksOrButtons, updateSelectionPositionsAfterTimeout)
  useDocumentEvent('click', !isHidden, resetSearchTextAndMatchesIfDifferentInputIsActive)
  useDocumentEvent('keydown', true, handleKeyEvent)

  useHighlights({ searchText, matchingNodes })

  if (isHidden) {
    return ''
  } else {
    return (
      <div>
        { !hideSelections && <Selections
            refresh={scrollOrResizeRefresh}
            selectedSelectionIndex={selectedSelectionIndex}
            matchingLinksAndButtons={matchingLinksAndButtons}
          />
        }
        <DraggableContainer searchInputRef={searchInputRef}>
          <SearchInput
            inputRef={searchInputRef}
            searchText={searchText}
            updateSearchText={setSearchText}
          />
          <MatchesSummary
            selectedSelectionIndex={selectedSelectionIndex}
            matchingLinksAndButtons={matchingLinksAndButtons}
          />
          <VisibilityButton hide={hide} />
          <InfoDropdown />
        </DraggableContainer>
      </div>
    )
  }
}

export default YipYip;
