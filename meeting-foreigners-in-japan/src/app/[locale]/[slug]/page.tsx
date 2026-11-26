import { notFound } from "next/navigation";
import LocalizedInfoPage from "@/components/LocalizedInfoPage";

const supportedLocales = ["ja", "zh-cn", "zh-tw"];
const supportedSlugs = ["about", "terms", "privacy", "commercial-disclosure", "advertising"];

export function generateStaticParams() {
  return supportedLocales.flatMap((locale) => supportedSlugs.map((slug) => ({ locale, slug })));
}

export default async function LocalizedPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!supportedLocales.includes(locale) || !supportedSlugs.includes(slug)) notFound();
  return <LocalizedInfoPage params={Promise.resolve({ locale, slug })} />;
}
