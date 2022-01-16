import { useEffect, useState } from "react";

/*
Custom hook to check if the page is loaded
Since localstorage is only defined client side the server side will return undefined
This ensures that the component is only rendered when the page is loaded
*/
export const useLoaded = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setLoaded(true), []);
  return loaded;
};
