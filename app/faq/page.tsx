import { InfoPage } from "@/components/info-page"

export default function FaqPage() {
  return (
    <InfoPage
      title="Frequently Asked Questions"
      description="Common questions from citizens about complaint registration and tracking."
      details={[
        "How do I submit a complaint? Sign in and use the Report Issue page.",
        "How can I track status? Open Track Status and search your complaints.",
        "Can I upload images? Yes, up to 5 supporting images are allowed.",
      ]}
    />
  )
}
