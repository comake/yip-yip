import ReactDOM from 'react-dom';
import Searchbar from "./components/searchbar/searchbar.js";
import { YIPYIP_ROOT_ID } from "./constants.js";
import './content.css'

const app = document.createElement('div');
app.id = YIPYIP_ROOT_ID;
document.body.appendChild(app);
ReactDOM.render(<Searchbar />, app);
