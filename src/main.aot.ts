import { enableProdMode } from "@angular/core";
import { platformBrowser } from "@angular/platform-browser";
import "./styles.scss";

import { AppModuleNgFactory } from "./app/app.module.ngfactory";

enableProdMode();

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
