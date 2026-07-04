import type { Metadata } from "next";
import { Reveal } from "@/components/motion";
import { SectionHeading } from "@/components/section-heading";
import { Guestbook } from "@/components/guestbook";

export const metadata: Metadata = {
  title: "Guestbook",
  description: "Sign the guestbook — leave a message, a meme, or a code review.",
  alternates: { canonical: "/guestbook" },
};

export default function GuestbookPage() {
  return (
    <div className="flex flex-col gap-8">
      <Reveal>
        <SectionHeading as="h1">guestbook</SectionHeading>
        <p className="max-w-xl text-sm leading-relaxed text-muted">
          Sign in with GitHub or Google and leave your mark — a hello, a hot
          take, or an unsolicited code review. All welcome.
        </p>
      </Reveal>
      <Reveal>
        <Guestbook />
      </Reveal>
    </div>
  );
}
