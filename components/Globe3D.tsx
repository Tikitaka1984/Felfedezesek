
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { routes, cities, empires } from '../data/mapData';

// Access the global Cesium object
declare const Cesium: any;

interface Globe3DProps {
  onExplorerSelect: (explorerId: string) => void;
  visibleRouteIds: string[];
  selectedExplorerId: string | null;
  showCities: boolean;
  showEmpires: boolean;
  currentYear: number;
  showTerritories: boolean;
}

const getRouteYearRange = (yearStr: string) => {
  const parts = yearStr.split('-').map(s => parseInt(s.trim()));
  return {
    start: parts[0],
    end: parts.length > 1 ? parts[1] : parts[0]
  };
};

const Globe3D: React.FC<Globe3DProps> = ({
  onExplorerSelect,
  visibleRouteIds,
  selectedExplorerId,
  showCities,
  showEmpires,
  currentYear,
  showTerritories
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const dataSourcesRef = useRef<any>(null);

  // Initialize Cesium Viewer
  useEffect(() => {
    if (!containerRef.current) return;

    // Set Base URL for 1.104
    const CESIUM_URL = "https://cesium.com/downloads/cesiumjs/releases/1.104/Build/Cesium/";
    try {
        if (Cesium.buildModuleUrl) {
            Cesium.buildModuleUrl.setBaseUrl(CESIUM_URL);
        }
    } catch (e) {
        console.warn("Cesium base URL might already be set", e);
    }

    const viewer = new Cesium.Viewer(containerRef.current, {
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      vrButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
      skyBox: false, // Remove starry sky
      skyAtmosphere: false, // Remove atmosphere halo for cleaner look
      contextOptions: {
        webgl: {
          alpha: true,
        }
      },
      imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
      })
    });

    viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#f3f4f6'); // Tailwind gray-100
    viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#cce6ff'); // Ocean color fallback

    // Disable lighting to avoid dark side of the earth
    viewer.scene.globe.enableLighting = false;
    viewer.scene.highDynamicRange = false;
    
    // Allow transparency
    viewer.scene.globe.translucency.enabled = true;

    // Create a CustomDataSource for our entities
    const dataSource = new Cesium.CustomDataSource('explorerData');
    viewer.dataSources.add(dataSource);
    dataSourcesRef.current = dataSource;
    viewerRef.current = viewer;

    // Initial camera position
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(-20, 20, 20000000)
    });

    return () => {
      viewer.destroy();
    };
  }, []);

  // Update Entities (Routes, Ships, Cities)
  useEffect(() => {
    if (!viewerRef.current || !dataSourcesRef.current) return;

    const dataSource = dataSourcesRef.current;
    const entities = dataSource.entities;
    
    // We will manage entities by ID to avoid full recreation if possible, 
    // but for simplicity with changing props, we'll update properties or recreate.
    // To prevent flickering, we update existing ones.
    
    // 1. CITIES
    if (showCities) {
        cities.forEach(city => {
            const id = `city-${city.name}`;
            let entity = entities.getById(id);
            if (!entity) {
                entities.add({
                    id,
                    position: Cesium.Cartesian3.fromDegrees(city.coords[0], city.coords[1]),
                    point: {
                        pixelSize: 6,
                        color: Cesium.Color.DARKSLATEGRAY,
                        outlineColor: Cesium.Color.WHITE,
                        outlineWidth: 2
                    },
                    label: {
                        text: city.name,
                        font: '12px sans-serif',
                        fillColor: Cesium.Color.BLACK,
                        outlineColor: Cesium.Color.WHITE,
                        outlineWidth: 2,
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -10),
                        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 10000000)
                    }
                });
            }
        });
    } else {
        // Remove cities if toggled off
        cities.forEach(city => entities.removeById(`city-${city.name}`));
    }

    // 2. EMPIRES
    if (showEmpires) {
        empires.forEach(empire => {
            const id = `empire-${empire.name}`;
            let entity = entities.getById(id);
            if (!entity) {
                entities.add({
                    id,
                    position: Cesium.Cartesian3.fromDegrees(empire.coords[0], empire.coords[1]),
                    point: {
                        pixelSize: 10,
                        color: Cesium.Color.SIENNA,
                        outlineColor: Cesium.Color.WHITE,
                        outlineWidth: 2
                    },
                    label: {
                        text: empire.name,
                        font: 'bold 12px sans-serif',
                        fillColor: Cesium.Color.SIENNA,
                        outlineColor: Cesium.Color.WHITE,
                        outlineWidth: 3,
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -12),
                        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 12000000)
                    }
                });
            }
        });
    } else {
         empires.forEach(empire => entities.removeById(`empire-${empire.name}`));
    }

    // 3. ROUTES & SHIPS
    routes.forEach(route => {
        const isVisible = visibleRouteIds.includes(route.id);
        const routeId = `route-${route.id}`;
        const shipId = `ship-${route.id}`;

        // --- Route Line ---
        let routeEntity = entities.getById(routeId);
        
        if (isVisible) {
            // Calculate visibility/opacity based on year
            const { start, end } = getRouteYearRange(route.year);
            let showRoute = false;
            let routeAlpha = 0.1;
            let progress = 0;

            if (currentYear >= start) {
                showRoute = true;
                if (currentYear > end) {
                    routeAlpha = 0.5;
                    progress = 1;
                } else {
                    routeAlpha = 1.0;
                    const duration = end - start;
                    progress = duration === 0 ? 1 : (currentYear - start) / duration;
                }
            }
            if (selectedExplorerId === route.id) {
                routeAlpha = 1.0;
                progress = 1;
                showRoute = true;
            }

            const color = Cesium.Color.fromCssColorString(route.color).withAlpha(routeAlpha);
            
            // Flatten coordinates for Cesium Polyline
            // Handle both simple array and array of arrays (segments)
            // For simplicity in 3D, we'll just join segments or treat them separately. 
            // Cesium handles one array per entity. We'll flatten for single continuous lines or create multiples.
            // To keep it simple: flatten all points.
            const flatPath = (Array.isArray(route.path[0]?.[0]) 
                ? (route.path as any).flat() 
                : route.path).map((c: any) => c);

            const positions = Cesium.Cartesian3.fromDegreesArray(flatPath.flat());

            if (!routeEntity) {
                routeEntity = entities.add({
                    id: routeId,
                    polyline: {
                        positions: positions,
                        width: route.id === selectedExplorerId ? 4 : 2,
                        material: color,
                        clampToGround: false 
                    }
                });
            } else {
                routeEntity.show = showRoute;
                routeEntity.polyline.material = color;
                routeEntity.polyline.width = route.id === selectedExplorerId ? 5 : (route.id === 'tordesillas' ? 2 : 3);
            }
            
            // Handle Tordesillas dashed line specially if needed, but color alpha handles fade.
            
            // --- Ship Animation ---
            let shipEntity = entities.getById(shipId);
            const shouldShowShip = showRoute && progress < 1 && progress > 0 && route.id !== 'tordesillas' && selectedExplorerId !== route.id;

            if (shouldShowShip) {
                // Calculate ship position using D3 logic then convert to Cartesian3
                const coords = flatPath; 
                // Same logic as Map.tsx
                if (coords.length > 1) {
                     const segments = d3.pairs(coords);
                     const segmentLengths = segments.map(([a, b]) => d3.geoDistance(a as [number,number], b as [number,number]));
                     const totalLength = d3.sum(segmentLengths);
                     const targetDist = totalLength * progress;
                     
                     let currentDist = 0;
                     let foundP0 = coords[0];
                     let foundP1 = coords[1];
                     let segmentFraction = 0;

                     for (let i = 0; i < segmentLengths.length; i++) {
                        if (currentDist + segmentLengths[i] >= targetDist) {
                            foundP0 = coords[i];
                            foundP1 = coords[i+1];
                            const distInSegment = targetDist - currentDist;
                            segmentFraction = distInSegment / segmentLengths[i];
                            break;
                        }
                        currentDist += segmentLengths[i];
                     }
                     
                     const interpolator = d3.geoInterpolate(foundP0 as [number,number], foundP1 as [number,number]);
                     const currentPos = interpolator(segmentFraction);
                     const position = Cesium.Cartesian3.fromDegrees(currentPos[0], currentPos[1]);

                     if (!shipEntity) {
                        shipEntity = entities.add({
                            id: shipId,
                            position: position,
                            billboard: {
                                image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzMzMyIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIj48cGF0aCBkPSJNMiAyMGgxN2wzLTdINkwyIDIwem0zLTlsMy04IDUtMyA1IDMtMyA4SDV6Ii8+PC9zdmc+', // Simple ship icon
                                scale: 1.5,
                                color: Cesium.Color.WHITE,
                                heightReference: Cesium.HeightReference.NONE
                            },
                            label: {
                                text: route.explorer.split(' ')[0],
                                font: '10px sans-serif',
                                fillColor: Cesium.Color.BLACK,
                                outlineColor: Cesium.Color.WHITE,
                                outlineWidth: 2,
                                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                                pixelOffset: new Cesium.Cartesian2(0, -20),
                                verticalOrigin: Cesium.VerticalOrigin.BOTTOM
                            }
                        });
                     } else {
                        shipEntity.position = position;
                        shipEntity.show = true;
                     }
                }
            } else {
                if (shipEntity) shipEntity.show = false;
            }

        } else {
            if (routeEntity) routeEntity.show = false;
            const shipEntity = entities.getById(shipId);
            if (shipEntity) shipEntity.show = false;
        }
    });

    viewerRef.current.scene.requestRender();

  }, [visibleRouteIds, currentYear, showCities, showEmpires, selectedExplorerId]);


  return <div ref={containerRef} className="w-full h-full" />;
};

export default Globe3D;
