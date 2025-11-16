import { useEffect, useState } from "react"
import { api } from "../lib/api"
import { NavLink } from "react-router-dom"

type Booking = {
  id: string
  startDate: string
  endDate: string
  totalPrice: number
  listing: {
    id: string
    title: string
    city: string
    images?: string[]
    pricePerNight: number
  }
}

const fmtCurrency = new Intl.NumberFormat("sv-SE", {
  style: "currency",
  currency: "SEK",
  maximumFractionDigits: 0,
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [paidIds, setPaidIds] = useState<string[]>([])
  const [payMessage, setPayMessage] = useState<string | null>(null)

  // Hämta bokningar
  useEffect(() => {
    ;(async () => {
      try {
        const res = await api.get<Booking[]>("/bookings")
        const data = res.data ?? []
        setBookings(data)
        if (data.length > 0) {
          setSelectedId(data[0].id)
        }
      } catch (e: any) {
        setErr(e?.response?.data?.message ?? "Kunde inte hämta bokningar")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // Hämta tidigare “betalda” bokningar från localStorage
  useEffect(() => {
    const stored = localStorage.getItem("paidBookings")
    if (stored) {
      try {
        setPaidIds(JSON.parse(stored))
      } catch {
        // ignore
      }
    }
  }, [])

  // Spara betalda bokningar i localStorage
  useEffect(() => {
    localStorage.setItem("paidBookings", JSON.stringify(paidIds))
  }, [paidIds])

  const selected = bookings.find((b) => b.id === selectedId) ?? bookings[0]

  const handlePay = () => {
    if (!selected) return
    if (paidIds.includes(selected.id)) {
      setPayMessage("Den här bokningen är redan markerad som betald.")
      return
    }
    setPaidIds((prev) => [...prev, selected.id])
    setPayMessage("Betalning genomförd. Tack för din bokning hos Nordstay!")
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      {/* Vänster: bokningslista */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Mina bokningar</h1>
        {err && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
            {err}
          </div>
        )}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-border p-3">
                <div className="aspect-[16/11] rounded-xl bg-muted" />
                <div className="mt-3 h-4 w-2/3 bg-muted rounded" />
                <div className="mt-2 h-3 w-1/3 bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <p className="text-sm text-gray-600">
            Du har inga bokningar ännu.{" "}
            <NavLink to="/" className="text-blue-600 underline">
              Utforska boenden på Nordstay
            </NavLink>
            .
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {bookings.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setSelectedId(b.id)
                  setPayMessage(null)
                }}
                className={`text-left rounded-2xl border p-3 transition hover:shadow-md ${
                  selectedId === b.id ? "border-blue-500 shadow-sm" : "border-border"
                }`}
              >
                <div className="aspect-[16/11] rounded-xl overflow-hidden bg-muted mb-3">
                  <img
                    src={b.listing.images?.[0] ?? "https://picsum.photos/800/500?blur=2"}
                    alt={b.listing.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        "https://picsum.photos/800/500?grayscale"
                    }}
                  />
                </div>
                <div className="font-semibold line-clamp-1">{b.listing.title}</div>
                <div className="text-sm text-gray-600">{b.listing.city}</div>
                <div className="text-xs text-gray-500">
                  {formatDate(b.startDate)} – {formatDate(b.endDate)}
                </div>
                <div className="mt-1 text-sm font-semibold">
                  {fmtCurrency.format(b.listing.pricePerNight)}{" "}
                  <span className="text-xs text-gray-500">/ natt</span>
                </div>
                {paidIds.includes(b.id) && (
                  <div className="mt-1 inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-700">
                    Betald
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Höger: Betalterminal / sammanfattning */}
      <aside className="space-y-4">
        <h2 className="text-lg font-semibold">Betalningsöversikt</h2>
        {!selected ? (
          <p className="text-sm text-gray-600">
            Välj en bokning till vänster för att se betalningsdetaljer.
          </p>
        ) : (
          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm space-y-4">
            <div className="flex gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted">
                <img
                  src={selected.listing.images?.[0] ?? "https://picsum.photos/200/200?blur=2"}
                  alt={selected.listing.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-sm font-semibold line-clamp-2">
                  {selected.listing.title}
                </div>
                <div className="text-xs text-gray-600">{selected.listing.city}</div>
                <div className="text-xs text-gray-500">
                  {formatDate(selected.startDate)} – {formatDate(selected.endDate)}
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span>Pris totalt</span>
                <span className="font-semibold">
                  {fmtCurrency.format(selected.totalPrice)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Skatt & avgifter</span>
                <span>Ingår</span>
              </div>
            </div>

            <div className="border-t border-border pt-3 space-y-2 text-sm">
              <span className="font-medium block">Betalningsmetod</span>
              <div className="flex flex-col gap-1">
                <label className="flex items-center gap-2 text-xs">
                  <input type="radio" name="pay-method" defaultChecked /> Kort (Visa / Mastercard)
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input type="radio" name="pay-method" /> Swish
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input type="radio" name="pay-method" /> Faktura (Klarna)
                </label>
              </div>
            </div>

            {payMessage && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800">
                {payMessage}
              </div>
            )}

            <button
              type="button"
              onClick={handlePay}
              className={`w-full rounded-xl py-2.5 text-sm font-semibold transition ${
                selected && paidIds.includes(selected.id)
                  ? "bg-gray-200 text-gray-500 cursor-default"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {selected && paidIds.includes(selected.id) ? "Redan betald" : "Bekräfta betalning"}
            </button>

            <p className="text-[11px] text-gray-500">
              Detta är en prototyp för skoluppgift. Ingen riktig betalning sker, men flödet
              motsvarar en riktig betalsida.
            </p>
          </div>
        )}
      </aside>
    </section>
  )
}
