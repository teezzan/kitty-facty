import axios, { AxiosResponse } from "axios";
import {
  GetCatFacts,
  transformCatFactAPIResponse,
} from "../../clients/catFactAPI";
import { CatFactAPIArgs } from "@/interfaces/api";
import config from "@/config";

jest.mock("axios");

describe("GetCatFacts", () => {
  const mockSuccessResponse = {
    current_page: 1,
    per_page: 5,
    last_page: 10,
    data: [{ fact: "Cats are awesome!", length: 17 }],
  };

  const params = {
    limit: 5,
    page: 1,
    maxLength: 140,
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return expected response if request is successful", async () => {
    (axios.get as jest.MockedFunction<typeof axios.get>).mockResolvedValue({
      data: mockSuccessResponse,
    });
    const result = await GetCatFacts(params as CatFactAPIArgs);

    expect(axios.get).toHaveBeenCalledWith(config.api.catFactBaseUrl, {
      params: {
        limit: params.limit,
        page: params.page,
        max_length: params.maxLength,
      },
    });

    expect(result).toEqual({
      data: {
        currentPage: 1,
        perPage: 5,
        totalPages: 10,
        facts: [{ fact: "Cats are awesome!", length: 17 }],
      },
      isError: false,
    });
  });

  it("should return isError as true if request fails", async () => {
    const mockError = new Error("Request failed");
    (axios.get as jest.MockedFunction<typeof axios.get>).mockRejectedValue(
      mockError
    );

    const result = await GetCatFacts(params as CatFactAPIArgs);

    expect(axios.get).toHaveBeenCalledWith(config.api.catFactBaseUrl, {
      params: {
        limit: params.limit,
        page: params.page,
        max_length: params.maxLength,
      },
    });
    expect(result).toEqual({ isError: true });
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
    const result = await GetCatFacts(params as CatFactAPIArgs);
    const transformedResponse = transformCatFactAPIResponse({
      data: mockSuccessResponse,
    } as any);
    expect(result.data).toEqual(transformedResponse);
  });
});
