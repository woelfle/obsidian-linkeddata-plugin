import {  Plugin } from 'obsidian';

// Remember to rename these classes and interfaces!

interface LinkedDataPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: LinkedDataPluginSettings = {
	mySetting: 'default'
}

export default class LinkedDataPlugin extends Plugin {
	settings: LinkedDataPluginSettings;

	async onload() {
		this.log("Loading plugin")
		await this.loadSettings();
	}

	onunload() {
		this.log("Unloading plugin")
	}

	async loadSettings() {
		this.log("Loading settings");
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		this.log("Save settings");
		await this.saveData(this.settings);
	}

	async activateView() {
		this.log("Activate View");
	}

	private log(message: string): void {
		const timestamp = new Date().toLocaleTimeString();
		console.log(`LinkedDataPlugin [${timestamp}]: ${message}`);
	}
}
