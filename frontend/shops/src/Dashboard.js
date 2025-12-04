import React, { useState } from 'react'

export default function Dashboard({ onLogout }) {
    const [currentPage, setCurrentPage] = useState('visit')

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
                            >
                                Add Shop
                            </button>
                            <button 
                                onClick={onLogout}
                                className='px-3 py-2 rounded text-red-200 hover:bg-red-600'
                            >
                                Logout
                            </button>
                    </div>
                </div>
            </nav>
            
            <div className='p-8'>
                {currentPage === 'visit' && (
                    <div>
                        <h2 className=''>View Shops</h2>
                    </div>
                )}
                {currentPage === 'add' && (
                    <div>
                        <h2 className='text-2xl font-bold mb-4'>Add New Shop</h2>
                        <input 
                            type='text'
                            placeholder='Enter shop name'
                            className='w-full p-3 border rounded mb-3'
                        />
                        <input 
                            type='text'
                            placeholder='Enter the address of the shop'
                            className='w-full p-3 border rounded mb-4'
                        />
                        <button className='bg-green-900 text-white px-6 py-3 rounded'>Add</button>
                        
                    </div>
                    )}
            </div>
        </div>
    )
}