export default function FallBack({fallback}: {fallback: string | null}) {
    window.location.href = fallback ? fallback : "/authen"
  return (
    <div>
    </div>
  )
}
