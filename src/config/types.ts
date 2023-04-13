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

type EnvConfig = {
  api: {
    catFactBaseUrl: string;
    defaultFactPerPage: number;
    defaultFactMaxLength: number;
    defaultFactPage: number;
    useCache: boolean;
  };
};
