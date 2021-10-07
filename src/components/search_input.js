import React from 'react';
import "../content.css";

const SearchInput = (props) => {
  const { searchText, updateSearchText, inputRef, onBlur } = props;

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
        autoComplete={'off'}
        name={'yipyip-search'}
        list="autocompleteOff"
        data-lpignore='true'
        onBlur={onBlur}
      />
    </div>
  )
}

export default SearchInput;
