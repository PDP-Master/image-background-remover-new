export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 处理 remove-bg API
    if (url.pathname === '/api/remove-bg' && request.method === 'POST') {
      try {
        const { image } = await request.json();
        
        if (!image) {
          return new Response(JSON.stringify({ error: '缺少图片数据' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const formData = new FormData();
        formData.append('image_file_b64', image);
        formData.append('size', 'auto');
        formData.append('format', 'png');

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
          method: 'POST',
          headers: {
            'X-Api-Key': env.REMOVE_BG_API_KEY || 'w98ePuScjM2zVfpfQcVbSmR9'
          },
          body: formData
        });

        if (!response.ok) {
          const errorText = await response.text();
          return new Response(JSON.stringify({ 
            error: 'API调用失败',
            details: errorText
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const arrayBuffer = await response.arrayBuffer();
        const binary = Array.from(new Uint8Array(arrayBuffer))
          .map(byte => String.fromCharCode(byte))
          .join('');
        const base64 = btoa(binary);

        return new Response(JSON.stringify({ 
          result: `data:image/png;base64,${base64}`,
          success: true
        }), {
          headers: { 'Content-Type': 'application/json' }
        });

      } catch (error) {
        return new Response(JSON.stringify({ 
          error: error.message 
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response('BG Remover API', { status: 200 });
  }
};
