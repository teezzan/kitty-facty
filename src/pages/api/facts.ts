// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  APIError,
  CatFactAPIArgs,
  CatFactAPIResponse,
  CatFactData,
  Fact,
  NextAPIQueryStrings,
} from "@/interfaces";
import { data } from "autoprefixer";
import axios, { AxiosResponse } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const baseUrl = "https://catfact.ninja/facts";
const defaultLimit = 10;
const defaultPage = 1;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CatFactData | APIError | null>
) {
  const { query } = req;
  const params = parseQueryStrings(query);

  const facts = await GetCatFacts(params);
  if (facts.isError) {
    res.status(500).json({ error: "Something went wrong" });
  }

  if (facts.data) {
    facts.data.facts = addIDToCatFacts(facts.data.facts);
  }
  res.status(200).json(facts.data);
}

const GetCatFacts = async (
  params: CatFactAPIArgs
): Promise<CatFactAPIResponse> => {
  try {
    const response = await axios.get(
      `${baseUrl}?limit=${params.limit}&page=${params.page}`
    );

    return {
      data: transformCatFactAPIResponse(response),
      isError: false,
    };
  } catch (error) {
    return {
      data: null,
      isError: true,
    };
  }
};

const parseQueryStrings = (query: NextAPIQueryStrings) => {
  const perPage = parseInt(query.perPage as string, 10);
  const page = parseInt(query.page as string, 10);

  return {
    limit: isNaN(perPage) ? defaultLimit : perPage,
    page: isNaN(page) ? defaultPage : page,
  };
};

const transformCatFactAPIResponse = (
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

const addIDToCatFacts = (facts: Fact[]): Fact[] => {
  return facts.map((fact, index) => {
    return {
      ...fact,
      id: index + 1,
    };
  });
};
