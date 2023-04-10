import { GetCatFacts } from "@/clients/catFactAPI";
import { APIError, CatFactData, Fact } from "@/interfaces/api";
import { SortOrder } from "@/interfaces/constants";
import {
  addIDToCatFacts,
  parseQueryStrings,
  sortFactsAlphabetically,
  sortFactsByLength,
} from "@/utils";
import type { NextApiRequest, NextApiResponse } from "next";

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
