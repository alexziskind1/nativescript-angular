import { Component } from '@angular/core';
import {
    trigger,
    state,
    style,
    animate,
    transition,
    AnimationBuilder,
    AnimationPlayer
} from '@angular/animations';

@Component({
    selector: "animation-builder",
    template: `
        <StackLayout>
            <Button text="Do it" (tap)="makeAnimation($event, lbl)"></Button>
            <Label #lbl text="test" class="lbl"></Label>
        </StackLayout>
    `,
    styles: [`
        .lbl {
            background-color: red;
        }
    `]
})
export class AnimationBuilderTest {

    public items: Array<string>;

    constructor(public builder: AnimationBuilder) {


        this.items = [];
        for (let i = 0; i < 3; i++) {
            this.items.push("Item " + i);
        }
    }

    public makeAnimation(args, element: any) {
        // first build the animation
        const myAnimation = this.builder.build([
            style({ width: 0 }),
            animate(1000, style({ width: '100px' }))
        ]);

        // then create a player from it
        const player = myAnimation.create(element);

        player.play();
    }

    onAddTap() {
        this.items.push("Item " + (this.items.length + 1));
    }

    onRemoveAllTap() {
        this.items = [];
    }

    onItemTap(event) {
        let index = this.items.indexOf(event.object.text);
        this.items.splice(index, 1);
    }
}

