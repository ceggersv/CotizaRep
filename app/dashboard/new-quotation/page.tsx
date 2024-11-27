import { QuotationForm } from "@/components/quotation-form"

export default function NewQuotationPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5">Request a New Quotation</h1>
      <QuotationForm />
    </div>
  )
}

