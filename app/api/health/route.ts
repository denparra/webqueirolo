import { NextResponse } from 'next/server'

export async function GET() {
    return NextResponse.json({
        ok: true,
        timestamp: new Date().toISOString(),
        service: 'queirolo-web',
        version: '1.0.0',
    })
}
