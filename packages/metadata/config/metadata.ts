import type { Metadata } from "next"

import { baseKeywords } from "./keywords"
export { baseKeywords } from "./keywords"

const defaultDescription =
  "Behind every thriving congregation is a community of people working together. Churchbase gives church teams a shared foundation to organize their work, care for their members, coordinate ministries, and focus more of their time on what matters most: serving their community."

export interface MetadataConfig extends Omit<Metadata, "description" | "keywords"> {
  name: string
  url: string
  ogImage?: string
  description?: string
  keywords?: string[]
}

export function createMetadata(config: MetadataConfig): Metadata {
  const {
    name,
    url,
    ogImage = `${url}/og.png`,
    description = defaultDescription,
    keywords = baseKeywords,
    ...rest
  } = config

  return {
    title: {
      default: name,
      template: `%s | ${name}`,
    },
    description,
    keywords,
    authors: [
      {
        name: "Churchbase",
        url,
      },
    ],
    creator: "Churchbase",
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      title: name,
      description,
      siteName: name,
      ...(config.openGraph || {}),
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
      images: [ogImage],
      ...(config.twitter || {}),
    },
    icons: {
      icon: "/favicon.ico",
    },
    manifest: "/site.webmanifest",
    ...rest,
  }
}
