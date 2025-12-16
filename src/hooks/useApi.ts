import { useContext, useMemo } from "react";
import axios from "axios";

import global from "../../config/Global.json";
import AuthContext from "../contexts/AuthContext";

const useApi = () => {
  const getAPI = (API_NAME: string) =>
    global.api.host + global.api[API_NAME as keyof typeof global.api];

  const getHost = () => global.api.host;

  const { authToken } = useContext(AuthContext) || {};
  const token = authToken?.access;

  // Memoize headers to prevent recreation on every render
  const headers = useMemo(() => {
    const headerObj: any = {};
    if (token) headerObj["Authorization"] = `Bearer ${token}`;
    return headerObj;
  }, [token]);

  // Post request
  // const Post = async (api: string, payload: any) => {
  //   let _api = getAPI(api).includes("undefined") ? api : getAPI(api);

  //   try {
  //     const response = await axios.post(_api, payload, {
  //       headers,
  //     });

  //     return response;
  //   } catch (err) {
  //     throw err;
  //   }
  // };
  const Post = async (api: string, payload: any) => {
    let _api = getAPI(api).includes("undefined") ? api : getAPI(api);

    // Create a copy so we don't mutate the original headers
    let customHeaders = { ...headers };

    // If payload is FormData, remove Content-Type header so Axios sets it
    if (payload instanceof FormData) {
      delete customHeaders["Content-Type"];
    }

    try {
      const response = await axios.post(_api, payload, {
        headers: customHeaders, // Use adjusted headers
      });
      return response;
    } catch (err) {
      throw err;
    }
  };
    const PATCH = async (api: string, payload: any) => {
    let _api = getAPI(api).includes("undefined") ? api : getAPI(api);

    // Create a copy so we don't mutate the original headers
    let customHeaders = { ...headers };

    // If payload is FormData, remove Content-Type header so Axios sets it
    if (payload instanceof FormData) {
      delete customHeaders["Content-Type"];
    }

    try {
      const response = await axios.patch(_api, payload, {
        headers: customHeaders, // Use adjusted headers
      });
      return response;
    } catch (err) {
      throw err;
    }
  };
  const PostFormData = async (api: string, payload: any) => {
    let _api = getAPI(api).includes("undefined") ? api : getAPI(api); // adds host from api config

    let customHeaders = { ...headers };
    if (payload instanceof FormData) {
      delete customHeaders["Content-Type"]; // axios will handle boundary
    }

    try {
      const response = await axios.post(_api, payload, {
        headers: customHeaders,
      });
      return response;
    } catch (err) {
      throw err;
    }
  };
  // Put request
  const Put = async (api: string, id: string, payload: any) => {
    let _api = getAPI(api).includes("undefined") ? api : getAPI(api);

    try {
      const response = await axios.put(`${_api}${id}/`, payload, {
        headers,
      });

      return response;
    } catch (err) {
      throw err;
    }
  };

  // Patch request
  const Patch = async (api: string, id?: string, payload?: any) => {
    let _api = getAPI(api).includes("undefined") ? api : getAPI(api);

    // If id is provided and not empty, append it to the URL
    const url = id ? `${_api}${id}/` : _api;

    try {
      const response = await axios.patch(url, payload, {
        headers,
      });

      return response;
    } catch (err) {
      throw err;
    }
  };

  // Get request (fetch data)
  const Get = async (api: string, idOrPath?: string | number) => {
    let _api = getAPI(api).includes("undefined") ? api : getAPI(api);

    // build full URL with trailing slash
    const url = idOrPath ? `${_api}${idOrPath}/` : _api;

    try {
      const response = await axios.get(url, { headers });
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  // Delete request
  const Delete = async (api: string, id: string) => {
    let _api = getAPI(api).includes("undefined") ? api : getAPI(api);

    try {
      const response = await axios.delete(`${_api}${id}/`, {
        headers,
      });

      return response;
    } catch (err) {
      throw err;
    }
  };

  const GetPaginatedData = async (
    api: string,
    options?: {
      page?: number;
      search?: string;
      queryParams?: Record<string, string | number | boolean>;
    }
  ) => {
    const { page = 1, search = "", queryParams = {} } = options || {};

    if (page === 0) {
      return {
        data: [],
        totalCount: 0,
        nextPage: null,
        previousPage: null,
      };
    }

    let _api = getAPI(api).includes("undefined") ? api : getAPI(api);

    const params = new URLSearchParams();

    if (page > 1) params.append("page", String(page));
    if (search.trim()) params.append("search", search.trim());

    // Support custom query params like filters, sorting, etc.
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });

    const fullUrl = `${_api}?${params.toString()}`;

    try {
      const response = await axios.get(fullUrl, {
        headers,
      });

      return {
        data: response.data.results,
        totalCount: response.data.count,
        nextPage: response.data.next,
        previousPage: response.data.previous,
      };
    } catch (err) {
      throw err;
    }
  };

  // Get universities and campuses by location
  const getUniversityByLocation = async ({
    country_id,
    state_id,
    city_id,
  }: {
    country_id: string;
    state_id: string;
    city_id: string;
  }) => {
    const url = `${global.api.host}/api/v1/getUniversityByLocation/?country_id=${country_id}&state_id=${state_id}&city_id=${city_id}`;

    try {
      const response = await axios.get(url, {
        headers,
      });

      return response.data;
    } catch (err) {
      throw err;
    }
  };

  // Get course mapping by course id
  const getCourseMapping = async ({ course_id }: { course_id: string }) => {
    const url = `${global.api.host}/api/v1/courseMapping/?course=${course_id}`;

    try {
      const response = await axios.get(url, {
        headers,
      });

      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return {
    Post,
    Put,
    Patch,
    PATCH,
    Get,
    Delete,
    GetPaginatedData,
    getAPI,
    getHost,
    getUniversityByLocation,
    getCourseMapping,
    PostFormData,
  };
};

export default useApi;
