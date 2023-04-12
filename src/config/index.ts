import { GetBool, GetInt, GetString } from "@/utils/env";
import { EnvConstants } from "./defaultValues";

export default {
  api: {
    catFactBaseUrl: GetString(
      "CAT_FACT_API_BASE_URL",
      EnvConstants.catFactAPIBaseUrl
    ),
    defaultFactPerPage: GetInt(
      "DEFAULT_FACTS_PER_PAGE",
      EnvConstants.defaultFactPerPage
    ),
    defaultFactMaxLength: GetInt(
      "DEFAULT_FACTS_MAX_LENGTH",
      EnvConstants.defaultFactMaxLength
    ),
    defaultFactPage: GetInt("DEFAULT_FACTS_PAGE", EnvConstants.defaultFactPage),
    useCache: GetBool("USE_CACHE", EnvConstants.useCache),
  },
};
