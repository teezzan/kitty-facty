import axios, { AxiosResponse } from "axios";
import {
  getCatFacts,
  transformCatFactAPIResponse,
} from "../../clients/catFactAPI";
import { CatFactAPIArgs } from "@/interfaces/api";
import config from "@/config";
import NodeCache from "node-cache";

jest.mock("axios");
jest.mock("node-cache");

const mockSuccessResponse = {
  current_page: 1,
  per_page: 5,
  last_page: 10,
  data: [{ fact: "Cats are awesome!", length: 17 }],
};

const transformedSuccessResponse = {
  currentPage: 1,
  perPage: 5,
  totalPages: 10,
  facts: [{ fact: "Cats are awesome!", length: 17 }],
};

const params = {
  limit: 5,
  page: 1,
  maxLength: 140,
};

describe("GetCatFacts", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return isError as true if request fails", async () => {
    const mockError = new Error("Request failed");
    (axios.get as jest.MockedFunction<typeof axios.get>).mockRejectedValue(
      mockError
    );

    const result = await getCatFacts(params as CatFactAPIArgs);

    expect(axios.get).toHaveBeenCalledWith(config.api.catFactBaseUrl, {
      params: {
        limit: params.limit,
        page: params.page,
        max_length: params.maxLength,
      },
    });
    expect(result).toEqual({ isError: true });
  });

  it("should return expected response if request is successful", async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({
      data: mockSuccessResponse,
    });
    const result = await getCatFacts(params as CatFactAPIArgs);

    expect(axios.get).toHaveBeenCalledWith(config.api.catFactBaseUrl, {
      params: {
        limit: params.limit,
        page: params.page,
        max_length: params.maxLength,
      },
    });

    expect(result).toEqual({
      data: transformedSuccessResponse,
      isError: false,
    });
  });

  it("should transform the API response correctly", async () => {
    const responseData = {
      current_page: 1,
      per_page: 10,
      last_page: 5,
      data: [
        { fact: "some fact", length: 50 },
        { fact: "another fact", length: 60 },
      ],
    };
    const response = { data: responseData };
    const transformedResponse = transformCatFactAPIResponse(
      response as AxiosResponse<any, any>
    );
    expect(transformedResponse.currentPage).toBe(responseData.current_page);
    expect(transformedResponse.perPage).toBe(responseData.per_page);
    expect(transformedResponse.totalPages).toBe(responseData.last_page);
    expect(transformedResponse.facts).toEqual(responseData.data);
  });

  it("should return the transformed response when the request succeeds", async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({
      data: mockSuccessResponse,
    });
    const result = await getCatFacts(params as CatFactAPIArgs);
    const transformedResponse = transformCatFactAPIResponse({
      data: mockSuccessResponse,
    } as any);
    expect(result.data).toEqual(transformedResponse);
  });
});

describe("getCatFactsFromCache", () => {
  const cachedResponse = transformedSuccessResponse;

  let cacheGetSpy: jest.SpyInstance;
  let cacheSetSpy: jest.SpyInstance;

  beforeEach(() => {
    cacheGetSpy = jest.spyOn(NodeCache.prototype, "get");
    cacheSetSpy = jest.spyOn(NodeCache.prototype, "set");
  });

  afterEach(() => {
    cacheGetSpy.mockRestore();
    cacheSetSpy.mockRestore();
  });

  it("should return the cached response if it exists", async () => {
    cacheGetSpy.mockReturnValue(cachedResponse);

    const result = await getCatFacts(params as CatFactAPIArgs);
    expect(result).toEqual({ data: cachedResponse, isError: false });
    expect(cacheGetSpy).toHaveBeenCalledTimes(1);
  });

  it("should call the API and set the cache if the cache is empty", async () => {
    cacheGetSpy.mockReturnValue(undefined);
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({
      data: mockSuccessResponse,
    });

    const result = await getCatFacts(params as CatFactAPIArgs);
    expect(result).toEqual({
      data: transformedSuccessResponse,
      isError: false,
    });
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(cacheSetSpy).toHaveBeenCalledWith("1-5-140", transformedSuccessResponse);
  });
});
