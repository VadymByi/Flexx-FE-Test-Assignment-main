import { NextResponse } from 'next/server'

import { data } from '@/app/api/fake-db/pages/flexx-table/index'

export async function GET() {
  await new Promise(resolve => setTimeout(resolve, 500)) // затримкузробив для демонстрації склетонута щоб сторінка нне мерехтіла при швидкому завантаженні

  return NextResponse.json(data)
}
