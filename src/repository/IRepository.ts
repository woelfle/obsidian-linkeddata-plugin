export interface RDFTriple {
    subject: string | undefined
    predicate: string | undefined
    object: string | undefined
}

export interface IRepository {
    clear(): void
    add(triple: RDFTriple): void
    filter(pattern: RDFTriple): RDFTriple[]
}
