export function RDFTriple({ subject, predicate, object }: { subject: string | undefined, predicate: string | undefined, object: string | undefined }) {
    return (
        <h6>{subject} {predicate} {object}</h6>
    );
}
