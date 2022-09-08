import { useEffect, useState } from "react";

export type UseData = {
  data: string;
};

export function useData(): UseData {
  const [data, setData] = useState<string>("");

  useEffect(() => {
    const dataId = alphaBadgerApi.onData(({ id, data }) => {
      console.log(`got data for id: ${id}, data:\n${data}`);
      setData(data);
    });

    return () => {
      alphaBadgerApi.removeListener(dataId);
    };
  }, []);

  return { data };
}
