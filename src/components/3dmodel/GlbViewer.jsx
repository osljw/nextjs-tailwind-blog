'use client' // 标记为客户端组件（Next.js 13+）

import '@google/model-viewer'

const ModelViewer = ({ modelPath }) => {
  return (
    <model-viewer
      src={modelPath}
      alt="3D Model"
      ar
      ar-modes="webxr scene-viewer quick-look"
      camera-controls
      auto-rotate
      exposure="5.2" // 增强曝光（默认1.0）
      environment-intensity="2.5" // 环境光强度（默认1.0）
      shadow-intensity="0.3" // 适当阴影增加立体感
      style={{
        width: '100%',
        height: '50vh',
        backgroundColor: '#ffffff', // 添加背景观察细节
      }}
      // 强制使用明亮环境贴图
      // environment-image="https://modelviewer.dev/shared-assets/environments/aircraft_workshop_01_1k.hdr"
      onError={({ detail }) => console.error('Texture Error:', detail)}
    >
      {/* 可选加载动画 */}
      <div slot="progress-bar"></div>
    </model-viewer>
  )
}

export default ModelViewer
