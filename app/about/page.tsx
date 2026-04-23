import { InfoPage } from "@/components/info-page"

export default function AboutPage() {
  return (
    <InfoPage
      title="About Smart City Complaint Portal"
      description="This platform helps citizens report local civic issues and track resolution progress transparently."
      details={[
        "Citizens can submit complaints with category, location, and photo evidence.",
        "Authorities can review, update, and resolve issues through role-based dashboards.",
        "The system improves transparency, accountability, and response timelines.",
      ]}
    />
  )
}
