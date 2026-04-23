import { InfoPage } from "@/components/info-page"

export default function ContactPage() {
  return (
    <InfoPage
      title="Contact Support"
      description="Reach the Smart City support desk for urgent help or account-related assistance."
      details={[
        "Helpline: 1800-123-4567 (24x7)",
        "Email: support@smartcity.gov.in",
        "Use the portal complaint form for issue-specific tracking IDs.",
      ]}
    />
  )
}
