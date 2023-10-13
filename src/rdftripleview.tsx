import { StrictMode } from "react";
import { ItemView, WorkspaceLeaf } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import * as React from "react";
import { RDFTriple } from "./rdftriple";
import { LinkedData, REPOSITORY_UPDATED_EVENT } from "./LinkedData";

export const TRIPLE_VIEW_NAME = "linkeddata-rdf-triple-view";

export class RDFTripleView extends ItemView {
    root: Root | null = null;
    linkedData: LinkedData;

    constructor(leaf: WorkspaceLeaf, linkedData: LinkedData) {
        super(leaf);
        this.linkedData = linkedData;
        addEventListener(
            REPOSITORY_UPDATED_EVENT,
            (event) => {
                this.updateView();
            },
            false,
        );
    }

    getViewType() {
        return TRIPLE_VIEW_NAME;
    }

    getDisplayText() {
        return "RDF Triple View";
    }

    async onOpen() {
        console.log("open rdf view")
        this.root = createRoot(this.containerEl.children[1]);
        this.updateView();
        console.log("rdf view opened")
    }

    async onClose() {
        console.log("closing rdf view")
        this.root?.unmount();
    }

    updateView() {
        console.log("update rdf view")
        const triples = this.linkedData.repository.filter({ subject: undefined, predicate: undefined, object: undefined });

        this.root?.render(
            <StrictMode>
                <h2>RDF Triples</h2>
                {triples.map(triple => (
                    <RDFTriple subject={triple.subject} predicate={triple.predicate} object={triple.object} />
                ))}
            </StrictMode>
        );

        if (triples.length == 0) {
            const container = this.containerEl.children[1];
            container.empty();
            container.createEl("h4", { text: "RDF Triple View\nNo triples" });
        }
        console.log("rdf view updated")
    }
}
