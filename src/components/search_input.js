import React from 'react';
import "../content.css";

const SearchInput = (props) => {
  const { searchText, updateSearchText, inputRef } = props;

  const onSearchTextChange = React.useCallback(event => updateSearchText(event.target.value), [updateSearchText])

  return (
    <div id={'yipyip-input-container'}>
      <input
        ref={inputRef}
        id={'yipyip-input'}
        type='text'
        placeholder={'YipYip!'}
        value={searchText}
        onChange={onSearchTextChange}
      />
    </div>
  )
}

export default SearchInput;
