type Props = {
  destination: string
  onDestinationChange: (v: string) => void
  onSearch: () => void
}

export default function SearchBar({ destination, onDestinationChange, onSearch }: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSearch()
      }}
      className="mx-auto mt-6 flex max-w-5xl flex-col gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3 shadow-sm md:flex-row md:items-stretch md:gap-0"
    >

      {/* DESTINATION */}
      <div className="flex flex-1 flex-col justify-center px-2 py-1 md:border-r md:border-slate-200">
        <label className="text-[11px] font-medium text-gray-500">Destination</label>
        <input
          type="text"
          value={destination}
          onChange={(e) => onDestinationChange(e.target.value)}
          placeholder="Skriv t.ex. Stockholm"
          className="w-full border-none bg-transparent p-0 text-sm focus:outline-none"
        />
      </div>

      {/* DATUM */}
      <div className="flex flex-1 flex-col justify-center px-2 py-1 md:border-r md:border-slate-200">
        <label className="text-[11px] font-medium text-gray-500">Datum</label>
        <input
          type="text"
          placeholder="31 Okt. – 1 Nov."
          className="w-full border-none bg-transparent p-0 text-sm focus:outline-none"
        />
      </div>

      {/* GÄSTER */}
      <div className="flex flex-1 flex-col justify-center px-2 py-1">
        <label className="text-[11px] font-medium text-gray-500">Gäster</label>
        <input
          type="text"
          placeholder="1 resenär, 1 rum"
          className="w-full border-none bg-transparent p-0 text-sm focus:outline-none"
        />
      </div>

      {/* SÖK KNAPP */}
      <div className="flex w-full items-stretch justify-end md:w-auto md:pl-3">
        <button
          type="submit"
          className="h-12 w-full rounded-2xl bg-blue-600 px-6 text-sm font-semibold text-white md:w-auto md:self-stretch"
        >
          Sök
        </button>
      </div>

    </form>
  )
}
