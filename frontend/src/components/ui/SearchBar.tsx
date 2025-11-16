import { useState } from "react"

type Props = {
  valueCity: string
  onCityChange: (v: string) => void
}

export default function SearchBar({ valueCity, onCityChange }: Props) {
  const [dateText, setDateText] = useState("31 Okt. - 1 Nov.")
  const [guests, setGuests] = useState("1 resenär, 1 rum")

  return (
    <div className="bg-white/80 backdrop-blur border border-border rounded-2xl p-3">
      <div className="grid gap-2 md:grid-cols-[1fr_1fr_1fr_auto]">
        {/* Destination */}
        <label className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3">
          <div className="text-xs uppercase tracking-wide text-subtext">Destination</div>
          <input
            className="w-full outline-none"
            placeholder="Stockholm, Sverige"
            value={valueCity}
            onChange={(e)=>onCityChange(e.target.value)}
          />
        </label>
        {/* Datum (visuellt – funktions-duglig senare) */}
        <label className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3">
          <div className="text-xs uppercase tracking-wide text-subtext">Datum</div>
          <input
            className="w-full outline-none"
            value={dateText}
            onChange={(e)=>setDateText(e.target.value)}
          />
        </label>
        {/* Gäster */}
        <label className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3">
          <div className="text-xs uppercase tracking-wide text-subtext">Gäster</div>
          <input
            className="w-full outline-none"
            value={guests}
            onChange={(e)=>setGuests(e.target.value)}
          />
        </label>
        {/* Sök */}
        <button className="rounded-xl bg-primary text-white px-6 font-medium">
          Sök
        </button>
      </div>
    </div>
  )
}
