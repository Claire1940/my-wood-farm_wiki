"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.my-wood-farm.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "My Wood Farm Wiki",
        description:
          "My Wood Farm Wiki for Roblox covers codes, best axes, upgrade paths, rebirth, tree farming, cash strategies, and offline earnings.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "My Wood Farm - Idle Woodcutting Simulator",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "My Wood Farm Wiki",
        alternateName: "My Wood Farm",
        url: siteUrl,
        description:
          "Complete My Wood Farm Wiki resource hub for codes, axes, upgrades, rebirth, tree farming, and offline earnings",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "My Wood Farm Wiki - Idle Woodcutting Simulator",
        },
        sameAs: [
          "https://www.roblox.com/games/79267089300389/My-Wood-Farm",
          "https://www.roblox.com/communities/308844184/Did-I-Axe",
        ],
      },
      {
        "@type": "VideoGame",
        name: "My Wood Farm",
        gamePlatform: ["Web", "Roblox"],
        applicationCategory: "Game",
        genre: ["Simulation", "Idle", "Farming", "Incremental"],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/79267089300389/My-Wood-Farm",
        },
      },
      {
        "@type": "VideoObject",
        name: "My Wood Farm Gameplay - Rarest Axe Showcase",
        description:
          "My Wood Farm Roblox gameplay showcasing the rarest axe, chopping trees, wood farming and progression.",
        uploadDate: "2026-03-12",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/gleNyfWuQUw",
        url: "https://www.youtube.com/watch?v=gleNyfWuQUw",
      },
    ],
  };

  // Accordion states
  const [plotExpanded, setPlotExpanded] = useState<number | null>(0);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Tools Grid 卡片锚点映射（与下方 8 个 section id 一一对应）
  const sectionIds = [
    "codes",
    "beginner-guide",
    "axe-tier-list",
    "money-farming",
    "trees-and-wood-values",
    "upgrade-order",
    "plot-expansion-guide",
    "offline-earnings-and-updates",
  ];

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="scroll-reveal text-center mb-8">
            {/* Badge */}
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)]
                          bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1.5 md:mb-6 md:px-4 md:py-2"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs font-medium md:text-sm">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="mb-4 text-4xl font-bold leading-[1.05] sm:text-5xl md:mb-6 md:text-7xl">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[hsl(var(--nav-theme))]
                           px-6 py-3.5 font-semibold text-base text-white transition-colors
                           hover:bg-[hsl(var(--nav-theme)/0.9)] md:px-8 md:py-4 md:text-lg"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/79267089300389/My-Wood-Farm"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border
                           px-6 py-3.5 font-semibold text-base transition-colors hover:bg-white/10
                           md:px-8 md:py-4 md:text-lg"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section */}
      <section className="px-4 py-10 md:py-12">
        <div className="container mx-auto max-w-5xl scroll-reveal">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="gleNyfWuQUw"
              title="My Wood Farm Gameplay - Rarest Axe Showcase"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards */}
      <section className="bg-white/[0.02] px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-8 text-center scroll-reveal md:mb-12">
            <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base text-muted-foreground md:text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = sectionIds[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="group scroll-reveal cursor-pointer rounded-xl border border-border bg-card p-4 text-left
                             transition-all duration-300 hover:border-[hsl(var(--nav-theme)/0.5)]
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)] md:p-6"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg
                                bg-[hsl(var(--nav-theme)/0.1)] transition-colors
                                group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                md:mb-4 md:h-12 md:w-12"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 text-[hsl(var(--nav-theme-light))] md:h-6 md:w-6"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold md:text-base">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端方形 / 桌面横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Latest Updates */}
      <LatestGuidesAccordion
        articles={latestArticles}
        locale={locale}
        max={12}
      />

      {/* Module 1: Codes */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.woodFarmCodes.eyebrow}
            title={t.modules.woodFarmCodes.title}
            intro={t.modules.woodFarmCodes.intro}
          />
          <div className="grid grid-cols-1 gap-4 scroll-reveal md:grid-cols-3">
            {t.modules.woodFarmCodes.cards.map((card: any, index: number) => (
              <div
                key={index}
                className="flex flex-col rounded-xl border border-border bg-white/5 p-6 transition-colors
                           hover:border-[hsl(var(--nav-theme)/0.5)]"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.15)]">
                  <DynamicIcon
                    name={card.icon}
                    className="h-6 w-6 text-[hsl(var(--nav-theme-light))]"
                  />
                </div>
                <h3 className="mb-2 text-lg font-bold text-[hsl(var(--nav-theme-light))]">
                  {card.status}
                </h3>
                <p className="mb-4 flex-1 text-sm text-muted-foreground">
                  {card.reward}
                </p>
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)]
                                  bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1 text-xs">
                  <Check className="h-3.5 w-3.5 text-[hsl(var(--nav-theme-light))]" />
                  {card.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 bg-white/[0.02] px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.woodFarmBeginnerGuide.eyebrow}
            title={t.modules.woodFarmBeginnerGuide.title}
            intro={t.modules.woodFarmBeginnerGuide.intro}
          />
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.woodFarmBeginnerGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 rounded-xl border border-border bg-white/5 p-4 transition-colors
                           hover:border-[hsl(var(--nav-theme)/0.5)] md:gap-4 md:p-6"
              >
                <div className="flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-xl
                                border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)]
                                md:h-12 md:w-12">
                  <DynamicIcon
                    name={step.icon}
                    className="h-4 w-4 text-[hsl(var(--nav-theme-light))] md:h-5 md:w-5"
                  />
                  <span className="mt-0.5 text-[10px] font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="mb-1 text-lg font-bold md:mb-2 md:text-xl">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground md:text-base">
                    {step.description}
                  </p>
                  <p className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
                    <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                    <span>{step.tip}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Axe Tier List */}
      <section id="axe-tier-list" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.woodFarmAxeTierList.eyebrow}
            title={t.modules.woodFarmAxeTierList.title}
            intro={t.modules.woodFarmAxeTierList.intro}
          />
          <div className="scroll-reveal space-y-4">
            {t.modules.woodFarmAxeTierList.tiers.map((tier: any, index: number) => (
              <div
                key={index}
                className="flex flex-col gap-4 rounded-xl border border-border bg-white/5 p-5 transition-colors
                           hover:border-[hsl(var(--nav-theme)/0.5)] md:flex-row md:items-center md:p-6"
              >
                <div className="flex items-center gap-4 md:w-48 md:flex-shrink-0">
                  <div
                    className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-2xl font-black text-white"
                    style={{
                      backgroundColor: `hsl(var(--nav-theme) / ${0.45 + (3 - index) * 0.12})`,
                    }}
                  >
                    {tier.tier}
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {tier.label}
                    </p>
                    <p className="text-lg font-bold text-[hsl(var(--nav-theme-light))]">
                      {tier.name}
                    </p>
                  </div>
                </div>
                <div className="flex-1">
                  <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)]
                                    bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1 text-xs font-medium">
                    <DynamicIcon
                      name={tier.icon}
                      className="h-3.5 w-3.5 text-[hsl(var(--nav-theme-light))]"
                    />
                    {tier.best_for}
                  </span>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Money Farming */}
      <section id="money-farming" className="scroll-mt-24 bg-white/[0.02] px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.woodFarmMoneyFarming.eyebrow}
            title={t.modules.woodFarmMoneyFarming.title}
            intro={t.modules.woodFarmMoneyFarming.intro}
          />
          <div className="grid grid-cols-1 gap-4 scroll-reveal md:grid-cols-2 lg:grid-cols-3">
            {t.modules.woodFarmMoneyFarming.methods.map((m: any, index: number) => (
              <div
                key={index}
                className="flex flex-col rounded-xl border border-border bg-white/5 p-6 transition-colors
                           hover:border-[hsl(var(--nav-theme)/0.5)]"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.15)]">
                    <DynamicIcon
                      name={m.icon}
                      className="h-5 w-5 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.15)]
                                   text-xs font-bold text-[hsl(var(--nav-theme-light))]">
                    {m.priority}
                  </span>
                </div>
                <h3 className="mb-1 font-bold">{m.name}</h3>
                <p className="mb-3 text-xs uppercase tracking-wider text-[hsl(var(--nav-theme-light))]">
                  {m.session_type}
                </p>
                <p className="mb-3 flex-1 text-sm text-muted-foreground">
                  {m.description}
                </p>
                <p className="flex items-start gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                  <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                  <span>{m.action}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 5: Trees and Wood Values */}
      <section id="trees-and-wood-values" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.woodFarmTreesAndValues.eyebrow}
            title={t.modules.woodFarmTreesAndValues.title}
            intro={t.modules.woodFarmTreesAndValues.intro}
          />
          {/* 桌面端表格 */}
          <div className="scroll-reveal hidden overflow-hidden rounded-xl border border-border md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-[hsl(var(--nav-theme)/0.1)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Target</th>
                  <th className="px-4 py-3 font-semibold">Durability</th>
                  <th className="px-4 py-3 font-semibold">Wood Yield</th>
                  <th className="px-4 py-3 font-semibold">Selling Value</th>
                  <th className="px-4 py-3 font-semibold">Best Stage</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.woodFarmTreesAndValues.rows.map((row: any, index: number) => (
                  <tr
                    key={index}
                    className="border-t border-border align-top transition-colors hover:bg-white/5"
                  >
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 font-semibold">
                        <DynamicIcon
                          name={row.icon}
                          className="h-4 w-4 text-[hsl(var(--nav-theme-light))]"
                        />
                        {row.target}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {row.notes}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{row.durability}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.wood_yield}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.selling_value}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row.recommended_progression}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* 移动端卡片 */}
          <div className="scroll-reveal space-y-4 md:hidden">
            {t.modules.woodFarmTreesAndValues.rows.map((row: any, index: number) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-white/5 p-5"
              >
                <span className="mb-3 flex items-center gap-2 text-lg font-bold">
                  <DynamicIcon
                    name={row.icon}
                    className="h-5 w-5 text-[hsl(var(--nav-theme-light))]"
                  />
                  {row.target}
                </span>
                <dl className="space-y-2 text-sm">
                  <DetailRow label="Durability" value={row.durability} />
                  <DetailRow label="Wood Yield" value={row.wood_yield} />
                  <DetailRow label="Selling Value" value={row.selling_value} />
                  <DetailRow label="Best Stage" value={row.recommended_progression} />
                </dl>
                <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                  {row.notes}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Upgrade Order */}
      <section id="upgrade-order" className="scroll-mt-24 bg-white/[0.02] px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.woodFarmUpgradeOrder.eyebrow}
            title={t.modules.woodFarmUpgradeOrder.title}
            intro={t.modules.woodFarmUpgradeOrder.intro}
          />
          <div className="scroll-reveal relative space-y-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] pl-6">
            {t.modules.woodFarmUpgradeOrder.steps.map((step: any, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-[1.65rem] flex h-8 w-8 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme))] text-sm font-bold text-white">
                  {index + 1}
                </div>
                <div className="rounded-xl border border-border bg-white/5 p-5 transition-colors hover:border-[hsl(var(--nav-theme)/0.5)]">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <DynamicIcon
                      name={step.icon}
                      className="h-5 w-5 text-[hsl(var(--nav-theme-light))]"
                    />
                    <h3 className="text-lg font-bold">{step.stage}</h3>
                    <span className="rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)]
                                     px-3 py-0.5 text-xs">
                      {step.priority}
                    </span>
                  </div>
                  <p className="mb-2 text-sm text-muted-foreground">{step.action}</p>
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Why it matters: </span>
                    {step.why}
                  </p>
                  <p className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[hsl(var(--nav-theme-light))]" />
                    <span>{step.spend_rule}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Plot Expansion Guide */}
      <section id="plot-expansion-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.woodFarmPlotExpansion.eyebrow}
            title={t.modules.woodFarmPlotExpansion.title}
            intro={t.modules.woodFarmPlotExpansion.intro}
          />
          <div className="scroll-reveal space-y-3">
            {t.modules.woodFarmPlotExpansion.items.map((item: any, index: number) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-border bg-white/5"
              >
                <button
                  onClick={() => setPlotExpanded(plotExpanded === index ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-white/5"
                >
                  <span className="flex items-center gap-3 font-semibold">
                    <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.15)]
                                     text-xs font-bold text-[hsl(var(--nav-theme-light))]">
                      {index + 1}
                    </span>
                    {item.title}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform ${plotExpanded === index ? "rotate-180" : ""}`}
                  />
                </button>
                {plotExpanded === index && (
                  <div className="px-5 pb-5 text-sm text-muted-foreground">
                    {item.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 8: Offline Earnings and Updates */}
      <section id="offline-earnings-and-updates" className="scroll-mt-24 bg-white/[0.02] px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={t.modules.woodFarmOfflineEarnings.eyebrow}
            title={t.modules.woodFarmOfflineEarnings.title}
            intro={t.modules.woodFarmOfflineEarnings.intro}
          />
          <div className="grid grid-cols-1 gap-4 scroll-reveal md:grid-cols-2 lg:grid-cols-3">
            {t.modules.woodFarmOfflineEarnings.cards.map((card: any, index: number) => (
              <div
                key={index}
                className="flex flex-col rounded-xl border border-border bg-white/5 p-6 transition-colors
                           hover:border-[hsl(var(--nav-theme)/0.5)]"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.15)]">
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <span className="rounded-full border border-[hsl(var(--nav-theme)/0.3)] bg-[hsl(var(--nav-theme)/0.1)]
                                   px-2.5 py-0.5 text-xs">
                    {card.category}
                  </span>
                </div>
                <h3 className="mb-2 font-bold">{card.title}</h3>
                <p className="mb-3 text-sm font-medium text-[hsl(var(--nav-theme-light))]">
                  {card.value}
                </p>
                <p className="flex-1 text-sm text-muted-foreground">{card.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="border-t border-border bg-white/[0.02]">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
            {/* Brand */}
            <div>
              <h3 className="mb-4 text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="mb-4 font-semibold">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.roblox.com/games/79267089300389/My-Wood-Farm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.robloxGame}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/communities/308844184/Did-I-Axe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.robloxGroup}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="mb-4 font-semibold">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground transition hover:text-[hsl(var(--nav-theme-light))]"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="mb-2 text-sm text-muted-foreground">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------- 局部展示组件 ---------- */

function ModuleHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <div className="mb-8 text-center scroll-reveal md:mb-12">
      <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--nav-theme)/0.3)]
                        bg-[hsl(var(--nav-theme)/0.1)] px-3 py-1 text-xs font-semibold uppercase tracking-wider
                        text-[hsl(var(--nav-theme-light))]">
        {eyebrow}
      </span>
      <h2 className="mb-3 text-3xl font-bold md:mb-4 md:text-5xl">{title}</h2>
      <p className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg">
        {intro}
      </p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
