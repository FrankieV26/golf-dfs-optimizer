import { NextRequest, NextResponse } from 'next/server';
import { getDKGolfers } from '@/lib/draftkings';
import { parseFanDuelCSV } from '@/lib/fanduel';

/** GET: Fetch DraftKings golfers for the current slate */
export async function GET(req: NextRequest) {
  const platform = req.nextUrl.searchParams.get('platform') || 'draftkings';

  try {
    if (platform === 'draftkings') {
      const data = await getDKGolfers();
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { error: 'Use POST with CSV body for FanDuel players' },
      { status: 400 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/** POST: Parse uploaded FanDuel CSV */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('csv') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No CSV file provided' }, { status: 400 });
    }

    const text = await file.text();
    const golfers = parseFanDuelCSV(text);

    return NextResponse.json({
      golfers,
      tournament: 'FanDuel Upload',
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
