/** crates.io download counts, ISR-cached. */
export async function getCrateDownloads(crate: string): Promise<number | null> {
  try {
    const res = await fetch(`https://crates.io/api/v1/crates/${crate}`, {
      headers: { "User-Agent": "abhaythakur71181-portfolio (contact: abhaythakur71181@gmail.com)" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.crate?.downloads ?? null;
  } catch {
    return null;
  }
}
