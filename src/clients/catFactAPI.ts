import axios, { AxiosResponse } from "axios";
import {
  CatFactAPIArgs,
  CatFactAPIResponse,
  CatFactData,
} from "@/interfaces/api";
import config from "@/config";

const baseURL = config.api.catFactBaseUrl;

export const GetCatFacts = async (
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
