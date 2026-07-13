import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'lib', 'lookbook.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to read lookbook data:', error);
    // Return empty array if file doesn't exist or is invalid
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Ensure the data is an array
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Invalid data format. Expected an array.' }, { status: 400 });
    }

    // Write back to file
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Failed to update lookbook data:', error);
    return NextResponse.json({ error: 'Failed to update lookbook data' }, { status: 500 });
  }
}
