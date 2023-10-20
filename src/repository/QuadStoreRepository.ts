import { IRepository, RDFTriple } from "./IRepository";
import { MemoryLevel } from 'memory-level';
import { DataFactory } from 'rdf-data-factory';
import { Quadstore } from 'quadstore';
import { Engine } from 'quadstore-comunica';
import { TFile } from "obsidian";
import ttlReader from '@graphy/content.ttl.read';

import type {
    Quad,
    Stream,
    Bindings,
    ResultStream,
} from '@rdfjs/types';

export class QuadStoreRepository implements IRepository {
    private dataFactory: DataFactory;
    private store: Quadstore;
    private engine: Engine;

    constructor() {
        console.log("Creating QuadStoreRepository");
        const backend = new MemoryLevel();
        this.dataFactory = new DataFactory();
        this.store = new Quadstore({ backend, dataFactory: this.dataFactory });
        this.engine = new Engine(this.store);
        console.log("QuadStoreRepository created");
    }

    init(): Promise<void> {
        return this.store.open();
    }

    add(triple: RDFTriple): void {
        if (triple.subject != undefined && triple.predicate != undefined && triple.object != undefined) {
            console.log("Adding triple:", triple);
            const subject = this.dataFactory.namedNode(triple.subject);
            const predicate = this.dataFactory.namedNode(triple.predicate);
            const object = this.dataFactory.namedNode(triple.object);
            const quad = this.dataFactory.quad(subject, predicate, object, this.dataFactory.defaultGraph());
            this.store.put(quad);
        }
    }

    addOntology(file: TFile) {
        console.log(`Adding ontology from file ${file.name}`);
        const store = this.store;

        file.vault.read(file)
            .then(data => {
                console.log(`Loaded ontology file ${file.name}`);
                ttlReader(data, {
                    data(y_quad) {
                        console.log("Add quad from ontology:", y_quad);
                        store.put(y_quad);
                    },
                    eof(h_prefixes) {
                        console.log(`Done loading ${file.name}.`);
                    }
                });
            })
            .catch(reason => {
                console.log(`Unable to load ontoloty ${file.name} because ${reason}`);
            });
    }

    clear(): void {
        console.log("Clear quadstore repository");
        this.store.clear();
    }

    async filter(pattern: RDFTriple): Promise<ResultStream<Quad>> {
        const result: Stream<Quad> = this.store.match(undefined, undefined, undefined, undefined);
        return result;
    }

    query(sparqlQuery: string): Promise<ResultStream<Bindings>> {
        console.log(`Executing query ${sparqlQuery}`);
        return this.engine.queryBindings(sparqlQuery);
    }

    private logQuads() {
        const quadsStream = this.store.match(undefined, undefined, undefined, undefined);
        quadsStream.on('data', quad => console.log(quad));
    }
}
