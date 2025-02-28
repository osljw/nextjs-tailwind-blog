'use client'

import React, { useEffect, useState } from 'react'
import { BookOutlined, TagOutlined, ClockCircleOutlined, RightOutlined } from '@ant-design/icons'

import { getArticleCategoryList } from '@/lib/api/category'

// 模拟数据
const articles = [
  {
    id: 1,
    title: 'React Hooks最佳实践',
    category: '技术',
    excerpt: '深入探讨React Hooks的高级用法和常见问题解决方案...',
    date: '2024-03-15',
    readTime: '8分钟',
  },
  // 更多文章数据...
]

// const categories = ['全部', '技术', '生活', '旅行', '科技'];

const CategoryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [categories, setCategories] = useState([]) // 新增状态：存储分类数据
  const [loading, setLoading] = useState(false) // 新增状态：加载状态（可选）

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const categoriesData = await getArticleCategoryList()
        // 假设接口返回数据在 res.data 中（根据实际接口调整）
        setCategories(categoriesData || [])

        const firstValidCategory =
          categoriesData.find((cat) => cat.articles.length > 0) || categoriesData[0]
        if (firstValidCategory) {
          setSelectedCategory(firstValidCategory.name)
        }
      } catch (error) {
        console.error('获取分类列表失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const currentArticles = categories.find((cat) => cat.id === selectedCategory)?.articles || []

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 rounded-lg bg-white p-4 shadow-sm">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors
                  ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div>加载中...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {currentArticles.map((article) => (
              <article
                key={article.id}
                className="rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="p-6">
                  <div className="mb-3 flex items-center text-sm text-gray-500">
                    <TagOutlined className="mr-1" />
                    <span>{article.category}</span>
                  </div>
                  <h2 className="mb-2 text-xl font-semibold">{article.title}</h2>
                  <p className="mb-4 text-gray-600">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center">
                      <ClockCircleOutlined className="mr-1" />
                      {article.readTime}
                    </span>
                    <span>{article.date}</span>
                  </div>
                </div>
                <button className="flex w-full items-center justify-center rounded-b-lg bg-gray-50 py-3 hover:bg-gray-100">
                  阅读全文
                  <RightOutlined className="ml-2" style={{ fontSize: '14px' }} />
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default CategoryPage
