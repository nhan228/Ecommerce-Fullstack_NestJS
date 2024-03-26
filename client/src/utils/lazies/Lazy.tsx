import { lazy, Suspense } from "react"
import Loading from "./components/load/Loading"
import Permission from "./components/per/Permission"

export const lazyFn = (importFunc: any, access: boolean = true, fallback: string | null = null) => {

  // check per
  if (!access) return <Permission fallback={fallback}/> 

  // set timeout for load
  const LazyComponent = lazy(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(importFunc())
      }, 1000)
    })
  })

  return (
    <Suspense fallback={<Loading />}>
      <LazyComponent />
    </Suspense>
  )
}
