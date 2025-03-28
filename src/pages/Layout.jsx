
import { Outlet } from 'react-router-dom'
import Header from '../components/header/header'
import Footer from '../components/footer/Footer'
import ScrollToTop from '../components/ScrollToTop'



function Layout() {
  return (
    <>
    <ScrollToTop />
    <Header />
    <Outlet />
    <Footer />
    </>
  )
}

export default Layout