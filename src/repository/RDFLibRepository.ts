import { log } from "./../main";
import { Store, parse } from "rdflib";

export default class RDFLibRepository {
  private store: Store;

  public init() {
    log(this, "Init Repository");

  }

  private initStore() {
    this.store = new Store();
    this.store.addDataCallback(quad => {
      log(this, "Added Quad")
    })
  }

  public addGraph(stmts: string, graphUri: string): void {
    parse(stmts, this.store, graphUri, 'text/turtle', cb => {
      log(this, "Finished adding graph");
    });
  }
}

