import { App, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { RDFTripleView, TRIPLE_VIEW_NAME } from 'src/rdftripleview'
import { InMemoryRepository } from 'src/repository/InMemoryRepository'
import { LinkedData } from './LinkedData';

// Remember to rename these classes and interfaces!

interface LinkedDataPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: LinkedDataPluginSettings = {
	mySetting: 'default'
}

export default class LinkedDataPlugin extends Plugin {
	settings: LinkedDataPluginSettings;
	linkedData: LinkedData;

	async onload() {
		await this.loadSettings();

		const repository = new InMemoryRepository();
		this.linkedData = new LinkedData(this.app, repository);

		this.registerView(
			TRIPLE_VIEW_NAME,
			(leaf) => new RDFTripleView(leaf, this.linkedData)
		);

		// This creates an icon in the left ribbon to open the 'Triple View'.
		const ribbonTripleIconEl = this.addRibbonIcon("dice", "Open LinkedData Triple View", () => {
			new Notice('Opening LinkedData RDF Triple View!');
			this.activateView();
		});

		// Perform additional things with the ribbon
		ribbonTripleIconEl.addClass('linkeddata-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'woelfle-linkeddata-update-repository',
			name: 'Update Repository',
			callback: () => {
				this.linkedData.updateRepository();
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new LinkedDataSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});


		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async activateView() {
		this.app.workspace.detachLeavesOfType(TRIPLE_VIEW_NAME);

		await this.app.workspace.getRightLeaf(false).setViewState({
			type: TRIPLE_VIEW_NAME,
			active: true,
		});

		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(TRIPLE_VIEW_NAME)[0]
		);
	}
}

class LinkedDataSettingTab extends PluginSettingTab {
	plugin: LinkedDataPlugin;

	constructor(app: App, plugin: LinkedDataPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
