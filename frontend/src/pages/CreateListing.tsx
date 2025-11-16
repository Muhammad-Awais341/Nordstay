import { useState } from "react"
import { api } from "../lib/api"
import { useNavigate } from "react-router-dom"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"

export default function CreateListing() {
  const nav = useNavigate()
  const [form, setForm] = useState({
    title: "", description: "", city: "", address: "",
    pricePerNight: 0, maxGuests: 1, imageUrl: ""
  })
  const [err, setErr] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const payload = {
        title: form.title,
        description: form.description,
        city: form.city,
        address: form.address,
        pricePerNight: Number(form.pricePerNight),
        maxGuests: Number(form.maxGuests),
        images: form.imageUrl ? [form.imageUrl] : []
      }
      await api.post("/listings", payload)
      nav("/")
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Kunde inte skapa boende")
    }
  }

  return (
    <form onSubmit={submit} className="max-w-lg space-y-3">
      <h1 className="text-2xl font-semibold">Skapa boende</h1>
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <Input label="Titel" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required/>
      <Input label="Beskrivning" value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
      <Input label="Stad" value={form.city} onChange={e=>setForm({...form, city:e.target.value})} required/>
      <Input label="Adress" value={form.address} onChange={e=>setForm({...form, address:e.target.value})} required/>
      <Input label="Pris per natt (kr)" type="number" value={form.pricePerNight} onChange={e=>setForm({...form, pricePerNight:e.target.valueAsNumber})} required/>
      <Input label="Max gäster" type="number" value={form.maxGuests} onChange={e=>setForm({...form, maxGuests:e.target.valueAsNumber})} required/>
      <Input label="Bild-URL" value={form.imageUrl} onChange={e=>setForm({...form, imageUrl:e.target.value})}/>
      <Button type="submit">Spara</Button>
    </form>
  )
}
