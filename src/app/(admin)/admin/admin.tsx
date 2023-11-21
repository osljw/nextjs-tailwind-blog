import TabPage from '@/components/TabPage'

export const testdata = [
  // AI
  {
    name: 'phind',
    url: 'https://www.phind.com/',
    category: 'AI',
  },
  {
    name: 'theb',
    url: 'https://beta.theb.ai/home',
    category: 'AI',
  },

  // 下载
  {
    name: '文件下载在线代理',
    url: 'https://respeed.chromiumer.com/',
    category: '下载',
  },

  // 办公
  {
    name: 'PDF转换',
    url: 'https://tool.browser.qq.com/category/pdf',
    category: '文档',
  },
  {
    name: '思维导图',
    url: 'https://www.iodraw.com/mind',
    category: '文档',
  },

  // 编辑器
  {
    url: 'https://editor.runjs.cool/',
  },

  // 博客
  {
    url: 'https://maqib.cn/',
  },
] //.map((item, index) => { return { key: index.toString(), ...item } })

const columns = [
  {
    title: '类别',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'url',
    dataIndex: 'url',
    key: 'url',
  },
]

export default function Admin() {
  const data = testdata.filter((item) => item.category)

  const tabData = [...new Set(data.map((item) => item.category))].map((category) => ({
    key: category,
    tab: category,
  }))

  return (
    <>
      <TabPage tabData={tabData} columns={columns} />
    </>
  )
}
