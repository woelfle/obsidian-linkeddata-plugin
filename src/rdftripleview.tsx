import { StrictMode } from "react";
import { ItemView, WorkspaceLeaf } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import * as React from "react";
import { RDFTriple } from "./rdftriple";

export const TRIPLE_VIEW_NAME = "linkeddata-rdf-triple-view";

export class RDFTripleView extends ItemView {
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
        console.log("open rdf view")
        this.root = createRoot(this.containerEl.children[1]);

        const noteFile = this.app.workspace.getActiveFile(); // Get the currently Open Note
        if (noteFile != null) {
            console.log("found active file")
            const subject = noteFile.name
            const metadata = this.app.metadataCache.getFileCache(noteFile);
            const cache = metadata?.frontmatter;
            if (cache != null) {
                const predicates = Object.keys(cache)

                this.root.render(
                    <StrictMode>
                        <h2>RDF Triples</h2>
                        {predicates.map(predicate => (
                            <RDFTriple subject={subject} predicate={predicate} object={cache[predicate]} />
                        ))}
                    </StrictMode>
                );

                predicates.forEach(predicate => {
                    const object = cache[predicate]
                    console.log(`${subject} ${predicate} ${object}`)
                });
                console.log(predicates)
            }


        } else {
            const container = this.containerEl.children[1];
            container.empty();
            container.createEl("h4", { text: "RDF Triple View\nNo active file" });
            console.log("no active file")
        }
        console.log("rdf view opened")
    }


    async onClose() {
        console.log("closing rdf view")
        this.root?.unmount();
    }
}
