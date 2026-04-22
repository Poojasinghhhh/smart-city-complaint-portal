"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, Crosshair, Loader2 } from "lucide-react"

interface LocationPickerProps {
  latitude: number | null
  longitude: number | null
  onLocationChange: (lat: number, lng: number, address?: string) => void
}

export function LocationPicker({ latitude, longitude, onLocationChange }: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<L.Map | null>(null)
  const [marker, setMarker] = useState<L.Marker | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [leaflet, setLeaflet] = useState<typeof import("leaflet") | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const loadLeaflet = async () => {
      const L = await import("leaflet")
      
      // Fix for default marker icons
      delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      setLeaflet(L)
    }

    loadLeaflet()
  }, [])

  useEffect(() => {
    if (!leaflet || !mapRef.current || map) return

    // Default to India center if no location
    const defaultLat = latitude || 20.5937
    const defaultLng = longitude || 78.9629
    const defaultZoom = latitude && longitude ? 15 : 5

    const newMap = leaflet.map(mapRef.current).setView([defaultLat, defaultLng], defaultZoom)

    leaflet.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(newMap)

    // Add click handler
    newMap.on("click", async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng
      updateMarker(lat, lng, newMap)
    })

    setMap(newMap)

    return () => {
      newMap.remove()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaflet])

  useEffect(() => {
    if (map && leaflet && latitude && longitude) {
      updateMarker(latitude, longitude, map, false)
      map.setView([latitude, longitude], 15)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude, map, leaflet])

  const updateMarker = async (lat: number, lng: number, mapInstance: L.Map, fetchAddress = true) => {
    if (!leaflet) return

    if (marker) {
      marker.remove()
    }

    const newMarker = leaflet.marker([lat, lng]).addTo(mapInstance)
    setMarker(newMarker)

    if (fetchAddress) {
      // Reverse geocode
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        )
        const data = await res.json()
        onLocationChange(lat, lng, data.display_name)
      } catch {
        onLocationChange(lat, lng)
      }
    }
  }

  const detectLocation = () => {
    if (!navigator.geolocation) return

    setIsLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lng } = position.coords
        if (map && leaflet) {
          map.setView([lat, lng], 15)
          updateMarker(lat, lng, map)
        }
        setIsLoading(false)
      },
      (err) => {
        console.error("Geolocation error:", err)
        setIsLoading(false)
      },
      { enableHighAccuracy: true }
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {latitude && longitude ? (
            <span>Location selected</span>
          ) : (
            <span>Click on the map or detect your location</span>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={detectLocation}
          disabled={isLoading}
          className="gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Crosshair className="h-4 w-4" />
          )}
          Detect Location
        </Button>
      </div>
      <div
        ref={mapRef}
        className="h-64 rounded-lg border border-border overflow-hidden"
        style={{ background: "var(--muted)" }}
      />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
    </div>
  )
}
