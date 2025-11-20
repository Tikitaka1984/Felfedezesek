
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { routes, cities, empires, territories, continents, oceans, EMPIRE_COLORS, EMPIRE_STROKE_COLORS } from '../data/mapData';
import type { Route, City, Empire, Continent, Coordinates } from '../types';

interface MapProps {
  worldData: any;
  onExplorerSelect: (explorerId: string) => void;
  onEmpireClick: (empire: Empire, event: MouseEvent) => void;
  visibleRouteIds: string[];
  showTerritories: boolean;
  selectedExplorerId: string | null;
  is3DView: boolean;
  showCities: boolean;
  showEmpires: boolean;
  currentYear: number;
}

// Helper to parse route years
const getRouteYearRange = (yearStr: string) => {
  const parts = yearStr.split('-').map(s => parseInt(s.trim()));
  return {
    start: parts[0],
    end: parts.length > 1 ? parts[1] : parts[0]
  };
};

const Map: React.FC<MapProps> = ({ 
  worldData, 
  onExplorerSelect, 
  onEmpireClick, 
  visibleRouteIds, 
  showTerritories, 
  selectedExplorerId, 
  is3DView, 
  showCities, 
  showEmpires,
  currentYear
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  // We don't need a complex D3 timer for the timeline, we react to props,
  // but for smooth rotation or internal animations, we might keep refs.

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current?.parentElement) {
        setDimensions({
          width: svgRef.current.parentElement.clientWidth,
          height: svgRef.current.parentElement.clientHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!worldData || !svgRef.current || dimensions.width === 0) return;

    const { width, height } = dimensions;
    const svg = d3.select(svgRef.current);
    svg.on('.drag', null).on('.zoom', null);
    svg.selectAll('*').remove();

    const projection = is3DView
      ? d3.geoOrthographic()
          .scale(height / 2.2)
          .translate([width / 2, height / 2])
          .clipAngle(90)
          .precision(0.1)
      : d3.geoMercator()
          .scale(width / 2 / Math.PI * 0.9)
          .translate([width / 2, height / 1.6]);

    const pathGenerator = d3.geoPath().projection(projection);

    const lineGenerator = d3.line()
        .x(d => projection(d as [number, number])?.[0] || 0)
        .y(d => projection(d as [number, number])?.[1] || 0)
        .defined(d => projection(d as [number, number]) !== null);

    const g = svg.append('g').attr('class', 'map-content');
    const labelsGroup = svg.append('g').attr('class', 'labels').style('pointer-events', 'none');

    if (is3DView) {
      g.append('path')
        .datum({ type: 'Sphere' })
        .attr('class', 'sphere')
        .attr('d', pathGenerator)
        .attr('fill', '#cce6ff')
        .attr('stroke', '#aaa');
    } else {
        g.append('rect')
            .attr('class', 'ocean')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', '#cce6ff');
    }
    
    const land = topojson.feature(worldData, worldData.objects.countries);

    g.append('g')
      .attr('class', 'landmass')
      .selectAll('path')
      .data((land as any).features)
      .join('path')
      .attr('fill', (d: any) => {
        if (!showTerritories) return '#f0e6c2';
        // Only show territories relevant to the current year? 
        // For simplicity, we keep the general territory map but could animate expansion in a v2.
        const territory = territories.find(t => t.countryNames.includes(d.properties.name));
        return territory ? (EMPIRE_COLORS[territory.id] || '#f0e6c2') : '#f0e6c2';
      })
      .attr('stroke', (d: any) => {
        if (!showTerritories) return '#888';
        const territory = territories.find(t => t.countryNames.includes(d.properties.name));
        return territory ? (EMPIRE_STROKE_COLORS[territory.id] || '#ccc') : '#ccc';
      })
      .attr('stroke-width', (d: any) => {
         const territory = territories.find(t => t.countryNames.includes(d.properties.name));
         return showTerritories && territory ? 0.8 : 0.5;
      });

    // -----------------------------------------------------------------------
    // Route Logic
    // -----------------------------------------------------------------------
    
    // Only render routes that are checked in the sidebar
    const visibleRoutes = routes.filter(r => visibleRouteIds.includes(r.id));
    
    const routeContainers = g.append('g')
      .attr('class', 'routes')
      .selectAll('g.route-container')
      .data(visibleRoutes, (d: Route) => d.id)
      .join('g')
        .attr('class', 'route-container')
        .style('cursor', 'pointer')
        .on('click', (_, d) => {
          onExplorerSelect(d.id);
        });

    // Render paths
    routeContainers.each(function(d: Route) {
        const container = d3.select(this);
        const { start, end } = getRouteYearRange(d.year);
        
        // Determine visibility and progress based on currentYear
        let opacity = 0.1; // Default: barely visible (future/past inactive)
        let progress = 0;  // 0 to 1
        let shipVisible = false;

        if (currentYear < start) {
            // Future route
            opacity = 0; 
        } else if (currentYear > end) {
            // Past completed route
            opacity = 0.5;
            progress = 1;
        } else {
            // Active route
            opacity = 1;
            shipVisible = true;
            const duration = end - start;
            // If duration is 0 (single year event), show progress as 100% or oscillating?
            // Let's treat it as 50% done in that year or fully done.
            progress = duration === 0 ? 0.9 : (currentYear - start) / duration;
            // Smooth out slightly or clamp
            progress = Math.min(Math.max(progress, 0), 1);
        }

        // If a specific explorer is selected manually, we override the timeline visibility to show it fully
        if (selectedExplorerId === d.id) {
            opacity = 1;
            progress = 1; // Show full path
            shipVisible = false; // We might disable the timeline ship for the selected "Highlight" view, or keep it.
            // Note: In this implementation, let's let the timeline drive the ship, but selection drives opacity.
        }

        // Prepare path data
        const isMultiSegment = Array.isArray(d.path[0]?.[0]);
        const pathSegments = isMultiSegment ? (d.path as Coordinates[][]) : [d.path as Coordinates[]];

        // Draw the static path (the trail)
        container.selectAll('path.route-path')
            .data(pathSegments)
            .join('path')
            .attr('class', 'route-path')
            .attr('stroke', d.color)
            .attr('fill', 'none')
            .attr('stroke-width', selectedExplorerId === d.id ? 4 : (d.id === 'tordesillas' ? 2.5 : 2))
            .attr('stroke-dasharray', () => {
                if (d.id === 'tordesillas') return '6,6';
                return d.type === 'dashed' ? '8, 8' : d.type === 'dotted' ? '2, 6' : 'none';
            })
            .attr('opacity', opacity);

        // Draw the ship if active
        if (shipVisible && progress < 1 && d.id !== 'tordesillas') {
            // Calculate position along path
            // Flatten path for distance calc
            const flatCoords = (isMultiSegment ? (d.path as Coordinates[][]).flat() : d.path as Coordinates[]).filter(c => c.length === 2);
            
            if (flatCoords.length > 1) {
                const segments = d3.pairs(flatCoords);
                const segmentLengths = segments.map(([a, b]) => d3.geoDistance(a, b));
                const totalLength = d3.sum(segmentLengths);
                
                const targetDist = totalLength * progress;
                
                // Find which segment the targetDist falls into
                let currentDist = 0;
                let foundP0 = flatCoords[0];
                let foundP1 = flatCoords[1];
                let segmentFraction = 0;

                for (let i = 0; i < segmentLengths.length; i++) {
                    if (currentDist + segmentLengths[i] >= targetDist) {
                        foundP0 = flatCoords[i];
                        foundP1 = flatCoords[i+1];
                        const distInSegment = targetDist - currentDist;
                        segmentFraction = distInSegment / segmentLengths[i];
                        break;
                    }
                    currentDist += segmentLengths[i];
                }

                if (foundP0 && foundP1) {
                    const interpolator = d3.geoInterpolate(foundP0, foundP1);
                    const currentGeoCoords = interpolator(segmentFraction);
                    
                    // Append Ship Group
                    // Use a unique class/id to select and update later? 
                    // Since we redraw on render, we append anew.
                    const shipGroup = container.append('g').attr('class', 'ship-group');
                    
                    // Store coordinates for updatePositions
                    (shipGroup.node() as any).__geoCoords = currentGeoCoords;

                    shipGroup.append('text')
                        .text('🚢')
                        .attr('font-size', is3DView ? '24px' : '20px')
                        .attr('text-anchor', 'middle')
                        .attr('dy', '.35em')
                        .style('paint-order', 'stroke')
                        .attr('stroke', 'white')
                        .attr('stroke-width', '2px')
                        .attr('stroke-linejoin', 'round');
                        
                    // Add explorer name label near ship
                    shipGroup.append('text')
                        .text(d.explorer.split(' ')[0]) // Short name
                        .attr('y', -15)
                        .attr('text-anchor', 'middle')
                        .attr('font-size', '10px')
                        .attr('fill', '#333')
                        .attr('font-weight', 'bold')
                        .style('text-shadow', '0px 0px 4px white');
                }
            }
        }
    });

    // -----------------------------------------------------------------------
    // Labels & Markers
    // -----------------------------------------------------------------------

    labelsGroup.append('g').attr('class', 'city-markers')
      .style('display', showCities ? 'block' : 'none')
      .selectAll('circle')
      .data(cities)
      .join('circle')
      .attr('r', 3.5)
      .attr('fill', '#333')
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5);

    labelsGroup.append('g').attr('class', 'empire-markers')
      .style('pointer-events', 'all')
      .style('display', showEmpires ? 'block' : 'none')
      .selectAll('rect')
      .data(empires)
      .join('rect')
      .attr('width', 7)
      .attr('height', 7)
      .attr('x', -3.5)
      .attr('y', -3.5)
      .attr('fill', '#a0522d')
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
          event.stopPropagation();
          onEmpireClick(d, event);
      });

    const allLabelsData = [
        ...cities.map(c => ({...c, type: 'city'})),
        ...empires.map(e => ({...e, type: 'empire'})),
        ...continents.map(c => ({...c, type: 'continent'})),
        ...oceans.map(o => ({...o, type: 'ocean'})),
    ];
    labelsGroup.append('g').attr('class', 'text-labels')
      .selectAll('text')
      .data(allLabelsData)
      .join('text')
      .attr('class', d => `static-label label-${d.type}`)
      .text(d => d.type === 'continent' || d.type === 'ocean' ? d.name.toUpperCase() : d.name)
      .attr('text-anchor', d => d.type === 'city' || d.type === 'empire' ? 'start' : 'middle')
      .style('fill', d => d.type === 'ocean' ? '#aaccff' : d.type === 'continent' ? 'rgba(181, 154, 126, 0.6)' : '#333')
      .style('font-size', d => d.type === 'ocean' ? '24px' : d.type === 'continent' ? '16px' : d.type === 'empire' ? '12px' : '10px')
      .style('font-family', d => d.type === 'ocean' ? 'serif' : 'sans-serif')
      .style('font-style', d => d.type === 'ocean' ? 'italic' : 'normal')
      .style('font-weight', d => d.type === 'empire' || d.type === 'continent' ? 'bold' : 'normal')
      .style('letter-spacing', d => d.type === 'continent' ? '1px' : 'normal')
      .style('paint-order', 'stroke').attr('stroke', 'white').attr('stroke-width', '3px').attr('stroke-linejoin', 'round');

    // -----------------------------------------------------------------------
    // Position Update Logic (Rotation/Zoom)
    // -----------------------------------------------------------------------

    function updatePositions() {
      const currentG = d3.select(svgRef.current).select<SVGGElement>('g.map-content');
      const currentLabels = d3.select(svgRef.current).select<SVGGElement>('g.labels');
      
      if (currentG.empty() || currentLabels.empty()) return;

      currentG.selectAll('.sphere, .landmass path').attr('d', pathGenerator);
      currentG.selectAll('path.route-path').attr('d', segment => lineGenerator(segment as any));
      
      // Update Ship positions
      currentG.selectAll('g.ship-group').attr('transform', function() {
          const coords = (this as any).__geoCoords;
          if (!coords) return '';
          const pos = projection(coords);
          if (!pos) return '';
          return `translate(${pos[0]}, ${pos[1]})`;
      });
      
      // Visibility on Globe check
      const rotation = projection.rotate ? projection.rotate() : [0, 0, 0];
      const isVisibleOnGlobe = (coords: [number, number]) => 
        !is3DView || d3.geoDistance(coords, [-rotation[0], -rotation[1]]) < Math.PI / 2;

      // Hide ships on back of globe
      currentG.selectAll('g.ship-group').style('display', function() {
          const coords = (this as any).__geoCoords;
          return (!coords || isVisibleOnGlobe(coords)) ? 'block' : 'none';
      });

      currentLabels.selectAll('.city-markers circle')
          .attr('transform', d => `translate(${projection((d as City).coords)})`)
          .style('display', d => (showCities && isVisibleOnGlobe((d as City).coords)) ? 'block' : 'none');
          
      currentLabels.selectAll('.empire-markers rect')
          .attr('transform', d => `translate(${projection((d as Empire).coords)})`)
          .style('display', d => (showEmpires && isVisibleOnGlobe((d as Empire).coords)) ? 'block' : 'none');

      currentLabels.selectAll('.text-labels text')
          .attr('x', d => (projection((d as any).coords)?.[0] || 0) + ( (d as any).type === 'city' || (d as any).type === 'empire' ? 8 : 0))
          .attr('y', d => (projection((d as any).coords)?.[1] || 0) + ( (d as any).type === 'city' || (d as any).type === 'empire' ? 4 : 0))
          .attr('transform', d => (d as any).type === 'continent' ? `rotate(${(d as Continent).rotation || 0}, ${projection((d as any).coords)?.[0] || 0}, ${projection((d as any).coords)?.[1] || 0})` : '')
          .style('display', d => {
              if (!isVisibleOnGlobe((d as any).coords)) return 'none';
              const type = (d as any).type;
              if (type === 'city' && !showCities) return 'none';
              if (type === 'empire' && !showEmpires) return 'none';
              return 'block';
          });
    }

    updatePositions();
    
    if (is3DView) {
      const initialScale = projection.scale();
      const drag = d3.drag().on('drag', event => {
        const r = projection.rotate();
        projection.rotate([r[0] + event.dx * 0.2, r[1] - event.dy * 0.2]);
        updatePositions();
      });
      const zoom = d3.zoom().scaleExtent([1, 10]).on('zoom', event => {
        projection.scale(initialScale * event.transform.k);
        updatePositions();
      });
      svg.call(drag).call(zoom);
      svg.on("dblclick.zoom", null);
    } else {
      const zoom2D = d3.zoom<SVGSVGElement, unknown>().scaleExtent([1, 8]).on('zoom', (event) => {
        const currentG = d3.select(svgRef.current).select<SVGGElement>('g.map-content');
        const currentLabels = d3.select(svgRef.current).select<SVGGElement>('g.labels');
        currentG.attr('transform', event.transform.toString());
        currentLabels.attr('transform', event.transform.toString());
      });
      svg.call(zoom2D);
    }

  }, [worldData, dimensions, onExplorerSelect, onEmpireClick, visibleRouteIds, showTerritories, selectedExplorerId, is3DView, showCities, showEmpires, currentYear]);

  return <svg ref={svgRef} className="w-full h-full cursor-grab"></svg>;
};

export default Map;
