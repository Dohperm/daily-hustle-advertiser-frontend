import { createContext, useContext } from "react";
export const AdvertiserDataContext = createContext(undefined);
export const useAdvertiserData = () => {
  const ctx = useContext(AdvertiserDataContext);
  if (!ctx)
    throw new Error(
      "useAdvertiserData must be used within <AdvertiserDataProvider>"
    );
  return ctx;
};
