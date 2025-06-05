'use client'

import { useState } from 'react'
import CollectionCard from '@/components/collection/CollectionCard'
// import { Pagination } from '@/components/pagination'
// import { SearchBar } from '@/components/search-bar'

// 测试数据集
const mockArtworks = [
  {
    id: 'CN-2023-001',
    title: '青花缠枝莲纹梅瓶',
    image: 'https://digicol.dpm.org.cn/Uploads/2023-01/65b7b9d9c53d7.jpg',
    dynasty: '明代',
    category: '瓷器',
    era: '永乐年间',
    dimensions: '高35.8cm 口径7.2cm',
    collection: '故宫博物院',
  },
  {
    id: 'CN-2022-015',
    title: '金嵌珍珠天球仪',
    image: 'https://digicol.dpm.org.cn/Uploads/2022-06/62b7b9d9c53d7.jpg',
    dynasty: '清代',
    category: '天文仪器',
    era: '乾隆时期',
    dimensions: '直径32cm',
    collection: '故宫博物院',
  },
  // 更多测试数据...
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `CN-TEST-${i + 1}`,
    title: `测试文物 ${i + 1}`,
    image: `https://source.unsplash.com/random/600x600/?artifact,${i}`,
    dynasty: ['唐', '宋', '元', '明', '清'][i % 5],
    category: ['瓷器', '青铜器', '书画', '玉器', '杂项'][i % 5],
    era: '测试年代',
    dimensions: '--',
    collection: '数字馆藏',
  })),
]

export default function CollectionPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // 过滤逻辑
  const filteredArtworks = mockArtworks.filter(
    (artwork) =>
      artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.dynasty.includes(searchTerm) ||
      artwork.category.includes(searchTerm)
  )

  // 分页计算
  const paginatedArtworks = filteredArtworks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="min-h-screen bg-gray-50 transition-colors dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        {/* <div className="mb-8">
          <SearchBar 
            onSearch={setSearchTerm}
            placeholder="搜索文物名称、朝代或类别..."
          />
        </div> */}

        {filteredArtworks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedArtworks.map((artwork) => (
                <CollectionCard
                  key={artwork.id}
                  title={artwork.title}
                  image={artwork.image}
                  dynasty={artwork.dynasty}
                  category={artwork.category}

                  //   badge={artwork.collection}
                />
              ))}
            </div>

            {/* <Pagination
              className="mt-8"
              currentPage={currentPage}
              totalPages={Math.ceil(filteredArtworks.length / itemsPerPage)}
              onPageChange={setCurrentPage}
            /> */}
          </>
        ) : (
          <div className="py-12 text-center text-gray-500 dark:text-gray-400">未找到匹配的文物</div>
        )}
      </main>
    </div>
  )
}
