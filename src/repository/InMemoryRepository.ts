import { IRepository, RDFTriple } from "./IRepository";

export class InMemoryRepository implements IRepository {
    private triples: RDFTriple[] = [];

    clear() {
        this.triples = [];
    }

    add(triple: RDFTriple) {
        this.triples.push(triple);
    }

    filter(pattern: RDFTriple): RDFTriple[] {
        //return this.triples.filter(triple => { this.matches(triple, pattern) });
        return this.triples;
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
