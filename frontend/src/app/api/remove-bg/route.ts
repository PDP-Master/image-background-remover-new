import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();
    
    if (!image) {
      return NextResponse.json(
        { error: '缺少图片数据' },
        { status: 400 }
      );
    }

    const API_KEY = process.env.REMOVE_BG_API_KEY || 'w98ePuScjM2zVfpfQcVbSmR9';

    const formData = new FormData();
    formData.append('image_file_b64', image);
    formData.append('size', 'auto');
    formData.append('format', 'png');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': API_KEY
      },
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'API调用失败', details: errorText },
        { status: 500 }
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const binary = Array.from(new Uint8Array(arrayBuffer))
      .map(byte => String.fromCharCode(byte))
      .join('');
    const base64 = btoa(binary);

    return NextResponse.json({
      result: `data:image/png;base64,${base64}`,
      success: true
    });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}
