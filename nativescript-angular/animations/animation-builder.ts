import { Injectable, RendererFactory2, Inject, ViewEncapsulation, RendererType2, Renderer2 } from '@angular/core';

import { View } from "tns-core-modules/ui/core/view";
import { APP_ROOT_VIEW } from "../platform-providers";
import {
    ɵBrowserAnimationBuilder as BrowserAnimationBuilder,
} from "@angular/platform-browser/animations";


@Injectable()
export class NativeScriptAnimationBuilder extends BrowserAnimationBuilder {

    constructor(rootRenderer: RendererFactory2, @Inject(APP_ROOT_VIEW) rootView: View) {
        super(rootRenderer);

        const typeData = {
            id: '0',
            encapsulation: ViewEncapsulation.None,
            styles: [],
            data: { animation: [] }
        } as RendererType2;

        (<any>this)._renderer = rootRenderer.createRenderer(rootView, typeData) as Renderer2;
    }
}