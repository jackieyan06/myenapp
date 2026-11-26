import { InfoLayout } from "@/components/InfoLayout";

const channels = ["YouTube", "X", "Meta", "Instagram", "TikTok", "LinkedIn"];

export default function AdvertisingPage() {
  return <InfoLayout title="Advertising with EnJapan" intro="Reach an engaged community interested in meeting people, discovering local experiences and exploring life in Japan.">
    <h2>Partner with EnJapan</h2>
    <p>EnJapan welcomes relevant brand partnerships, sponsored content, event collaborations and community-focused campaigns. We are interested in working with organisations whose products and services add value to international residents, visitors and Japanese communities.</p>
    <h2>Potential collaboration channels</h2>
    <ul>{channels.map((channel) => <li key={channel}>{channel}</li>)}</ul>
    <p>Campaigns may include sponsored editorial or social posts, event partnerships, featured offers and cross-platform promotions. Availability, deliverables, audience information, fees and campaign terms are agreed individually. We do not guarantee reach, impressions, engagement or sales.</p>
    <h2>Transparency</h2><p>Paid placements, sponsorships, affiliate links and other material commercial relationships will be identified clearly where required by applicable law and platform policies. Editorial or community content will not be presented as an independent recommendation when it is paid advertising.</p>
    <h2>Enquire about a partnership</h2><p>Tell us about your organisation, campaign objective, target audience, preferred timing and budget. Contact <a href="mailto:enjapan.support@gmail.com?subject=EnJapan%20Advertising%20Enquiry">enjapan.support@gmail.com</a>.</p>
    <h2>Connect with EnJapan</h2><p>Follow our channels as they launch. Official profile links will be added here once each account is established and verified.</p>
    <ul>{channels.map((channel) => <li key={channel}>{channel} — official account link coming soon</li>)}</ul>
  </InfoLayout>;
}
