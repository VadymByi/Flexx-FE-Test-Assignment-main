import { NextResponse } from 'next/server'

import { data } from '@/app/api/fake-db/pages/flexx-table/index'

export async function GET() {
  const payments = data.filter(item => item.status === 'Completed').reduce((acc, item) => acc + item.amount, 0)

  const pendingPayments = data
    .filter(item => item.status === 'Pending' || item.status === 'Processing')
    .reduce((acc, item) => acc + item.amount, 0)

  //у  базі немає даних ро витрати, тому роблю типу заглушки з рандомними числами, але у логічних межах - не більше доходів
  const payouts = Math.floor(Math.random() * payments)
  const pendingPayouts = Math.floor(Math.random() * payouts)

  const stats = [
    {
      title: 'Payments',
      stats: `${payments.toLocaleString('en-US')}`,
      icon: 'ri-user-follow-line',
      color: 'success',
      trendNumber: '15%', // захардкодил для соответствия типу
      trend: 'positive'
    },
    {
      title: 'Pending Payments',
      stats: `${pendingPayments.toLocaleString('en-US')}`,
      icon: 'ri-user-add-line',
      color: 'success',
      trendNumber: '5%',
      trend: 'positive'
    },
    {
      title: 'Payouts',
      stats: `${payouts.toLocaleString('en-US')}`,
      icon: 'ri-user-follow-line',
      color: 'error',
      trendNumber: '10%',
      trend: 'negative'
    },
    {
      title: 'Pending Payouts',
      stats: `${pendingPayouts.toLocaleString('en-US')}`,
      icon: 'ri-user-add-line',
      color: 'error',
      trendNumber: '2%',
      trend: 'negative'
    }
  ]

  return NextResponse.json(stats)
}
