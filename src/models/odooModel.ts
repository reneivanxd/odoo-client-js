import { IOdooConnection } from "../connections/odooConnection";
import { Domain } from "./odooModelDomain";
import { IQueryBuilder, QueryBuilder } from "./queryBuilder";

/**
 * Odoo model fields information
 */
export interface IFieldsInfo {
    [key: string]: { [key: string]: any };
}

/**
 * Odoo model interface
 *
 * @typeparam T - Model custom type
 */
export interface IOdooModel<T> {
    /**
     * Call odoo api search method
     *
     * @param domain - Odoo domain filter
     * @param order  - Order by field and direction
     * @param offset - Result records offset
     * @param limit  - Result records limit
     */
    search(
        domain: Domain,
        order?: string,
        offset?: number,
        limit?: number
    ): Promise<number[]>;
    /**
     * Call odoo api read method
     *
     * @param id - Record identifier
     * @param fields - Fields to be returned
     */
    read(id: number[], fields?: string[]): Promise<T[]>;
    /**
     * Call odoo api search_read method
     *
     * @param domain - Odoo domain filter
     * @param fields - Fields to be returned
     * @param order  - Order by field and direction
     * @param offset - Result records offset
     * @param limit  - Result records limit
     */
    searchRead(
        domain: Domain,
        fields?: string[],
        order?: string,
        offset?: number,
        limit?: number
    ): Promise<T[]>;
    /**
     * Call odoo api search_count method
     *
     * @param domain - Odoo domain filter
     */
    searchCount(domain: Domain): Promise<number>;
    /**
     * Call odoo api fields_get method
     *
     * @param attributes - Attributes to be returned
     */
    getFields(attributes?: string[]): Promise<IFieldsInfo>;
    /**
     *  Creates a query builder from current model, see [[IQueryBuilder]]
     *
     * @param fields - Fields to be returned
     */
    select(fields?: string[]): IQueryBuilder<T>;
    /**
     * Creates a records
     *
     * @param object - Record object
     */
    create(object: T): Promise<number>;
    /**
     * Updates a records
     *
     * @param id - Records identifier
     * @param object - Record object
     */
    update(id: number, object: T): Promise<any>;
    /**
     * Deletes a record
     *
     * @param id - Records identifier
     */
    delete(id: number): Promise<any>;
    /**
     * Calls any method in odoo API
     *
     * @param method - Api method name
     * @param args   - Api method arguments
     */
    call<TResult>(method: string, ...args: any[]): Promise<TResult>;
}

export class OdooModel<T = any> implements IOdooModel<T> {
    /**
     * Odoo Model Name
     */
    protected name: string;
    /**
     * Odoo Service Name, always "object"
     */
    protected service: string;
    /**
     * Odoo Connection Object, see [[IOdooConnection]]
     */
    protected connection: IOdooConnection;
    /**
     * Odoo Model Fields
     */
    protected fields: string[];

    /**
     * Creates a new Odoo model instance
     *
     * @param name - Odoo Model Name
     * @param connection - Odoo Connection Object
     */
    constructor(name: string, connection: IOdooConnection) {
        this.name = name;
        this.service = "object";
        this.connection = connection;
        this.fields = [];
    }

    /**
     * @inheritdoc
     */
    public search(
        domain: Domain,
        order?: string,
        offset?: number,
        limit?: number
    ): Promise<number[]> {
        return this.call<number[]>("search", [domain], {
            order,
            offset,
            limit
        });
    }

    /**
     * @inheritdoc
     */
    public read(id: number[], fields?: string[]): Promise<T[]> {
        return this.call<T[]>("read", [...id], {
            fields: fields || this.fields || []
        });
    }

    /**
     * @inheritdoc
     */
    public searchRead(
        domain: Domain,
        fields?: string[],
        order?: string,
        offset?: number,
        limit?: number
    ): Promise<T[]> {
        return this.call<T[]>("search_read", [domain], {
            fields: fields || this.fields || [],
            order,
            offset,
            limit
        });
    }

    /**
     * @inheritdoc
     */
    public searchCount(domain: Domain): Promise<number> {
        return this.call<number>("search_count", [domain]);
    }

    /**
     * @inheritdoc
     */
    public getFields(attributes?: string[]): Promise<IFieldsInfo> {
        return this.call<IFieldsInfo>("fields_get", [], {
            attributes: attributes || []
        });
    }

    /**
     * @inheritdoc
     */
    public select(fields?: string[]): IQueryBuilder<T> {
        return new QueryBuilder<T>(this, fields || this.fields || []);
    }

    /**
     * @inheritdoc
     */
    public create(object: T): Promise<number> {
        return this.call<number>("create", [object]);
    }

    /**
     * @inheritdoc
     */
    public update(id: number, object: T): Promise<any> {
        return this.call<any>("write", [[id], object]);
    }

    /**
     * @inheritdoc
     */
    public delete(id: number): Promise<any> {
        return this.call<any>("unlink", [[id]]);
    }

    /**
     * @inheritdoc
     */
    public call<TResult>(method: string, ...args: any[]): Promise<TResult> {
        return this.connection.execute_kw<TResult>(
            this.service,
            this.name,
            method,
            ...args
        );
    }
}
