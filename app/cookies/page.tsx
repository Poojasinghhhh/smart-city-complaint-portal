import { InfoPage } from "@/components/info-page"

export default function CookiesPage() {
  return (
    <InfoPage
      title="Cookie Policy"
      description="Cookies help keep you signed in and improve portal usability."
      details={[
        "Essential cookies are used for session handling and secure authentication.",
        "Preference cookies may store UI settings for a smoother user experience.",
        "You can clear browser cookies at any time, but you may need to sign in again.",
      ]}
    />
  )
}
