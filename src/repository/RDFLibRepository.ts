import TurtleFile from "./TurtleFile";
import { info, debug, error } from "./../logging";
import { Store, parse } from "rdflib";

export default class RDFLibRepository {
  private store: Store;

  public init(): boolean {
    info(this, "Init Repository");
    this.initStore();
    return true;
  }

  private initStore() {
    this.store = new Store();
    this.store.addDataCallback(quad => {
      debug(this, "Added Quad %s", quad.subject.value, quad.predicate.value, quad.object.value)
    })
  }

  public addOntology(file: TurtleFile) {
    if(!this.isValidFile(file)) return;

    info(this, `Adding ontology from file ${file.name()}`);
    const store = this.store;
    const graphUri = `obsidian://graph/ontology/${file.name()}`

    file.toString()
      .then(data => {
        info(this, `Loaded ontology file ${file.name()} into store`);
        parse(data, store, graphUri, 'text/turtle', cb => {
          info(this, `Finished adding graph. New store Size is ${store.length}`);
        });
      })
      .catch(reason => {
        error(this, `Unable to load ontoloty ${file.name()} because ${reason}`);
      });
  }

  private isValidFile(file: TurtleFile) : boolean {
    if(!file) {
      error(this, 'Null object passed as file in "addOntology"');
      return false;
    }
    return true;
  }
}
