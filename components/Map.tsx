
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
  showCities: boolean;
  showEmpires: boolean;
  currentYear: number;
}

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
  showCities, 
  showEmpires,
  currentYear
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

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

    // Standard Mercator Projection for 2D
    const projection = d3.geoMercator()
          .scale(width / 2 / Math.PI * 0.9)
          .translate([width / 2, height / 1.6]);

    const pathGenerator = d3.geoPath().projection(projection);

    const lineGenerator = d3.line()
        .x(d => projection(d as [number, number])?.[0] || 0)
        .y(d => projection(d as [number, number])?.[1] || 0)
        .defined(d => projection(d as [number, number]) !== null);

    const g = svg.append('g').attr('class', 'map-content');
    const labelsGroup = svg.append('g').attr('class', 'labels').style('pointer-events', 'none');

    g.append('rect')
        .attr('class', 'ocean')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', '#cce6ff');
    
    const land = topojson.feature(worldData, worldData.objects.countries);

    g.append('g')
      .attr('class', 'landmass')
      .selectAll('path')
      .data((land as any).features)
      .join('path')
      .attr('d', pathGenerator as any)
      .attr('fill', (d: any) => {
        if (!showTerritories) return '#f0e6c2';
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

    routeContainers.each(function(d: Route) {
        const container = d3.select(this);
        const { start, end } = getRouteYearRange(d.year);
        
        let opacity = 0.1;
        let progress = 0;
        let shipVisible = false;

        if (currentYear < start) {
            opacity = 0; 
        } else if (currentYear > end) {
            opacity = 0.5;
            progress = 1;
        } else {
            opacity = 1;
            shipVisible = true;
            const duration = end - start;
            progress = duration === 0 ? 0.9 : (currentYear - start) / duration;
            progress = Math.min(Math.max(progress, 0), 1);
        }

        if (selectedExplorerId === d.id) {
            opacity = 1;
            progress = 1;
            shipVisible = false; 
        }

        const isMultiSegment = Array.isArray(d.path[0]?.[0]);
        const pathSegments = isMultiSegment ? (d.path as Coordinates[][]) : [d.path as Coordinates[]];

        container.selectAll('path.route-path')
            .data(pathSegments)
            .join('path')
            .attr('class', 'route-path')
            .attr('d', segment => lineGenerator(segment as any))
            .attr('stroke', d.color)
            .attr('fill', 'none')
            .attr('stroke-width', selectedExplorerId === d.id ? 4 : (d.id === 'tordesillas' ? 2.5 : 2))
            .attr('stroke-dasharray', () => {
                if (d.id === 'tordesillas') return '6,6';
                return d.type === 'dashed' ? '8, 8' : d.type === 'dotted' ? '2, 6' : 'none';
            })
            .attr('opacity', opacity);

        if (shipVisible && progress < 1 && d.id !== 'tordesillas') {
            const flatCoords = (isMultiSegment ? (d.path as Coordinates[][]).flat() : d.path as Coordinates[]).filter(c => c.length === 2);
            
            if (flatCoords.length > 1) {
                const segments = d3.pairs(flatCoords);
                const segmentLengths = segments.map(([a, b]) => d3.geoDistance(a, b));
                const totalLength = d3.sum(segmentLengths);
                
                const targetDist = totalLength * progress;
                
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
                    const pos = projection(currentGeoCoords);

                    if (pos) {
                      const shipGroup = container.append('g')
                          .attr('class', 'ship-group')
                          .attr('transform', `translate(${pos[0]}, ${pos[1]})`);
                      
                      shipGroup.append('text')
                          .text('🚢')
                          .attr('font-size', '20px')
                          .attr('text-anchor', 'middle')
                          .attr('dy', '.35em')
                          .style('paint-order', 'stroke')
                          .attr('stroke', 'white')
                          .attr('stroke-width', '2px')
                          .attr('stroke-linejoin', 'round');
                          
                      shipGroup.append('text')
                          .text(d.explorer.split(' ')[0])
                          .attr('y', -15)
                          .attr('text-anchor', 'middle')
                          .attr('font-size', '10px')
                          .attr('fill', '#333')
                          .attr('font-weight', 'bold')
                          .style('text-shadow', '0px 0px 4px white');
                    }
                }
            }
        }
    });

    // -----------------------------------------------------------------------
    // Labels
    // -----------------------------------------------------------------------

    labelsGroup.append('g').attr('class', 'city-markers')
      .style('display', showCities ? 'block' : 'none')
      .selectAll('circle')
      .data(cities)
      .join('circle')
      .attr('transform', d => `translate(${projection(d.coords)})`)
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
      .attr('transform', d => `translate(${projection(d.coords)})`)
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
      .attr('x', d => (projection((d as any).coords)?.[0] || 0) + ( (d as any).type === 'city' || (d as any).type === 'empire' ? 8 : 0))
      .attr('y', d => (projection((d as any).coords)?.[1] || 0) + ( (d as any).type === 'city' || (d as any).type === 'empire' ? 4 : 0))
      .attr('text-anchor', d => d.type === 'city' || d.type === 'empire' ? 'start' : 'middle')
      .style('fill', d => d.type === 'ocean' ? '#aaccff' : d.type === 'continent' ? 'rgba(181, 154, 126, 0.6)' : '#333')
      .style('font-size', d => d.type === 'ocean' ? '24px' : d.type === 'continent' ? '16px' : d.type === 'empire' ? '12px' : '10px')
      .style('font-family', d => d.type === 'ocean' ? 'serif' : 'sans-serif')
      .style('font-style', d => d.type === 'ocean' ? 'italic' : 'normal')
      .style('font-weight', d => d.type === 'empire' || d.type === 'continent' ? 'bold' : 'normal')
      .style('letter-spacing', d => d.type === 'continent' ? '1px' : 'normal')
      .style('display', d => {
          const type = (d as any).type;
          if (type === 'city' && !showCities) return 'none';
          if (type === 'empire' && !showEmpires) return 'none';
          return 'block';
      })
      .style('paint-order', 'stroke').attr('stroke', 'white').attr('stroke-width', '3px').attr('stroke-linejoin', 'round');


    const zoom2D = d3.zoom<SVGSVGElement, unknown>().scaleExtent([1, 8]).on('zoom', (event) => {
        const currentG = d3.select(svgRef.current).select<SVGGElement>('g.map-content');
        const currentLabels = d3.select(svgRef.current).select<SVGGElement>('g.labels');
        currentG.attr('transform', event.transform.toString());
        currentLabels.attr('transform', event.transform.toString());
    });
    svg.call(zoom2D);

  }, [worldData, dimensions, onExplorerSelect, onEmpireClick, visibleRouteIds, showTerritories, selectedExplorerId, showCities, showEmpires, currentYear]);

  return <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing"></svg>;
};

export default Map;
