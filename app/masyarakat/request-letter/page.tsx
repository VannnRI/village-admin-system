// This file is now app/masyarakat/request-letter/page.tsx
// Original content from app/public/request-letter/page.tsx, adapted for MasyarakatLayout
import MasyarakatLayout from "@/components/masyarakat-layout"
import LetterRequestForm from "@/components/masyarakat/letter-request-form" // Updated path

export default function LetterRequestPage() {
  return (
    <MasyarakatLayout>
      <LetterRequestForm />
    </MasyarakatLayout>
  )
}
