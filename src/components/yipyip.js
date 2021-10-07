import React from 'react';
import "../content.css";

import useWindowEvent from "../hooks/use_window_event.js";
import useDocumentEvent from "../hooks/use_document_event.js";
import useHighlights from "../hooks/use_highlights.js";
import useKeyboardShortcuts from "../hooks/use_keyboard_shortcuts.js";

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

const HIDDEN_STYLE = { display: 'none' }
const SHOWN_STYLE = { display: 'block' }

function scrollToNodeAtIndexInList(nodeList, selectedIndex) {
  const selectedMatchingNode = nodeList.length > 0 ? nodeList[selectedIndex] : null;
  if (selectedMatchingNode) {
    selectedMatchingNode.scrollIntoViewIfNeeded()
  }
}

const YipYip = (props) => {
  const scrollOrResizeUpdateTimeout = React.useRef();
  const selectionUpdateTimeout = React.useRef();
  const containerRef = React.useRef();
  const searchInputRef = React.useRef();

  const [autoHide, setAutoHide] = React.useState(true);
  const [isHidden, setIsHidden] = React.useState(true);
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

  const handleBlur = React.useCallback(event => {
    if (autoHide) {
      setIsHidden(true)
    }
    resetSearchTextAndMatches()
  }, [autoHide, resetSearchTextAndMatches])

  const preventDefaultEventAndFocusInput = React.useCallback(event => {
    event.preventDefault();
    event.stopPropagation();
    focusSearchInput()
  }, [focusSearchInput]);

  const clickSelectedMatchingNodeAndReset = React.useCallback(event => {
    if (matchingLinksAndButtons.length > 0) {
      event.preventDefault()
      event.stopPropagation()

      const node = matchingLinksAndButtons[selectedSelectionIndex];
      Utils.clickOrFocusNode(node)

      if (autoHide) {
        setIsHidden(true)
      }
      resetSearchTextAndMatches()
    }
  }, [matchingLinksAndButtons, selectedSelectionIndex, resetSearchTextAndMatches, autoHide])

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

  const preventDefaultEventAndSelectNextMatchingNode = React.useCallback((event, forward=true) => {
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

  const handleNextMatchShortcut = React.useCallback(event => {
    const differentInputIsActive = Utils.differentInputIsActive(searchInputRef.current);
    if (!isHidden && (document.activeElement === searchInputRef.current || !differentInputIsActive)) {
      preventDefaultEventAndSelectNextMatchingNode(event)
    }
  }, [isHidden, preventDefaultEventAndSelectNextMatchingNode])

  const handlePreviousMatchShortcut = React.useCallback(event => {
    const differentInputIsActive = Utils.differentInputIsActive(searchInputRef.current);
    if (!isHidden && (document.activeElement === searchInputRef.current || !differentInputIsActive)) {
      preventDefaultEventAndSelectNextMatchingNode(event, false)
    }
  }, [isHidden, preventDefaultEventAndSelectNextMatchingNode])

  const handleSelectShortcut = React.useCallback(event => {
    if (!isHidden) {
      clickSelectedMatchingNodeAndReset(event)
    }
  }, [isHidden, clickSelectedMatchingNodeAndReset])

  const handleClearShortcut = React.useCallback(event => {
    const differentInputIsActive = Utils.differentInputIsActive(searchInputRef.current);
    if (!isHidden && !differentInputIsActive) {
      preventDefaultAndClearSearchText(event)
    }
  }, [isHidden, preventDefaultAndClearSearchText])

  const handleFocusShortcut = React.useCallback(event => {
    setIsHidden(false)
    preventDefaultEventAndFocusInput(event)
  }, [preventDefaultEventAndFocusInput])

  const toggleAutoHide = React.useCallback(() => {
    setAutoHide(!autoHide)

    if (autoHide) {
      setIsHidden(false)
      focusSearchInput()
    } else {
      hide()
    }
  }, [focusSearchInput, hide, autoHide])

  const handleToggleAutohideShortcut = React.useCallback(event => {
    setAutoHide(!autoHide)

    if (autoHide) {
      setIsHidden(false)
      preventDefaultEventAndFocusInput(event)
    } else {
      hide()
    }
  }, [preventDefaultEventAndFocusInput, hide, autoHide])

  const keyboardShortcutHandlerMapping = React.useMemo(() => {
    return {
      next_match: handleNextMatchShortcut,
      previous_match: handlePreviousMatchShortcut,
      select: handleSelectShortcut,
      clear_searchbar: handleClearShortcut,
      focus_searchbar: handleFocusShortcut,
      toggle_autohide: handleToggleAutohideShortcut
    }
  }, [handleNextMatchShortcut, handlePreviousMatchShortcut, handleSelectShortcut,
    handleClearShortcut, handleFocusShortcut, handleToggleAutohideShortcut
  ])

  const handleShortcut = React.useCallback((keyboardShortcutName, event) => {
    const keyboardEventHandler = keyboardShortcutHandlerMapping[keyboardShortcutName]
    if (keyboardEventHandler) {
      keyboardEventHandler(event)
    }
  }, [keyboardShortcutHandlerMapping])

  const handleKeydown = React.useCallback(event => {
    const differentInputIsActive = Utils.differentInputIsActive(searchInputRef.current);
    if (!differentInputIsActive && Utils.keyValidForFocus(event.key) && !event.metaKey && !event.altKey) {
      setIsHidden(false)
      focusSearchInput()
    }
  }, [focusSearchInput])

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
  // useDocumentEvent('click', !isHidden, handleClick)
  useDocumentEvent('keydown', true, handleKeydown)
  useKeyboardShortcuts(handleShortcut)

  useHighlights({ searchText, matchingNodes })

  return (
    <div style={isHidden ? HIDDEN_STYLE : SHOWN_STYLE}>
      { !hideSelections && <Selections
          refresh={scrollOrResizeRefresh}
          selectedSelectionIndex={selectedSelectionIndex}
          matchingLinksAndButtons={matchingLinksAndButtons}
        />
      }
      <DraggableContainer containerRef={containerRef} searchInputRef={searchInputRef}>
        <SearchInput
          inputRef={searchInputRef}
          searchText={searchText}
          onBlur={handleBlur}
          updateSearchText={setSearchText}
        />
        <MatchesSummary
          selectedSelectionIndex={selectedSelectionIndex}
          matchingLinksAndButtons={matchingLinksAndButtons}
        />
        <VisibilityButton
          autoHide={autoHide}
          toggleAutoHide={toggleAutoHide}
        />
        <InfoDropdown />
      </DraggableContainer>
    </div>
  )
}

export default YipYip;
