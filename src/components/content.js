import ReactDOM from 'react-dom';
import YipYip from "./yipyip.js";
import { YIPYIP_ROOT_ID } from "../constants.js";

const app = document.createElement('div');
app.id = YIPYIP_ROOT_ID;
document.body.appendChild(app);
ReactDOM.render(<YipYip />, app);
