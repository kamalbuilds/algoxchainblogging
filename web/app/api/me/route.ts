// If you're specifically asked to export HTTP methods by name
import { NextRequest, NextResponse } from 'next/server';

// Named export for the GET method
export async function GET(req: NextRequest, res: NextResponse) {
    return new Response('Hello, from API!');
}
