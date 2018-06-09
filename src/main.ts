import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";
import "./styles.css";

import "jquery";
// tslint:disable-next-line:ordered-imports
import "bootstrap/dist/js/bootstrap";
// tslint:disable-next-line:ordered-imports
import "bootstrap/dist/css/bootstrap.min.css";

platformBrowserDynamic().bootstrapModule(AppModule);
