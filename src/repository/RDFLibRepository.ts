import { TFile } from "obsidian";
import { log } from "./../logging";
import { Store, parse } from "rdflib";

export default class RDFLibRepository {
  private store: Store;

  public init(): boolean {
    log(this, "Init Repository");
    this.initStore();
    return true;
  }

  private initStore() {
    this.store = new Store();
    this.store.addDataCallback(quad => {
      log(this, "Added Quad")
    })
  }

  public addOntology(file: TFile) {
    console.log(`Adding ontology from file ${file.name}`);
    const store = this.store;
    const graphUri = `obsidian://graph/ontology/${file.name}`

    file.vault.read(file)
        .then(data => {
            log(this, `Loaded ontology file ${file.name} into store ${store}`);
            parse(data, store, graphUri, 'text/turtle', cb => {
              log(this, `Finished adding graph`);
              log(this, `Store Size: ${store.length}`);
            });
        })
        .catch(reason => {
            log(this, `Unable to load ontoloty ${file.name} because ${reason}`);
        });
  }
}

