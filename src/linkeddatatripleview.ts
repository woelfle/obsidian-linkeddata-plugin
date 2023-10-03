import { ItemView, WorkspaceLeaf } from 'obsidian';

export const TRIPLE_VIEW_NAME = "linkeddata-triple-view";

export class LinkedDataTripleView extends ItemView {
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
        const noteFile = this.app.workspace.getActiveFile(); // Get the currently Open Note
        if (noteFile != null) {
            const subject = noteFile.name
            const metadata = this.app.metadataCache.getFileCache(noteFile);
            const cache = metadata?.frontmatter;
            if (cache != null) {
                const predicates = Object.keys(cache)
                predicates.forEach(predicate => {
                    const object = cache[predicate]
                    console.log(`${subject} ${predicate} ${object}`)
                });
                console.log(predicates)
            }

            const container = this.containerEl.children[1];
            container.empty();
            container.createEl('h4', { text: "RDF Triple View" });

        } else {
            const container = this.containerEl.children[1];
            container.empty();
            container.createEl("h4", { text: "RDF Triple View\nNo active file" });
        }
        console.log("rdf view opened")
    }

    async onClose() {
        // Nothing to clean up.
        console.log("closing rdf view")
    }
}
