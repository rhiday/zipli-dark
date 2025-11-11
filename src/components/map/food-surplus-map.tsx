"use client"

import React, { useState, useCallback, useEffect } from 'react'
import Map, { Marker, Popup } from 'react-map-gl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, Users, Clock, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DonationGauge } from '@/components/ui/donation-gauge'

interface LocationData {
  geometry: { coordinates: [number, number] };
  properties: {
    id: string;
    name: string;
    type: string;
    donations?: number;
    meals?: number;
    lastDonation?: string;
  };
}

interface LocationPopupProps {
  location: LocationData
  onClose: () => void
}

function LocationPopup({ location, onClose }: LocationPopupProps) {
  const { properties } = location
  
  return (
    <Popup
      longitude={location.geometry.coordinates[0]}
      latitude={location.geometry.coordinates[1]}
      onClose={onClose}
      closeButton={false}
      closeOnClick={false}
      className="mapbox-popup"
    >
      <Card className="w-72 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6 rounded-full"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardHeader className="pb-2 pr-10">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-base">{properties.name}</CardTitle>
            <Badge variant={properties.type === 'receiver' ? 'secondary' : 'default'} className="text-xs">
              {properties.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          {properties.type !== 'receiver' ? (
            <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
              <div className="flex items-center justify-center">
                <DonationGauge donations={properties.donations ?? 0} meals={properties.meals ?? 0} size="sm" showLabel={false} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm font-medium">{properties.donations} donations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">{properties.meals} meals saved</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last activity: {properties.lastDonation}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Popup>
  )
}

export function FoodSurplusMap() {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [restaurantData, setRestaurantData] = useState<{
    features: LocationData[];
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewState, setViewState] = useState({
    longitude: 24.945831,
    latitude: 60.192059,
    zoom: 12
  })

  // Load restaurant data from JSON file
  useEffect(() => {
    async function loadRestaurants() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/data/helsinki-restaurants.json')
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.status}`)
        }
        const data = await response.json()
        if (!data.features || !Array.isArray(data.features)) {
          throw new Error('Invalid data format')
        }
        setRestaurantData(data)
      } catch (error) {
        console.error('Failed to load restaurant data:', error)
        setError(error instanceof Error ? error.message : 'Failed to load map data')
      } finally {
        setLoading(false)
      }
    }
    loadRestaurants()
  }, [])

  const handleMarkerClick = useCallback((e: { originalEvent: { stopPropagation: () => void } }, location: LocationData) => {
    e.originalEvent.stopPropagation()
    setSelectedLocation(location)
  }, [])

  const handleClosePopup = useCallback(() => {
    setSelectedLocation(null)
  }, [])

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.your-mapbox-token-here'
  const hasValidToken = MAPBOX_TOKEN && MAPBOX_TOKEN !== 'pk.your-mapbox-token-here'

  return (
    <div className="w-full h-[500px] rounded-lg border overflow-hidden relative">
      {loading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading restaurants...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-sm text-destructive mb-2">Error: {error}</p>
            <p className="text-xs text-muted-foreground">Check browser console for details</p>
          </div>
        </div>
      )}

      {!hasValidToken && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-sm text-muted-foreground mb-2">Mapbox token not configured</p>
            <p className="text-xs text-muted-foreground">Set NEXT_PUBLIC_MAPBOX_TOKEN in your environment variables</p>
          </div>
        </div>
      )}

      {hasValidToken && !error && (
        <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        onClick={() => setSelectedLocation(null)}
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
      >
        {restaurantData?.features.map((location: LocationData) => (
          <Marker
            key={location.properties.id}
            longitude={location.geometry.coordinates[0]}
            latitude={location.geometry.coordinates[1]}
            onClick={(e) => handleMarkerClick(e, location)}
            style={{ cursor: 'pointer' }}
          >
            <div className={`w-10 h-10 ${location.properties.type === 'receiver' ? 'bg-orange-500' : 'bg-blue-600'} rounded-full border-2 border-white shadow-lg flex items-center justify-center`}>
              {location.properties.type === 'receiver' ? (
                <Users className="h-5 w-5 text-white" />
              ) : (
                <Package className="h-5 w-5 text-white" />
              )}
            </div>
          </Marker>
        ))}

        {selectedLocation && (
          <LocationPopup
            location={selectedLocation}
            onClose={handleClosePopup}
          />
        )}
        </Map>
      )}
    </div>
  )
}
