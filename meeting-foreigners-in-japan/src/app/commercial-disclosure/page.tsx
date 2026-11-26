import { InfoLayout } from "@/components/InfoLayout";

export default function CommercialDisclosurePage() {
  return <InfoLayout pageKey="commercial-disclosure" locale="en" title="Commercial Disclosure" intro="Information disclosed under Japan’s Act on Specified Commercial Transactions (特定商取引法).">
    <p><strong>Business operator:</strong> Individual business operator</p>
    <p><strong>Business name:</strong> EnJapan (縁)</p>
    <p><strong>Contact email:</strong> <a href="mailto:enjapan.support@gmail.com">enjapan.support@gmail.com</a></p>
    <p><strong>Business address and telephone number:</strong> In accordance with Article 11 of Japan’s Act on Specified Commercial Transactions, these details will be disclosed promptly upon request. Please contact us by email to request this information.</p>
    <h2>Pricing and payment</h2><p>Where paid plans, event fees or other paid services are offered, the price, applicable taxes, payment method, payment timing and any additional charges will be displayed on the relevant purchase or checkout screen before an order is placed. Subscription prices and renewal conditions will be shown before subscription confirmation.</p>
    <h2>Delivery or provision</h2><p>Digital services are generally made available electronically after successful registration or payment, as described on the relevant service or checkout screen. Event-related services are provided at the date, time and venue stated in the event listing.</p>
    <h2>Cancellation, refunds and withdrawal</h2><p>Any cancellation, refund or withdrawal conditions applicable to a paid plan, event or service will be presented before purchase. Where no special terms are displayed, please contact us promptly at the email address above. Statutory rights under applicable law are not limited by this notice.</p>
    <h2>Additional charges</h2><p>Users are responsible for internet connection and communication charges. Any other fees will be disclosed before purchase where applicable.</p>
    <p><em>This disclosure should be checked and updated to match the exact payment, subscription, event and refund flows before accepting payments.</em></p>
  </InfoLayout>;
}
