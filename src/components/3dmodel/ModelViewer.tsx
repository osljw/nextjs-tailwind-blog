// components/ModelViewer.tsx
'use client'

import { Suspense, useEffect, useState } from 'react'

import { Canvas, useLoader, useThree } from '@react-three/fiber'

import { MTLLoader, OBJLoader } from 'three-stdlib'
import * as THREE from 'three'

import { OrbitControls, useTexture, Bounds, useBounds } from '@react-three/drei'
import { Text } from '@react-three/drei'
import { PointerLockControls } from '@react-three/drei'

const AxisLabels = () => (
  <group>
    <Text position={[5.5, 0, 0]} color="red">
      X
    </Text>
    <Text position={[0, 5.5, 0]} color="green">
      Y
    </Text>
    <Text position={[0, 0, 5.5]} color="blue">
      Z
    </Text>
  </group>
)

// 类型定义
interface ModelProps {
  objPath: string
  mtlPath: string
  onLoad: (size: number) => void
}

interface CameraControllerProps {
  modelSize: number
}

// 模型加载组件
function Model({ objPath, mtlPath, onLoad }: ModelProps) {
  const [model, setModel] = useState<Group | null>(null)

  useEffect(() => {
    const loadModel = async () => {
      try {
        const materials = await new MTLLoader().loadAsync(mtlPath)
        const obj = await new OBJLoader().setMaterials(materials).loadAsync(objPath)

        // 计算模型尺寸并居中
        const box = new THREE.Box3().setFromObject(obj)
        const size = box.getSize(new THREE.Vector3()).length()
        const center = box.getCenter(new THREE.Vector3())
        obj.position.sub(center)

        setModel(obj)
        onLoad(size)
      } catch (error) {
        console.error('模型加载失败:', error)
      }
    }

    loadModel()
  }, [objPath, mtlPath, onLoad])

  return model ? <primitive object={model} /> : null
}

// 智能摄像机控制器
function CameraController({ modelSize }: { modelSize: number }) {
  const { camera } = useThree() // 现在正确包裹在Canvas内

  useEffect(() => {
    if (modelSize <= 0) return // 添加安全校验

    // 动态计算摄像机位置
    const aspect = window.innerWidth / window.innerHeight
    const fovRad = (camera.fov * Math.PI) / 180
    const distance = Math.max(modelSize / (2 * Math.tan(fovRad / 2)), modelSize * 1.5)

    const initialPosition = new THREE.Vector3(distance * aspect, distance * 0.75, distance)

    camera.position.copy(initialPosition)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }, [modelSize, camera])

  return null
}

// 主组件
export default function ModelViewer({ objPath, mtlPath }: ModelProps) {
  const [modelSize, setModelSize] = useState(0)
  const [controlsEnabled, setControlsEnabled] = useState(true)
  // const { progress } = useProgress()
  const bounds = useBounds()

  // 自动适应窗口尺寸变化
  useEffect(() => {
    console.log('modelsize:', modelSize)
    // const handler = () => {
    //   if (modelSize > 0) {
    //     bounds.refresh().clip().fit()
    //   }
    // }
    // window.addEventListener('resize', handler)
    // return () => window.removeEventListener('resize', handler)
  }, [modelSize])

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      {/* 加载进度指示 */}
      {/* {progress < 100 && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          zIndex: 10
        }}>
          <Html center>
            <div className="loader">加载进度: {progress}%</div>
          </Html>
        </div>
      )} */}

      <Canvas camera={{ fov: 90, near: 0.1, far: 10000 }}>
        {/* 光照系统 */}
        <ambientLight intensity={0.8} />
        {/* <pointLight position={[10, 10, 10]} intensity={1} />
        <directionalLight
          position={[-5, 5, 5]}
          intensity={0.5}
          castShadow
        /> */}

        {/* 模型加载 */}
        {/* <Bounds fit margin={0.5}> */}
        <Suspense fallback={null}>
          <Model
            objPath={objPath}
            mtlPath={mtlPath}
            onLoad={(size) => {
              setModelSize(size)
              setControlsEnabled(true)
            }}
          />
        </Suspense>
        {/* </Bounds> */}

        {/* 辅助可视化 */}
        <axesHelper args={[modelSize * 1.1]} />
        <gridHelper
          args={[modelSize * 2, 20, '#404040', '#202020']}
          // 旋转 90 度平铺在地面，并略微下移避免与模型重叠。
          // rotation={[Math.PI / 2, 0, 0]}
          // position={[0, -modelSize * 0.05, 0]}
          rotation={[0, 0, 0]}
          position={[0, 0, 0]}
        />

        {/* <CameraController modelSize={modelSize} /> */}

        <OrbitControls
          // enableDamping
          // dampingFactor={0.05}
          rotateSpeed={0.8}
          zoomSpeed={0.8}
          panSpeed={0.8}
          // minDistance={modelSize * 0.5}
          // maxDistance={modelSize * 5}
          target={[0, 0, 0]}
          makeDefault
          onStart={() => setControlsEnabled(true)}
          onEnd={() => setControlsEnabled(false)}
          onDoubleClick={() => bounds.refresh().fit()}
        />
      </Canvas>
    </div>
  )
}
