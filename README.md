## A javascript odoo jsonrpc client

This is a simple javascript library to interact with [Odoo](https://www.odoo.com/) using [JSONRPC](https://www.jsonrpc.org/).

### Create an Odoo connection

```typescript
import {
    createOdooConnection,
    IHttpService,
    IHeaders,
    QueryBuilder
} from "odoo-client-js";

//Example IHttpService using fetch
const httpService: IHttpService = {
    post: async (url: string, data: any, headers: IHeaders): Promise<any> => {
        const resp = await fetch(url, {
            method: "POST",
            headers: headers,
            body: data
        });
        return await resp.json();
    }
};

// Create odoo connection
const odoo = createConnection(
    "http://myodooserver.com/",
    "odoodbname",
    "apitestusername",
    "apitestuserpassword",
    httpService
);

// Get Odoo Version
odoo.version()
    .then(resp => console.log({ resp }))
    .catch(error => console.error({ error }));

// Authentication
odoo.authenticate()
    .then(resp => console.log({ resp }))
    .catch(error => console.error({ error }));

//Create a OdooModel
const model = odoo.getModel<any>("sale.order");

//Request Model Fields
model
    .getFields([])
    .then(resp => console.log({ resp }))
    .catch(error => console.error({ error }));

//Query the model data
model
    .select(["id", "name", "invoice_ids", "date_order"])
    .where([["state", "!=", "cancel"]])
    .orderBy("date_order desc")
    .take(5)
    .all()
    .then(resp => console.log({ resp }))
    .catch(error => console.error({ error }));

//Using the query builder
QueryBuilder.fromConnection(odoo, "pos.order")
    .select()
    .where([])
    .orderBy("id desc")
    .take(10)
    .all()
    .then(resp => console.log({ resp }))
    .catch(error => console.error({ error }));
```
