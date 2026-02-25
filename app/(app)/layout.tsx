import { Header } from '@/components/header'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className="container mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </>
  )
}
