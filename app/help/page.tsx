import { InfoPage } from "@/components/info-page"

export default function HelpPage() {
  return (
    <InfoPage
      title="Help Center"
      description="Use this guide to quickly understand how to use the Smart City Complaint Portal."
      details={[
        "Create an account or sign in with your registered credentials.",
        "Submit a complete complaint with accurate location details.",
        "Track updates regularly and provide feedback after resolution.",
      ]}
    />
  )
}
