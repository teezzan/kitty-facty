import { createMocks } from "node-mocks-http";
import handler from "@/pages/api/facts";
import { GetCatFacts } from "../clients/catFactAPI";
import config from "@/config";
import { SortOrder } from "@/interfaces/constants";

jest.mock("../clients/catFactAPI", () => ({
  GetCatFacts: jest.fn(),
}));

describe("/api/facts", () => {
  const mockedFacts = {
    isError: false,
    data: {
      currentPage: 1,
      perPage: 10,
      totalPages: 10,
      facts: [
        { fact: "Fact A", length: 5 },
        { fact: "Fact B", length: 3 },
        { fact: "Fact C", length: 4 },
      ],
    },
  };

  test("handles error and returns 500 status code", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {},
    });

    // mock GetCatFacts function to return an error
    (GetCatFacts as jest.Mock).mockImplementation(() =>
      Promise.resolve({ isError: true })
    );

    await handler(req, res);

    expect(GetCatFacts).toHaveBeenCalledWith({
      limit: config.api.defaultFactPerPage,
      maxLength: config.api.defaultFactMaxLength,
      page: config.api.defaultFactPage,
      sortByAlphabet: null,
      sortByLength: null,
    });

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: "Something went wrong",
    });
  });

  test("returns 405 error for non-GET requests", async () => {
    const { req, res } = createMocks({
      method: "POST",
      query: {},
    });
  
    await handler(req, res);
  
    expect(res._getStatusCode()).toBe(405);
    const body = JSON.parse(res._getData());
    expect(body).toEqual({ error: "Method Not Allowed" });
  });

  test("returns cat facts without sorting and with IDs", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {},
    });

    // mock GetCatFacts function
    (GetCatFacts as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockedFacts)
    );

    await handler(req, res);

    expect(GetCatFacts).toHaveBeenCalledWith({
      limit: config.api.defaultFactPerPage,
      maxLength: config.api.defaultFactMaxLength,
      page: config.api.defaultFactPage,
      sortByAlphabet: null,
      sortByLength: null,
    });

    expect(res._getStatusCode()).toBe(200);
    const body = JSON.parse(res._getData());
    expect(body).toEqual({
      currentPage: 1,
      perPage: 10,
      totalPages: 10,
      facts: [
        { fact: "Fact A", length: 5, id: 1 },
        { fact: "Fact B", length: 3, id: 2 },
        { fact: "Fact C", length: 4, id: 3 },
      ],
    });
  });

  test("returns sorted cat facts with IDs", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        sortByLength: SortOrder.DESC,
      },
    });

    // mock GetCatFacts function
    (GetCatFacts as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockedFacts)
    );

    await handler(req, res);

    expect(GetCatFacts).toHaveBeenCalledWith({
      limit: config.api.defaultFactPerPage,
      maxLength: config.api.defaultFactMaxLength,
      page: config.api.defaultFactPage,
      sortByLength: SortOrder.DESC,
      sortByAlphabet: null,
    });

    expect(res._getStatusCode()).toBe(200);
    const body = JSON.parse(res._getData());
    expect(body).toEqual({
      currentPage: 1,
      perPage: 10,
      totalPages: 10,
      facts: [
        { fact: "Fact A", length: 5, id: 1 },
        { fact: "Fact C", length: 4, id: 2 },
        { fact: "Fact B", length: 3, id: 3 },
      ],
    });
  });

  test("returns cat facts sorted by alphabet with IDs", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        sortByAlphabet: SortOrder.ASC,
      },
    });

    // mock GetCatFacts function
    (GetCatFacts as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockedFacts)
    );

    await handler(req, res);

    expect(GetCatFacts).toHaveBeenCalledWith({
      limit: config.api.defaultFactPerPage,
      maxLength: config.api.defaultFactMaxLength,
      page: config.api.defaultFactPage,
      sortByAlphabet: SortOrder.ASC,
      sortByLength: null,
    });

    expect(res._getStatusCode()).toBe(200);
    const body = JSON.parse(res._getData());
    expect(body).toEqual({
      currentPage: 1,
      perPage: 10,
      totalPages: 10,
      facts: [
        { fact: "Fact A", length: 5, id: 1 },
        { fact: "Fact B", length: 3, id: 2 },
        { fact: "Fact C", length: 4, id: 3 },
      ],
    });
  });

  test("returns cat facts sorted by length in ascending order and with IDs", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        sortByLength: SortOrder.ASC,
      },
    });

    // mock GetCatFacts function
    (GetCatFacts as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockedFacts)
    );

    await handler(req, res);

    expect(GetCatFacts).toHaveBeenCalledWith({
      limit: config.api.defaultFactPerPage,
      maxLength: config.api.defaultFactMaxLength,
      page: config.api.defaultFactPage,
      sortByLength: SortOrder.ASC,
      sortByAlphabet: null,
    });

    expect(res._getStatusCode()).toBe(200);
    const body = JSON.parse(res._getData());
    expect(body).toEqual({
      currentPage: 1,
      perPage: 10,
      totalPages: 10,
      facts: [
        { fact: "Fact B", length: 3, id: 1 },
        { fact: "Fact C", length: 4, id: 2 },
        { fact: "Fact A", length: 5, id: 3 },
      ],
    });
  });

  test("returns cat facts sorted by length in descending order and with IDs", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        sortByLength: SortOrder.DESC,
      },
    });

    // mock GetCatFacts function
    (GetCatFacts as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockedFacts)
    );

    await handler(req, res);

    expect(GetCatFacts).toHaveBeenCalledWith({
      limit: config.api.defaultFactPerPage,
      maxLength: config.api.defaultFactMaxLength,
      page: config.api.defaultFactPage,
      sortByLength: SortOrder.DESC,
      sortByAlphabet: null,
    });

    expect(res._getStatusCode()).toBe(200);
    const body = JSON.parse(res._getData());
    expect(body).toEqual({
      currentPage: 1,
      perPage: 10,
      totalPages: 10,
      facts: [
        { fact: "Fact A", length: 5, id: 1 },
        { fact: "Fact C", length: 4, id: 2 },
        { fact: "Fact B", length: 3, id: 3 },
      ],
    });
  });

  test("returns cat facts sorted by alphabet in ascending order and with IDs", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        sortByAlphabet: SortOrder.ASC,
      },
    });

    // mock GetCatFacts function
    (GetCatFacts as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockedFacts)
    );

    await handler(req, res);

    expect(GetCatFacts).toHaveBeenCalledWith({
      limit: config.api.defaultFactPerPage,
      maxLength: config.api.defaultFactMaxLength,
      page: config.api.defaultFactPage,
      sortByLength: null,
      sortByAlphabet: SortOrder.ASC,
    });

    expect(res._getStatusCode()).toBe(200);
    const body = JSON.parse(res._getData());
    expect(body).toEqual({
      currentPage: 1,
      perPage: 10,
      totalPages: 10,
      facts: [
        { fact: "Fact A", length: 5, id: 1 },
        { fact: "Fact B", length: 3, id: 2 },
        { fact: "Fact C", length: 4, id: 3 },
      ],
    });
  });

  test("returns cat facts sorted by alphabet in descending order and with IDs", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        sortByAlphabet: SortOrder.DESC,
      },
    });

    // mock GetCatFacts function
    (GetCatFacts as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockedFacts)
    );

    await handler(req, res);

    expect(GetCatFacts).toHaveBeenCalledWith({
      limit: config.api.defaultFactPerPage,
      maxLength: config.api.defaultFactMaxLength,
      page: config.api.defaultFactPage,
      sortByLength: null,
      sortByAlphabet: SortOrder.DESC,
    });

    expect(res._getStatusCode()).toBe(200);
    const body = JSON.parse(res._getData());
    expect(body).toEqual({
      currentPage: 1,
      perPage: 10,
      totalPages: 10,
      facts: [
        { fact: "Fact C", length: 4, id: 1 },
        { fact: "Fact B", length: 3, id: 2 },
        { fact: "Fact A", length: 5, id: 3 },
      ],
    });
  });

  test("returns cat facts sorted by length in ascending order, with IDs, and paginated", async () => {
    const mockedFacts = {
      isError: false,
      data: {
        currentPage: 2,
        perPage: 10,
        totalPages: 10,
        facts: [
          { fact: "Fact A", length: 5 },
          { fact: "Fact B", length: 3 },
          { fact: "Fact C", length: 4 },
        ],
      },
    };

    const { req, res } = createMocks({
      method: "GET",
      query: {
        sortByLength: SortOrder.ASC,
        page: 2,
      },
    });

    // mock GetCatFacts function
    (GetCatFacts as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockedFacts)
    );

    await handler(req, res);

    expect(GetCatFacts).toHaveBeenCalledWith({
      limit: config.api.defaultFactPerPage,
      maxLength: config.api.defaultFactMaxLength,
      page: 2,
      sortByLength: SortOrder.ASC,
      sortByAlphabet: null,
    });

    expect(res._getStatusCode()).toBe(200);
    const body = JSON.parse(res._getData());
    expect(body).toEqual({
      currentPage: 2,
      perPage: 10,
      totalPages: 10,
      facts: [
        { fact: "Fact B", length: 3, id: 1 },
        { fact: "Fact C", length: 4, id: 2 },
        { fact: "Fact A", length: 5, id: 3 },
      ],
    });
  });

  test("returns cat facts sorted by length in descending order and ignores sorting by alphabet if both are present", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        sortByAlphabet: SortOrder.ASC,
        sortByLength: SortOrder.DESC,
      },
    });

    // mock GetCatFacts function
    (GetCatFacts as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockedFacts)
    );

    await handler(req, res);

    expect(GetCatFacts).toHaveBeenCalledWith({
      limit: config.api.defaultFactPerPage,
      maxLength: config.api.defaultFactMaxLength,
      page: config.api.defaultFactPage,
      sortByLength: SortOrder.DESC,
      sortByAlphabet: null,
    });

    expect(res._getStatusCode()).toBe(200);
    const body = JSON.parse(res._getData());
    expect(body).toEqual({
      currentPage: 1,
      perPage: 10,
      totalPages: 10,
      facts: [
        { fact: "Fact A", length: 5, id: 1 },
        { fact: "Fact C", length: 4, id: 2 },
        { fact: "Fact B", length: 3, id: 3 },
      ],
    });
  });

  test("ignores misspelled query values of sortByAlphabet and sortByLength", async () => {
    const { req, res } = createMocks({
      method: "GET",
      query: {
        sortByAlphabet: "ascending",
        sortByLength: "descend",
      },
    });

    // mock GetCatFacts function
    (GetCatFacts as jest.Mock).mockImplementation(() =>
      Promise.resolve(mockedFacts)
    );

    await handler(req, res);

    expect(GetCatFacts).toHaveBeenCalledWith({
      limit: config.api.defaultFactPerPage,
      maxLength: config.api.defaultFactMaxLength,
      page: config.api.defaultFactPage,
      sortByLength: null,
      sortByAlphabet: null,
    });

    expect(res._getStatusCode()).toBe(200);
    const body = JSON.parse(res._getData());
    expect(body).toEqual({
      currentPage: 1,
      perPage: 10,
      totalPages: 10,
      facts: [
        { fact: "Fact A", length: 5, id: 1 },
        { fact: "Fact C", length: 4, id: 2 },
        { fact: "Fact B", length: 3, id: 3 },
      ],
    });
  });
});
