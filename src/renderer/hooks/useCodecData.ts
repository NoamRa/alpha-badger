import { useEffect, useState } from "react";

export type UseCodecData = {
  codecData: string;
};

export function useCodecData(): UseCodecData {
  const [codecData, setCodecData] = useState<string>("");

  useEffect(() => {
    const codecDataId = alphaBadgerApi.onCodecData(({ id, codecData }) => {
      console.log(`got codecData for id: ${id}, codecData:\n${codecData}`);
      setCodecData(codecData);
    });

    return () => {
      alphaBadgerApi.removeListener(codecDataId);
    };
  }, []);

  return { codecData };
}
