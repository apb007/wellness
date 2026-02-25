import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Header />
      <main className="container mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12">
          {/* Hero Section */}
          <section className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
              <span className="text-3xl font-bold text-primary">W</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Your Wellness Journey Starts Here
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Calculate your Overall Wellness Score by assessing three key dimensions of your health: happiness, physical fitness, and mental health. Track your progress and build a healthier you.
            </p>
            <Link href="/input">
              <Button size="lg" className="mt-4">
                Start Assessment
              </Button>
            </Link>
          </section>

          {/* Features Section */}
          <section className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
              </div>
              <h3 className="font-semibold">Quick Assessment</h3>
              <p className="text-sm text-muted-foreground">
                Complete your wellness assessment in just a few minutes with our intuitive form.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="font-semibold">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                View your wellness scores over time and identify trends in your health metrics.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              </div>
              <h3 className="font-semibold">Get Insights</h3>
              <p className="text-sm text-muted-foreground">
                Receive personalized recommendations based on your wellness assessment results.
              </p>
            </div>
          </section>

          {/* CTA Section */}
          <section className="rounded-lg border border-border bg-card p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold">Ready to Take Control of Your Wellness?</h2>
            <p className="mb-6 text-muted-foreground">
              Start your assessment now and get your personalized wellness score.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/input">
                <Button>Start Assessment</Button>
              </Link>
              <Link href="/history">
                <Button variant="outline">View History</Button>
              </Link>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
