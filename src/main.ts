import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { RDFTripleView, TRIPLE_VIEW_NAME } from 'src/rdftripleview'

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
		await this.loadSettings();

		this.registerView(
			TRIPLE_VIEW_NAME,
			(leaf) => new RDFTripleView(leaf)
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
			id: 'open-linkeddata-modal-simple',
			name: 'Open LinkedData modal (simple)',
			callback: () => {
				new LinkedDataModal(this.app).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'linkeddata-editor-command',
			name: 'LinkedData editor command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getSelection());
				editor.replaceSelection('LinkedData Editor Command');
			}
		});
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: 'open-linkeddata-modal-complex',
			name: 'Open LinkedData modal (complex)',
			checkCallback: (checking: boolean) => {
				// Conditions to check
				const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
				if (markdownView) {
					// If checking is true, we're simply "checking" if the command can be run.
					// If checking is false, then we want to actually perform the operation.
					if (!checking) {
						new LinkedDataModal(this.app).open();
					}

					// This command will only show up in Command Palette when the check function returns true
					return true;
				}
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

class LinkedDataModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
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
