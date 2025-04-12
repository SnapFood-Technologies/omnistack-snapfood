// src/middleware/api-auth.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export function validateApiKey(request: Request) {
  const headersList = headers();
  const apiKey = headersList.get('x-api-key');
  const validApiKey = process.env.API_KEY;

  if (!apiKey || apiKey !== validApiKey) {
    return new NextResponse(
      JSON.stringify({ 
        error: 'Unauthorized', 
        message: 'Invalid or missing API key' 
      }), 
      { 
        status: 401,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }

  return null;
}