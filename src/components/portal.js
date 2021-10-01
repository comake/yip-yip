import React from 'react';
import ReactDOM from 'react-dom';
import { YIPYIP_ROOT_ID } from '../constants.js';

const Portal = (props) => {
  const { children } = props;
  const el = React.useRef(document.getElementById(YIPYIP_ROOT_ID))
  return ReactDOM.createPortal(children, el.current);
}

export default Portal;
