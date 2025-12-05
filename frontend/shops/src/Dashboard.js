import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Map from './components/map'

export default function Dashboard() {
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState('visit')
    const [shopName, setShopName] = useState('')
    const [shopAddress, setShopAddress] = useState('')
    const [shopCategory, setShopCategory] = useState('')
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [shops, setShops] = useState([])
    
    useEffect(() => {
        fetchShops()
    }, [])
    
    const handleAddShop = async () => {
        const token = localStorage.getItem('token')
        console.log('Token:', token) // Debug token
        
        if (!token) {
            alert('No token found. Please login again.')
            navigate('/login')
            return
        }
        
        if (!selectedLocation) {
            alert('Please select a location on the map')
            return
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/shops/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: shopName,
                    address: shopAddress,
                    category: shopCategory,
                    latitude: selectedLocation.lat,
                    longitude: selectedLocation.lng
                })
            })
            const data = await response.json()
            if (response.ok) {
                alert('Shop added successfully!')
                setShopName('')
                setShopAddress('')
                setShopCategory('')
                setSelectedLocation(null)
                fetchShops()
            } else {
                alert(data.message || 'Failed to add shop')
            }
        } catch (error) {
            alert('Network error: ' + error.message)
        }
    }
    const fetchShops = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/shops/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response.ok) {
                const data = await response.json()
                setShops(data)
            }
        } catch (error) {
            console.error('Network error:', error.message)
        }
    }
    return (
        <div className='h-screen bg-gray-100'>
            <nav className='bg-green-900 p-4'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-xl text-green-100'>GeoShop</h1>
                        <div className='flex space-x-4'>
                        <button 
                            onClick={() => setCurrentPage('visit')}
                            className={`px-3 py-2 rounded ${currentPage === 'visit' ? 'bg-white text-green-900' : 'text-green-100 hover:bg-green-800'}`}
                        >Visit Shops
                        </button>
                        <button 
                            onClick={() => setCurrentPage('add')}
                            className={`px-3 py-2 rounded ${currentPage === 'add' ? 'bg-white text-green-900' : 'text-green-100 hover:bg-green-800'}`}
                        > Add Shop </button>
                        <button 
                            onClick={()=>navigate('/login')}
                            className='px-3 py-2 rounded text-red-200 hover:bg-red-600'
                        > Logout </button>
                    </div>
                </div>
            </nav>    
            <div className='p-8'>
                {currentPage === 'visit' && (
                    <div>
                        <h2 className='text-2xl font-bold mb-4'>View Shops</h2>
                        <div className='grid gap-4'>
                            {shops.map((shop, index) => (
                                <div key={index} className='bg-white p-4 rounded shadow'>
                                    <h3 className='font-bold'>{shop.name}</h3>
                                    <p className='text-gray-600'>{shop.address}</p>
                                    <p className='text-blue-600 text-sm'>{shop.category}</p>
                                    {shop.latitude && shop.longitude && (
                                        <div className='mt-2 text-sm text-gray-500'>
                                            <p>Latitude: {shop.latitude}</p>
                                            <p>Longitude: {shop.longitude}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {currentPage === 'add' && (
                    <div>
                        <h2 className='text-2xl font-bold mb-4'>Add New Shop</h2>
                        <input 
                            type='text'
                            placeholder='Enter shop name'
                            value={shopName}
                            onChange={(e) => setShopName(e.target.value)}
                            className='w-full p-2 border rounded mb-3'
                        />
                        <input 
                            type='text'
                            placeholder='Enter shop category'
                            value={shopCategory}
                            onChange={(e) => setShopCategory(e.target.value)}
                            className='w-full p-2 border rounded mb-3'
                        />
                        <textarea 
                            placeholder='Enter the address of the shop'
                            value={shopAddress}
                            onChange={(e) => setShopAddress(e.target.value)}
                            className='w-full p-2 border rounded mb-4 h-20'
                        />
                        <div className='mb-4'>
                            <h3 className='text-lg font-bold mb-2'>Select Location on Map</h3>
                            <Map 
                                onLocationSelect={setSelectedLocation}
                                selectedPosition={selectedLocation}
                                showCoordinates={true}
                            />
                        </div>
                        <button onClick={handleAddShop} className='bg-green-900 text-white px-6 py-3 rounded'>Add</button>    
                    </div>
                 )}
            </div>
        </div>
    )
}