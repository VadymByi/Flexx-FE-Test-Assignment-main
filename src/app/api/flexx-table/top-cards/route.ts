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
      value: payments,
      icon: 'ri-user-follow-line',
      color: 'success',
      isPending: false
    },
    {
      title: 'Pending Payments',
      value: pendingPayments,
      icon: 'ri-user-add-line',
      color: 'success',
      isPending: true
    },
    {
      title: 'Payouts',
      value: payouts,
      icon: 'ri-user-follow-line',
      color: 'error',
      isPending: false
    },
    {
      title: 'Pending Payouts',
      value: pendingPayouts,
      icon: 'ri-user-add-line',
      color: 'error',
      isPending: true
    }
  ]

  return NextResponse.json(stats)
}
