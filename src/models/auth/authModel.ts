/**
 * Odoo version information model
 */
export interface IOdooVersion {
    /**
     * Odoo Server string version
     */
    server_version: string;
    /**
     * Odoo Server series
     */
    server_serie: string;
    /**
     * Odoo Server protocol version
     */
    protocol_version: number;
    /**
     * Odoo Server version details
     */
    server_version_info: any[];
}

/**
 * Odoo user context model
 */
export interface IUserContext {
    /**
     * User time zone
     */
    tz: string;
    /**
     * User language
     */
    lang: string;
}

/**
 * Odoo api authentication response model
 */
export interface IAuthResponse {
    /**
     * User Identifier
     */
    userId: number;
    /**
     * User Context, see [[IUserContext]]
     */
    userContext: IUserContext;
}
