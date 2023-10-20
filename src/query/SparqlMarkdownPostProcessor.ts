import { MarkdownPostProcessorContext } from "obsidian";
import { LinkedData } from "src/LinkedData";
import type {
    Bindings
} from '@rdfjs/types';


export class SparqlMarkdownPostProcessor {
    linkedData: LinkedData;

    constructor(linkedData: LinkedData) {
        this.linkedData = linkedData;
    }


    public processor(): (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => void | Promise<any> {
        return (source: string, el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
            console.log("Processing SPARQL query");
            const result = this.linkedData.query(source);
            result.then(stream => {
                console.log(`Processing query result: ${stream}`);
                el.createEl("div").setText(source);
                const table = el.createEl("table");
                const body = table.createEl("tbody");

                let count = 0;
                stream.on('data', binding => {
                    console.log("Createing row for Binding");
                    const b: Bindings = binding;
                    if (count == 0) {
                        const headerRow = body.createEl("tr");
                        b.forEach((value, key) => {
                            headerRow.createEl("td", { text: key.value });
                        })
                        count++;
                    }
                    const row = body.createEl("tr");
                    b.forEach((value, key) => {
                        row.createEl("td", { text: value.value });
                    })
                });
            })
        };
    }
}
