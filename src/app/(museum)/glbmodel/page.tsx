import dynamic from 'next/dynamic'

// 动态导入避免 SSR 问题
const ModelViewer = dynamic(() => import('@/components/3dmodel/GlbViewer'), { ssr: false })

export default function Home() {
  return (
    <div>
      <h1>3D Model Viewer</h1>
      <ModelViewer modelPath="/model/model.glb" />
      <ModelViewer modelPath="/model/model2.glb" />
    </div>
  )
}
