import { NextResponse } from 'next/server';

import { getLegitFsContext } from '@/lib/server/legitFsContext';

export async function POST(req: Request) {
  const { formState } = await req.json();

  const { legitFs } = await getLegitFsContext();

  await legitFs.promises.writeFile(
    '/.legit/branches/main/forms.json',
    JSON.stringify(formState, null, 2),
    'utf8'
  );

  return NextResponse.json({ status: 'ok' });
}
