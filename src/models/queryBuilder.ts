import { IOdooConnection } from "../connections/odooConnection";
import { IOdooModel } from "./odooModel";
import { Domain } from "./odooModelDomain";

/**
 * Odoo Query Builder interface
 *
 * @typeparam T - Query Result type
 */
export interface IQueryBuilder<T> {
    /**
     * Set the field names for the query
     *
     * @param fields - List of field names to return
     * @returns - Current instance
     */
    select(fields?: string[]): IQueryBuilder<T>;
    /**
     * Set the domain filter
     *
     * @param domain - Odoo domain, see [Domain]
     * @returns - Current instance
     */
    where(domain: Domain): IQueryBuilder<T>;
    /**
     * Set the order of the query
     *
     * @param order - Order field and direction
     * @returns - Current instance
     */
    orderBy(order: string): IQueryBuilder<T>;
    /**
     * Set the amount of results to skip
     *
     * @param offset - Query offset
     * @returns - Current instance
     */
    skip(offset: number): IQueryBuilder<T>;
    /**
     * Set the limit of records to be returned
     *
     * @param limit - Query result limit
     * @returns - Current instance
     */
    take(limit: number): IQueryBuilder<T>;
    /**
     * Execute the query and return all the records
     */
    all(): Promise<T[]>;
    /**
     * Execute the query and return only the first record
     */
    first(): Promise<T | null>;
    /**
     * Execute the query and return the number od records.
     */
    count(): Promise<number>;
    /**
     * Get a list of records using their identifiers
     *
     * @param ids - List of records identifiers
     */
    findAll(ids: number[]): Promise<T[]>;
    /**
     * Get a record by its identifier
     *
     * @param id - Record identifier
     */
    find(id: number): Promise<T | null>;
}

/**
 * Odoo Query Builder Implementation
 *
 * @typeparam T - Query Result type
 */
export class QueryBuilder<T> implements IQueryBuilder<T> {
    /**
     * Create a query builder from an odoo connection and a odoo model name
     *
     * @param odooConnection - Odoo connection, see [[IOdooConnection]]
     * @param modelName      - Odoo model
     */
    public static fromConnection<T = any>(
        odooConnection: IOdooConnection,
        modelName: string
    ): IQueryBuilder<T> {
        return new QueryBuilder<T>(odooConnection.getModel<T>(modelName));
    }

    /**
     * Create a query builder from an odoo model
     *
     * @param odooModel - Odoo model, see [[IOdooModel]]
     */
    public static fromModel<T = any>(
        odooModel: IOdooModel<T>
    ): IQueryBuilder<T> {
        return new QueryBuilder<T>(odooModel);
    }

    /**
     * Odoo model, see [[IOdooModel]]
     */
    private model: IOdooModel<T>;
    /**
     * Odoo query field names
     */
    private fields: string[];
    /**
     * Odoo query domain, see [[Domain]]
     */
    private domain: Domain;
    /**
     * Odoo query records offset
     */
    private offset?: number;
    /**
     * Odoo query records limit
     */
    private limit?: number;
    /**
     * Odoo query order
     */
    private order?: string;

    /**
     * doo query builder constructor
     *
     * @param model - Odoo Model, see [[IOdooModel]]
     * @param fields  - Odoo query field names
     */
    constructor(model: IOdooModel<T>, fields?: string[]) {
        this.model = model;
        this.fields = fields || model.fields || [];
        this.domain = [];
    }

    /**
     * @inheritdoc
     */
    public select(fields?: string[]): IQueryBuilder<T> {
        this.fields = fields || [];
        return this;
    }

    /**
     * @inheritdoc
     */
    public where(domain: Domain): IQueryBuilder<T> {
        this.domain = domain;
        return this;
    }

    /**
     * @inheritdoc
     */
    public orderBy(order: string): IQueryBuilder<T> {
        this.order = order;
        return this;
    }

    /**
     * @inheritdoc
     */
    public skip(offset: number): IQueryBuilder<T> {
        this.offset = offset;
        return this;
    }

    /**
     * @inheritdoc
     */
    public take(limit: number): IQueryBuilder<T> {
        this.limit = limit;
        return this;
    }

    /**
     * @inheritdoc
     */
    public all(): Promise<T[]> {
        return this.model.searchRead(
            this.domain,
            this.fields,
            this.order,
            this.offset,
            this.limit
        );
    }

    /**
     * @inheritdoc
     */
    public async first(): Promise<T | null> {
        const result: T[] = await this.skip(0)
            .take(1)
            .all();
        return result && result.length > 0 ? result[0] : null;
    }

    /**
     * @inheritdoc
     */
    public count(): Promise<number> {
        return this.model.searchCount(this.domain);
    }

    /**
     * @inheritdoc
     */
    public findAll(ids: number[]): Promise<T[]> {
        return this.model.read(ids, this.fields);
    }

    /**
     * @inheritdoc
     */
    public async find(id: number): Promise<T | null> {
        const result: T[] = await this.findAll([id]);
        return result && result.length > 0 ? result[0] : null;
    }
}
