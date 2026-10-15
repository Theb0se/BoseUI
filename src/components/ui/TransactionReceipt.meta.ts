import type { PulseComponentMeta } from "../../types/component";

export const TransactionReceiptMeta: PulseComponentMeta = {
  title: "Transaction Receipt",
  description:
    "Perforated fintech digital receipt card inspired by Monzo and Stripe with an authentic zigzag bottom tear edge, itemized breakdown, barcode, and animated spring rubber stamps (PAID, SETTLED, REFUNDED).",
  tagline: "Perforated digital fintech receipt with spring-physics rubber stamp animation.",
  category: "Cards",
  badges: ["New", "Fintech", "Card", "Interactive"],
  createdAt: "2026-10-12",
  featured: true,
  keywords: [
    "fintech receipt",
    "transaction card",
    "perforated receipt",
    "rubber stamp animation",
    "monzo receipt",
    "stripe invoice",
  ],
  features: [
    "Authentic SVG zigzag perforated bottom tear edge.",
    "Interactive spring rubber stamp overlay (PAID, SETTLED, REFUNDED).",
    "Itemized subtotal, estimated tax, discount, and total payment calculation.",
    "Integrated transaction barcode and one-click reference ID copying.",
    "Zero external graphic assets with complete dark/light mode responsiveness.",
  ],
  accessibility: [
    "Accessible semantic table/flex layout for screen readers.",
    "High contrast monochromatic typography with WCAG AA compliance.",
  ],
  props: [
    {
      name: "merchantName",
      type: "string",
      default: '"BoseUI Cloud Infrastructure"',
      description: "Header company or merchant business name.",
    },
    {
      name: "transactionId",
      type: "string",
      default: '"TXN-84920481"',
      description: "Transaction unique reference identifier.",
    },
    {
      name: "date",
      type: "string",
      default: '"Oct 12, 2026 • 13:42 UTC"',
      description: "Formatted timestamp of payment.",
    },
    {
      name: "items",
      type: "ReceiptItem[]",
      description: "List of purchased line items with name, quantity, and price.",
    },
    {
      name: "stampText",
      type: '"PAID" | "SETTLED" | "REFUNDED" | null',
      default: '"PAID"',
      description: "Rubber stamp watermark label.",
    },
  ],
  usageCode: `import { TransactionReceipt } from "@/components/ui/TransactionReceipt";

export function Example() {
  return (
    <TransactionReceipt
      merchantName="Stripe Platform Services"
      transactionId="ch_3M498Fhsd92"
      stampText="PAID"
      subtotal={120.00}
      tax={12.00}
    />
  );
}`,
};

export default TransactionReceiptMeta;
