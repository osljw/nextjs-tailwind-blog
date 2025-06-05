'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

import { getArticleCategoryList } from '@/lib/api/category'

interface CategoryCardProps {
  category: Category
}

function CategoryCard({ category }: CategoryCardProps) {
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString()
  }

  return (
    <div className="rounded-xl bg-white shadow-md transition-all hover:shadow-lg">
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-xl font-semibold text-gray-800">{category.name}</h3>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            {category.total} 篇
          </span>
        </div>

        <div className="text-sm text-gray-500">
          <i className="fas fa-clock mr-2"></i>
          {formatDate(category.create_time)}
        </div>
      </div>
    </div>
  )
}

interface Category {
  id: number
  name: string
  total: number
  create_time: string
}

export default function ReadonlyCategoryPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getArticleCategoryList()
        setCategories(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} />
  if (!categories.length) return <EmptyState />

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-gray-800">文章分类</h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="transition-shadow hover:shadow-lg"
            >
              <CategoryCard category={category} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

// 简化版加载状态
const LoadingState = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="animate-pulse">
      <div className="mb-8 h-12 w-48 rounded-lg bg-gray-200"></div>
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-gray-200"></div>
        ))}
      </div>
    </div>
  </div>
)

// 简化版错误状态
const ErrorState = ({ message }: { message: string }) => (
  <div className="flex min-h-screen flex-col items-center justify-center">
    <div className="mb-4 text-lg text-red-600">
      <i className="fas fa-exclamation-triangle mr-2"></i>
      加载失败：{message}
    </div>
  </div>
)

// 简化版空状态
const EmptyState = () => (
  <div className="flex min-h-screen flex-col items-center justify-center text-gray-500">
    <i className="fas fa-folder-open mb-4 text-4xl"></i>
    <h3 className="text-xl">暂无分类数据</h3>
  </div>
)
