/**
 * Types of odoo api connection protocols
 */
export enum OdooConnectionProtocol {
    /**
     * [JsonRpc 2.0](https://www.jsonrpc.org/) protocol
     */
    JSON_RPC = "jsonrpc",
    /**
     * [XmlRpc](https://www.xmlrpc.com/) protocol
     */
    XML_RPC = "xmlrpc/2"
}
