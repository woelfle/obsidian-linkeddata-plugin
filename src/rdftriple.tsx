export function RDFTriple({ subject, predicate, object }: { subject: string, predicate: string, object: string }) {
    return (
        <h4>{subject} {predicate} {object}</h4>
    );
}
