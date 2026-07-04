import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-edge-strong bg-terminal text-left shadow-xl">
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" aria-hidden="true" />
        </div>
        <div className="p-4 font-mono text-[13px] leading-relaxed">
          <p className="text-white/90">
            <span className="text-emerald-400">abhay@nixos:~$</span> cd{" "}
            {`{requested-page}`}
          </p>
          <p className="text-red-400">
            cd: no such file or directory <span className="text-white/40">(404)</span>
          </p>
          <p className="mt-2 text-white/60">
            The page you&apos;re looking for was moved, deleted, or never
            existed in the first place.
          </p>
          <p className="mt-2 text-white/90">
            <span className="text-emerald-400">abhay@nixos:~$</span> cd ~{" "}
            <span className="cursor-blink text-emerald-400">▊</span>
          </p>
        </div>
      </div>
      <Link
        href="/"
        className="rounded-lg bg-accent px-4 py-2 font-mono text-sm font-medium text-bg transition-opacity hover:opacity-90"
      >
        cd ~ (go home)
      </Link>
    </div>
  );
}
