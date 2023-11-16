import { Tabs } from 'antd'
import { Space, Table, Tag } from 'antd'
import { useEffect, useState } from 'react'

const { TabPane } = Tabs

const TabPage = ({ tabData, columns }) => {
  console.log('props:', tabData)
  const [activeKey, setActiveKey] = useState('0')
  const [tableData, setTableData] = useState([])

  const handleTabChange = (key) => {
    setActiveKey(key)
  }

  const renderTable = () => {
    const activeTab = tabData[activeKey]
    const filteredTableData = tableData.filter(
      (data) => data.category && data.category === activeTab.tab
    )

    return (
      <Table rowKey={(record) => record.name} columns={columns} dataSource={filteredTableData} />
    )
  }

  return (
    <>
      <Tabs
        defaultActiveKey="0"
        activeKey={activeKey}
        onChange={handleTabChange}
        items={tabData.map((item, index) => ({
          label: item.tab,
          key: index.toString(),
          children: index.toString() === activeKey ? renderTable() : null,
        }))}
      ></Tabs>
    </>
  )
}

export default TabPage
