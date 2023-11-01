import {  Plugin, TFile, TFolder } from 'obsidian';
import RDFLibRepository from 'src/repository/RDFLibRepository';
import { ecmaScriptInfo } from "./helper";
import { log } from './logging';


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
		log(this, "Loading plugin")
    this.logEcmaVersion();
		await this.loadSettings();

    this.repo = new RDFLibRepository();
    this.repo.init();

    this.populateOntologies();
	}

	onunload() {
		log(this, "Unloading plugin")
	}

	async loadSettings() {
		log(this, "Loading settings");
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		log(this, "Save settings");
		await this.saveData(this.settings);
	}

	async activateView() {
    log(this, "Activate View");
	}

  private logEcmaVersion() {
    log(this, "ECMA Info: " + ecmaScriptInfo.text);
  }

  private populateOntologies() {
    log(this, "Populating LinkedData repository with all ontologies found at 'admin/ontologies'");
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
    this.repo.addOntology(file);
  }
}
