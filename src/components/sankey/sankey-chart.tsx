"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { sankey, SankeyNode, SankeyLink, sankeyLinkHorizontal } from "d3-sankey";

interface SankeyNodeData {
    id: string;
    name: string;
    value?: number;
}

interface SankeyLinkData {
    source: string;
    target: string;
    value: number;
}

interface SankeyData {
    nodes: Array<SankeyNodeData>;
    links: Array<SankeyLinkData>;
}

type FlowMetric = 'mass' | 'co2eq';

interface SankeyChartProps {
    metric?: FlowMetric;
}

export default function SankeyChart({ metric = 'mass' }: SankeyChartProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [data, setData] = useState<SankeyData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch('/data/food-flow.json', { cache: 'no-store' });
                if (!res.ok) throw new Error('Failed to fetch /data/food-flow.json');
                const json = await res.json() as {
                    nodes: Array<{ id: string; mass?: number; co2eq?: number }>;
                    links: Array<{ source: string; target: string; mass?: number; co2eq?: number }>;
                };

                const links = json.links.map(l => ({
                    source: l.source,
                    target: l.target,
                    value: (metric === 'mass' ? l.mass : l.co2eq) ?? 0,
                }));

                const incoming = new Map<string, number>();
                const outgoing = new Map<string, number>();
                for (const l of links) {
                    outgoing.set(l.source, (outgoing.get(l.source) ?? 0) + l.value);
                    incoming.set(l.target, (incoming.get(l.target) ?? 0) + l.value);
                }

                const nodes = json.nodes.map(n => {
                    const own = metric === 'mass' ? n.mass : n.co2eq;
                    const agg = Math.max(incoming.get(n.id) ?? 0, outgoing.get(n.id) ?? 0);
                    return { id: n.id, name: n.id, value: (own ?? agg) || 0 };
                });

                setData({ nodes, links });
                setLoading(false);
            } catch (e) {
                console.error('Error loading flow data:', e);
                setLoading(false);
            }
        };

        load();
    }, [metric]);

    useEffect(() => {
        if (!data || !svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = 800;
        const height = 600;
        const margin = { top: 20, right: 20, bottom: 20, left: 20 };

        svg.attr("width", width).attr("height", height);

        const sankeyGenerator = sankey<SankeyNode<SankeyNodeData, SankeyLinkData>, SankeyLink<SankeyNodeData, SankeyLinkData>>()
            .nodeId((d: SankeyNode<SankeyNodeData, SankeyLinkData>) => d.id as string)
            .nodeWidth(15)
            .nodePadding(10)
            .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]);

        const { nodes, links } = sankeyGenerator(data);

        // Brand colors matching Donation Sources
        const colorMap: Record<string, string> = {
            "total": "#666666", // gray for total
            "beef": "#026209", // Zipli Earth (dark green)
            "fish": "#18E170", // Zipli Lime (bright green)
            "pork": "#FFA5BD", // Zipli Rose (pink)
            "veg": "#5A0057", // Zipli Plum (purple)
            "side": "#86efac", // light green
            "casserole": "#f59e0b", // orange
            "sauce": "#ef4444", // red
            "soup": "#3b82f6", // blue
            "stew": "#8b5cf6", // purple
        };
        const color = (id: string) => colorMap[id] || "#22c55e";

        svg.append("g")
            .selectAll("path")
            .data(links)
            .enter()
            .append("path")
            .attr("d", (d: SankeyLink<SankeyNodeData, SankeyLinkData>) => sankeyLinkHorizontal()(d))
            .attr("fill", "none")
            .attr("stroke", (d: SankeyLink<SankeyNodeData, SankeyLinkData>) => color((d.source as SankeyNode<SankeyNodeData, SankeyLinkData>).id as string))
            .attr("stroke-width", (d: SankeyLink<SankeyNodeData, SankeyLinkData>) => Math.max(1, (d as SankeyLink<SankeyNodeData, SankeyLinkData> & { width?: number }).width ?? 1))
            .attr("opacity", 0.6);

        svg.append("g")
            .selectAll("rect")
            .data(nodes)
            .enter()
            .append("rect")
            .attr("x", (d: SankeyNode<SankeyNodeData, SankeyLinkData>) => (d as SankeyNode<SankeyNodeData, SankeyLinkData> & { x0?: number }).x0 ?? 0)
            .attr("y", (d: SankeyNode<SankeyNodeData, SankeyLinkData>) => (d as SankeyNode<SankeyNodeData, SankeyLinkData> & { y0?: number }).y0 ?? 0)
            .attr("height", (d: SankeyNode<SankeyNodeData, SankeyLinkData>) => {
                const dTyped = d as SankeyNode<SankeyNodeData, SankeyLinkData> & { y0?: number; y1?: number };
                return (dTyped.y1 ?? 0) - (dTyped.y0 ?? 0);
            })
            .attr("width", (d: SankeyNode<SankeyNodeData, SankeyLinkData>) => {
                const dTyped = d as SankeyNode<SankeyNodeData, SankeyLinkData> & { x0?: number; x1?: number };
                return (dTyped.x1 ?? 0) - (dTyped.x0 ?? 0);
            })
            .attr("fill", (d: SankeyNode<SankeyNodeData, SankeyLinkData>) => color(d.id as string))
            .attr("opacity", 0.8);

        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim() || '#0f172a';
        svg.append("g")
            .selectAll("text")
            .data(nodes)
            .enter()
            .append("text")
            .attr("x", (d: SankeyNode<SankeyNodeData, SankeyLinkData>) => {
                const dTyped = d as SankeyNode<SankeyNodeData, SankeyLinkData> & { x0?: number; x1?: number };
                const x0 = dTyped.x0 ?? 0;
                return x0 < width / 2 ? (dTyped.x1 ?? 0) + 6 : x0 - 6;
            })
            .attr("y", (d: SankeyNode<SankeyNodeData, SankeyLinkData>) => {
                const dTyped = d as SankeyNode<SankeyNodeData, SankeyLinkData> & { y0?: number; y1?: number };
                return ((dTyped.y0 ?? 0) + (dTyped.y1 ?? 0)) / 2;
            })
            .attr("text-anchor", (d: SankeyNode<SankeyNodeData, SankeyLinkData>) => {
                const dTyped = d as SankeyNode<SankeyNodeData, SankeyLinkData> & { x0?: number };
                return (dTyped.x0 ?? 0) < width / 2 ? "start" : "end";
            })
            .attr("dy", "0.35em")
            .attr("font-size", "11px")
            .attr("fill", `oklch(${textColor})`)
            .attr("font-weight", "500")
            .text((d: SankeyNode<SankeyNodeData, SankeyLinkData>) => {
                const unit = metric === 'mass' ? ' kg' : ' kg CO₂e';
                return `${d.name} (${(d.value as number)?.toFixed(1)}${unit})`;
            });
    }, [data, metric]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-lg text-muted-foreground">Ladataan Sankey-kaaviota...</div>
            </div>
        );
    }

    const metricLabel = metric === 'mass' ? 'Paino' : 'CO₂e';

    return (
        <div className="w-full">
            <h2 className="text-lg font-semibold text-[var(--brand-900)] mb-4 font-[family-name:var(--font-space-grotesk)]">
                Ruokahävikin virtaus kategorioista tuotteisiin ({metricLabel})
            </h2>
            <div className="overflow-x-auto bg-card rounded-lg p-4 border">
                <svg ref={svgRef} className="mx-auto block" />
            </div>
        </div>
    );
}


