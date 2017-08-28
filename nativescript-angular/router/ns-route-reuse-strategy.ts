
import { Injectable } from "@angular/core";
import { RouteReuseStrategy, ActivatedRoute, ActivatedRouteSnapshot, DetachedRouteHandle } from "@angular/router";

import { Page } from "tns-core-modules/ui/page";

import { NSLocationStrategy, pageSymbol } from "./ns-location-strategy";

/**
 * Does not detach any subtrees. Reuses routes as long as their route config is the same.
 */
@Injectable()
export class NsRouteReuseStrategy implements RouteReuseStrategy {

    constructor(private location: NSLocationStrategy) { }

    handlers: { [key: string]: DetachedRouteHandle } = {};

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        console.log("-- NsRouteReuseStrategy --> .shouldDetach " + route.url);

        if (typeof route.component === "string") {
            throw new Error("NsRouteReuseStrategy.shouldDetach() called, but route.component is string");
        }

        const page = getPageFromRouteSnapshot(route);

        if (!this.location._isPageNavigatingBack() && !!page) {
            console.log("-- NsRouteReuseStrategy --> .shouldDetach - TRUE this is page.");
            return true;
        }

        console.log("-- NsRouteReuseStrategy --> .shouldDetach - FALSE");
        return false;
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        console.log("-- NsRouteReuseStrategy --> .shouldAttach " + route.url);

        const page = getPageFromRouteSnapshot(route);

        if (this.location._isPageNavigatingBack() &&
            !!page &&
            !!this.handlers[page.id]) {

            console.log("-- NsRouteReuseStrategy --> .shouldAttach - TRUE");
            return true;
        }

        console.log("-- NsRouteReuseStrategy --> .shouldAttach - FALSE");
        return false;
    }


    store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
        const page = getPageFromRouteSnapshot(route);
        if (!page) {
            throw new Error("NsRouteReuseStrategy.store() called, but could not find a page");
        }

        const key = page.id;
        console.log(`-- NsRouteReuseStrategy --> .store url: ${route.url}, key: ${key}, state: ${detachedTree}`);
        this.handlers[key] = detachedTree;
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        const page = getPageFromRouteSnapshot(route);
        console.log(`-- NsRouteReuseStrategy --> .retrieve url: ${route.url} page: ${page}`);

        if (!page) {
            console.log(`-- NsRouteReuseStrategy --> .retrieve NULL`);
            return null;
        }

        const state = this.handlers[page.id];
        console.log(`-- NsRouteReuseStrategy --> .retrieve FOUND STATE: ${state}`);

        return state;
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        console.log(`-- NsRouteReuseStrategy --> .shouldReuseRoute curr.routeConfig: ${curr.routeConfig ? curr.routeConfig.path : null}, future.routeConfig: ${future.routeConfig ? future.routeConfig.path : null}`);
        console.log(`-- NsRouteReuseStrategy --> .shouldReuseRoute: ${future.routeConfig === curr.routeConfig}`);

        return future.routeConfig === curr.routeConfig;
    }
}


function getPageFromRouteSnapshot(snapshot: ActivatedRouteSnapshot): Page {
    const page = <Page>snapshot.component[pageSymbol];
    return page;
}
