import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  Tag,
  Barcode,
  X,
  Save,
  Boxes,
  AlertTriangle,
  Layers3,
} from 'lucide-react'

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({
    sku: '',
    name: '',
    category: '',
    price: '',
    costPrice: '',
    stock: '',
    minStock: 5,
    barcode: '',
  })

  const fetchData = async () => {
    const [p, c] = await Promise.all([
      api.get('/products', { params: { search } }),
      api.get('/categories'),
    ])

    setProducts(p.data.data)
    setCategories(c.data.data)
  }

  useEffect(() => {
    fetchData().catch(() => toast.error('Failed to load'))
  }, [search])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const payload = {
        ...form,
        price: +form.price,
        costPrice: +form.costPrice,
        stock: +form.stock,
        minStock: +form.minStock,
        category: form.category || undefined,
      }

      if (editId) {
        await api.put(`/products/${editId}`, payload)
        toast.success('Product updated successfully')
      } else {
        await api.post('/products', payload)
        toast.success('Product created successfully')
      }

      setShowModal(false)
      setEditId(null)

      setForm({
        sku: '',
        name: '',
        category: '',
        price: '',
        costPrice: '',
        stock: '',
        minStock: 5,
        barcode: '',
      })

      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error')
    }
  }

  const handleEdit = (p) => {
    setForm({
      sku: p.sku,
      name: p.name,
      category: p.category?._id || '',
      price: p.price,
      costPrice: p.costPrice,
      stock: p.stock,
      minStock: p.minStock,
      barcode: p.barcode || '',
    })

    setEditId(p._id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this product?')) return

    await api.delete(`/products/${id}`)
    toast.success('Product deactivated')
    fetchData()
  }

  const openAddModal = () => {
    setEditId(null)

    setForm({
      sku: '',
      name: '',
      category: '',
      price: '',
      costPrice: '',
      stock: '',
      minStock: 5,
      barcode: '',
    })

    setShowModal(true)
  }

  const totalProducts = products.length
  const lowStockProducts = products.filter(
    (p) => p.stock <= p.minStock
  ).length

  const totalStock = products.reduce(
    (sum, p) => sum + Number(p.stock || 0),
    0
  )

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 shadow-lg shadow-green-200">
              <Package className="text-white" size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Products
              </h1>

              <p className="text-sm text-slate-500 mt-0.5">
                Manage your inventory and product catalog
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="group inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl font-semibold shadow-lg shadow-green-200 hover:shadow-xl transition-all duration-200"
        >
          <Plus
            size={19}
            className="group-hover:rotate-90 transition-transform duration-200"
          />
          Add Product
        </button>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Total Products */}
        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Products
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {totalProducts}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Active catalog items
              </p>
            </div>

            <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Boxes className="text-emerald-600" size={21} />
            </div>
          </div>
        </div>

        {/* Total Stock */}
        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Stock
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {totalStock.toLocaleString()}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Units available
              </p>
            </div>

            <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <Layers3 className="text-blue-600" size={21} />
            </div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-orange-500" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Low Stock
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {lowStockProducts}
              </p>

              <p className="text-xs text-slate-400 mt-1">
                Need attention
              </p>
            </div>

            <div className="h-11 w-11 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={21} />
            </div>
          </div>
        </div>

      </div>

      {/* ================= SEARCH ================= */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">

        <div className="flex flex-col md:flex-row md:items-center gap-3">

          <div className="relative flex-1">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={19}
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by product name, SKU or barcode..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100">
            <Package size={17} className="text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">
              {products.length} Products
            </span>
          </div>

        </div>
      </div>

      {/* ================= PRODUCTS TABLE ================= */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900">
              Product Inventory
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              View and manage all products
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            Inventory Active
          </div>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  SKU
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Product
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Category
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Price
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Stock
                </th>

                <th className="text-right px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-16 text-center">

                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                        <Package className="text-slate-400" size={25} />
                      </div>

                      <p className="font-semibold text-slate-700">
                        No products found
                      </p>

                      <p className="text-sm text-slate-400 mt-1">
                        Try changing your search or add a new product
                      </p>
                    </div>

                  </td>
                </tr>
              ) : (
                products.map((p) => {

                  const isLowStock = p.stock <= p.minStock

                  return (
                    <tr
                      key={p._id}
                      className="group hover:bg-emerald-50/30 transition-colors"
                    >

                      {/* SKU */}
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-mono text-xs font-semibold">
                          {p.sku}
                        </span>
                      </td>

                      {/* Product */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center shrink-0">
                            <Package
                              size={18}
                              className="text-emerald-600"
                            />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {p.name}
                            </p>

                            {p.barcode && (
                              <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                                <Barcode size={12} />
                                {p.barcode}
                              </div>
                            )}
                          </div>

                        </div>

                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">

                        <span className="inline-flex items-center gap-1.5 text-slate-600">
                          <Tag size={14} className="text-slate-400" />
                          {p.category?.name || '-'}
                        </span>

                      </td>

                      {/* Price */}
                      <td className="px-5 py-4">

                        <div>
                          <span className="font-bold text-slate-800">
                            Rs {Number(p.price).toLocaleString()}
                          </span>

                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Selling price
                          </p>
                        </div>

                      </td>

                      {/* Stock */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                              isLowStock
                                ? 'bg-red-50 text-red-600 border border-red-100'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isLowStock
                                  ? 'bg-red-500'
                                  : 'bg-emerald-500'
                              }`}
                            />
                            {p.stock}
                          </span>

                          {isLowStock && (
                            <span className="text-[10px] font-semibold text-red-500">
                              Low
                            </span>
                          )}

                        </div>

                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">

                        <div className="flex justify-end items-center gap-1">

                          <button
                            onClick={() => handleEdit(p)}
                            title="Edit product"
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() => handleDelete(p._id)}
                            title="Deactivate product"
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                })
              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">

          <div
            className="absolute inset-0"
            onClick={() => setShowModal(false)}
          />

          <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">

            {/* Modal Header */}
            <div className="relative px-6 py-5 bg-gradient-to-r from-emerald-600 to-green-600 text-white">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                    <Package size={21} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold">
                      {editId ? 'Edit Product' : 'Add Product'}
                    </h2>

                    <p className="text-xs text-green-100 mt-0.5">
                      {editId
                        ? 'Update product information'
                        : 'Add a new item to your inventory'}
                    </p>
                  </div>

                </div>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>

              </div>

            </div>

            {/* Modal Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4 max-h-[75vh] overflow-y-auto"
            >

              {/* SKU + Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                    SKU
                  </label>

                  <input
                    placeholder="e.g. PROD-001"
                    value={form.sku}
                    onChange={(e) =>
                      setForm({ ...form, sku: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none bg-slate-50 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all disabled:bg-slate-100 disabled:text-slate-400"
                    required
                    disabled={!!editId}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                    Product Name
                  </label>

                  <input
                    placeholder="Product name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none bg-slate-50 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all"
                    required
                  />
                </div>

              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none bg-slate-50 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all"
                >
                  <option value="">Select Category</option>

                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                    Selling Price
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      Rs
                    </span>

                    <input
                      type="number"
                      placeholder="0"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none bg-slate-50 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                    Cost Price
                  </label>

                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      Rs
                    </span>

                    <input
                      type="number"
                      placeholder="0"
                      value={form.costPrice}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          costPrice: e.target.value,
                        })
                      }
                      className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none bg-slate-50 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all"
                      required
                    />
                  </div>
                </div>

              </div>

              {/* Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                    Stock
                  </label>

                  <input
                    type="number"
                    placeholder="Available quantity"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none bg-slate-50 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                    Minimum Stock
                  </label>

                  <input
                    type="number"
                    placeholder="5"
                    value={form.minStock}
                    onChange={(e) =>
                      setForm({ ...form, minStock: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none bg-slate-50 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all"
                  />
                </div>

              </div>

              {/* Barcode */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                  Barcode
                </label>

                <div className="relative">
                  <Barcode
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    placeholder="Enter barcode"
                    value={form.barcode}
                    onChange={(e) =>
                      setForm({ ...form, barcode: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none bg-slate-50 focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 transition-all"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-slate-100">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold rounded-xl shadow-lg shadow-green-100 hover:from-emerald-700 hover:to-green-700 transition-all"
                >
                  <Save size={17} />
                  {editId ? 'Update Product' : 'Save Product'}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  )
}