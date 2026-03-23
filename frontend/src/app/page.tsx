'use client';

import { useState } from 'react';

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatus('请选择图片文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setOriginalImage(result);
      setResultImage(null);
      setStatus('图片已加载，点击"开始处理"');
    };
    reader.readAsDataURL(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatus('请选择图片文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      const result = evt.target?.result as string;
      setOriginalImage(result);
      setResultImage(null);
      setStatus('图片已加载，点击"开始处理"');
    };
    reader.readAsDataURL(file);
  }

  async function handleProcess() {
    if (!originalImage) return;

    setIsProcessing(true);
    setStatus('正在去除背景，请稍候...');

    try {
      const base64 = originalImage.split(',')[1];

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 })
      });

      const data = await response.json();

      if (data.result) {
        setResultImage(data.result);
        setStatus('✅ 处理完成！点击图片可保存');
      } else {
        throw new Error(data.error || '处理失败');
      }
    } catch (err) {
      setStatus(`❌ ${err instanceof Error ? err.message : '处理失败'}`);
    } finally {
      setIsProcessing(false);
    }
  }

  function downloadImage(dataUrl: string, filename: string) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
  }

  function triggerFileSelect() {
    const input = document.getElementById('file-input') as HTMLInputElement;
    input?.click();
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #fef3c7, #fef9c3, #fef3c7)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#92400e', marginBottom: '0.5rem' }}>
            🖼️ AI 背景去除
          </h1>
          <p style={{ color: '#92400e' }}>上传图片，自动去除背景</p>
        </div>

        {/* Upload Area */}
        <div
          style={{
            backgroundColor: '#fffbeb',
            borderRadius: '1rem',
            padding: '2rem',
            marginBottom: '1.5rem',
            cursor: 'pointer',
            border: '3px dashed #d97706',
          }}
          onClick={triggerFileSelect}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <input
            id="file-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          
          {!originalImage ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
              <p style={{ color: '#92400e', fontSize: '1.125rem' }}>
                点击或拖拽图片到这里
              </p>
              <p style={{ color: '#b45309', fontWeight: 500, marginTop: '0.5rem' }}>
                或浏览文件
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <h3 style={{ textAlign: 'center', fontWeight: 600, color: '#92400e', marginBottom: '0.75rem' }}>原图</h3>
                <img
                  src={originalImage}
                  alt="原图"
                  style={{ width: '100%', borderRadius: '0.5rem', border: '2px solid #d97706' }}
                />
              </div>
              <div>
                <h3 style={{ textAlign: 'center', fontWeight: 600, color: '#92400e', marginBottom: '0.75rem' }}>结果</h3>
                {resultImage ? (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={resultImage}
                      alt="结果"
                      style={{ width: '100%', borderRadius: '0.5rem', border: '2px solid #22c55e' }}
                    />
                    <button
                      onClick={(e) => { e.stopPropagation(); downloadImage(resultImage, 'removed-bg.png'); }}
                      style={{
                        position: 'absolute',
                        bottom: '0.5rem',
                        right: '0.5rem',
                        backgroundColor: '#22c55e',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                      }}
                    >
                      下载
                    </button>
                  </div>
                ) : (
                  <div style={{ 
                    width: '100%', 
                    height: '12rem', 
                    borderRadius: '0.5rem', 
                    border: '2px dashed #d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#b45309'
                  }}>
                    等待处理
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Process Button */}
        <button
          onClick={handleProcess}
          disabled={!originalImage || isProcessing}
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '0.75rem',
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'white',
            background: (!originalImage || isProcessing) ? '#d6d3d1' : 'linear-gradient(to right, #d97706, #eab308)',
            cursor: (!originalImage || isProcessing) ? 'not-allowed' : 'pointer',
            border: 'none',
          }}
        >
          {isProcessing ? '处理中...' : '✨ 开始处理'}
        </button>

        {/* Status */}
        {status && (
          <p style={{ 
            textAlign: 'center', 
            marginTop: '1rem', 
            color: status.includes('✅') ? '#16a34a' : status.includes('❌') ? '#dc2626' : '#92400e' 
          }}>
            {status}
          </p>
        )}

        {/* Tips */}
        <div style={{ marginTop: '2rem', backgroundColor: '#fef3c7', padding: '1rem', borderRadius: '0.75rem', fontSize: '0.875rem', color: '#92400e' }}>
          <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>💡 提示</p>
          <ul style={{ listStyle: 'disc', paddingLeft: '1.25rem' }}>
            <li>支持 PNG、JPG、WebP 等常见格式</li>
            <li>最佳效果：主体清晰、背景简单</li>
            <li>处理后的图片为 PNG 格式（透明背景）</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
