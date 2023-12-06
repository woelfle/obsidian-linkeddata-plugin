import { TFile } from "obsidian";

export default interface TurtleFile {
  toString() : Promise<string>;
  name(): string;
}

export class ObsidianTurtleFile implements TurtleFile {
  private file: TFile;

  constructor(file: TFile) {
    this.file = file;
  }
  public toString() : Promise<string> {
    return this.file.vault.read(this.file);
  }

  public name(): string {
    return this.file.name;
  }
}
