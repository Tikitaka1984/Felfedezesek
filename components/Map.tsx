
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { routes, cities, empires, territories, continents, oceans } from '../data/mapData';
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
}

const Map: React.FC<MapProps> = ({ worldData, onExplorerSelect, onEmpireClick, visibleRouteIds, showTerritories, selectedExplorerId, is3DView, showCities, showEmpires }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationTimer = useRef<d3.Timer | null>(null);

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
    // Stop any previous animation timer when the component re-renders
    if (animationTimer.current) {
      animationTimer.current.stop();
    }

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
        const territory = territories.find(t => t.countryCodes.includes(d.properties.name));
        return territory ? territory.color : '#f0e6c2';
      })
      .attr('stroke', (d: any) => {
        if (!showTerritories) return '#888';
        const territory = territories.find(t => t.countryCodes.includes(d.properties.name));
        return territory ? territory.strokeColor : '#ccc';
      })
      .attr('stroke-width', (d: any) => {
         const territory = territories.find(t => t.countryCodes.includes(d.properties.name));
         return showTerritories && territory ? 0.8 : 0.5;
      });

    const visibleRoutes = routes.filter(r => visibleRouteIds.includes(r.id));
    
    const routeContainers = g.append('g')
      .attr('class', 'routes')
      .selectAll('g.route-container')
      .data(visibleRoutes, (d: Route) => d.id)
      .join('g')
        .attr('class', 'route-container')
        .style('cursor', (d) => d.id === 'tordesillas' ? 'default' : 'pointer')
        .on('click', (_, d) => {
          if (d.id !== 'tordesillas') {
            onExplorerSelect(d.id);
          }
        });

    routeContainers.selectAll('path.route-path')
      .data((route: Route) => {
        const isMultiSegment = Array.isArray(route.path[0]?.[0]);
        return isMultiSegment ? (route.path as Coordinates[][]) : [route.path as Coordinates[]];
      })
      .join('path')
      .attr('class', 'route-path')
      .attr('stroke', function() {
        const routeData = d3.select(this.parentNode as SVGGElement).datum() as Route;
        return routeData.color;
      })
      .attr('fill', 'none')
      .attr('stroke-width', function() {
        const routeData = d3.select(this.parentNode as SVGGElement).datum() as Route;
        return selectedExplorerId === routeData.id ? 4 : (routeData.id === 'tordesillas' ? 2.5 : 2);
      })
      .attr('stroke-dasharray', function() {
        const routeData = d3.select(this.parentNode as SVGGElement).datum() as Route;
        if (routeData.id === 'tordesillas') return '6,6';
        return routeData.type === 'dashed' ? '8, 8' : routeData.type === 'dotted' ? '2, 6' : 'none';
      });

    if (selectedExplorerId) {
      const selectedRouteData = routes.find(r => r.id === selectedExplorerId);
      
      if (selectedRouteData && selectedRouteData.path.length > 1) {
        const isMultiSegment = Array.isArray(selectedRouteData.path[0]?.[0]);
        const fullPathCoords = (isMultiSegment 
            ? (selectedRouteData.path as Coordinates[][]).flat() 
            : selectedRouteData.path as Coordinates[]
        ).filter(p => p && p.length === 2);

        if (fullPathCoords.length > 1) {
          const segments = d3.pairs(fullPathCoords);
          const segmentLengths = segments.map(([a, b]) => d3.geoDistance(a, b));
          const cumulativeLengths: number[] = [0];
          let currentLength = 0;
          for(const len of segmentLengths) {
              currentLength += len;
              cumulativeLengths.push(currentLength);
          }
          const totalGeoLength = cumulativeLengths[cumulativeLengths.length - 1];
          
          if (totalGeoLength > 0) {
            const ship = g.append('text')
                .attr('class', 'ship-marker')
                .text('🚢')
                .attr('font-size', is3DView ? '20px' : '16px')
                .attr('text-anchor', 'middle')
                .attr('dy', '.35em')
                .style('paint-order', 'stroke')
                .attr('stroke', 'white')
                .attr('stroke-width', '2px')
                .attr('stroke-linejoin', 'round');
                
            const duration = 20000; // 20 seconds for the whole trip

            animationTimer.current = d3.timer(function(elapsed) {
                const t = (elapsed % duration) / duration;
                const targetDist = t * totalGeoLength;

                const segmentIndex = d3.bisect(cumulativeLengths, targetDist) - 1;
                
                if(segmentIndex < 0) return;

                const distIntoSegment = targetDist - cumulativeLengths[segmentIndex];
                const segmentFraction = segmentLengths[segmentIndex] > 0 ? (distIntoSegment / segmentLengths[segmentIndex]) : 0;
                
                const p0 = fullPathCoords[segmentIndex];
                const p1 = fullPathCoords[segmentIndex + 1];

                if (!p0 || !p1) return;

                const interpolator = d3.geoInterpolate(p0, p1);
                const currentGeoCoords = interpolator(segmentFraction);
                
                const screenPos = projection(currentGeoCoords);

                if (screenPos) {
                    const rotation = projection.rotate ? projection.rotate() : [0,0,0];
                    const isVisible = !is3DView || d3.geoDistance(currentGeoCoords, [-rotation[0], -rotation[1]]) < Math.PI / 2;
                    ship
                        .attr('transform', `translate(${screenPos[0]}, ${screenPos[1]})`)
                        .style('display', isVisible ? 'block' : 'none');
                } else {
                    ship.style('display', 'none');
                }
            });
          }
        }
      }
    }

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

    function updatePositions() {
      const currentG = d3.select(svgRef.current).select<SVGGElement>('g.map-content');
      const currentLabels = d3.select(svgRef.current).select<SVGGElement>('g.labels');
      
      if (currentG.empty() || currentLabels.empty()) return;

      currentG.selectAll('.sphere, .landmass path').attr('d', pathGenerator);
      currentG.selectAll('path.route-path').attr('d', segment => lineGenerator(segment as any));
      
      const rotation = projection.rotate ? projection.rotate() : [0, 0, 0];
      const isVisibleOnGlobe = (d: { coords: [number, number] }) => 
        !is3DView || d3.geoDistance(d.coords, [-rotation[0], -rotation[1]]) < Math.PI / 2;

      currentLabels.selectAll('.city-markers circle')
          .attr('transform', d => `translate(${projection((d as City).coords)})`)
          .style('display', d => (showCities && isVisibleOnGlobe(d as City)) ? 'block' : 'none');
          
      currentLabels.selectAll('.empire-markers rect')
          .attr('transform', d => `translate(${projection((d as Empire).coords)})`)
          .style('display', d => (showEmpires && isVisibleOnGlobe(d as Empire)) ? 'block' : 'none');

      currentLabels.selectAll('.text-labels text')
          .attr('x', d => (projection((d as any).coords)?.[0] || 0) + ( (d as any).type === 'city' || (d as any).type === 'empire' ? 8 : 0))
          .attr('y', d => (projection((d as any).coords)?.[1] || 0) + ( (d as any).type === 'city' || (d as any).type === 'empire' ? 4 : 0))
          .attr('transform', d => (d as any).type === 'continent' ? `rotate(${(d as Continent).rotation || 0}, ${projection((d as any).coords)?.[0] || 0}, ${projection((d as any).coords)?.[1] || 0})` : '')
          .style('display', d => {
              if (!isVisibleOnGlobe(d as any)) return 'none';
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

  }, [worldData, dimensions, onExplorerSelect, onEmpireClick, visibleRouteIds, showTerritories, selectedExplorerId, is3DView, showCities, showEmpires]);

  return <svg ref={svgRef} className="w-full h-full cursor-grab"></svg>;
};

export default Map;
