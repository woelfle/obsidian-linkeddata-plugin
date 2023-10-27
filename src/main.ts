import {  Plugin } from 'obsidian';
import RDFLibRepository from 'src/repository/RDFLibRepository';
import { ecmaScriptInfo } from "./helper";


// Remember to rename these classes and interfaces!

interface LinkedDataPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: LinkedDataPluginSettings = {
	mySetting: 'default'
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function log(cls: any, message: string): void {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] (${cls.constructor.name}): ${message}`);
}

export default class LinkedDataPlugin extends Plugin {
	settings: LinkedDataPluginSettings;

	async onload() {
		log(this, "Loading plugin")
    this.logEcmaVersion();
		await this.loadSettings();

    const repo = new RDFLibRepository();
    repo.init();
    repo.add();
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
}
