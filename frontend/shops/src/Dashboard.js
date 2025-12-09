import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Map from './components/map'

export default function Dashboard() {
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState('home')
    const [shopName, setShopName] = useState('')
    const [shopAddress, setShopAddress] = useState('')
    const [shopCategory, setShopCategory] = useState('')
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [shops, setShops] = useState([])
    const [showEditPopup, setShowEditPopup] = useState(false)
    const [editingShop, setEditingShop] = useState(null)
    
    useEffect(() => {
        if (currentPage === 'visit' || currentPage === 'home') {
            fetchShops()
        }
    }, [currentPage])
    
    const handleAddShop = async () => {
        const token = localStorage.getItem('token')
        console.log('Token:', token) 
    
        if (!token) {
            alert('No token found. Please login again.')
            navigate('/login')
            return
        }
        
        if (!selectedLocation) {
            toast.error("Please select a location on the map");
            return
        }
        console.log("Token > ",`Bearer ${token}`)
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/shops/`, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
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
                toast.success("Shop added successfully!");
                setShopName('')
                setShopAddress('')
                setShopCategory('')
                setSelectedLocation(null)
                fetchShops()
            } else {
                toast.error(data.message || "Failed to add shop");
            }
        } catch (error) {
            alert('Network error: ' + error.message)
        }
    }
    const fetchShops = async () => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/shops/`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.ok) {
                const data = await response.json()
                console.log('data not showed ', data);
                setShops(data.results)
                console.log('array found',data.results)
                
            }
        } catch (error) {
            console.error('Network error:', error.message)
        }
    }
    const handleDeleteShop = async (shopId) => {
        const token = localStorage.getItem('token')
        
        if (!window.confirm('Are you sure you want to delete this shop?')) {
            return
        }
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/shops/${shopId}/`, {
                method: 'DELETE',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'Authorization': `Bearer ${token}`
                }
            })
            
            if (response.ok) {
                toast.success("Successfully Deleted");
                fetchShops()
            } else {
                const data = await response.json()
                toast.error(data.message || "Failed to delete shop");
            }
        } catch (error) {
            alert('Network error: ' + error.message)
        }
    }

    const handleEditShop = (shop) => {
        setEditingShop(shop)
        setShowEditPopup(true)
    }

    const handleUpdateShop = async () => {
        const token = localStorage.getItem('token')
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/shops/${editingShop.id}/`, {
                method: 'PUT',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: editingShop.name,
                    address: editingShop.address,
                    category: editingShop.category,
                    latitude: editingShop.lat,
                    longitude: editingShop.lon
                })
            })
            
            if (response.ok) {
                toast.success("Shop updated successfully!");
                setShowEditPopup(false)
                setEditingShop(null)
                fetchShops()
            } else {
                const data = await response.json()
                toast.error(data.message || "Failed to update shop");
            }
        } catch (error) {
            alert('Network error: ' + error.message)
        }
    }
    return (
        <div className='h-screen bg-gray-100'>
            <nav className='bg-green-900 p-4'>
                    <div className='flex justify-between items-center'>
                        <h1 className='text-xl text-green-100'>
                         <button onClick={()=>setCurrentPage('home')}> GeoShop </button></h1>
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
                {currentPage === 'home' && (
                    <div className='flex flex-col items-center justify-center h-96'>
                        <h2 className='text-4xl font-bold text-green-900 mb-4'>Welcome to GeoShop</h2>
                        <p className='text-gray-600 text-lg mb-8'>Manage your shops with location tracking</p>
                        <div className='flex gap-4'>
                            <button 
                                onClick={() => setCurrentPage('visit')}
                                className='bg-green-900 text-white px-6 py-3 rounded hover:bg-green-800'
                            >
                                View Shops
                            </button>
                            <button 
                                onClick={() => setCurrentPage('add')}
                                className='bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700'
                            >
                                Add New Shop
                            </button>
                        </div>

                    </div>
                    
                )}
                {currentPage === 'home' && (
                    <div>
                        <h2 className='text-xl font-bold text-black-900 mb-4'>All Shops Location</h2>
                        <Map 
                            shops={shops}
                            showAllShops={true}
                        />
                    </div>
                )}
                {currentPage === 'visit' && (
                    <div>
                        <h2 className='text-xl font-bold text-black-900 mb-6'>View Shops</h2>
                        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                            {shops.map((shop, index) => (
                                <div key={index} className='bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow'>
                                    <h3 className='text-xl font-semibold text-Black-900 mb-2'>{shop.name}</h3>
                                    <p className='text-gray-600 mb-2 font-medium'>Address: {shop.address}</p>
                                    <p className='text-gray-600 mb-3 font-medium'>Category: {shop.category}</p>
                                    {shop.lat && shop.lon && (
                                        <div>
                                            <p className='text-gray-700 font-medium mt-1'>Latitude: {shop.lat}</p>
                                            <p className='text-gray-700 font-medium'>Longitude: {shop.lon}</p>
                                        </div>
                                    )}
                                    <div className='flex gap-4 mt-4'> 
                                    <button
                                        onClick={() => handleEditShop(shop)}
                                        className='bg-blue-800 text-center text-white px-4 py-2 rounded'
                                    >Edit</button>
                                    <button onClick={()=>handleDeleteShop(shop.id)}
                                        className='bg-red-900 text-center text-white px-4 py-2 rounded'
                                    >Delete</button>
                                    </div>
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
            {showEditPopup && editingShop && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                    <div className='bg-white p-6 rounded-lg w-96 max-w-md'>
                        <h3 className='text-xl font-bold mb-4'>Edit Shop</h3>
                        <input
                            type='text'
                            placeholder='Shop name'
                            value={editingShop.name}
                            onChange={(e) => setEditingShop({...editingShop, name: e.target.value})}
                            className='w-full p-2 border rounded mb-3'
                        />
                        <input
                            type='text'
                            placeholder='Category'
                            value={editingShop.category}
                            onChange={(e) => setEditingShop({...editingShop, category: e.target.value})}
                            className='w-full p-2 border rounded mb-3'
                        />
                        <textarea
                            placeholder='Address'
                            value={editingShop.address}
                            onChange={(e) => setEditingShop({...editingShop, address: e.target.value})}
                            className='w-full p-2 border rounded mb-4 h-20'
                        />
                        <div className='flex gap-3'>
                            <button
                                onClick={handleUpdateShop}
                                className='bg-green-900 text-white px-4 py-2 rounded flex-1'
                            >
                                Update
                            </button>
                            <button
                                onClick={() => {setShowEditPopup(false); setEditingShop(null)}}
                                className='bg-gray-700 text-white px-4 py-2 rounded flex-1'
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}