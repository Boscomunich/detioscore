import axios, { AxiosRequestConfig } from "axios";

interface ApiParams {
  [key: string]: string | number | boolean | undefined;
}

interface FootballApiResponse<T> {
  get: string;
  parameters: any[];
  errors: any[];
  results: number;
  paging: {
    current: number;
    total: number;
  };
  response: T;
}

export async function fetchFootballData<T = any>(
  path: string,
  params: ApiParams = {},
  options: Partial<AxiosRequestConfig> = {}
): Promise<{ data: FootballApiResponse<T>; status: number }> {
  try {
    const mergedParams = { ...params };

    const requestOptions: AxiosRequestConfig = {
      method: "GET",
      url: `https://v3.football.api-sports.io/${path}`,
      params: mergedParams,
      headers: {
        "x-rapidapi-host": "v3.football.api-sports.io",
        "x-rapidapi-key": process.env.FOOTBALL_API_KEY || "",
      },
      ...options,
    };

    const response = await axios.request<FootballApiResponse<T>>(
      requestOptions
    );

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `API request failed: ${error.message} - ${error.response?.status}`
      );
    }
    throw new Error("Unknown error occurred during API request");
  }
}
