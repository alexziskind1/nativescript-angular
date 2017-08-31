import { NgModule, Injectable, NgZone, Provider, RendererFactory2 } from "@angular/core";

import { AnimationBuilder } from "@angular/animations";

import {
    AnimationDriver,
    ɵAnimationStyleNormalizer as AnimationStyleNormalizer,
    ɵWebAnimationsStyleNormalizer as WebAnimationsStyleNormalizer,
} from "@angular/animations/browser";

import {
    ɵAnimationRendererFactory as AnimationRendererFactory,
    ɵBrowserAnimationBuilder as BrowserAnimationBuilder,
} from "@angular/platform-browser/animations";

import { NativeScriptAnimationEngine } from "./animations/animation-engine";
import { NativeScriptAnimationDriver } from "./animations/animation-driver";
import { NativeScriptModule } from "./nativescript.module";
import { NativeScriptRendererFactory } from "./renderer";
import { NativeScriptAnimationBuilder } from "./animations/animation-builder";
import { APP_ROOT_VIEW } from "./platform-providers";
import { View } from "tns-core-modules/ui/core/view";

@Injectable()
export class InjectableAnimationEngine extends NativeScriptAnimationEngine {
    constructor(driver: AnimationDriver, normalizer: AnimationStyleNormalizer) {
        super(driver, normalizer);
    }
}

export function instantiateSupportedAnimationDriver() {
    return new NativeScriptAnimationDriver();
}

export function instantiateRendererFactory(
    renderer: NativeScriptRendererFactory, engine: NativeScriptAnimationEngine, zone: NgZone) {
    return new AnimationRendererFactory(renderer, engine, zone);
}

export function instantiateDefaultStyleNormalizer() {
    return new WebAnimationsStyleNormalizer();
}

export function instantiateAnimationBuilder(renderer: NativeScriptRendererFactory, rootView: View) {
    return new NativeScriptAnimationBuilder(renderer, rootView);
}

export const NATIVESCRIPT_ANIMATIONS_PROVIDERS: Provider[] = [
    {
        provide: AnimationBuilder,
        useFactory: instantiateAnimationBuilder,
        deps: [NativeScriptRendererFactory, APP_ROOT_VIEW]
    },
    { provide: AnimationDriver, useFactory: instantiateSupportedAnimationDriver },
    { provide: AnimationStyleNormalizer, useFactory: instantiateDefaultStyleNormalizer },
    { provide: NativeScriptAnimationEngine, useClass: InjectableAnimationEngine },
    {
        provide: RendererFactory2,
        useFactory: instantiateRendererFactory,
        deps: [NativeScriptRendererFactory, NativeScriptAnimationEngine, NgZone]
    }
];

@NgModule({
    imports: [NativeScriptModule],
    providers: NATIVESCRIPT_ANIMATIONS_PROVIDERS,
})
export class NativeScriptAnimationsModule {
}
