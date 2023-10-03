import { StrictMode } from "react";
import { ItemView, WorkspaceLeaf } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import * as React from "react";
import { RDFTriple } from "./rdftriple";

export const TRIPLE_VIEW_NAME = "linkeddata-triple-view";

export class LinkedDataTripleView extends ItemView {
    root: Root | null = null;

    constructor(leaf: WorkspaceLeaf) {
        super(leaf);
    }

    getViewType() {
        return TRIPLE_VIEW_NAME;
    }

    getDisplayText() {
        return "RDF Triple View";
    }

    async onOpen() {
        this.root = createRoot(this.containerEl.children[1]);
        this.root.render(
            <StrictMode>
                <RDFTriple subject="foo" predicate="bar" object="blup" />,
            </StrictMode>,
        );
    }

    async onClose() {
        console.log("closing rdf view")
        this.root?.unmount();
    }
}
