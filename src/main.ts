import { App, MarkdownPostProcessorContext, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { RDFTripleView, TRIPLE_VIEW_NAME } from 'src/rdftripleview'
import { QuadStoreRepository } from 'src/repository/QuadStoreRepository'
import { LinkedData } from './LinkedData';
import { SparqlMarkdownPostProcessor } from 'src/query/SparqlMarkdownPostProcessor';

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
		console.log("Loading LinkedData plugin")
		await this.loadSettings();

		console.log("Initialize repository");
		const repository = new QuadStoreRepository();
		await repository.init();
		this.linkedData = new LinkedData(this.app, repository);

		const sparqlProcessor = new SparqlMarkdownPostProcessor(this.linkedData);

		this.registerMarkdownCodeBlockProcessor("sparql", sparqlProcessor.processor());

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

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	private processSparqlBlock(): (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => void | Promise<any> {
		return (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
			const rows = source.split("\n").filter((row) => row.length > 0);

			const table = el.createEl("table");
			const body = table.createEl("tbody");

			for (let i = 0; i < rows.length; i++) {
				const cols = rows[i].split(",");
				const row = body.createEl("tr");

				for (let j = 0; j < cols.length; j++) {
					row.createEl("td", { text: cols[j] });
				}
			}
		};
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
