"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { sankey, SankeyNode, SankeyLink, sankeyLinkHorizontal } from "d3-sankey";

interface SankeyData {
    nodes: Array<{ id: string; name: string; value?: number }>;
    links: Array<{ source: string; target: string; value: number }>;
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

        const sankeyGenerator = sankey<SankeyNode, SankeyLink>()
            // @ts-ignore d3 types are permissive here
            .nodeId((d: any) => d.id)
            .nodeWidth(15)
            .nodePadding(10)
            .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom]]);

        // @ts-ignore — d3 types here are permissive
        const { nodes, links } = sankeyGenerator(data);

        const color = d3.scaleOrdinal([
            "#22c55e", "#86efac", "#166534", "#0f3a1b", "#f59e0b", "#ef4444", "#22c55e",
        ]);

        const link = svg.append("g")
            .selectAll("path")
            .data(links as any)
            .enter()
            .append("path")
            .attr("d", (d: any) => sankeyLinkHorizontal()(d))
            .attr("fill", "none")
            .attr("stroke", (d: any) => color((d.source as any).id))
            .attr("stroke-width", (d: any) => Math.max(1, (d as any).width))
            .attr("opacity", 0.6);

        svg.append("g")
            .selectAll("rect")
            .data(nodes as any)
            .enter()
            .append("rect")
            .attr("x", (d: any) => d.x0)
            .attr("y", (d: any) => d.y0)
            .attr("height", (d: any) => d.y1 - d.y0)
            .attr("width", (d: any) => d.x1 - d.x0)
            .attr("fill", (d: any) => color(d.id as any))
            .attr("opacity", 0.8);

        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim() || '#0f172a';
        svg.append("g")
            .selectAll("text")
            .data(nodes as any)
            .enter()
            .append("text")
            .attr("x", (d: any) => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
            .attr("y", (d: any) => (d.y0 + d.y1) / 2)
            .attr("text-anchor", (d: any) => d.x0 < width / 2 ? "start" : "end")
            .attr("dy", "0.35em")
            .attr("font-size", "11px")
            .attr("fill", `oklch(${textColor})`)
            .attr("font-weight", "500")
            .text((d: any) => {
                const unit = metric === 'mass' ? ' kg' : ' kg CO₂e';
                return `${d.name} (${(d.value as number)?.toFixed(1)}${unit})`;
            });
    }, [data]);

    const getCategoryDisplayName = (category: string): string => {
        const categoryMap: Record<string, string> = {
            main_protein: "Pääruoka",
            energy_supplement: "Energiatuki",
            soup: "Keitto",
            salad_ingredients: "Salaatti",
        };
        return categoryMap[category] || category;
    };

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
            <div className="mt-4 text-sm text-muted-foreground">
                <p>Kaavio näyttää ruokahävikin jakautumisen eri kategorioihin ja yksittäisiin tuotteisiin {metricLabel.toLowerCase()}n mukaan.</p>
            </div>
        </div>
    );
}


