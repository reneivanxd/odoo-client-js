/**
 * Odoo Query Domain Tuple Operator
 */
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

/**
 * Odoo Query Domain Tuple Value
 */
export type DomainValue =
    | string
    | number
    | boolean
    | null
    | string[]
    | number[];

/**
 * Odoo Query Domain Tuple. See [[DomainOperator]] and [[DomainValue]]
 *
 * Tuple is build as (models_field_name, domain_operator, domain_value)
 */
export type DomainTuple = [string, DomainOperator, DomainValue];

/**
 * Odoo Query Domain. see [[DomainTuple]].
 *
 * Holds a list of [[DomainTuple]] or operators (|, &, !)
 */
export type Domain = Array<DomainTuple | "|" | "&" | "!">;
