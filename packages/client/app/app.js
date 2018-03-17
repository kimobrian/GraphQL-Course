import routes from "./config/routes";
import { render } from "react-dom";
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

render(routes, document.getElementById("app"));
