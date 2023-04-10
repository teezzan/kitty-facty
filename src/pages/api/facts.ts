// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
  APIError,
  CatFactAPIArgs,
  CatFactAPIResponse,
  CatFactData,
  Fact,
  NextAPIQueryStrings,
  SortOrder,
} from "@/interfaces";
import axios, { AxiosResponse } from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const baseUrl = "https://catfact.ninja/facts";
const defaultLimit = 10;
const defaultPage = 1;
const defaultMaxLength = 140;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CatFactData | APIError>
) {
  const { query } = req;
  const params = parseQueryStrings(query);

  const facts = await GetCatFacts(params);
  if (facts.isError) {
    res.status(500).json({ error: "Something went wrong" });
  }

  let sortedFacts: Fact[] = [];
  if (params.sortByLength) {
    sortedFacts = sortFactsByLength(
      facts.data.facts,
      params.sortByLength == SortOrder.ASC
    );
  } else if (params.sortByAlphabet) {
    sortedFacts = sortFactsAlphabetically(
      facts.data.facts,
      params.sortByAlphabet == SortOrder.ASC
    );
  } else {
    sortedFacts = facts.data.facts;
  }

  facts.data.facts = addIDToCatFacts(sortedFacts);

  res.status(200).json(facts.data);
}

const GetCatFacts = async (
  params: CatFactAPIArgs
): Promise<CatFactAPIResponse> => {
  try {
    const response = await axios.get(
      `${baseUrl}?limit=${params.limit}&page=${params.page}&max_length=${params.maxLength}`
    );

    return {
      data: transformCatFactAPIResponse(response),
      isError: false,
    };
  } catch (error) {
    return <CatFactAPIResponse>{
      isError: true,
    };
  }
};

const parseQueryStrings = (query: NextAPIQueryStrings): CatFactAPIArgs => {
  const perPage = parseInt(query.perPage as string, 10);
  const page = parseInt(query.page as string, 10);
  const sortByLength = query.sortByLength as string;
  const sortByAlphabet = query.sortByAlphabet as string;
  const maxLength = parseInt(query.maxLength as string, 10);

  const isValidAlphabetSortOrder = Object.values(SortOrder).includes(
    sortByAlphabet as SortOrder
  );

  const isValidLengthSortOrder = Object.values(SortOrder).includes(
    sortByLength as SortOrder
  );

  return {
    limit: perPage || defaultLimit,
    page: page || defaultPage,
    maxLength: maxLength || defaultMaxLength,
    sortByLength: isValidLengthSortOrder ? (sortByLength as SortOrder) : null,
    sortByAlphabet: isValidAlphabetSortOrder
      ? (sortByAlphabet as SortOrder)
      : null,
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

const sortFactsAlphabetically = (facts: Fact[], sortAsc = true): Fact[] => {
  return facts.sort((a, b) => {
    if (a.fact > b.fact) {
      return sortAsc ? 1 : -1;
    }
    if (a.fact < b.fact) {
      return sortAsc ? -1 : 1;
    }
    return 0;
  });
};

const sortFactsByLength = (facts: Fact[], sortAsc = true): Fact[] => {
  return facts.sort((a, b) => {
    if (a.length > b.length) {
      return sortAsc ? 1 : -1;
    }
    if (a.length < b.length) {
      return sortAsc ? -1 : 1;
    }
    return 0;
  });
};
