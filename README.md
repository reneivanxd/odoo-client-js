## A javascript odoo jsonrpc client

This is a simple javascript library to interact with [Odoo](https://www.odoo.com/) using [JSONRPC](https://www.jsonrpc.org/).

### Create an Odoo connection

```typescript
import { createConnection, IHttpService, IHeaders } from "odoo-client-js";

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
```
