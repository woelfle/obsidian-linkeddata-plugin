import { TFile } from "obsidian"
import type {
    Quad,
    Bindings,
    ResultStream,
} from '@rdfjs/types';

export interface RDFTriple {
    subject: string | undefined
    predicate: string | undefined
    object: string | undefined
}

export interface IRepository {
    init(): Promise<void>
    addOntology(file: TFile): void
    clear(): void
    add(triple: RDFTriple): void
    filter(pattern: RDFTriple): Promise<ResultStream<Quad>>
    query(sparqlQuery: string): Promise<ResultStream<Bindings>>
}
