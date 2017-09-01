import { AnimationBuilder, AnimationFactory, AnimationMetadata, AnimationOptions, AnimationPlayer, NoopAnimationPlayer, sequence } from '@angular/animations';
import { Inject, Injectable, RendererFactory2, RendererType2, ViewEncapsulation } from '@angular/core';
import { APP_ROOT_VIEW } from "../platform-providers";
import { AnimationRenderer } from "@angular/platform-browser/animations/src/animation_renderer";
import { NativeScriptAnimationPlayer } from "./animation-player";

@Injectable()
export class NativeScriptAnimationBuilder extends AnimationBuilder {
    private _nextAnimationId = 0;
    private _renderer: AnimationRenderer;

    constructor(rootRenderer: RendererFactory2, @Inject(APP_ROOT_VIEW) doc: any) {
        super();
        const typeData = {
            id: '0',
            encapsulation: ViewEncapsulation.None,
            styles: [],
            data: { animation: [] }
        } as RendererType2;
        this._renderer = rootRenderer.createRenderer(doc, typeData) as AnimationRenderer;
    }

    build(animation: AnimationMetadata | AnimationMetadata[]): AnimationFactory {
        const id = this._nextAnimationId.toString();
        this._nextAnimationId++;
        const entry = Array.isArray(animation) ? sequence(animation) : animation;
        issueAnimationCommand(this._renderer, null, id, 'register', [entry]);
        return new NativeScriptAnimationFactory(id, this._renderer);
    }
}

export class NativeScriptAnimationFactory extends AnimationFactory {
    constructor(private _id: string, private _renderer: AnimationRenderer) { super(); }

    create(element: any, options?: AnimationOptions): AnimationPlayer {

        return new NativeScriptAnimationPlayer(element, [], 2000, 0, 'ease-in');
        //return new RendererAnimationPlayer(this._id, element, options || {}, //this._renderer);
    }

}

export class RendererAnimationPlayer implements AnimationPlayer {
    public parentPlayer: AnimationPlayer | null = null;
    private _started = false;

    constructor(
        public id: string, public element: any, options: AnimationOptions,
        private _renderer: AnimationRenderer) {
        this._command('create', options);
    }

    private _listen(eventName: string, callback: (event: any) => any): () => void {
        return this._renderer.listen(this.element, `@@${this.id}:${eventName}`, callback);
    }

    private _command(command: string, ...args: any[]) {
        return issueAnimationCommand(this._renderer, this.element, this.id, command, args);
    }

    onDone(fn: () => void): void { this._listen('done', fn); }

    onStart(fn: () => void): void { this._listen('start', fn); }

    onDestroy(fn: () => void): void { this._listen('destroy', fn); }

    init(): void { this._command('init'); }

    hasStarted(): boolean { return this._started; }

    play(): void {
        this._command('play');
        this._started = true;
    }

    pause(): void { this._command('pause'); }

    restart(): void { this._command('restart'); }

    finish(): void { this._command('finish'); }

    destroy(): void { this._command('destroy'); }

    reset(): void { this._command('reset'); }

    setPosition(p: number): void { this._command('setPosition', p); }

    getPosition(): number { return 0; }

    public totalTime = 0;
}

function issueAnimationCommand(
    renderer: AnimationRenderer, element: any, id: string, command: string, args: any[]): any {
    return renderer.setProperty(element, `@@${id}:${command}`, args);
}