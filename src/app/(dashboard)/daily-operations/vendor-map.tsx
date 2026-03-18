"use client"

import 'mapbox-gl/dist/mapbox-gl.css'
import React, { useState, useEffect } from 'react'
import Map, { Marker, Popup } from 'react-map-gl'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Vendor {
  id: string
  name: string
  coordinates: [number, number]
  wasteRatio: number
  monthlyOrders: number
  monthlyWaste: number
}

interface Buyer {
  coordinates: [number, number]
  name: string
}

interface VendorMapProps {
  onVendorClick?: (vendorId: string) => void
}

export function VendorMap({ onVendorClick }: VendorMapProps) {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [buyer, setBuyer] = useState<Buyer | null>(null)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/dashboard-data.json')
        const data = await response.json()
        setVendors(data.vendors)
        setBuyer(data.buyer)
      } catch (error) {
        console.error('Failed to load map data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return <div>Loading map...</div>
  }

  const getMarkerColor = (wasteRatio: number) => {
    if (wasteRatio < 5) return '#10b981' // green
    if (wasteRatio < 8) return '#f59e0b' // amber
    return '#ef4444' // red
  }

  // Center map on buyer location
  const mapCenter = buyer ? { lng: buyer.coordinates[0], lat: buyer.coordinates[1] } : { lng: 24.94, lat: 60.17 }

  return (
    <Map
      initialViewState={{
        longitude: mapCenter.lng,
        latitude: mapCenter.lat,
        zoom: 11,
      }}
      style={{ width: '100%', height: '500px', borderRadius: '8px' }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''}
    >
      {/* Buyer location marker */}
      {buyer && (
        <Marker
          longitude={buyer.coordinates[0]}
          latitude={buyer.coordinates[1]}
          anchor="bottom"
        >
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
            <div className="text-xs font-bold bg-blue-500 text-white px-2 py-1 rounded mt-1 whitespace-nowrap">
              {buyer.name}
            </div>
          </div>
        </Marker>
      )}

      {/* Vendor location markers */}
      {vendors.map((vendor) => (
        <Marker
          key={vendor.id}
          longitude={vendor.coordinates[0]}
          latitude={vendor.coordinates[1]}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation()
            setSelectedVendor(vendor)
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedVendor(vendor)
            }}
            className="cursor-pointer"
          >
            <div
              className="w-5 h-5 rounded-full border-2 border-white shadow-lg transition-transform hover:scale-125"
              style={{ backgroundColor: getMarkerColor(vendor.wasteRatio) }}
            />
          </button>
        </Marker>
      ))}

      {/* Vendor popup */}
      {selectedVendor && (
        <Popup
          longitude={selectedVendor.coordinates[0]}
          latitude={selectedVendor.coordinates[1]}
          onClose={() => setSelectedVendor(null)}
          closeButton={true}
          closeOnClick={false}
          className="mapbox-popup"
        >
          <div className="p-4 w-72 bg-slate-900/95 backdrop-blur-sm rounded-lg">
            <div className="font-semibold text-sm mb-2 flex items-center justify-between">
              <span className="text-white">{selectedVendor.name}</span>
              <div className="bg-opacity-80 px-2.5 py-1 rounded-full" style={{
                backgroundColor: selectedVendor.wasteRatio < 5 ? 'rgba(16, 185, 129, 0.8)' : selectedVendor.wasteRatio < 8 ? 'rgba(251, 146, 60, 0.8)' : 'rgba(239, 68, 68, 0.8)'
              }}>
                <span className="text-white text-xs font-semibold">{selectedVendor.wasteRatio.toFixed(1)}%</span>
              </div>
            </div>
            <div className="space-y-1.5 text-xs mb-4">
              <p className="text-gray-300">Monthly Ordered: <span className="text-white font-semibold">€{selectedVendor.monthlyOrders}</span></p>
              <p className="text-gray-300">Monthly Wasted: <span className="text-white font-semibold">{selectedVendor.monthlyWaste} kg</span></p>
            </div>
            <Button
              onClick={() => {
                onVendorClick?.(selectedVendor.id)
                setSelectedVendor(null)
              }}
              className="w-full text-xs h-8"
            >
              View Details
            </Button>
          </div>
        </Popup>
      )}

      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-white p-3 rounded-lg shadow-lg border border-gray-300">
        <p className="text-xs font-semibold mb-2 text-gray-900">Waste Ratio</p>
        <div className="space-y-2 text-xs text-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>&lt; 5% (Excellent)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span>5-8% (Good)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>&gt; 8% (Needs Work)</span>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-200">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Your Café</span>
          </div>
        </div>
      </div>
    </Map>
  )
}
