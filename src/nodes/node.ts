import { Container, Point } from "pixi.js";
import { signal } from "../signal";
import type { MaybePromise } from "bun";

export interface NodeProps {
	[key: string]: string | undefined;
}

export class Node {
	name;
	protected pixiContainer;
	children: Node[] = [];
	parent: Node | null = null;

	ready;
	tree_entered;
	tree_exited;

	constructor(props: NodeProps) {
		this.name = props.name ?? "";
		this.pixiContainer = new Container();
		this.ready = signal();
		this.tree_entered = signal();
		this.tree_exited = signal();
		this.children = [];

		if (props["position"]) {
			const [x, y] = props["position"]?.split(",");
			this.pixiContainer.position.set(+x, +y);
		}
	}

	_init?(): MaybePromise<void>;
	_ready?(): MaybePromise<void>;
	_process?(delta: number): void;

	addChild(child: Node): void {
		this.children.push(child);
		child.parent = this;
		this.pixiContainer.addChild(child.pixiContainer);
	}

	removeChild(child: Node): void {
		const idx = this.children.indexOf(child);
		if (idx > -1) {
			this.children.splice(idx, 1);
			child.parent = null;
			this.pixiContainer.removeChild(child.pixiContainer);
		}
	}

	// TODO: Split by "/" and query subchildren
	$(name: string): Node | undefined {
		return this.children.find((c) => c.name === name);
	}

	get position() {
		return this.pixiContainer.position;
	}

	set position(value: Point) {
		this.pixiContainer.position = value;
	}

	get rotation() {
		return this.pixiContainer.rotation;
	}

	set rotation(value: number) {
		this.pixiContainer.rotation = value;
	}

	get scale() {
		return this.pixiContainer.scale;
	}

	set scale(value: Point) {
		this.pixiContainer.scale = value;
	}
}
