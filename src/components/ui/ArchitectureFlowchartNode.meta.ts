import type { PulseComponentMeta } from "../../types/component";

export const ArchitectureFlowchartNodeMeta: PulseComponentMeta = {
  title: "Architecture Flowchart Node",
  description:
    "ReactFlow and AWS Architecture diagrams inspired cloud infrastructure component card featuring interactive system nodes (Edge CDN, Serverless compute, Vector DB, Cache), downstream connection highlights, and real-time throughput metrics.",
  tagline: "Interactive cloud system architecture flowchart nodes with live telemetry metrics.",
  category: "Cards",
  badges: ["New", "DevTools", "Architecture", "Cloud"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "architecture diagram",
    "system flowchart",
    "reactflow node",
    "cloud infrastructure card",
    "microservices topology",
    "aws diagram card",
  ],
  features: [
    "Interactive cloud nodes for Edge CDN, Compute Workers, Vector Database, and Redis Cache.",
    "Click-to-highlight downstream connection topology pathways.",
    "Real-time RTT latency and request throughput telemetry banner.",
    "Responsive card layout with distinct subsystem color palettes.",
  ],
  accessibility: [
    "High-contrast color badges for different infrastructure tiers.",
    "Keyboard accessible interactive nodes.",
  ],
  props: [
    {
      name: "diagramTitle",
      type: "string",
      default: '"High-Throughput Global Microservices Architecture"',
      description: "Architecture diagram card title.",
    },
    {
      name: "nodes",
      type: "SystemNode[]",
      description: "Array of connected infrastructure nodes with telemetry.",
    },
  ],
  usageCode: `import { ArchitectureFlowchartNode } from "@/components/ui/ArchitectureFlowchartNode";

export function Example() {
  return (
    <ArchitectureFlowchartNode />
  );
}`,
};

export default ArchitectureFlowchartNodeMeta;
