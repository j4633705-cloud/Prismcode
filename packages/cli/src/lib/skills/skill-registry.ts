import type { SkillRegistryEntry, SkillRegistryResponse } from "@prismcode543/shared";

const DEFAULT_REGISTRY_URL = "https://registry.prismcode.dev/api/v1/skills";

export class SkillRegistry {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl ?? DEFAULT_REGISTRY_URL;
  }

  async search(query?: string, page = 1, limit = 20): Promise<SkillRegistryResponse> {
    const url = new URL(this.baseUrl);
    if (query) url.searchParams.set("q", query);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Registry search failed: ${res.statusText}`);
    return res.json() as Promise<SkillRegistryResponse>;
  }

  async getSkillUrl(name: string, version?: string): Promise<string> {
    const url = new URL(`${this.baseUrl}/${encodeURIComponent(name)}`);
    if (version) url.searchParams.set("version", version);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Registry lookup failed for "${name}": ${res.statusText}`);
    const data = await res.json() as { downloadUrl: string };
    return data.downloadUrl;
  }

  async getPopularTags(): Promise<string[]> {
    try {
      const res = await fetch(`${this.baseUrl}/tags`);
      if (!res.ok) return [];
      const data = await res.json() as { tags: string[] };
      return data.tags ?? [];
    } catch {
      return [];
    }
  }
}

export const skillRegistry = new SkillRegistry();
