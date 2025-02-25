import axios from "axios";
import { useState, useEffect } from "react";
import notify from "@/utils/notify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export function useAxios() {
  const router = useRouter();
  const storedUser = Cookies.get("u-user");

  const user = storedUser ? JSON.parse(storedUser) : null;

  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

  const [method, setMethod] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const ApiRequest = async (path, method, body, params) => {
    setIsLoading(true);
    setData(null);
    setError(null);
    setMethod(method);
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api${path}`;

    try {
      const res = await axios({
        method,
        url,
        params: params,
        data: body,
        ...config,
      });

      if (res.status >= 200 && res.status < 300) {
        setData(res?.data);
        setError(null);
        if (method !== "GET") {
          notify(res?.data?.message, "success");
        }
      }
    } catch (err) {
      console.log(err);
      if (method !== "GET") {
        notify(err?.response?.data?.message, "error");
      }
      setError(err?.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, ApiRequest, config };
}
