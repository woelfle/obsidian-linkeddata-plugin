import { StrictMode } from "react";
import { ItemView, WorkspaceLeaf } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import * as React from "react";
import { RDFTriple } from "./rdftriple";
import { LinkedData, REPOSITORY_UPDATED_EVENT } from "./LinkedData";
import { Quad, ResultStream } from "@rdfjs/types";
import { removeAllListeners } from "process";

export const TRIPLE_VIEW_NAME = "linkeddata-rdf-triple-view";

export class RDFTripleView extends ItemView {
    root: Root | null = null;
    linkedData: LinkedData;
    updateEventHandler = (event: Event) => {
        this.updateView(event);
    }

    constructor(leaf: WorkspaceLeaf, linkedData: LinkedData) {
        super(leaf);
        this.linkedData = linkedData;
        addEventListener(
            REPOSITORY_UPDATED_EVENT,
            this.updateEventHandler,
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
        this.updateView(new CustomEvent("on open"));
        console.log("rdf view opened")
    }

    async onClose() {
        console.log("closing rdf view")
        removeEventListener(REPOSITORY_UPDATED_EVENT, this.updateEventHandler);
        this.root?.unmount();
    }

    updateView(event: Event) {
        console.log(`update rdf view because event: `, event)
        const root = this.root;
        const triples: Promise<ResultStream<Quad>> = this.linkedData.repository.filter({ subject: undefined, predicate: undefined, object: undefined });
        triples.then(stream => {
            console.log("  received quad stream")
            const quads: Quad[] = [];
            stream
                .on('data', quad => {
                    console.log(`    processing quad number ${quads.length + 1}`, quad);
                    quads.push(quad);
                })
                .on('error', err => {
                    console.log("    Error:", err)
                })
                .on('end', () => {
                    let x = 0;
                    root?.render(
                        <StrictMode>
                            <h2>RDF Triples</h2>
                            {quads.map(quad => (
                                <RDFTriple quad={quad} key={"quad-" + ++x} />
                            ))}
                        </StrictMode>
                    );
                    console.log(`    done updating rdf view with ${quads.length} triples`)
                })

        })
    }
}
