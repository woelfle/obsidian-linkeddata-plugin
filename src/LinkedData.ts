import { App, TFile } from "obsidian";
import { IRepository } from "./repository/IRepository";
import { ResultType } from "quadstore";

export const REPOSITORY_UPDATED_EVENT = "linkeddata-repository-updated";

export class LinkedData {
    repository: IRepository;
    app: App;

    constructor(app: App, repository: IRepository) {
        this.app = app;
        this.repository = repository;
    }

    updateRepository() {
        this.repository.clear();
        const files = this.app.vault.getMarkdownFiles();
        let numberOfTriples = 0;
        files.forEach(file => {
            numberOfTriples += this.updateRepositoryWith(file)
        })
        console.log(`Updated repository with '${files.length}' files and created ${numberOfTriples} triples`)
        dispatchEvent(new CustomEvent(REPOSITORY_UPDATED_EVENT));
    }

    updateRepositoryWith(file: TFile): number {
        let result = 0;
        if (file != null) {
            console.debug(`update repository with file '${file.name}'`)
            const subject = file.name
            const metadata = this.app.metadataCache.getFileCache(file);
            const cache = metadata?.frontmatter;
            if (cache != null) {
                const predicates = Object.keys(cache)
                console.debug(`cache is not null. Found ${predicates.length} predicates`)
                predicates.forEach(predicate => {
                    if (predicate == "rdf:type") {
                        const object = cache[predicate];
                        console.debug(`adding ${subject} ${predicate} ${object}`)
                        this.repository.add({ subject, predicate, object });
                        result++;
                    }
                })
            }
        }
        return result;
    }
}
