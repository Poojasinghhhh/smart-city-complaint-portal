import { InfoPage } from "@/components/info-page"

export default function EmergencyPage() {
  return (
    <InfoPage
      title="Emergency Services"
      description="For urgent incidents, contact emergency services directly before raising a standard complaint."
      details={[
        "Police Emergency: 100",
        "Fire Emergency: 101",
        "Ambulance Emergency: 108",
      ]}
    />
  )
}
