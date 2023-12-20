'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Breadcrumb, Table, Tag, Switch, Button, Pagination } from 'antd'
import { useEffect, useState, useRef } from 'react'

import formatDate from '@/lib/utils/formatDate'
import { getArticleList, patchArticle } from '@/lib/api/article'

export default function Page() {
  const router = useRouter()
  const tableRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState('id')
  const [defaultSortOrder, setDefaultSortOrder] = useState('descend')
  const [sortOrder, setSortOrder] = useState('descend')

  const fetchData = async ({ page, order }) => {
    try {
      const res = await getArticleList({
        all: true,
        page,
        ordering: sortField && order ? `${order === 'ascend' ? '' : '-'}${sortField}` : undefined,
      })
      const { results, count } = res
      setPosts(results)
      setTotal(count)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    fetchData({ page: 1, order: sortOrder })
  }, [])

  useEffect(() => {
    // 在表格数据变化时重新计算滚动高度
    if (tableRef.current) {
      console.log('tableRef:', tableRef.current)
      // const tableBody = tableRef.current.querySelector(".ant-table-body");
      // const tableHeader = tableRef.current.querySelector(".ant-table-header");
      // const tableBodyHeight = tableBody.offsetHeight;
      // const tableHeaderHeight = tableHeader.offsetHeight;
      // const availableHeight = tableBodyHeight - tableHeaderHeight;

      // const scrollHeight = availableHeight > 400 ? 400 : availableHeight;

      // tableRef.current.querySelector(".ant-table-scroll-y").style.height = `${scrollHeight}px`;
    }
  }, [posts])

  const createArticle = () => {
    router.push('/admin/article/create')
  }

  const handleSwitchChange = (id) => (checked) => {
    console.log('==switch key:', id, ', checked:', checked)
    // // 根据key更新对应行的开关状态
    // const updatedData = posts.map((item) =>
    //   item.id === id ? { ...item, is_show: checked } : item
    // );
    // console.log("updatedData:", updatedData)
    setLoading(true)
    patchArticle({ id, is_show: checked })
      .then((res) => {
        if (res.id === id) {
          const updatedData = posts.map((item) =>
            item.id === id ? { ...item, is_show: checked } : item
          )
          console.log('updatedDAta:', updatedData)
          setPosts(updatedData)
        }
      })
      .catch((error) => {
        // 处理异常情况
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handlePageChange = (page) => {
    setLoading(true)
    fetchData({ page, order: defaultSortOrder })
  }

  const handleTableChange = (pagination, filters, sorter) => {
    const { field, order } = sorter
    console.log('handleTableChange sorter:', field, order)

    if (order) {
      fetchData({ page: currentPage, order })
    }

    setSortField(field)
    setSortOrder(order)
    setDefaultSortOrder(order ? order : defaultSortOrder)
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      defaultSortOrder: defaultSortOrder,
      sortOrder: sortOrder,
    },
    {
      title: '标题',
      dataIndex: 'title',
      // key: 'name',
      render: (title, record) => {
        return (
          <>
            <Link href={`/admin/article/${record.id}`}>{title}</Link>
          </>
        )
      },
    },

    {
      title: 'Tags',
      dataIndex: 'tags',
      render: (tags) => (
        <>
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      // key: "url",
      sorter: true,
      render: (create_time) => <> {formatDate(create_time)} </>,
    },
    {
      title: '状态',
      dataIndex: 'valid',
      render: (_, record) => (
        // <Switch defaultChecked={record.is_show} onChange={handleSwitchChange(record.id)} />
        <Switch checked={record.is_show} onChange={handleSwitchChange(record.id)} />
      ),
    },
    // {
    //   title: 'Actions',
    //   render: () => (
    //     <>
    //       <Button type="link" icon="edit" />
    //       <Button type="link" icon="delete" />
    //     </>
    //   ),
    // },
  ]

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Breadcrumb
            items={[
              {
                title: 'Home',
              },
              {
                title: (
                  <Link href="" className="text-blue-500">
                    文章管理
                  </Link>
                ),
              },
            ]}
          />
        </div>

        <div className="flex items-center">
          <Button
            type="primary"
            onClick={createArticle}
            className="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            新增文章
          </Button>
        </div>
      </div>

      <div style={{ height: '400px', position: 'relative' }}>
        <Table
          // ref={tableRef}
          loading={loading}
          rowKey={(record) => record.id}
          columns={columns}
          dataSource={posts}
          pagination={false}
          onChange={handleTableChange}
          scroll={{ y: 300 }}
          style={
            {
              // minHeight: 400,
              // maxHeight: 400,
              // height: 300,
              // overflow: "auto",
            }
          }
        />

        <Pagination
          showTotal={(total, range) => `总共 ${total} 条记录`}
          current={currentPage}
          total={total}
          pageSize={10} // 每页显示的记录数量，与后端的分页设置一致
          onChange={handlePageChange}
          style={{ position: 'absolute', bottom: 0 }}
        />
      </div>
    </>
  )
}
