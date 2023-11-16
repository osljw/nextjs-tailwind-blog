import AdminLayout from '@/components/AdminLayout'

function Admin({ Component, pageProps }) {
  //   const isAdminPage = Component.layout === "admin";
  console.log('Admin==========')

  return (
    <AdminLayout>
      <Component {...pageProps} />
    </AdminLayout>
  )
}

export default Admin
