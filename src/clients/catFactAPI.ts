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

export const getCatFacts = async (
  params: CatFactAPIArgs
): Promise<CatFactAPIResponse> => {
  if (config.api.useCache) {
    return getCatFactsFromCache(params);
  }

  return getCatFactsFromAPI(params);
};
