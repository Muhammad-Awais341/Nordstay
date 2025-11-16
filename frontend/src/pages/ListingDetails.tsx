import { useParams, NavLink } from "react-router-dom"
import { useEffect, useMemo, useState } from "react"
import { api } from "../lib/api"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"

type Listing = {
  id: string
  title: string
  description?: string
  city: string
  address?: string
  pricePerNight: number
  maxGuests?: number
  images?: string[]
}

function getCategory(l: Listing | null): "Office" | "Home" {
  if (!l) return "Home"
  const t = `${l.title} ${l.description ?? ""}`.toLowerCase()
  return t.includes("office") || t.includes("kontor") ? "Office" : "Home"
}

function nightsBetween(a: string, b: string) {
  if (!a || !b) return 0
  const A = new Date(a)
  const B = new Date(b)
  const ms = B.getTime() - A.getTime()
  const n = Math.ceil(ms / (1000 * 60 * 60 * 24))
  return n > 0 ? n : 0
}

const fmt = new Intl.NumberFormat("sv-SE")

export function ListingDetails() {
  const { id } = useParams()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  // booking state
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [bookingMsg, setBookingMsg] = useState<string | null>(null)
  const [bookingErr, setBookingErr] = useState<string | null>(null)

  const canBook = !!startDate && !!endDate && nightsBetween(startDate, endDate) > 0
  const nights = useMemo(() => nightsBetween(startDate, endDate), [startDate, endDate])
  const subtotal = useMemo(
    () => (listing ? listing.pricePerNight * nights : 0),
    [listing, nights]
  )

  useEffect(() => {
    if (!id) return
    let mounted = true
    ;(async () => {
      try {
        const res = await api.get<Listing>(`/listings/${id}`)
        if (mounted) setListing(res.data)
      } catch (e: any) {
        if (mounted) setErr(e?.response?.data?.message ?? "Kunde inte hämta boendet")
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [id])

  async function book() {
    if (!id) return
    try {
      setBookingErr(null)
      setBookingMsg(null)
      await api.post("/bookings", { listingId: id, startDate, endDate })
      setBookingMsg("✅ Bokningen skapades! Gå till Mina bokningar.")
    } catch (e: any) {
      setBookingErr(e?.response?.data?.message ?? "Kunde inte boka")
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="h-64 sm:h-80 rounded-2xl bg-muted animate-pulse" />
        <div className="h-5 w-2/3 bg-muted rounded animate-pulse" />
        <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  if (err || !listing) {
    return (
      <div className="max-w-6xl mx-auto space-y-2">
        <p className="text-red-600">{err ?? "Hittades inte"}</p>
        <NavLink to="/" className="text-primary underline">
          Tillbaka till Hem
        </NavLink>
      </div>
    )
  }

  const cat = getCategory(listing)

  // ---- image processing: dedupe + fallbacks ----
  const rawImages =
    (listing.images && listing.images.length > 0
      ? listing.images
      : ["https://picsum.photos/1200/800"]) as string[]
  const images = Array.from(new Set(rawImages)) // remove duplicates
  if (images.length < 3) {
    // add safe filler thumbnails if listing has < 3 images
    while (images.length < 3) {
      images.push(`https://picsum.photos/seed/${listing.id}-${images.length}/800/600`)
    }
  }
  const [hero, ...thumbs] = images

  return (
    <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-12">
      {/* Left: gallery + details */}
      <div className="lg:col-span-8 space-y-5">
        {/* Breadcrumb */}
        <div className="text-sm text-subtext">
          <NavLink to="/" className="hover:underline">
            Nordstay
          </NavLink>
          <span> / </span>
          <span>{listing.city}</span>
        </div>

        {/* Title + badge */}
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{listing.title}</h1>
          {cat === "Office" && (
            <span className="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2 py-1 h-fit">
              Office
            </span>
          )}
        </div>
        <div className="text-subtext">
          {listing.city}
          {listing.address ? ` • ${listing.address}` : ""}
          {listing.maxGuests ? ` • ${listing.maxGuests} gäster` : ""}
        </div>

        {/* Gallery */}
        <div className="grid gap-3 grid-cols-12">
          <div className="col-span-12 sm:col-span-8 rounded-2xl overflow-hidden bg-muted">
            <img
              src={hero}
              alt={listing.title}
              className="w-full h-full object-cover aspect-[16/10]"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://picsum.photos/1200/800?grayscale"
              }}
              loading="eager"
            />
          </div>
          <div className="col-span-12 sm:col-span-4 grid gap-3">
            {thumbs.slice(0, 3).map((src, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-muted">
                <img
                  src={src}
                  alt={`${listing.title} ${i + 2}`}
                  className="w-full h-full object-cover aspect-[16/10]"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://picsum.photos/800/600?blur=2"
                  }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        {listing.description && (
          <div className="prose max-w-none">
            <h2 className="text-lg font-semibold">Beskrivning</h2>
            <p className="text-[15px] leading-relaxed">{listing.description}</p>
          </div>
        )}
      </div>

      {/* Right: sticky booking card */}
      <aside className="lg:col-span-4">
        <div className="lg:sticky lg:top-20 rounded-2xl border border-border p-4 shadow-sm bg-white space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-semibold">
              {fmt.format(listing.pricePerNight)} kr
              <span className="text-sm text-subtext"> / natt</span>
            </div>
          </div>

          <div className="grid gap-3">
            <Input
              label="Startdatum"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="Slutdatum"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Price breakdown */}
          <div className="rounded-lg border border-border p-3 text-sm space-y-1 bg-gray-50">
            <div className="flex justify-between">
              <span>Antal nätter</span>
              <span>{nights}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Delsumma</span>
              <span>{fmt.format(subtotal)} kr</span>
            </div>
          </div>

          <Button onClick={book} disabled={!canBook} className="w-full">
            {canBook ? "Boka nu" : "Välj datum"}
          </Button>

          {bookingMsg && <p className="text-green-600 text-sm">{bookingMsg}</p>}
          {bookingErr && <p className="text-red-600 text-sm">{bookingErr}</p>}

          <p className="text-[12px] text-subtext">
            Kostnaden beräknas per natt. Datumkontroll sker vid bokning.
          </p>
        </div>
      </aside>
    </div>
  )
}
