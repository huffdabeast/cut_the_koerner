"use client";

import dynamic from 'next/dynamic';

// Dynamically import the SideMenuBar component to avoid SSR issues with hooks
const SideMenuBar = dynamic(() => import('../../components/ui/claude-side-menu'), {
  ssr: false,
});

export default function TechDirectoryPage() {
  return <SideMenuBar />;
}
