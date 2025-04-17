// components/ModelGallery.jsx
'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const ModelViewer = dynamic(() => import('@/components/3dmodel/ModelViewer'), { ssr: false })

export default function ModelGallery() {
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/model-config.json', {
          cache: 'no-cache', // 开发环境禁用缓存
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const config = await response.json()
        setModels(config.models)
      } catch (err) {
        console.error('模型配置加载失败:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadConfig()
  }, [])

  if (loading) {
    return <div className="p-8 text-center">加载模型中...</div>
  }

  if (error) {
    return (
      <div className="p-8 text-red-500">
        错误: {error}
        <button
          className="ml-4 rounded bg-blue-500 px-4 py-2 text-white"
          onClick={() => window.location.reload()}
        >
          重试
        </button>
      </div>
    )
  }

  console.log('models:', models)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="mb-8 text-3xl font-bold">3D模型库</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {models.map((model) => (
          <div key={model.id} className="overflow-hidden rounded-lg bg-white shadow-lg">
            {/* <div className="p-4 border-b">
                            <h2 className="text-xl font-semibold">{model.name}</h2>
                            <img
                                src={model.thumb}
                                alt="预览图"
                                className="mt-2 w-full h-48 object-cover rounded"
                                loading="lazy"
                                decoding="async"
                            />
                        </div> */}
            <div className="h-[500px]">
              {/* 关键修改：传递正确的模型路径格式 */}
              {/* <DynamicModelViewer
                                modelPath={`${model.obj},${model.mtl},${model.thumb}`}
                            /> */}

              <ModelViewer
                objPath={model.obj}
                mtlPath={model.mtl}
                // textureBasePath={model.thumb}
                textureBasePath="/model/"
                cameraPosition={[0, 1.5, 3]}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
