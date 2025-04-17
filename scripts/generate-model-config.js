// scripts/generate-model-config.js
const fs = require('fs')
const path = require('path')

const modelsDir = path.join(process.cwd(), 'public', 'model')
const outputPath = path.join(process.cwd(), 'public', 'model-config.json') // 直接生成到public根目录

const generateModelConfig = () => {
  const modelDirs = fs
    .readdirSync(modelsDir)
    .filter((f) => fs.statSync(path.join(modelsDir, f)).isDirectory())

  const config = modelDirs.map((dir) => {
    const files = fs.readdirSync(path.join(modelsDir, dir))
    return {
      id: dir,
      name: dir.split('_').slice(1).join(' '),
      obj: `/model/${dir}/${dir}.obj`,
      mtl: `/model/${dir}/${dir}.mtl`,
      thumb: `/model/${dir}/T_${dir}_4K.jpg`,
    }
  })

  fs.writeFileSync(outputPath, JSON.stringify({ models: config }))
}

generateModelConfig()
