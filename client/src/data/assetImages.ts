// client/src/data/assetImages.ts
type GlobModule = Record<string, { default: string } | string>;

const modules = import.meta.glob("../assets/*.png", { eager: true }) as GlobModule;

function getUrl(mod: { default: string } | string) {
  return typeof mod === "string" ? mod : mod.default;
}

export function assetPngUrl(fileName: string): string | null {
  // fileName 예: "1-1.png"
  for (const path in modules) {
    if (path.endsWith(`/${fileName}`)) return getUrl(modules[path]);
  }
  return null;
}

export function assetPngUrls(fileNames: string[]): string[] {
  return fileNames
    .map((n) => assetPngUrl(n))
    .filter((x): x is string => typeof x === "string");
}