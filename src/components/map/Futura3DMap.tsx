import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as maplibregl from 'maplibre-gl';
import type { Map as MapLibreMap, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  Search, 
  SlidersHorizontal, 
  Plus, 
  Minus, 
  Mountain, 
  Layers, 
  Crosshair, 
  Navigation, 
  Bookmark, 
  Share2, 
  X, 
  ArrowUpRight, 
  Check, 
  Sparkles,
  Building2,
  TrendingUp,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { sound } from '../../utils/sound';

export interface LocationData {
  id: string;
  name: string;
  subtitle: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
    formatted: string;
  };
  thumbnail: string;
  category: 'Campus' | 'Commercial' | 'Residential' | 'Metro';
  indicativePricePerSqFt: number; // in INR
  propertyType: string;
  typicalHomePrice: number; // in INR
  estimatedRent: number; // in INR / mo
  affordabilityStatus: 'High Budget Fit' | 'Moderate Gap' | 'Long-term Goal';
  connectivity: string;
}

export const FEATURED_LOCATIONS: LocationData[] = [
  {
    id: 'vit-vellore',
    name: 'VIT Vellore',
    subtitle: 'Vellore, Tamil Nadu, India',
    state: 'Tamil Nadu',
    coordinates: {
      lat: 12.9698,
      lng: 79.1592,
      formatted: '12.9698° N, 79.1592° E'
    },
    thumbnail: 'https://images.unsplash.com/photo-1562774053-701939374585?w=500&auto=format&fit=crop&q=80',
    category: 'Campus',
    indicativePricePerSqFt: 4850,
    propertyType: '1-2 BHK Campus Apartment',
    typicalHomePrice: 3800000,
    estimatedRent: 11000,
    affordabilityStatus: 'High Budget Fit',
    connectivity: 'Katpadi Junction (3.2 km) · NH-48 Highway Access'
  },
  {
    id: 'mumbai-csmt',
    name: 'CSMT & Fort Heritage',
    subtitle: 'South Mumbai, Maharashtra, India',
    state: 'Maharashtra',
    coordinates: {
      lat: 18.9401,
      lng: 72.8354,
      formatted: '18.9401° N, 72.8354° E'
    },
    thumbnail: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500&auto=format&fit=crop&q=80',
    category: 'Commercial',
    indicativePricePerSqFt: 45000,
    propertyType: 'Heritage Apartment / Commercial Hub',
    typicalHomePrice: 32000000,
    estimatedRent: 65000,
    affordabilityStatus: 'Long-term Goal',
    connectivity: 'CSMT Terminus · Eastern Freeway · Harbor & Central Line'
  },
  {
    id: 'mumbai-bandra',
    name: 'Bandra West (Pali Hill)',
    subtitle: 'Western Suburbs, Mumbai, India',
    state: 'Maharashtra',
    coordinates: {
      lat: 19.0596,
      lng: 72.8295,
      formatted: '19.0596° N, 72.8295° E'
    },
    thumbnail: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&auto=format&fit=crop&q=80',
    category: 'Residential',
    indicativePricePerSqFt: 38000,
    propertyType: '2 BHK Coastal Sea-Breeze Flat',
    typicalHomePrice: 24500000,
    estimatedRent: 55000,
    affordabilityStatus: 'Long-term Goal',
    connectivity: 'Bandra-Worli Sea Link · Western Railway · Metro Line 2B'
  },
  {
    id: 'mumbai-andheri',
    name: 'Andheri West (Lokhandwala)',
    subtitle: 'Western Suburbs, Mumbai, India',
    state: 'Maharashtra',
    coordinates: {
      lat: 19.1363,
      lng: 72.8277,
      formatted: '19.1363° N, 72.8277° E'
    },
    thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&auto=format&fit=crop&q=80',
    category: 'Residential',
    indicativePricePerSqFt: 24000,
    propertyType: '1.5 BHK Compact City Flat',
    typicalHomePrice: 14500000,
    estimatedRent: 38000,
    affordabilityStatus: 'Moderate Gap',
    connectivity: 'Andheri Metro Line 1 & Line 7 · Western Express Highway'
  },
  {
    id: 'mumbai-kandivali',
    name: 'Kandivali East (Thakur Village)',
    subtitle: 'North Western Suburbs, Mumbai, India',
    state: 'Maharashtra',
    coordinates: {
      lat: 19.2085,
      lng: 72.8715,
      formatted: '19.2085° N, 72.8715° E'
    },
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=80',
    category: 'Residential',
    indicativePricePerSqFt: 18500,
    propertyType: '1 BHK Modern High-rise Apartment',
    typicalHomePrice: 8500000,
    estimatedRent: 26000,
    affordabilityStatus: 'Moderate Gap',
    connectivity: 'Western Express Highway · Borivali/Kandivali Railway'
  },
  {
    id: 'mumbai-borivali',
    name: 'Borivali West (IC Colony)',
    subtitle: 'North Western Suburbs, Mumbai, India',
    state: 'Maharashtra',
    coordinates: {
      lat: 19.2307,
      lng: 72.8567,
      formatted: '19.2307° N, 72.8567° E'
    },
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&auto=format&fit=crop&q=80',
    category: 'Residential',
    indicativePricePerSqFt: 17200,
    propertyType: '1 BHK Quiet Garden Residence',
    typicalHomePrice: 7800000,
    estimatedRent: 24000,
    affordabilityStatus: 'Moderate Gap',
    connectivity: 'Borivali Outstation Terminus · Metro Line 2A & Line 7'
  }
];

type MapStyleMode = 'Map' | 'Satellite' | '3D';

interface Futura3DMapProps {
  onSelectLocation?: (loc: LocationData) => void;
  className?: string;
}

export const Futura3DMap: React.FC<Futura3DMapProps> = ({ 
  onSelectLocation,
  className = '' 
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<Marker | null>(null);

  // Active View States
  const [styleMode, setStyleMode] = useState<MapStyleMode>('3D');
  const [selectedLocation, setSelectedLocation] = useState<LocationData>(FEATURED_LOCATIONS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCardVisible, setIsCardVisible] = useState<boolean>(true);
  const [bearing, setBearing] = useState<number>(-25);
  const [pitch, setPitch] = useState<number>(60);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [showDirectionsModal, setShowDirectionsModal] = useState<boolean>(false);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  // Initialize MapLibre GL 3D Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // ESRI World Imagery (Crystal clear, genuine satellite photography, 100% token-free)
    const satelliteStyle = {
      version: 8 as const,
      sources: {
        'esri-satellite': {
          type: 'raster' as const,
          tiles: [
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          ],
          tileSize: 256,
          attribution: 'Esri, Maxar, Earthstar Geographics'
        }
      },
      layers: [
        {
          id: 'satellite-layer',
          type: 'raster' as const,
          source: 'esri-satellite',
          minzoom: 0,
          maxzoom: 22
        }
      ]
    };

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: satelliteStyle,
      center: [selectedLocation.coordinates.lng, selectedLocation.coordinates.lat],
      zoom: 16.5,
      pitch: 60,
      bearing: -25,
      maxPitch: 85,
      attributionControl: false
    });

    mapRef.current = map;

    map.on('load', () => {
      setMapLoaded(true);

      // Create Custom 3D Gold Pin Marker
      const el = document.createElement('div');
      el.className = 'futura-map-marker-container cursor-pointer';
      el.innerHTML = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
          <!-- Pin Head with Golden Aura Glow -->
          <div style="
            width: 32px; 
            height: 32px; 
            background: linear-gradient(135deg, #FFF4DC 0%, #E6C17D 50%, #C5A059 100%); 
            border-radius: 50% 50% 50% 0; 
            transform: rotate(-45deg); 
            box-shadow: 0 0 24px rgba(230, 193, 125, 0.7), 0 8px 16px rgba(0, 0, 0, 0.9);
            border: 2px solid #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="width: 10px; height: 10px; border-radius: 50%; background: #090A0C; transform: rotate(45deg);"></div>
          </div>
          <!-- Ground Target Ring -->
          <div style="
            width: 16px; 
            height: 6px; 
            background: rgba(230, 193, 125, 0.45); 
            border-radius: 50%; 
            margin-top: -2px; 
            box-shadow: 0 0 10px #E6C17D;
          "></div>
        </div>
      `;

      el.addEventListener('click', () => {
        sound.playClick();
        setIsCardVisible(true);
      });

      markerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat([selectedLocation.coordinates.lng, selectedLocation.coordinates.lat])
        .addTo(map);
    });

    map.on('rotate', () => {
      setBearing(Math.round(map.getBearing()));
    });

    map.on('pitch', () => {
      setPitch(Math.round(map.getPitch()));
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update map camera & marker when selectedLocation changes
  const flyToLocation = useCallback((loc: LocationData) => {
    setSelectedLocation(loc);
    setIsCardVisible(true);
    setIsSearchOpen(false);
    setSearchQuery('');
    if (onSelectLocation) onSelectLocation(loc);

    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [loc.coordinates.lng, loc.coordinates.lat],
        zoom: 16.5,
        pitch: styleMode === 'Map' ? 0 : 60,
        bearing: -25,
        essential: true,
        duration: 2200
      });
    }

    if (markerRef.current) {
      markerRef.current.setLngLat([loc.coordinates.lng, loc.coordinates.lat]);
    }
  }, [styleMode, onSelectLocation]);

  // Handle Style Switcher: Map vs Satellite vs 3D
  const handleStyleChange = (mode: MapStyleMode) => {
    sound.playClick();
    setStyleMode(mode);

    if (!mapRef.current) return;

    if (mode === '3D') {
      mapRef.current.easeTo({
        pitch: 60,
        bearing: -25,
        duration: 1000
      });
    } else if (mode === 'Satellite') {
      mapRef.current.easeTo({
        pitch: 0,
        bearing: 0,
        duration: 1000
      });
    } else if (mode === 'Map') {
      mapRef.current.easeTo({
        pitch: 0,
        bearing: 0,
        duration: 1000
      });
    }
  };

  // Zoom In / Out
  const handleZoom = (delta: number) => {
    sound.playClick();
    if (!mapRef.current) return;
    if (delta > 0) {
      mapRef.current.zoomIn({ duration: 300 });
    } else {
      mapRef.current.zoomOut({ duration: 300 });
    }
  };

  // Reset Compass / North Bearing
  const handleResetBearing = () => {
    sound.playClick();
    if (!mapRef.current) return;
    mapRef.current.easeTo({
      bearing: 0,
      duration: 600
    });
  };

  // Toggle Pitch 3D / 2D
  const handleTogglePitch = () => {
    sound.playClick();
    if (!mapRef.current) return;
    const nextPitch = pitch > 20 ? 0 : 60;
    mapRef.current.easeTo({
      pitch: nextPitch,
      bearing: nextPitch === 0 ? 0 : -25,
      duration: 800
    });
    setPitch(nextPitch);
    if (nextPitch === 60) setStyleMode('3D');
    else setStyleMode('Satellite');
  };

  // Filtered Search Results
  const searchResults = FEATURED_LOCATIONS.filter((loc) => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`relative w-full h-full min-h-[580px] bg-[#07080A] overflow-hidden select-none font-sans ${className}`}>
      
      {/* 1. ACTUAL INTERACTIVE WEBGL 3D MAP CANVAS */}
      <div 
        ref={mapContainerRef} 
        className="absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing"
      />

      {/* Subtle vignette border gradient overlay matching FUTURA cinematic aesthetic */}
      <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_80px_rgba(0,0,0,0.7)]" />

      {/* 2. FLOATING TOP CENTER SEARCH BAR (Matching Reference Image) */}
      <div className="absolute top-4 sm:top-5 inset-x-0 mx-auto w-full max-w-[460px] lg:max-w-[520px] px-4 z-30">
        <div className="relative">
          <div className="flex items-center w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-2xl bg-[#0E1015]/85 hover:bg-[#14171E]/95 border border-white/10 hover:border-white/20 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.85)] transition-all">
            <Search className="w-4 h-4 text-[#A6AFBD] shrink-0 mr-2.5" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              placeholder="Search for a location, city, campus or landmark..."
              className="w-full bg-transparent text-xs sm:text-sm text-[#F5F3EF] placeholder-[#7E8592] outline-none"
            />
            {searchQuery ? (
              <button 
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full text-[#A6AFBD] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button 
                onClick={() => sound.playClick()}
                className="p-1.5 rounded-lg text-[#A6AFBD] hover:text-[#E6C17D] transition-colors cursor-pointer"
                title="Filter locations"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Search Dropdown Suggestions */}
          {isSearchOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-[#12141A]/95 border border-white/15 backdrop-blur-2xl shadow-2xl overflow-hidden animate-fadeIn z-40 max-h-72 overflow-y-auto">
              <div className="p-2 border-b border-white/10 flex items-center justify-between text-[11px] text-[#A6AFBD] px-3 font-mono">
                <span>SUGGESTED CORRIDORS & CAMPUSES</span>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="py-1">
                {searchResults.length > 0 ? (
                  searchResults.map((loc) => (
                    <button
                      key={loc.id}
                      onClick={() => {
                        sound.playClick();
                        flyToLocation(loc);
                      }}
                      className="w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-white/[0.08] transition-colors cursor-pointer text-left group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl overflow-hidden bg-[#1E222A] shrink-0 border border-white/10 group-hover:border-[#E6C17D]/50 transition-colors">
                          <img 
                            src={loc.thumbnail} 
                            alt={loc.name}
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-white group-hover:text-[#E6C17D] transition-colors">
                            {loc.name}
                          </p>
                          <p className="text-[11px] text-[#8E929C]">
                            {loc.subtitle}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#E6C17D]">
                        ₹{loc.indicativePricePerSqFt.toLocaleString('en-IN')}/sq.ft
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-[#8E929C]">
                    No locations matching "{searchQuery}"
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. FLOATING TOP RIGHT STYLE SELECTOR PILLS (Map | Satellite | 3D) */}
      <div className="absolute top-4 sm:top-5 right-4 sm:right-6 z-30 flex items-center">
        <div className="p-1 rounded-2xl bg-[#0E1015]/85 border border-white/10 backdrop-blur-xl shadow-lg flex items-center space-x-1">
          {(['Map', 'Satellite', '3D'] as const).map((mode) => {
            const isActive = styleMode === mode;
            return (
              <button
                key={mode}
                onClick={() => handleStyleChange(mode)}
                className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#E6C17D] text-[#08090B] font-bold shadow-md'
                    : 'text-[#A6AFBD] hover:text-white hover:bg-white/5'
                }`}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. FLOATING RIGHT NAVIGATION STACK (Compass, Zoom, 3D, Layers, Center) */}
      <div className="absolute right-4 sm:right-6 top-20 sm:top-24 z-30 flex flex-col items-center space-y-2">
        {/* Compass Button */}
        <button
          onClick={handleResetBearing}
          className="w-10 h-10 rounded-2xl bg-[#0E1015]/85 border border-white/10 hover:border-white/25 hover:bg-[#1C2029] backdrop-blur-xl text-white shadow-xl flex items-center justify-center transition-all cursor-pointer group"
          title="Reset North orientation"
        >
          <div 
            className="transition-transform duration-200"
            style={{ transform: `rotate(${-bearing}deg)` }}
          >
            {/* Real Compass Needle */}
            <div className="w-4 h-4 relative flex items-center justify-center">
              <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-b-[8px] border-b-[#E27D78] absolute top-0" />
              <div className="w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[8px] border-t-white absolute bottom-0" />
            </div>
          </div>
        </button>

        {/* Zoom In (+) */}
        <button
          onClick={() => handleZoom(1)}
          className="w-10 h-10 rounded-2xl bg-[#0E1015]/85 border border-white/10 hover:border-white/25 hover:bg-[#1C2029] backdrop-blur-xl text-[#F5F3EF] shadow-xl flex items-center justify-center transition-all cursor-pointer active:scale-95"
          title="Zoom in"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Zoom Out (-) */}
        <button
          onClick={() => handleZoom(-1)}
          className="w-10 h-10 rounded-2xl bg-[#0E1015]/85 border border-white/10 hover:border-white/25 hover:bg-[#1C2029] backdrop-blur-xl text-[#F5F3EF] shadow-xl flex items-center justify-center transition-all cursor-pointer active:scale-95"
          title="Zoom out"
        >
          <Minus className="w-4 h-4" />
        </button>

        {/* 3D Terrain / Pitch Toggle */}
        <button
          onClick={handleTogglePitch}
          className={`w-10 h-10 rounded-2xl border backdrop-blur-xl shadow-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
            pitch > 30 
              ? 'bg-[#E6C17D]/20 border-[#E6C17D] text-[#E6C17D]' 
              : 'bg-[#0E1015]/85 border-white/10 text-[#A6AFBD] hover:text-white hover:border-white/25 hover:bg-[#1C2029]'
          }`}
          title="Toggle 3D aerial tilt"
        >
          <Mountain className="w-4 h-4" />
        </button>

        {/* Layers / Styles Switcher */}
        <button
          onClick={() => {
            sound.playClick();
            handleStyleChange(styleMode === '3D' ? 'Map' : styleMode === 'Map' ? 'Satellite' : '3D');
          }}
          className="w-10 h-10 rounded-2xl bg-[#0E1015]/85 border border-white/10 hover:border-white/25 hover:bg-[#1C2029] backdrop-blur-xl text-[#A6AFBD] hover:text-white shadow-xl flex items-center justify-center transition-all cursor-pointer active:scale-95"
          title="Cycle map layers"
        >
          <Layers className="w-4 h-4" />
        </button>

        {/* Recenter Location Button */}
        <button
          onClick={() => flyToLocation(selectedLocation)}
          className="w-10 h-10 rounded-2xl bg-[#0E1015]/85 border border-white/10 hover:border-white/25 hover:bg-[#1C2029] backdrop-blur-xl text-[#A6AFBD] hover:text-[#E6C17D] shadow-xl flex items-center justify-center transition-all cursor-pointer active:scale-95"
          title="Center on target"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* 5. FLOATING BOTTOM-LEFT LOCATION DETAIL CARD (Matching Reference Image) */}
      {isCardVisible && (
        <div className="absolute bottom-5 left-4 sm:left-6 z-30 w-full max-w-[340px] sm:max-w-[380px] animate-slideUp">
          <div className="p-4 rounded-2xl bg-[#12141A]/90 border border-white/15 backdrop-blur-2xl shadow-[0_16px_48px_rgba(0,0,0,0.9)] space-y-3.5">
            {/* Top row: Thumbnail + Title + Close */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#1E222A] shrink-0 border border-white/20 shadow-md">
                  <img 
                    src={selectedLocation.thumbnail} 
                    alt={selectedLocation.name}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#F5F3EF] leading-tight">
                    {selectedLocation.name}
                  </h3>
                  <p className="text-xs text-[#A6AFBD] mt-0.5">
                    {selectedLocation.subtitle}
                  </p>
                  <p className="text-[10px] font-mono text-[#D5B477] mt-0.5">
                    {selectedLocation.coordinates.formatted}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  sound.playClick();
                  setIsCardVisible(false);
                }}
                className="p-1 rounded-lg text-[#A6AFBD] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Dismiss location details"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Pricing & Affordability Badge */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-left">
                <span className="text-[10px] text-[#8E929C] block">Indicative Rate</span>
                <span className="font-mono font-bold text-xs sm:text-sm text-[#F5F3EF]">
                  ₹{selectedLocation.indicativePricePerSqFt.toLocaleString('en-IN')}<span className="text-[10px] font-normal text-[#8E929C]">/sq.ft</span>
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-left">
                <span className="text-[10px] text-[#8E929C] block">Typical Cost</span>
                <span className="font-mono font-bold text-xs sm:text-sm text-[#E6C17D]">
                  ₹{(selectedLocation.typicalHomePrice / 100000).toFixed(1)} Lakhs
                </span>
              </div>
            </div>

            {/* 4 Iconic Action Buttons matching Reference: Directions | Save | Nearby | Share */}
            <div className="flex items-center space-x-2 pt-1">
              {/* Primary Directions Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  setShowDirectionsModal(true);
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#E6C17D] hover:bg-[#F0D399] text-[#08090B] font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-md active:scale-95"
              >
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Directions</span>
              </button>

              {/* Save Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  setIsSaved(!isSaved);
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition-all cursor-pointer border ${
                  isSaved
                    ? 'bg-[#80C9A0]/20 border-[#80C9A0]/50 text-[#80C9A0]'
                    : 'bg-[#1C1F26] hover:bg-[#252A34] border-white/10 text-[#F5F3EF]'
                }`}
                title="Save location to goals"
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              {/* Nearby Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  setShowDirectionsModal(true);
                }}
                className="py-2.5 px-3 rounded-xl bg-[#1C1F26] hover:bg-[#252A34] border border-white/10 text-[#F5F3EF] text-xs font-semibold flex items-center justify-center space-x-1 transition-all cursor-pointer"
                title="Explore nearby transit and prices"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Nearby</span>
              </button>

              {/* Share Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  if (navigator.share) {
                    navigator.share({
                      title: `FUTURA 3D Map — ${selectedLocation.name}`,
                      text: `Check out property intelligence for ${selectedLocation.name} (${selectedLocation.coordinates.formatted}) on FUTURA`,
                      url: window.location.href
                    }).catch(() => {});
                  } else {
                    navigator.clipboard.writeText(`${selectedLocation.name} (${selectedLocation.coordinates.formatted}) - FUTURA Property Intelligence`);
                    alert('Location details copied to clipboard!');
                  }
                }}
                className="py-2.5 px-3 rounded-xl bg-[#1C1F26] hover:bg-[#252A34] border border-white/10 text-[#F5F3EF] text-xs font-semibold flex items-center justify-center space-x-1 transition-all cursor-pointer"
                title="Share location"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: DETAILED DIRECTIONS & AREA INVESTMENT INTELLIGENCE */}
      {showDirectionsModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowDirectionsModal(false)}
        >
          <div 
            className="w-full max-w-lg bg-[#12141A] border border-[#30343C] rounded-2xl p-6 shadow-2xl space-y-5 animate-slideUp text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#20232A] to-[#15171C] border border-[#E6C17D]/40 flex items-center justify-center text-[#E6C17D]">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#F5F3EF]">
                    {selectedLocation.name}
                  </h3>
                  <p className="text-xs text-[#A6AFBD]">
                    Area Property Affordability & Connectivity
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDirectionsModal(false)}
                className="w-8 h-8 rounded-full bg-[#20232A] text-[#A6AFBD] hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#191C23] border border-[#30343C]/60 space-y-1">
                <span className="text-[#8E929C] text-[10px] block">Location Type</span>
                <span className="font-semibold text-white">{selectedLocation.propertyType}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#191C23] border border-[#30343C]/60 space-y-1">
                <span className="text-[#8E929C] text-[10px] block">Estimated Monthly Rent</span>
                <span className="font-semibold text-[#80C9A0]">₹{selectedLocation.estimatedRent.toLocaleString('en-IN')}/mo</span>
              </div>
              <div className="p-3 rounded-xl bg-[#191C23] border border-[#30343C]/60 space-y-1">
                <span className="text-[#8E929C] text-[10px] block">Transit Connectivity</span>
                <span className="font-semibold text-white truncate block">{selectedLocation.connectivity}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#191C23] border border-[#30343C]/60 space-y-1">
                <span className="text-[#8E929C] text-[10px] block">FUTURA Affordability Status</span>
                <span className="font-semibold text-[#E6C17D]">{selectedLocation.affordabilityStatus}</span>
              </div>
            </div>

            {/* Educational Disclaimer */}
            <div className="p-3 rounded-xl bg-[#171A20] border border-[#30343C]/60 text-[11px] text-[#A6AFBD] leading-relaxed flex items-start space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#80C9A0] shrink-0 mt-0.5" />
              <span>
                <strong>Educational Property Planning:</strong> Indicative prices represent historical neighbourhood medians. Actual purchase requires down payment verification, emergency buffer retention, and formal mortgage qualification.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center space-x-3 pt-1">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowDirectionsModal(false);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs bg-[#20232A] hover:bg-[#282C35] border border-[#30343C] text-[#F5F3EF] transition-all cursor-pointer text-center"
              >
                Close
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setShowDirectionsModal(false);
                  setIsSaved(true);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-[#E6C17D] text-[#08090B] hover:bg-[#F0D399] transition-all cursor-pointer text-center shadow-md"
              >
                Set as Home Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
