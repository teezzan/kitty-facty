import axios, { AxiosResponse } from "axios";
import NodeCache from "node-cache";
import {
  CatFactAPIArgs,
  CatFactAPIResponse,
  CatFactData,
} from "@/interfaces/api";
import config from "@/config";

const baseURL = config.api.catFactBaseUrl;
const cache = new NodeCache();

/**
 * Fetches cat facts from the Cat Fact API.
 * @param params - The query parameters for the API request.
 * @returns A Promise that resolves to a CatFactAPIResponse object.
 */
export const getCatFactsFromAPI = async (
  params: CatFactAPIArgs
): Promise<CatFactAPIResponse> => {
  try {
    const response = await axios.get(baseURL, {
      params: {
        limit: params.limit,
        page: params.page,
        max_length: params.maxLength,
      },
    });

    return <CatFactAPIResponse>{
      data: transformCatFactAPIResponse(response),
      isError: false,
    };
  } catch (error) {
    return <CatFactAPIResponse>{
      isError: true,
    };
  }
};

/**
 * Transforms the response from the Cat Fact API to a CatFactData object.
 * @param response - The AxiosResponse object returned by the API.
 * @returns A CatFactData object.
 */
export const transformCatFactAPIResponse = (
  response: AxiosResponse<any, any>
): CatFactData => {
  const { data } = response;
  const { current_page, per_page, last_page, data: facts } = data;

  return {
    currentPage: Number(current_page),
    perPage: Number(per_page),
    totalPages: Number(last_page),
    facts,
  };
};

/**
 * Fetches cat facts from the cache if they exist, otherwise fetches them from the API.
 * @param params - The query parameters for the API request.
 * @returns A Promise that resolves to a CatFactAPIResponse object.
 */
export const getCatFactsFromCache = async (
  params: CatFactAPIArgs
): Promise<CatFactAPIResponse> => {
  const { page, limit, maxLength } = params;
  const key = `${page}-${limit}-${maxLength}`;
  const cachedData = cache.get(key);

  if (cachedData) {
    return <CatFactAPIResponse>{
      data: cachedData,
      isError: false,
    };
  }

  const response = await getCatFactsFromAPI(params);

  if (!response.isError) {
    cache.set(key, response.data);
  }

  return response;
};

/**
 * Fetches cat facts either from the cache or the Cat Fact API depending on the value of `config.api.useCache`.
 * @param params - The query parameters for the API request.
 * @returns A Promise that resolves to a CatFactAPIResponse object.
 */
export const getCatFacts = async (
  params: CatFactAPIArgs
): Promise<CatFactAPIResponse> => {
  if (config.api.useCache) {
    return getCatFactsFromCache(params);
  }

  return getCatFactsFromAPI(params);
};
