import { App, TFile, TFolder } from "obsidian";
import { IRepository } from "./repository/IRepository";

import type {
    Bindings,
    ResultStream,
} from '@rdfjs/types';

export const REPOSITORY_UPDATED_EVENT = "linkeddata-repository-updated";

export class LinkedData {
    repository: IRepository;
    app: App;

    constructor(app: App, repository: IRepository) {
        this.app = app;
        this.repository = repository;
    }

    query(sparqlQuery: string): Promise<ResultStream<Bindings>> {
        return this.repository.query(sparqlQuery);
    }

    updateRepository() {
        this.repository.clear();
        this.populateOntologies();
        const files = this.app.vault.getMarkdownFiles();
        let numberOfTriples = 0;
        files.forEach(file => {
            numberOfTriples += this.updateRepositoryWith(file)
        })
        console.log(`Updated repository with '${files.length}' files and created ${numberOfTriples} triples`)
        dispatchEvent(new CustomEvent(REPOSITORY_UPDATED_EVENT));
    }

    private updateRepositoryWith(file: TFile): number {
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
                    if (predicate.startsWith("adr:")) {
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

    private populateOntologies() {
        console.log("Populating LinkedData repository with all ontologies found at 'admin/ontologies'");
        const ontologiesFolder = this.app.vault.getAbstractFileByPath("admin/ontologies");
        if (ontologiesFolder instanceof TFolder) {
            const ontologies = ontologiesFolder.children;
            ontologies.forEach(ontology => {
                if (ontology instanceof TFile) {
                    this.populateOntology(ontology);
                }
            })
        }
    }

    private populateOntology(file: TFile) {
        this.repository.addOntology(file);
    }
}
