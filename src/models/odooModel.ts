import { IOdooConnection } from "../connections/odooConnection";
import { Domain } from "./odooModelDomain";
import { IQueryBuilder, QueryBuilder } from "./queryBuilder";

export interface IFieldsInfo {
    [key: string]: { [key: string]: any };
}

export interface IOdooModel<T> {
    name: string;
    service: string;
    connection: IOdooConnection;
    fields: string[];
    search: (
        domain: Domain,
        order?: string,
        offset?: number,
        limit?: number
    ) => Promise<number[]>;
    read: (id: number[], fields?: string[]) => Promise<T[]>;
    searchRead: (
        domain: Domain,
        fields?: string[],
        order?: string,
        offset?: number,
        limit?: number
    ) => Promise<T[]>;
    searchCount: (domain: Domain) => Promise<number>;
    getFields: (attributes?: string[]) => Promise<IFieldsInfo>;
    select: (fields?: string[]) => IQueryBuilder<T>;
}

export class OdooModel<T = any> implements IOdooModel<T> {
    public name: string;
    public service: string;
    public connection: IOdooConnection;
    public fields: string[];

    constructor(name: string, connection: IOdooConnection) {
        this.name = name;
        this.service = "object";
        this.connection = connection;
        this.fields = [];
    }

    public search(
        domain: Domain,
        order?: string,
        offset?: number,
        limit?: number
    ): Promise<number[]> {
        return this.connection.execute_kw<number[]>(
            this.service,
            this.name,
            "search",
            domain,
            {
                order,
                offset,
                limit
            }
        );
    }

    public read(id: number[], fields?: string[]): Promise<T[]> {
        return this.connection.execute_kw<T[]>(
            this.service,
            this.name,
            "read",
            [...id],
            {
                fields: fields || this.fields || []
            }
        );
    }

    public searchRead(
        domain: Domain,
        fields?: string[],
        order?: string,
        offset?: number,
        limit?: number
    ): Promise<T[]> {
        return this.connection.execute_kw<T[]>(
            this.service,
            this.name,
            "search_read",
            domain,
            {
                fields: fields || this.fields || [],
                order,
                offset,
                limit
            }
        );
    }

    public searchCount(domain: Domain): Promise<number> {
        return this.connection.execute_kw<number>(
            this.service,
            this.name,
            "search_count",
            domain
        );
    }

    public getFields(attributes?: string[]): Promise<IFieldsInfo> {
        return this.connection.execute_kw<IFieldsInfo>(
            this.service,
            this.name,
            "fields_get",
            [],
            {
                attributes: attributes || []
            }
        );
    }

    public select(fields?: string[]): IQueryBuilder<T> {
        const fieldList = fields || this.fields || [];
        return new QueryBuilder<T>(this, fields);
    }
}
