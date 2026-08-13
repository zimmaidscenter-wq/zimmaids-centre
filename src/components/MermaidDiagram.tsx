import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Check, Copy, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  themeVariables: {
    primaryColor: "#059669",
    primaryTextColor: "#ffffff",
    primaryBorderColor: "#047857",
    lineColor: "#10b981",
    secondaryColor: "#3b82f6",
    tertiaryColor: "#f3f4f6",
  },
});

interface MermaidProps {
  chart: string;
  id?: string;
}

export const MermaidDiagram: React.FC<MermaidProps> = ({ chart, id = "mermaid-chart" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const renderChart = async () => {
      try {
        setError(null);
        const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(uniqueId, chart);
        if (isMounted) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        console.error("Mermaid Render Error:", err);
        if (isMounted) {
          setError(err.message || "Failed to render Mermaid diagram");
        }
      }
    };

    renderChart();
    return () => {
      isMounted = false;
    };
  }, [chart]);

  const handleCopy = () => {
    navigator.clipboard.writeText(chart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative border border-emerald-900/20 bg-slate-900/90 rounded-2xl overflow-hidden text-white shadow-xl my-4">
      {/* Control Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-emerald-400 uppercase tracking-wider text-[11px]">
            Mermaid Enterprise Diagram
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.25, 2.5))}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.25, 0.5))}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1.5 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-900/40 hover:bg-emerald-900/60 border border-emerald-700/50 rounded-lg text-emerald-300 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Code"}</span>
          </button>
        </div>
      </div>

      {/* Diagram Content */}
      <div className="p-6 overflow-x-auto min-h-[300px] flex items-center justify-center bg-slate-900/90">
        {error ? (
          <div className="text-amber-400 p-4 text-center font-mono text-xs max-w-xl">
            <p className="font-bold mb-1">Diagram Render Warning</p>
            <p>{error}</p>
            <pre className="mt-2 p-2 bg-slate-950 rounded text-left overflow-x-auto text-[10px] text-slate-400">
              {chart}
            </pre>
          </div>
        ) : (
          <div
            ref={containerRef}
            style={{ transform: `scale(${zoom})`, transformOrigin: "top center", transition: "transform 0.2s ease" }}
            className="mermaid-wrapper w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}
      </div>
    </div>
  );
};
