import { InfoPage } from "@/components/info-page"

export default function TermsPage() {
  return (
    <InfoPage
      title="Terms of Service"
      description="These terms define how citizens and administrators should use the Smart City Complaint Portal."
      details={[
        "Users must provide accurate complaint details and avoid false reporting.",
        "Authorities update complaint status based on official verification and field action.",
        "The portal may retain complaint records for audit, analytics, and governance purposes.",
      ]}
    />
  )
}
