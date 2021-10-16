import ReactDOM from 'react-dom';
import Searchbar from "./components/searchbar/searchbar.js";
import { YIPYIP_ROOT_ID } from "./constants.js";
import { detect } from "detect-browser";
import './content.css'

const app = document.createElement('div');
app.id = YIPYIP_ROOT_ID;
document.body.appendChild(app);
ReactDOM.render(<Searchbar />, app);

const browser = detect();
if (browser.name == 'firefox') {
  app.classList.add('yipyip-firefox');
}
