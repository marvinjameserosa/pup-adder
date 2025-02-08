import type { Metadata } from "next"
import Header from "@/components/header/header"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
export const metadata: Metadata = {
  title: "PUP Gather",
  description: "Explore popular events in the university, browse by category, or check out exciting upcoming events.",
}

export default function DiscoverPage() {
  return (
      <div className="relative min-h-screen bg-gradient-to-b from-[#4A0E0E] to-[#A61B1B]">
        <div className="absolute inset-0 bg-black/80 mix-blend-multiply" />
        <div className="relative z-10 min-h-screen">
          <Header />
          <Table>


          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <section className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-300">
                
              </p>
            </section>
            <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
          
          </main>
        </div>
      </div>
    )
  
}

