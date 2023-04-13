import { Inter } from 'next/font/google'
import FactTable from '@/components/FactTable'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-6xl font-bold text-center">Kitty Fact Table</h1>
    <FactTable/>
    </main>
  )
}
