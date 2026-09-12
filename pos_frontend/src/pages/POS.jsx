
import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  ShoppingCart,
  Package,
  User,
  Receipt,
  X,
  CheckCircle2,
  Tag,
  Barcode,
  Wallet,
} from 'lucide-react'

export default function POS() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [customers, setCustomers] = useState([])
  const [cart, setCart] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [customer, setCustomer] = useState('')
  const [tax, setTax] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [amountPaid, setAmountPaid] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [processing, setProcessing] = useState(false)
  const [lastSale, setLastSale] = useState(null)

  useEffect(() => {
    Promise.all([
      api.get('/products'),
      api.get('/categories'),
      api.get('/customers')
    ])
      .then(([p, c, cu]) => {
        setProducts(p.data.data)
        setCategories(c.data.data)
        setCustomers(cu.data.data)
      })
      .catch(() => toast.error('Failed to load data'))
  }, [])

  const filtered = products.filter(p => {
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode?.includes(search)

    const matchCat =
      !selectedCategory ||
      p.category?._id === selectedCategory

    return matchSearch && matchCat && p.stock > 0
  })

  const addToCart = (product) => {
    const existing = cart.find(i => i.product === product._id)

    if (existing) {
      if (existing.quantity >= product.stock) {
        return toast.error('Not enough stock')
      }

      setCart(
        cart.map(i =>
          i.product === product._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      )
    } else {
      setCart([
        ...cart,
        {
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          stock: product.stock,
        },
      ])
    }
  }

  const updateQty = (id, delta) => {
    setCart(
      cart.map(i => {
        if (i.product !== id) return i

        const newQty = i.quantity + delta

        if (newQty < 1) return i

        if (newQty > i.stock) {
          toast.error('Not enough stock')
          return i
        }

        return { ...i, quantity: newQty }
      })
    )
  }

  const removeItem = (id) =>
    setCart(cart.filter(i => i.product !== id))

  const subtotal = cart.reduce(
    (s, i) => s + i.price * i.quantity,
    0
  )

  const total =
    subtotal +
    Number(tax) -
    Number(discount)

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  )

  const handleCheckout = async () => {
    if (cart.length === 0)
      return toast.error('Cart is empty')

    const paid = Number(amountPaid) || total

    if (paid < total)
      return toast.error('Insufficient payment')

    setProcessing(true)

    try {
      const { data } = await api.post('/sales', {
        items: cart.map(i => ({
          product: i.product,
          quantity: i.quantity,
        })),
        tax: Number(tax),
        discount: Number(discount),
        amountPaid: paid,
        paymentMethod,
        customer: customer || undefined,
      })

      toast.success(
        `Sale completed! ${data.data.invoiceNumber}`
      )

      setLastSale(data.data)
      setCart([])
      setTax(0)
      setDiscount(0)
      setAmountPaid('')
      setCustomer('')

      const { data: pData } =
        await api.get('/products')

      setProducts(pData.data)
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        'Checkout failed'
      )
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-5">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">

        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center">
              <ShoppingCart
                size={18}
                className="text-green-600"
              />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Point of Sale
              </h1>

              <p className="text-xs text-slate-400">
                Create and process customer orders
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">

          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-600">
              Register Online
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-50 border border-green-100">
            <ShoppingCart
              size={15}
              className="text-green-600"
            />

            <span className="text-xs font-bold text-green-700">
              {totalItems} Items
            </span>
          </div>

        </div>
      </div>

      {/* ================= MAIN POS AREA ================= */}
      <div className="flex flex-col lg:flex-row gap-5 flex-1 min-h-0">

        {/* ================= PRODUCTS ================= */}
        <div className="flex-1 min-w-0 flex flex-col min-h-0">

          {/* Search / Filter */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 mb-4">

            <div className="flex flex-col sm:flex-row gap-3">

              {/* Search */}
              <div className="relative flex-1">

                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search product, SKU or barcode..."
                  className="
                    w-full pl-11 pr-4 py-3
                    bg-slate-50
                    border border-slate-200
                    rounded-xl
                    text-sm
                    outline-none
                    transition
                    focus:bg-white
                    focus:border-green-500
                    focus:ring-4
                    focus:ring-green-500/10
                  "
                />

                <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 text-slate-300">
                  <Barcode size={16} />
                </div>
              </div>

              {/* Category */}
              <div className="sm:w-52">

                <select
                  value={selectedCategory}
                  onChange={e =>
                    setSelectedCategory(e.target.value)
                  }
                  className="
                    w-full h-full min-h-[46px]
                    bg-slate-50
                    border border-slate-200
                    rounded-xl
                    px-3
                    text-sm
                    text-slate-700
                    outline-none
                    focus:bg-white
                    focus:border-green-500
                    focus:ring-4
                    focus:ring-green-500/10
                  "
                >
                  <option value="">
                    All Categories
                  </option>

                  {categories.map(c => (
                    <option
                      key={c._id}
                      value={c._id}
                    >
                      {c.name}
                    </option>
                  ))}
                </select>

              </div>
            </div>
          </div>

          {/* Product Header */}
          <div className="flex items-center justify-between mb-3 px-1">

            <div className="flex items-center gap-2">
              <Package
                size={17}
                className="text-slate-500"
              />

              <span className="text-sm font-bold text-slate-700">
                Products
              </span>

              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-500">
                {filtered.length}
              </span>
            </div>

            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory('')}
                className="text-xs font-semibold text-green-600 hover:text-green-700"
              >
                Clear filter
              </button>
            )}
          </div>

          {/* Products Grid */}
          <div className="flex-1 overflow-y-auto pr-1">

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 content-start">

              {filtered.map(p => (
                <button
                  key={p._id}
                  onClick={() => addToCart(p)}
                  className="
                    group
                    relative
                    bg-white
                    border border-slate-200
                    rounded-2xl
                    p-4
                    text-left
                    shadow-sm
                    hover:border-green-400
                    hover:shadow-lg
                    hover:-translate-y-0.5
                    transition-all duration-200
                  "
                >

                  {/* Product Icon */}
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-green-50 flex items-center justify-center mb-3 transition">
                    <Package
                      size={18}
                      className="text-slate-500 group-hover:text-green-600"
                    />
                  </div>

                  <p className="font-semibold text-sm text-slate-800 truncate">
                    {p.name}
                  </p>

                  <p className="text-[11px] text-slate-400 mt-1 truncate">
                    SKU: {p.sku}
                  </p>

                  <div className="flex items-end justify-between gap-2 mt-4">

                    <div>
                      <p className="text-base font-bold text-green-700">
                        Rs {p.price?.toLocaleString()}
                      </p>

                      <p
                        className={`text-[10px] mt-1 font-medium ${
                          p.stock <= p.minStock
                            ? 'text-red-500'
                            : 'text-slate-400'
                        }`}
                      >
                        {p.stock <= p.minStock
                          ? 'Low stock'
                          : 'In stock'}{' '}
                        · {p.stock}
                      </p>
                    </div>

                    <span className="
                      w-7 h-7 rounded-lg
                      bg-green-50
                      flex items-center justify-center
                      text-green-600
                      opacity-0
                      group-hover:opacity-100
                      transition
                    ">
                      <Plus size={15} />
                    </span>

                  </div>
                </button>
              ))}

              {filtered.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20">

                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                    <Package
                      size={26}
                      className="text-slate-300"
                    />
                  </div>

                  <p className="text-sm font-semibold text-slate-500 mt-4">
                    No products found
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Try another search or category
                  </p>

                </div>
              )}

            </div>
          </div>
        </div>

        {/* ================= CART ================= */}
        <div className="
          w-full lg:w-[390px]
          bg-white
          rounded-2xl
          border border-slate-200
          shadow-xl shadow-slate-200/40
          flex flex-col
          min-h-0
          overflow-hidden
        ">

          {/* Cart Header */}
          <div className="p-5 border-b border-slate-100">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <ShoppingCart
                    size={19}
                    className="text-green-600"
                  />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Current Sale
                  </h2>

                  <p className="text-[11px] text-slate-400">
                    {totalItems} items in cart
                  </p>
                </div>

              </div>

              {cart.length > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-green-50 text-[10px] font-bold text-green-700">
                  ACTIVE
                </span>
              )}

            </div>

            {/* Customer */}
            <div className="relative mt-4">

              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={customer}
                onChange={e =>
                  setCustomer(e.target.value)
                }
                className="
                  w-full
                  pl-9 pr-3 py-2.5
                  bg-slate-50
                  border border-slate-200
                  rounded-xl
                  text-sm
                  text-slate-700
                  outline-none
                  focus:bg-white
                  focus:border-green-500
                "
              >
                <option value="">
                  Walk-in Customer
                </option>

                {customers.map(c => (
                  <option
                    key={c._id}
                    value={c._id}
                  >
                    {c.name}{' '}
                    {c.phone && `(${c.phone})`}
                  </option>
                ))}
              </select>

            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">

            {cart.length === 0 && (
              <div className="h-full min-h-[180px] flex flex-col items-center justify-center">

                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <ShoppingCart
                    size={25}
                    className="text-slate-300"
                  />
                </div>

                <p className="text-sm font-semibold text-slate-500 mt-4">
                  Cart is empty
                </p>

                <p className="text-xs text-slate-400 mt-1 text-center">
                  Select products to start a sale
                </p>

              </div>
            )}

            {cart.map(item => (
              <div
                key={item.product}
                className="
                  group
                  flex items-center gap-3
                  bg-slate-50
                  hover:bg-slate-100
                  rounded-xl
                  p-3
                  transition
                "
              >

                <div className="w-9 h-9 shrink-0 rounded-lg bg-white flex items-center justify-center">
                  <Package
                    size={16}
                    className="text-slate-400"
                  />
                </div>

                <div className="flex-1 min-w-0">

                  <p className="text-sm font-semibold text-slate-700 truncate">
                    {item.name}
                  </p>

                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Rs {item.price?.toLocaleString()} × {item.quantity}
                  </p>

                </div>

                <div className="flex items-center gap-1">

                  <button
                    onClick={() =>
                      updateQty(item.product, -1)
                    }
                    className="
                      w-7 h-7
                      rounded-lg
                      bg-white
                      border border-slate-200
                      flex items-center justify-center
                      text-slate-500
                      hover:text-green-600
                      hover:border-green-300
                    "
                  >
                    <Minus size={13} />
                  </button>

                  <span className="w-6 text-center text-xs font-bold text-slate-700">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateQty(item.product, 1)
                    }
                    className="
                      w-7 h-7
                      rounded-lg
                      bg-white
                      border border-slate-200
                      flex items-center justify-center
                      text-slate-500
                      hover:text-green-600
                      hover:border-green-300
                    "
                  >
                    <Plus size={13} />
                  </button>

                  <button
                    onClick={() =>
                      removeItem(item.product)
                    }
                    className="
                      w-7 h-7
                      rounded-lg
                      flex items-center justify-center
                      text-red-400
                      hover:text-red-600
                      hover:bg-red-50
                      ml-1
                    "
                  >
                    <Trash2 size={14} />
                  </button>

                </div>
              </div>
            ))}
          </div>

          {/* ================= CHECKOUT ================= */}
          <div className="border-t border-slate-100 bg-slate-50/70 p-5 space-y-4">

            {/* Tax / Discount */}
            <div className="grid grid-cols-2 gap-3">

              <div>
                <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                  <Tag size={11} />
                  Tax
                </label>

                <input
                  type="number"
                  value={tax}
                  onChange={e =>
                    setTax(e.target.value)
                  }
                  className="
                    w-full
                    bg-white
                    border border-slate-200
                    rounded-xl
                    px-3 py-2.5
                    text-sm
                    outline-none
                    focus:border-green-500
                    focus:ring-2
                    focus:ring-green-500/10
                  "
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                  <Tag size={11} />
                  Discount
                </label>

                <input
                  type="number"
                  value={discount}
                  onChange={e =>
                    setDiscount(e.target.value)
                  }
                  className="
                    w-full
                    bg-white
                    border border-slate-200
                    rounded-xl
                    px-3 py-2.5
                    text-sm
                    outline-none
                    focus:border-green-500
                    focus:ring-2
                    focus:ring-green-500/10
                  "
                />
              </div>

            </div>

            {/* Totals */}
            <div className="bg-white rounded-xl border border-slate-200 p-3.5 space-y-2">

              <div className="flex justify-between text-xs text-slate-500">
                <span>Subtotal</span>
                <span>
                  Rs {subtotal.toLocaleString()}
                </span>
              </div>

              {Number(tax) > 0 && (
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Tax</span>
                  <span>
                    + Rs {Number(tax).toLocaleString()}
                  </span>
                </div>
              )}

              {Number(discount) > 0 && (
                <div className="flex justify-between text-xs text-red-500">
                  <span>Discount</span>
                  <span>
                    - Rs {Number(discount).toLocaleString()}
                  </span>
                </div>
              )}

              <div className="h-px bg-slate-100 my-2" />

              <div className="flex items-center justify-between">

                <span className="font-bold text-slate-800">
                  Total
                </span>

                <span className="text-xl font-bold text-green-700">
                  Rs {total.toLocaleString()}
                </span>

              </div>
            </div>

            {/* Payment Method */}
            <div>

              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-2">
                Payment Method
              </p>

              <div className="grid grid-cols-3 gap-2">

                <button
                  onClick={() =>
                    setPaymentMethod('cash')
                  }
                  className={`
                    flex flex-col items-center justify-center gap-1
                    py-2.5 rounded-xl text-xs font-semibold
                    border transition
                    ${
                      paymentMethod === 'cash'
                        ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-600/20'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-green-300'
                    }
                  `}
                >
                  <Banknote size={16} />
                  Cash
                </button>

                <button
                  onClick={() =>
                    setPaymentMethod('card')
                  }
                  className={`
                    flex flex-col items-center justify-center gap-1
                    py-2.5 rounded-xl text-xs font-semibold
                    border transition
                    ${
                      paymentMethod === 'card'
                        ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-600/20'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-green-300'
                    }
                  `}
                >
                  <CreditCard size={16} />
                  Card
                </button>

                <button
                  onClick={() =>
                    setPaymentMethod('mobile')
                  }
                  className={`
                    flex flex-col items-center justify-center gap-1
                    py-2.5 rounded-xl text-xs font-semibold
                    border transition
                    ${
                      paymentMethod === 'mobile'
                        ? 'bg-green-600 text-white border-green-600 shadow-md shadow-green-600/20'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-green-300'
                    }
                  `}
                >
                  <Smartphone size={16} />
                  Mobile
                </button>

              </div>
            </div>

            {/* Amount Paid */}
            <div>

              <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1.5">
                <Wallet size={11} />
                Amount Paid
              </label>

              <input
                type="number"
                value={amountPaid}
                onChange={e =>
                  setAmountPaid(e.target.value)
                }
                placeholder={String(total)}
                className="
                  w-full
                  bg-white
                  border border-slate-200
                  rounded-xl
                  px-3.5 py-3
                  text-sm font-semibold
                  outline-none
                  focus:border-green-500
                  focus:ring-4
                  focus:ring-green-500/10
                "
              />

              {amountPaid &&
                Number(amountPaid) >= total && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-green-600">
                    <CheckCircle2 size={13} />
                    Change: Rs{' '}
                    {(
                      Number(amountPaid) - total
                    ).toLocaleString()}
                  </div>
                )}
            </div>

            {/* Checkout */}
            <button
              onClick={handleCheckout}
              disabled={
                processing ||
                cart.length === 0
              }
              className="
                w-full
                flex items-center justify-center gap-2
                py-3.5
                rounded-xl
                bg-gradient-to-r
                from-green-600
                to-emerald-600
                hover:from-green-700
                hover:to-emerald-700
                text-white
                font-bold
                text-sm
                shadow-lg
                shadow-green-600/20
                transition-all
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >
              {processing ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard size={17} />
                  Charge Rs {total.toLocaleString()}
                </>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* ================= RECEIPT MODAL ================= */}
      {lastSale && (
        <div
          className="
            fixed inset-0
            bg-slate-950/60
            backdrop-blur-sm
            z-50
            flex items-center justify-center
            p-4
          "
          onClick={() => setLastSale(null)}
        >

          <div
            className="
              bg-white
              rounded-3xl
              w-full max-w-sm
              shadow-2xl
              overflow-hidden
            "
            onClick={e => e.stopPropagation()}
          >

            {/* Receipt Header */}
            <div className="relative bg-gradient-to-br from-green-600 to-emerald-700 text-white px-6 py-7 text-center">

              <button
                onClick={() => setLastSale(null)}
                className="absolute right-4 top-4 w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <X size={17} />
              </button>

              <div className="w-14 h-14 mx-auto rounded-2xl bg-white/15 flex items-center justify-center mb-3">
                <CheckCircle2 size={29} />
              </div>

              <h3 className="font-bold text-xl">
                Sale Complete
              </h3>

              <p className="text-xs text-green-100 mt-1">
                {lastSale.invoiceNumber}
              </p>

            </div>

            {/* Receipt Items */}
            <div className="p-6">

              <div className="space-y-2 border-b border-slate-100 pb-4">

                {lastSale.items.map((i, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between gap-3 text-sm"
                  >
                    <span className="text-slate-600">
                      {i.name} × {i.quantity}
                    </span>

                    <span className="font-semibold text-slate-800">
                      Rs {i.total?.toLocaleString()}
                    </span>
                  </div>
                ))}

              </div>

              {/* Summary */}
              <div className="mt-4 space-y-2 text-sm">

                <div className="flex justify-between font-bold text-lg">
                  <span className="text-slate-800">
                    Total
                  </span>

                  <span className="text-green-700">
                    Rs {lastSale.totalAmount?.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Paid</span>
                  <span>
                    Rs {lastSale.amountPaid?.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between text-slate-500">
                  <span>Change</span>
                  <span>
                    Rs {lastSale.change?.toLocaleString()}
                  </span>
                </div>

              </div>

              <button
                onClick={() => setLastSale(null)}
                className="
                  w-full
                  mt-5
                  py-3
                  rounded-xl
                  bg-gradient-to-r
                  from-green-600
                  to-emerald-600
                  hover:from-green-700
                  hover:to-emerald-700
                  text-white
                  font-semibold
                  text-sm
                  shadow-lg
                  shadow-green-600/20
                  transition
                "
              >
                Start New Sale
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  )
}

