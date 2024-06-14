import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const CustomCalloutLineOverlay = ({ data, width, height, centerX, centerY, radius }) => {
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current)
            .attr("width", width)
            .attr("height", height)
            .style("position", "absolute")
            .style("top", 0)
            .style("left", 0)
            .style("pointer-events", "none");

        const arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        const pieGenerator = d3.pie()
            .value(d => d.value);

        const arcs = pieGenerator(data);

        const calloutLines = svg.selectAll(".callout-line")
            .data(arcs)
            .join("g")
            .attr("class", "callout-line");

        calloutLines.append("line")
            .attr("x1", d => arcGenerator.centroid(d)[0] + centerX)
            .attr("y1", d => arcGenerator.centroid(d)[1] + centerY)
            .attr("x2", d => arcGenerator.centroid(d)[0] * 1.5 + centerX)
            .attr("y2", d => arcGenerator.centroid(d)[1] * 1.5 + centerY)
            .attr("stroke", d => d.data.color)
            .attr("stroke-width", 2);

        calloutLines.append("line")
            .attr("x1", d => arcGenerator.centroid(d)[0] * 1.5 + centerX)
            .attr("y1", d => arcGenerator.centroid(d)[1] * 1.5 + centerY)
            .attr("x2", d => arcGenerator.centroid(d)[0] * 2.5 + (arcGenerator.centroid(d)[0] > 0 ? 50 : -50) + centerX)
            .attr("y2", d => arcGenerator.centroid(d)[1] * 1.5 + centerY)
            .attr("stroke", d => d.data.color)
            .attr("stroke-width", 2);

        calloutLines.append("text")
            .attr("x", d => arcGenerator.centroid(d)[0] * 2.5 + (arcGenerator.centroid(d)[0] > 0 ? 50 : -50) + centerX)
            .attr("y", d => arcGenerator.centroid(d)[1] * 1.5 + centerY)
            .attr("dy", "0.35em")
            .attr("text-anchor", d => arcGenerator.centroid(d)[0] > 0 ? "start" : "end")
            .attr("fill", "white")
            .text(d => `${d.data.label} (${d.data.value} GB)`);

    }, [data, width, height, centerX, centerY, radius]);

    return <svg ref={ref} />;
};

export default CustomCalloutLineOverlay;
