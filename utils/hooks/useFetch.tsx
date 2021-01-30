import { useState } from "react";

export const useFetch = () => {
  const [loading, setloading] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const myFetch = async (url: string) => {
    try {
      setloading(loading + 1);
      const res = await fetch(url);
      return res.json();
    } catch (e) {
      console.error(e);
      setError(e.meesage);
    } finally {
      setloading(loading - 1);
    }
  };

  return {
    error,
    fetch: myFetch,
    loading: loading > 0,
  };
};

export default useFetch;
