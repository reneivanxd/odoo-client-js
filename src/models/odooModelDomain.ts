export type DomainOperator =
    | "="
    | "!="
    | ">"
    | ">="
    | "<"
    | "<="
    | "=?"
    | "=like"
    | "like"
    | "not like"
    | "ilike"
    | "=ilike"
    | "not ilike"
    | "in"
    | "not in"
    | "child_of";
export type DomainValue =
    | string
    | number
    | boolean
    | null
    | string[]
    | number[];
export type DomainTuple = [string, DomainOperator, DomainValue];
export type Domain = Array<Array<DomainTuple | "|" | "&" | "!">>;
