import { Lora } from "next/font/google"
import Image from "next/image"
import type { JSX } from "react"

const lora = Lora({ subsets: ["latin"] })

export function BrandHeader(): JSX.Element {
  return (
    <header className="fixed inset-x-0 top-0 z-10 flex items-center justify-center gap-2 px-4 py-4 sm:px-6">
      <Image
        src="/logo/churchbase-light-transparent.webp"
        alt=""
        width={500}
        height={500}
        className="size-8 shrink-0 object-contain dark:hidden"
      />
      <Image
        src="/logo/churchbase-dark-transparent.webp"
        alt=""
        width={500}
        height={500}
        className="hidden size-8 shrink-0 object-contain dark:block"
      />
      <h1 className={`${lora.className} text-foreground text-2xl font-normal tracking-normal`}>
        Churchbase
      </h1>
    </header>
  )
}
