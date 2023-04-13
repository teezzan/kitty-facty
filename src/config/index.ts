/**
 * An object containing environment constants.
 * @typedef {Object} EnvConfig
 * @property {Object} api - An object containing API-related environment constants.
 * @property {string} api.catFactBaseUrl - The base URL of the Cat Fact API.
 * @property {number} api.defaultFactPerPage - The default number of facts to display per page.
 * @property {number} api.defaultFactMaxLength - The default maximum length of facts to retrieve.
 * @property {number} api.defaultFactPage - The default page number to retrieve.
 * @property {boolean} api.useCache - Indicates whether to use cache for API requests.
 */

import { GetBool, GetInt, GetString } from "@/utils/env";
import { EnvConstants } from "./defaultValues";

/**
 * The environment configuration object.
 * @type {EnvConfig}
 */
const config: EnvConfig = {
  api: {
    /**
     * The base URL of the Cat Fact API.
     * @type {string}
     */
    catFactBaseUrl: GetString(
      "CAT_FACT_API_BASE_URL",
      EnvConstants.catFactAPIBaseUrl
    ),
    /**
     * The default number of facts to display per page.
     * @type {number}
     */
    defaultFactPerPage: GetInt(
      "DEFAULT_FACTS_PER_PAGE",
      EnvConstants.defaultFactPerPage
    ),
    /**
     * The default maximum length of facts to retrieve.
     * @type {number}
     */
    defaultFactMaxLength: GetInt(
      "DEFAULT_FACTS_MAX_LENGTH",
      EnvConstants.defaultFactMaxLength
    ),
    /**
     * The default page number to retrieve.
     * @type {number}
     */
    defaultFactPage: GetInt("DEFAULT_FACTS_PAGE", EnvConstants.defaultFactPage),
    /**
     * Indicates whether to use cache for API requests.
     * @type {boolean}
     */
    useCache: GetBool("USE_CACHE", EnvConstants.useCache),
  },
};

export default config;
