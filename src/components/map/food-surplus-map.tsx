"use client"

import 'mapbox-gl/dist/mapbox-gl.css'
import React, { useState, useCallback, useEffect } from 'react'
import Map, { Marker, Popup, Source, Layer } from 'react-map-gl'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, Users, X, UtensilsCrossed, Coffee, School, Building2, Flame, Sprout, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DonationGauge } from '@/components/ui/donation-gauge'

interface DonorData {
  id: string;
  name: string;
  type: string;
  category: string;
  coordinates: [number, number];
  totalDonations: number;
  totalMeals: number;
  lastDonation: string;
}

interface ReceiverData {
  id: string;
  name: string;
  type: string;
  organization: string;
  coordinates: [number, number];
  capacity: number;
  receivedDonations: number;
  mealsDistributed: number;
  lastReceived: string;
}

interface LocationData {
  type?: string;
  geometry: { coordinates: [number, number] };
  properties: {
    id: string;
    name: string;
    type: string;
    cuisine?: string;
    donations?: number;
    meals?: number;
    receivedDonations?: number;
    mealsDistributed?: number;
    lastDonation?: string;
    lastReceived?: string;
    markerType?: string;
  };
}

interface LocationPopupProps {
  location: LocationData
  onClose: () => void
}

// Helper function to check if a type is a receiver
function isReceiverType(type: string): boolean {
  return ['receiver', 'food receiver', 'community_center', 'shelter', 'food_bank'].includes(type)
}

// Helper function to get icon and color based on type/cuisine
function getLocationStyle(type: string, cuisine?: string) {
  if (isReceiverType(type)) {
    return {
      icon: Users,
      bgColor: '#5A0057',  // Dark purple for receivers
      label: 'Receiver'
    }
  }
  
  // Producer type
  if (type === 'producer') {
    return {
      icon: Sprout,
      bgColor: '#024209',  // Same green as other donors
      label: 'Producer'
    }
  }
  
  // Supermarket/Hypermarket types
  if (type === 'supermarket' || type === 'hypermarket') {
    return {
      icon: ShoppingCart,
      bgColor: '#024209',  // Same green as other donors
      label: type === 'hypermarket' ? 'Hypermarket' : 'Supermarket'
    }
  }
  
  // All donors use dark green, but different icons
  if (type === 'student restaurant') {
    return {
      icon: UtensilsCrossed,
      bgColor: '#024209',  // Dark green
      label: 'Student Restaurant'
    }
  }
  
  if (type === 'staff restaurant') {
    if (cuisine === 'Cafe') {
      return {
        icon: Coffee,
        bgColor: '#024209',  // Dark green
        label: 'Staff Café'
      }
    }
    return {
      icon: Building2,
      bgColor: '#024209',  // Dark green
      label: 'Staff Restaurant'
    }
  }
  
  if (type === 'school restaurant' || cuisine === 'School Cafeteria') {
    return {
      icon: School,
      bgColor: '#024209',  // Dark green
      label: 'School Cafeteria'
    }
  }
  
  if (cuisine === 'Cafe') {
    return {
      icon: Coffee,
      bgColor: '#024209',  // Dark green
      label: 'Café'
    }
  }
  
  // Default for cafeterias
  return {
    icon: UtensilsCrossed,
    bgColor: '#024209',  // Dark green
    label: 'Cafeteria'
  }
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
            <Badge variant={isReceiverType(properties.type) ? 'secondary' : 'default'} className="text-xs">
              {isReceiverType(properties.type) ? 'receiver' : properties.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-4">
          {!isReceiverType(properties.type) ? (
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
            <div className="grid grid-cols-[auto_1fr] gap-4 items-center">
              <div className="flex items-center justify-center">
                <DonationGauge donations={properties.receivedDonations ?? 0} meals={properties.mealsDistributed ?? 0} size="sm" showLabel={false} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-orange-600 flex-shrink-0" />
                  <span className="text-sm font-medium">{properties.receivedDonations} received</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm font-medium">{properties.mealsDistributed} meals distributed</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Popup>
  )
}

// Legend component
function MapLegend({ showHeatmap, onToggleHeatmap }: { showHeatmap: boolean, onToggleHeatmap: () => void }) {
  const legendItems = [
    { icon: UtensilsCrossed, color: '#024209', label: 'Donors' },
    { icon: Users, color: '#5A0057', label: 'Receivers' },
  ]

  return (
    <Card className="absolute bottom-4 left-4 z-10 shadow-lg">
      <CardContent className="p-3">
        <p className="text-xs font-semibold mb-2 text-muted-foreground">Location Types</p>
        <div className="space-y-1.5">
          {legendItems.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                >
                  <Icon className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-xs">{item.label}</span>
              </div>
            )
          })}
        </div>
        
        {/* Heatmap toggle button */}
        <div className="mt-3 pt-3 border-t border-border">
          <Button
            variant={showHeatmap ? "default" : "outline"}
            size="sm"
            onClick={onToggleHeatmap}
            className="w-full text-xs h-8"
          >
            <Flame className="h-3.5 w-3.5 mr-1.5" />
            {showHeatmap ? 'Hide' : 'Show'} Donation Areas
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function FoodSurplusMap() {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null)
  const [restaurantData, setRestaurantData] = useState<{
    type?: string;
    features: LocationData[];
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [viewState, setViewState] = useState({
    longitude: 24.945831,
    latitude: 60.185,
    zoom: 13 // Initial view (will auto-adjust when data loads)
  })

  // Load donor and receiver data from merged data file
  useEffect(() => {
    async function loadLocations() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/data/dashboard-data.json')
        if (!response.ok) {
          throw new Error(`Failed to load data: ${response.status}`)
        }
        const data = await response.json()
        
        // Transform donors and receivers into GeoJSON format
        const donorFeatures = (data.donors || []).map((donor: DonorData) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: donor.coordinates
          },
          properties: {
            id: donor.id,
            name: donor.name,
            type: donor.type,
            cuisine: donor.category,
            donations: donor.totalDonations,
            meals: donor.totalMeals,
            lastDonation: donor.lastDonation,
            markerType: 'donor'
          }
        }))

        const receiverFeatures = (data.receivers || []).map((receiver: ReceiverData) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: receiver.coordinates
          },
          properties: {
            id: receiver.id,
            name: receiver.name,
            type: receiver.type,
            cuisine: receiver.organization,
            capacity: receiver.capacity,
            receivedDonations: receiver.receivedDonations,
            mealsDistributed: receiver.mealsDistributed,
            lastReceived: receiver.lastReceived,
            markerType: 'receiver'
          }
        }))

        // Load additional location data
        const extraFeatures: LocationData[] = []

        // Load Sodexo restaurants
        try {
          const restaurantsResponse = await fetch('/data/sodexo-helsinki-branches.json')
          if (restaurantsResponse.ok) {
            const restaurantsData = await restaurantsResponse.json()
            if (restaurantsData.features) {
              // Add prefix to ensure unique IDs
              const restaurants = (restaurantsData.features as LocationData[]).map(f => ({
                ...f,
                properties: {
                  ...f.properties,
                  id: `sodexo-${f.properties.id}`
                }
              }))
              extraFeatures.push(...restaurants)
            }
          }
        } catch (error) {
          console.error('Failed to load Sodexo restaurant data:', error)
        }

        // Load producers
        try {
          const producersResponse = await fetch('/data/foodproducers.json')
          if (producersResponse.ok) {
            const producersData = await producersResponse.json()
            if (producersData.features) {
              // Add prefix to ensure unique IDs
              const producers = (producersData.features as LocationData[]).map(f => ({
                ...f,
                properties: {
                  ...f.properties,
                  id: `prod-${f.properties.id}`
                }
              }))
              extraFeatures.push(...producers)
            }
          }
        } catch (error) {
          console.error('Failed to load producer data:', error)
        }

        // Load shops
        try {
          const shopsResponse = await fetch('/data/shopshelsinki.json')
          if (shopsResponse.ok) {
            const shopsData = await shopsResponse.json()
            if (shopsData.features) {
              // Add prefix to ensure unique IDs
              const shops = (shopsData.features as LocationData[]).map(f => ({
                ...f,
                properties: {
                  ...f.properties,
                  id: `shop-${f.properties.id}`
                }
              }))
              extraFeatures.push(...shops)
            }
          }
        } catch (error) {
          console.error('Failed to load shop data:', error)
        }

        const allFeatures: LocationData[] = [...donorFeatures, ...receiverFeatures, ...extraFeatures]
        
        setRestaurantData({
          type: 'FeatureCollection',
          features: allFeatures
        })

        // Auto-detect map view based on data points
        if (allFeatures.length > 0) {
          const allCoords = allFeatures.map(f => f.geometry.coordinates)
          
          const lngs = allCoords.map(c => c[0])
          const lats = allCoords.map(c => c[1])
          
          const bounds = {
            minLng: Math.min(...lngs),
            maxLng: Math.max(...lngs),
            minLat: Math.min(...lats),
            maxLat: Math.max(...lats),
          }
          
          // Calculate center
          const centerLng = (bounds.minLng + bounds.maxLng) / 2
          const centerLat = (bounds.minLat + bounds.maxLat) / 2
          
          // Calculate appropriate zoom level based on bounds
          const lngDiff = bounds.maxLng - bounds.minLng
          const latDiff = bounds.maxLat - bounds.minLat
          const maxDiff = Math.max(lngDiff, latDiff)
          
          // Adjust zoom based on spread of points
          let zoom = 11
          if (maxDiff < 0.05) zoom = 13
          else if (maxDiff < 0.1) zoom = 12
          else if (maxDiff < 0.2) zoom = 11
          else zoom = 10
          
          setViewState({
            longitude: centerLng,
            latitude: centerLat,
            zoom
          })
        }
      } catch (error) {
        console.error('Failed to load location data:', error)
        setError(error instanceof Error ? error.message : 'Failed to load map data')
      } finally {
        setLoading(false)
      }
    }
    loadLocations()
  }, [])

  const handleMarkerClick = useCallback((e: { originalEvent: { stopPropagation: () => void } }, location: LocationData) => {
    e.originalEvent.stopPropagation()
    setSelectedLocation(location)
  }, [])

  const handleClosePopup = useCallback(() => {
    setSelectedLocation(null)
  }, [])

  const toggleHeatmap = useCallback(() => {
    setShowHeatmap(prev => !prev)
  }, [])

  // Prepare heatmap data (all donors - exclude receivers)
  const heatmapData = {
    type: 'FeatureCollection' as const,
    features: (restaurantData?.features || [])
      .filter(f => {
        const isReceiver = isReceiverType(f.properties.type)
        const hasDonations = f.properties.donations && f.properties.donations > 0
        return !isReceiver && hasDonations
      })
      .map(f => ({
        type: 'Feature' as const,
        geometry: f.geometry,
        properties: {
          donations: f.properties.donations || 0
        }
      }))
  }

  // Circle layer for area-based donation visualization
  const circleLayer = {
    id: 'donation-circles',
    type: 'circle' as const,
    paint: {
      // Radius based on donation amount - grows with zoom
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        10, [
          'interpolate',
          ['linear'],
          ['get', 'donations'],
          0, 15,
          500, 30,
          1000, 50,
          1500, 70
        ],
        15, [
          'interpolate',
          ['linear'],
          ['get', 'donations'],
          0, 30,
          500, 60,
          1000, 100,
          1500, 140
        ]
      ],
      // Color gradient: red (low) → amber → yellow → green (high)
      'circle-color': [
        'interpolate',
        ['linear'],
        ['get', 'donations'],
        0, '#ef4444',      // Red - very low
        400, '#f97316',    // Orange - low
        700, '#f59e0b',    // Amber - medium-low
        900, '#eab308',    // Yellow - medium
        1100, '#84cc16',   // Lime - medium-high
        1300, '#22c55e',   // Green - high
        1500, '#16a34a'    // Dark green - very high
      ],
      // Low opacity for nice overlaps
      'circle-opacity': 0.25,
      // Blur for smooth glow effect
      'circle-blur': 0.9,
      // Stroke for definition
      'circle-stroke-width': 1,
      'circle-stroke-color': [
        'interpolate',
        ['linear'],
        ['get', 'donations'],
        0, '#dc2626',
        700, '#f59e0b',
        1300, '#22c55e'
      ],
      'circle-stroke-opacity': 0.4
    }
  }

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.your-mapbox-token-here'
  const hasValidToken = MAPBOX_TOKEN && MAPBOX_TOKEN !== 'pk.your-mapbox-token-here'

  return (
    <div className="w-full h-[500px] rounded-lg border overflow-hidden relative">
      {loading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading donors and receivers...</p>
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
        padding={{ left: 200, right: 50, top: 50, bottom: 50 }}
      >
        {/* Circle layer - rendered when heatmap toggled on */}
        {showHeatmap && (
          <Source type="geojson" data={heatmapData}>
            <Layer {...(circleLayer as unknown as React.ComponentProps<typeof Layer>)} />
          </Source>
        )}

        {restaurantData?.features.map((location: LocationData) => {
          const style = getLocationStyle(location.properties.type, location.properties.cuisine)
          const Icon = style.icon
          
          return (
            <Marker
              key={location.properties.id}
              longitude={location.geometry.coordinates[0]}
              latitude={location.geometry.coordinates[1]}
              onClick={(e) => handleMarkerClick(e, location)}
              style={{ cursor: 'pointer' }}
            >
              <div 
                className="w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                style={{ backgroundColor: style.bgColor }}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
            </Marker>
          )
        })}

        {selectedLocation && (
          <LocationPopup
            location={selectedLocation}
            onClose={handleClosePopup}
          />
        )}
        
        <MapLegend showHeatmap={showHeatmap} onToggleHeatmap={toggleHeatmap} />
        </Map>
      )}
    </div>
  )
}
