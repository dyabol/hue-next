import { useState } from "react";

export const useFetch = () => {
  const [loading, setloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const myFetch = async (url: string) => {
    try {
      setloading(true);
      const res = await fetch(url);
      const data = await res.json();
      if (res.status === 500) {
        setError(data.error);
        return null;
      }
      return data;
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setloading(false);
    }
  };

  return {
    error,
    loading,
    fetch: myFetch,
  };
};

export default useFetch;
