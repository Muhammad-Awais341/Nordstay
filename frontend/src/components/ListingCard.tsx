import { NavLink } from "react-router-dom"

type Props = {
  id: string
  image: string
  title: string
  city: string
  dateText: string
  rating: number // t.ex. 4.3
  pricePerNight: number
}

const fmt = new Intl.NumberFormat("sv-SE")

export default function ListingCard({
  id, image, title, city, dateText, rating, pricePerNight
}: Props) {
  return (
    <NavLink
      to={`/listing/${id}`}
      className="block rounded-2xl overflow-hidden border border-border hover:shadow-md transition"
    >
      <div className="aspect-[4/3] bg-muted">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e)=>{ (e.currentTarget as HTMLImageElement).src = "https://picsum.photos/600/450?grayscale" }}
          loading="lazy"
        />
      </div>
      <div className="p-3">
        <div className="font-semibold line-clamp-1">{title}</div>
        <div className="text-sm text-subtext">{city}</div>
        <div className="text-sm text-subtext">{dateText}</div>
        <div className="text-sm mt-1"> {rating.toFixed(1)} ★</div>
        <div className="mt-1 font-semibold">
          {fmt.format(pricePerNight)} SEK <span className="text-sm text-subtext">för 1 natt</span>
        </div>
      </div>
    </NavLink>
  )
}
