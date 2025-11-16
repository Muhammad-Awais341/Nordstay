import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { api } from "../lib/api"
import SearchBar from "../components/SearchBar"
import ListingCard from "../components/ListingCard"

type Listing = {
  id: string
  title: string
  city: string
  pricePerNight: number
  images?: string[]
}

const fmtMonth: Intl.DateTimeFormatOptions = { month: "short" }
function oneNightRangeText() {
  const today = new Date()
  const tomorrow = new Date(today.getTime() + 24*60*60*1000)
  const d1 = `${today.getDate()} ${today.toLocaleString("sv-SE", fmtMonth)}.`
  const d2 = `${tomorrow.getDate()} ${tomorrow.toLocaleString("sv-SE", fmtMonth)}.`
  return `${d1} - ${d2}`
}
function pseudoRating(id: string, city: string) {
  let h = 0; const s = id + city
  for (let i=0; i<s.length; i++) h = (h*31 + s.charCodeAt(i)) % 1000
  return 4.0 + (h % 9) / 10
}

export default function Home() {
  const [params, setParams] = useSearchParams()
  const qParam = params.get("q") ?? ""   // ?q=stockholm
  const [destination, setDestination] = useState(qParam)

  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<Listing[]>("/listings")
        setListings(res.data ?? [])
      } catch (e: any) {
        setErr(e?.response?.data?.message ?? "Kunde inte hämta boenden")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // keep input synced with URL if user clicks "Hem" (which removes ?q)
  useEffect(() => setDestination(qParam), [qParam])

  const dateText = useMemo(oneNightRangeText, [])

  const visible = useMemo(() => {
    const q = (qParam || "").trim().toLowerCase()
    if (!q) return listings // show all when no ?q
    return listings.filter(l => l.city.toLowerCase().includes(q))
  }, [listings, qParam])

  return (
    <section className="space-y-6">
      <SearchBar
        destination={destination}
        onDestinationChange={setDestination}
        onSearch={() => {
          const q = destination.trim()
          if (q) setParams({ q })
          else setParams({}) // clear -> back to all
        }}
      />

      {err ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">{err}</div>
      ) : loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {Array.from({length:10}).map((_,i)=>(
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/3] rounded-2xl bg-muted" />
              <div className="mt-3 h-4 w-2/3 bg-muted rounded" />
              <div className="mt-2 h-3 w-1/3 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {visible.map(l => (
            <ListingCard
              key={l.id}
              id={l.id}
              image={l.images?.[0] ?? "https://picsum.photos/600/450?blur=2"}
              title={l.title}
              city={l.city}
              dateText={dateText}
              rating={pseudoRating(l.id, l.city)}
              pricePerNight={l.pricePerNight}
            />
          ))}
        </div>
      )}
    </section>
  )
}
