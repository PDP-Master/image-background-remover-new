'use client';

import { useState, useRef } from 'react';

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setStatus('请选择图片文件');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setResultImage(null);
      setStatus('图片已加载，点击"开始处理"');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleProcess = async () => {
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
  };

  const downloadImage = (dataUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-yellow-50 to-amber-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">
            🖼️ AI 背景去除
          </h1>
          <p className="text-amber-700">上传图片，自动去除背景</p>
        </div>

        {/* Upload Area */}
        <div
          className={`
            bg-amber-50 rounded-2xl p-8 mb-6 cursor-pointer
            border-3 border-dashed transition-all duration-300
            ${isDragOver 
              ? 'border-amber-500 bg-amber-100' 
              : 'border-amber-300 hover:border-amber-500 hover:bg-amber-100'
            }
          `}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
          
          {!originalImage ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📁</div>
              <p className="text-amber-800 text-lg">
                点击或拖拽图片到这里
              </p>
              <p className="text-amber-600 font-medium mt-2">
                或浏览文件
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              {/* Original */}
              <div>
                <h3 className="text-center font-semibold text-gray-700 mb-3">原图</h3>
                <img
                  src={originalImage}
                  alt="原图"
                  className="w-full rounded-lg border-2 border-gray-200"
                />
              </div>
              {/* Result */}
              <div>
                <h3 className="text-center font-semibold text-gray-700 mb-3">结果</h3>
                {resultImage ? (
                  <div className="relative group">
                    <img
                      src={resultImage}
                      alt="结果"
                      className="w-full rounded-lg border-2 border-green-300 bg-checkerboard"
                      style={{ backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}
                    />
                    <button
                      onClick={() => downloadImage(resultImage, 'removed-bg.png')}
                      className="absolute bottom-2 right-2 bg-green-500 text-white px-3 py-1 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      下载
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-48 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
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
          className={`
            w-full py-4 rounded-xl text-xl font-semibold text-white
            transition-all duration-300 transform
            ${!originalImage || isProcessing
              ? 'bg-amber-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 hover:-translate-y-1 hover:shadow-lg'
            }
          `}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              处理中...
            </span>
          ) : (
            '✨ 开始处理'
          )}
        </button>

        {/* Status */}
        {status && (
          <p className={`text-center mt-4 ${status.includes('✅') ? 'text-green-400' : status.includes('❌') ? 'text-red-400' : 'text-gray-300'}`}>
            {status}
          </p>
        )}

        {/* Tips */}
        <div className="mt-8 bg-amber-100/50 backdrop-blur rounded-xl p-4 text-amber-800 text-sm">
          <p className="font-semibold mb-2">💡 提示</p>
          <ul className="list-disc list-inside space-y-1">
            <li>支持 PNG、JPG、WebP 等常见格式</li>
            <li>最佳效果：主体清晰、背景简单</li>
            <li>处理后的图片为 PNG 格式（透明背景）</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
