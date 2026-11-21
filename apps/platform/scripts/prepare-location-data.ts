import { access, cp, mkdir, readdir, rm } from "node:fs/promises"
import { resolve } from "node:path"

const packagePath = resolve("node_modules/@countrystatecity/countries-browser")
const outputPath = resolve("public/data")

await rm(outputPath, { force: true, recursive: true })
await mkdir(outputPath, { recursive: true })
await cp(resolve(packagePath, "dist/data"), outputPath, { recursive: true })

for (const file of await readdir(packagePath)) {
  if (file === "LICENSE" || (file.startsWith("NOTICE-") && file.endsWith(".txt"))) {
    await cp(resolve(packagePath, file), resolve(outputPath, file))
  }
}

await Promise.all(
  ["countries.json", "version.json", "LICENSE", "NOTICE-SOURCES.txt"].map((file) =>
    access(resolve(outputPath, file)),
  ),
)
