import { lazy, Suspense } from "react";
import FallBack from "./components/FallBack";
import Loading from "./components/Loading";

const lazyFn = (importFn: any, access: boolean =true, fallback: string | null = null) => {
  if(!access) {
    return () => <FallBack fallback={fallback}/>  
  }
  const LazyComponent = lazy(importFn)
  return () => (
    <Suspense fallback={<Loading/>}>
      <LazyComponent />
    </Suspense>
  );
};

export default lazyFn