import { InfoPage } from "@/components/info-page"

export default function PrivacyPage() {
  return (
    <InfoPage
      title="Privacy Policy"
      description="This policy explains what data is collected and how it is used within the complaint platform."
      details={[
        "Personal profile details are used only for authentication and complaint ownership.",
        "Complaint metadata may be used to improve public service planning and reporting.",
        "Sensitive credentials are never displayed publicly and are protected via secure access policies.",
      ]}
    />
  )
}
