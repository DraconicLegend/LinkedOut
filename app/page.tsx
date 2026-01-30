import Feed from "@/components/Feed";
import SuggestPromptWidget from "@/components/SuggestPromptWidget";

import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/Logo';

export default function Home() {
  return (
    <main className="container">
      <header className="header" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <Logo size={52} />
        {/* Removed SIDECHAT_v2 text as the logo now carries the brand name "LinkedOut" */}
        {/* Auth status could go here */}
      </header>

      <section>
        <Feed />
      </section>

      <SuggestPromptWidget />
    </main>
  );
}
