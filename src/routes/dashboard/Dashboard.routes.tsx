import ProductPage from '@/pages/products/ProductPage'
import { Route, Routes } from 'react-router'

export default function DashboardRoutes() {
  return (
    <Routes>
        <Route path='/' element={<h1>Inicio dashboard</h1>}/>
        <Route path='/inventario/producto' element={<ProductPage />} />
    </Routes>
  )
}
