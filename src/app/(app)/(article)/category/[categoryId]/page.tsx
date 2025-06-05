import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getCategoryArticles, getArticleCategoryList } from '@/lib/api/category'

interface Props {
  category: {
    name: string
    description?: string
    totalArticles: number
    createdAt: string
  }
}

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleDateString()
}

function CategoryHeader({ category }: Props) {
  return (
    <header className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">{category.name}</h1>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
          共 {category.totalArticles} 篇
        </span>
      </div>

      {category.description && <p className="mb-4 text-gray-600">{category.description}</p>}

      <div className="flex items-center text-sm text-gray-500">
        <ClockIcon className="mr-2 h-4 w-4" />
        创建于：{formatDate(category.createdAt)}
      </div>
    </header>
  )
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

interface Article {
  id: string
  title: string
  summary: string
  publishDate: string
  author: string
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/article/${article.id}`}
      className="block rounded-lg border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <h3 className="mb-2 text-xl font-semibold text-gray-800">{article.title}</h3>

      {article.summary && <p className="mb-4 line-clamp-2 text-gray-600">{article.summary}</p>}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{article.author}</span>
        <time>{formatDate(article.publishDate)}</time>
      </div>
    </Link>
  )
}

export async function generateStaticParams() {
  try {
    const categories = await getArticleCategoryList()
    console.log('categories:', categories)
    return categories.map((c) => ({ categoryid: c.id.toString() }))
  } catch (error) {
    return []
  }
}

export default async function CategoryPage({ params }: { params: { categoryId: string } }) {
  console.log('params:', params.categoryId)
  try {
    const articles = await getCategoryArticles(params.categoryId)
    console.log('articles:', articles)

    return (
      <main className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          {/* 返回按钮 */}
          <div className="mb-6">
            <Link
              href="/category"
              className="inline-flex items-center text-gray-600 hover:text-blue-600"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" />
              返回分类列表
            </Link>
          </div>

          {/* <CategoryHeader category={category} /> */}

          {/* 文章列表 */}
          <section className="mt-8 space-y-4">
            {articles.results.length > 0 ? (
              articles.results.map((article) => <ArticleCard key={article.id} article={article} />)
            ) : (
              <EmptyState />
            )}
          </section>
        </div>
      </main>
    )
  } catch (error) {
    console.log('error:', error)
    if (error.message.includes('404')) {
      notFound()
    }
    return <ErrorFallback error={error.message} />
  }
}

function ErrorFallback({ error }: { error: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-md text-center text-red-600">
        {/* <ExclamationTriangleIcon className="h-12 w-12 mx-auto mb-4" /> */}
        <h2 className="mb-2 text-xl font-semibold">数据加载失败</h2>
        <p className="mb-4 text-sm">{error}</p>
        <Link href="/categories" className="text-blue-600 underline hover:text-blue-700">
          返回分类列表
        </Link>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="py-12 text-center text-gray-500">
      {/* <DocumentTextIcon className="h-12 w-12 mx-auto mb-4" /> */}
      <p>该分类下暂时没有文章</p>
    </div>
  )
}

// SVG 图标组件
function ArrowLeftIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
  )
}
