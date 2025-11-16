type Props = {
  id?: string
  title: string
  city: string
  pricePerNight: number
  imageUrl: string
  onClick?: () => void
}
export function ListingCard({ title, city, pricePerNight, imageUrl, onClick }: Props) {
  return (
    <button onClick={onClick} className="text-left rounded-card shadow-card bg-bg overflow-hidden border border-border hover:shadow-lg transition">
      <div className="aspect-[4/3] w-full bg-muted">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover"/>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold">{title}</h3>
          <span className="text-[15px] font-semibold">{pricePerNight} kr<span className="text-subtext font-normal">/natt</span></span>
        </div>
        <p className="text-subtext text-sm mt-1">{city}</p>
      </div>
    </button>
  )
}
