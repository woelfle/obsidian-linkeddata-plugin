import { TFile } from "obsidian";
import { IRepository, RDFTriple } from "./IRepository";
import type {
    Quad,
    Bindings,
    ResultStream,
} from '@rdfjs/types';


export class InMemoryRepository implements IRepository {
    private triples: RDFTriple[] = [];

    init(): Promise<void> {
        throw new Error("Method not implemented.");
    }


    clear() {
        this.triples = [];
    }

    add(triple: RDFTriple) {
        this.triples.push(triple);
    }

    addOntology(file: TFile): unknown {
        const content = file.vault.read(file);
        content.then(str => {

        })
        throw new Error("Method not implemented.");
    }

    query(sparqlQuery: string): Promise<ResultStream<Bindings>> {
        throw new Error("Method not implemented.");
    }

    filter(pattern: RDFTriple): Promise<ResultStream<Quad>> {
        //return this.triples.filter(triple => { this.matches(triple, pattern) });
        // return this.triples;
        throw new Error("Method not implemented.");
    }

    private matches(triple: RDFTriple, pattern: RDFTriple): boolean {
        return this.fuzzyMatch(triple.subject, pattern.subject)
            && this.fuzzyMatch(triple.predicate, pattern.predicate)
            && this.fuzzyMatch(triple.object, pattern.object);
    }

    private fuzzyMatch(element: string | undefined, pattern: string | undefined): boolean {
        return element == pattern || (pattern == undefined);
    }
}
