import { createNodeHTMLElement } from "./element-factory";
import { Node } from "./nodes/node";
import { Scene } from "./nodes/scene";
import { Sprite } from "./nodes/sprite";

const nodeElementsMap: Record<string, typeof Node> = {
	"gg-node": Node,
	"gg-scene": Scene,
	"gg-sprite": Sprite,
};

for (const tagName in nodeElementsMap) {
	customElements.define(
		tagName,
		createNodeHTMLElement(tagName, nodeElementsMap[tagName]),
	);
}

export { Node, Scene, Sprite };

export { Input } from "./input";
