import { Plugin, TFile, TFolder } from 'obsidian';
import RDFLibRepository from 'src/repository/RDFLibRepository';
import { ecmaScriptInfo } from "./helper";
import { info } from './logging';
import { ObsidianTurtleFile } from './repository/TurtleFile';


// Remember to rename these classes and interfaces!

interface LinkedDataPluginSettings {
  mySetting: string;
}

const DEFAULT_SETTINGS: LinkedDataPluginSettings = {
  mySetting: 'default'
}

export default class LinkedDataPlugin extends Plugin {
  settings: LinkedDataPluginSettings;
  repo: RDFLibRepository;

  async onload() {
    info(this, "Loading plugin")
    this.logEcmaVersion();
    await this.loadSettings();

    this.repo = new RDFLibRepository();
    this.repo.init();

    this.populateOntologies();
  }

  onunload() {
    info(this, "Unloading plugin")
  }

  async loadSettings() {
    info(this, "Loading settings");
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    info(this, "Save settings");
    await this.saveData(this.settings);
  }

  async activateView() {
    info(this, "Activate View");
  }

  private logEcmaVersion() {
    info(this, "ECMA Info: " + ecmaScriptInfo.text);
  }

  private populateOntologies() {
    info(this, "Populating LinkedData repository with all ontologies found at 'admin/ontologies'");
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
    this.repo.addOntology(new ObsidianTurtleFile(file));
  }
}
