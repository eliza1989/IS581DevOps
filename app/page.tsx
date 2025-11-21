'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

// define the shape of our table data
type Shop = {
  id?: number
  name: string
  favorite_color: string
  created_at?: string
}

export default function Home() {
  const [shops, setShops] = useState<Shop[]>([])
  const [name, setName] = useState('')
  const [color, setColor] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchShops()
  }, [])

  // Fetch all rows from Supabase table
  async function fetchShops() {
    setLoading(true)
    const { data, error } = await supabase
      .from('Shops')              // ✅ Fixed
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error(
        ':x: Error fetching data:',
        (error as any).message ?? 'No message',
        (error as any).details ?? 'No details'
      )
    } else {
      console.log(':white_check_mark: Data fetched:', data)
      setShops(data || [])
    }
    setLoading(false)
  }

  // Insert a new shop into the Supabase table
  async function addShop() {
    if (!name.trim() || !color.trim()) {
      alert('Please enter both name and color')
      return
    }

    setLoading(true)
    const { error } = await supabase
      .from('Shops')               // ✅ Fixed
      .insert([{ name: name.trim(), favorite_color: color.trim() }])

    if (error) {
      console.error(
        ':x: Error inserting data:',
        (error as any).message ?? 'No message',
        (error as any).details ?? 'No details'
      )
      alert('Failed to add shop. Check console for details.')
    } else {
      console.log(`:white_check_mark: Added ${name} with color ${color}`)
      setName('')
      setColor('')
      fetchShops()
    }

    setLoading(false)
  }

  // Delete a shop from the database
  async function deleteShop(id: number) {
    const { error } = await supabase
      .from('Shops')               // ✅ Fixed
      .delete()
      .eq('id', id)

    if (error) {
      console.error(
        ':x: Error deleting shop:',
        (error as any).message ?? 'No message',
        (error as any).details ?? 'No details'
      )
    } else {
      console.log(`:white_check_mark: Deleted shop with id ${id}`)
      fetchShops()
    }
  }

  // Handle Enter key press
  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      addShop()
    }
  }

  return (
    <main className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">
          Shop Color🛍️
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              className="border border-gray-300 p-3 rounded-lg w-full sm:w-auto flex-1 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
            />

            <input
              className="border border-gray-300 p-3 rounded-lg w-full sm:w-auto flex-1 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Favorite color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={loading}
            />

            <button
              onClick={addShop}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {loading ? '...' : 'Add'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Shops ({shops.length})
          </h2>

          {loading && shops.length === 0 ? (
            <p className="text-gray-500 italic">Loading...</p>
          ) : shops.length === 0 ? (
            <p className="text-gray-500 italic">No shops yet. Add one above!</p>
          ) : (
            <ul className="space-y-3">
              {shops.map((s: Shop) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: s.favorite_color }}
                      title={s.favorite_color}
                    />
                    <div>
                      <strong className="text-gray-800">{s.name}</strong>
                      <span className="text-gray-500 text-sm ml-2">
                        — {s.favorite_color}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => s.id && deleteShop(s.id)}
                    className="text-red-500 hover:text-red-700 px-3 py-1 rounded hover:bg-red-50 transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  )
}










