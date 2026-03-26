import { NextResponse } from 'next/server';

//пока для поверки, потм переписать

const mockData = [{ id: 1, name: 'Avery Davis', email: 'avery@example.com', role: 'Editor', status: 'active' },
  { id: 2, name: 'Jordan Smith', email: 'jordan@example.com', role: 'Admin', status: 'pending' },
  { id: 3, name: 'Morgan Port', email: 'morgan@example.com', role: 'Maintainer', status: 'inactive' },];

export async function GET() {
  await new Promise(resolve => setTimeout(resolve, 1000))

  return NextResponse.json(mockData)
  }
