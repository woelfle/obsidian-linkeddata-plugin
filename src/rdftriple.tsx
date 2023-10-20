import { Quad } from "@rdfjs/types";

export function RDFTriple({ quad }: { quad: Quad }) {
    return (
        <h6>{quad.subject.value} {quad.predicate.value} {quad.object.value}</h6>
    );
}
