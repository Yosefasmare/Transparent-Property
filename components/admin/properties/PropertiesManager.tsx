'use client'

import useStore from '@/lib/store'
import { deleteProperty, deletPropertyImages, setSoldProperties } from '@/lib/supabaseClient'
import Image from 'next/image'
import Link from 'next/link'
import React, {  useState, useEffect } from 'react'
import { FiSearch, FiEdit, FiTrash2, FiCheckCircle, FiPlus, FiMapPin, FiDollarSign } from 'react-icons/fi'
import ConfirmationPopup from '../ConfirmationPopup'



const statusColors = {
  sale: "bg-green-100 text-green-800 border-green-200",
  rent: "bg-blue-100 text-blue-800 border-blue-200",
  sold: "bg-red-100 text-red-800 border-red-200",
}

export default function PropertiesManager() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const {agent_properties,setAgent_properties} = useStore()
  const [loading, setLoading] = useState(false)
  const [deleteMessage, setDeleteMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(null)
  const [markSoldMessage, setMarkSoldMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [markingSoldPropertyId, setMarkingSoldPropertyId] = useState<string | null>(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<{ id: string; title: string,loc_name:string,loc_subcity:string,loc_city:string } | null>(null)

  // Auto-dismiss delete message after 5 seconds
  useEffect(() => {
    if (deleteMessage) {
      const timer = setTimeout(() => {
        setDeleteMessage(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [deleteMessage])

  // Auto-dismiss mark sold message after 5 seconds
  useEffect(() => {
    if (markSoldMessage) {
      const timer = setTimeout(() => {
        setMarkSoldMessage(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [markSoldMessage])

  const filteredProperties =  agent_properties.filter((property) => {
      const matchesSearch =
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.state.toLowerCase().includes(searchTerm.toLowerCase())
        let matchesStatus;
        if(statusFilter === 'sold') {
          matchesStatus = property.is_sold
        } else {
          matchesStatus = statusFilter === "All" || property.status === statusFilter
        }
      return matchesSearch && matchesStatus
    })

   const FormatPrice = (price: number) =>{
    return new Intl.NumberFormat('en-US').format(price);
  }



  const handleDeleteClick = (id: string, title: string,loc_name:string,loc_subcity:string,loc_city:string) => {
    setPropertyToDelete({ id, title,loc_name,loc_subcity,loc_city })
    setShowDeleteConfirmation(true)
  }

  const handleDeleteConfirm = async () => {
    if (!propertyToDelete) return
    
    setDeletingPropertyId(propertyToDelete.id)
    setLoading(true)
    setShowDeleteConfirmation(false)

    try {
      const toBe_deleted = agent_properties.filter(prop => prop.id == propertyToDelete.id)[0]

      if (toBe_deleted && toBe_deleted.image_paths?.length > 0) {
        // Run all deletions in parallel
        await Promise.all(
          toBe_deleted.image_paths.map(async (property_image_path: string) => {
            const { message, type } = await deletPropertyImages(property_image_path);
            if(type === 'error') {
              setDeleteMessage({ message: message || 'Failed to delete images', type: 'error' })
            }
          })
        );
      }

      const {message,type} = await deleteProperty(propertyToDelete.id,propertyToDelete.loc_name,propertyToDelete.loc_subcity,propertyToDelete.loc_city)

      if (type === 'success') {
        setAgent_properties(agent_properties.filter(prop => prop.id !== propertyToDelete.id))
        setDeleteMessage({ message, type })
      } else {
        setDeleteMessage({ message: message || 'Failed to delete property', type: 'error' })
      }
    } catch (error) {
      console.error('Error deleting property:', error)
      setDeleteMessage({ message: 'An error occurred while deleting the property', type: 'error' })
    } finally {
      setLoading(false)
      setDeletingPropertyId(null)
      setPropertyToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirmation(false)
    setPropertyToDelete(null)
  }

  const handleMarkAsSold = async (id: string) => {
    setMarkingSoldPropertyId(id)
    setLoading(true)

    try {
      const currentProperty = agent_properties.filter(prev=>prev.id === id)[0]

      const {message, type} = await setSoldProperties(id, currentProperty.agent_id)
      
      if (type === 'success') {
        setAgent_properties(agent_properties.map(prop => 
          prop.id === id ? { ...prop, is_sold: true } : prop
        ))
        setMarkSoldMessage({ message: message || 'Property marked as sold successfully!', type: 'success' })
      } else {
        setMarkSoldMessage({ message: message || 'Failed to mark property as sold', type: 'error' })
      }
    } catch (error) {
      console.error('Error marking property as sold:', error)
      setMarkSoldMessage({ message: 'An error occurred while marking the property as sold', type: 'error' })
    } finally {
      setLoading(false)
      setMarkingSoldPropertyId(null)
    }
  }


  return (
    <>
      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="rent">For Rent</option>
            <option value="sale">For Sale</option>
            <option value="sold">Sold Properties</option>
          </select>
          
          <Link
          href={'/admin/properties/add-properties'}
           className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <FiPlus className="h-4 w-4" />
            Add Property
          </Link>
        </div>
      </div>

      {/* Delete Message Display */}
      {deleteMessage && (
        <div className={`mb-6 p-4 rounded-xl border-l-4 shadow-lg ${
          deleteMessage.type === 'success' 
            ? 'bg-green-50 border-green-400 text-green-800' 
            : 'bg-red-50 border-red-400 text-red-800'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
              deleteMessage.type === 'success' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              {deleteMessage.type === 'success' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className={`font-semibold ${
                deleteMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {deleteMessage.type === 'success' ? 'Success!' : 'Error'}
              </p>
              <p className={`mt-1 ${
                deleteMessage.type === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {deleteMessage.message}
              </p>
            </div>
            <button
              onClick={() => setDeleteMessage(null)}
              className={`flex-shrink-0 p-1 rounded-full hover:bg-opacity-80 transition-colors ${
                deleteMessage.type === 'success' 
                  ? 'hover:bg-green-200' 
                  : 'hover:bg-red-200'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Mark as Sold Message Display */}
      {markSoldMessage && (
        <div className={`mb-6 p-4 rounded-xl border-l-4 shadow-lg ${
          markSoldMessage.type === 'success' 
            ? 'bg-green-50 border-green-400 text-green-800' 
            : 'bg-red-50 border-red-400 text-red-800'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
              markSoldMessage.type === 'success' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              {markSoldMessage.type === 'success' ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <p className={`font-semibold ${
                markSoldMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {markSoldMessage.type === 'success' ? 'Success!' : 'Error'}
              </p>
              <p className={`mt-1 ${
                markSoldMessage.type === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {markSoldMessage.message}
              </p>
            </div>
            <button
              onClick={() => setMarkSoldMessage(null)}
              className={`flex-shrink-0 p-1 rounded-full hover:bg-opacity-80 transition-colors ${
                markSoldMessage.type === 'success' 
                  ? 'hover:bg-green-200' 
                  : 'hover:bg-red-200'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}

        <>
        {/* Properties List */}
        {filteredProperties.length > 0 ? (
          <div className="space-y-3">
            {filteredProperties.map((property) => (
              <div key={property.id} 
              className={`${
                property.is_sold 
                  ? 'bg-red-50 border-red-300 shadow-red-100 relative overflow-hidden' 
                  : 'bg-white border-gray-200'
              } rounded-lg shadow-sm border-2 p-4 hover:shadow-md transition-all duration-300 ${
                property.is_sold ? 'hover:shadow-red-200' : 'hover:shadow-gray-200'
              }`}>
                
                {/* SOLD Watermark Pattern for Sold Properties */}
                {property.is_sold && (
                  <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-600 transform rotate-45 scale-150"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-red-800 text-6xl font-black tracking-wider">SOLD</div>
                    </div>
                  </div>
                )}
                {/* Mobile Layout */}
                <div className="block sm:hidden">
                  {/* Image and Status */}
                  <div className="relative mb-3">
                    <div className="relative w-full h-32 bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_PIC_URL}/property-images/${property.image_paths[0]}`}
                        alt={property.title}
                        width={320}
                        height={128}
                        priority
                        className={`w-full h-full object-cover ${property.is_sold ? 'opacity-60' : ''}`}
                      />
                      
                      {/* SOLD Badge Overlay */}
                      {property.is_sold && (
                        <div className="absolute inset-0 bg-red-600/80 flex items-center justify-center">
                          <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg transform rotate-12 shadow-lg">
                            SOLD
                          </div>
                        </div>
                      )}
                      
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                          property.is_sold ? statusColors.sold : statusColors[property.status as keyof typeof statusColors]
                        }`}>
                          {property.is_sold ? 'Sold' : property.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="space-y-2 mb-4">
                    <h3 className={`font-semibold text-base ${
                      property.is_sold ? 'text-red-800 line-through' : 'text-gray-900'
                    }`}>
                      {property.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FiDollarSign className={`h-4 w-4 ${property.is_sold ? 'text-red-500' : 'text-green-600'}`} />
                        <span className={`font-medium ${property.is_sold ? 'text-red-700 line-through' : 'text-green-700'}`}>
                          {property.price}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMapPin className="h-4 w-4 text-gray-500" />
                        <span className="truncate">{`${property.location.area}, ${property.location.state}`}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Stacked on Mobile */}
                  <div className="flex flex-col gap-2">
                    <Link
                      href={`/admin/properties/edit-property/${property.id}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <FiEdit className="h-4 w-4" />
                      Edit Property
                    </Link>
                    
                    {!property.is_sold && (
                      <button
                        onClick={() => handleMarkAsSold(property.id)}
                        disabled={markingSoldPropertyId === property.id}
                        className={`flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
                          markingSoldPropertyId === property.id
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                        } border`}
                      >
                        {markingSoldPropertyId === property.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            Marking as Sold...
                          </>
                        ) : (
                          <>
                            <FiCheckCircle className="h-4 w-4" />
                            Mark as Sold
                          </>
                        )}
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDeleteClick(property.id, property.title,property.location.area,property.location.subcity,property.location.state)}
                      disabled={deletingPropertyId === property.id}
                      className={`flex items-center justify-center gap-2 px-4 py-2 text-sm rounded-lg transition-all duration-300 ${
                        deletingPropertyId === property.id
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          : 'text-red-600 border-red-200 hover:bg-red-50'
                      } border`}
                    >
                      {deletingPropertyId === property.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <FiTrash2 className="h-4 w-4" />
                          Delete Property
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden sm:flex items-center gap-4">
                  {/* Property Image */}
                  <div className="relative w-20 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_PIC_URL}/property-images/${property.image_paths[0]}`}
                      alt={property.title}
                      width={80}
                      height={64}
                      className={`w-full h-full object-cover ${property.is_sold ? 'opacity-60' : ''}`}
                    />
                    
                    {/* SOLD Badge Overlay for Desktop */}
                    {property.is_sold && (
                      <div className="absolute inset-0 bg-red-600/80 flex items-center justify-center">
                        <div className="bg-red-600 text-white px-2 py-1 rounded font-bold text-xs transform rotate-12 shadow-lg">
                          SOLD
                        </div>
                      </div>
                    )}
                    
                    <div className="absolute top-1 right-1">
                      <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full border ${
                        property.is_sold ? statusColors.sold : statusColors[property.status as keyof typeof statusColors]
                      }`}>
                        {property.is_sold ? 'Sold' : property.status}
                      </span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-sm mb-1 truncate ${
                          property.is_sold ? 'text-red-800 line-through' : 'text-gray-900'
                        }`}>
                          {property.title}
                        </h3>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <FiDollarSign className={`h-3 w-3 ${property.is_sold ? 'text-red-500' : ''}`} />
                            <span className={`font-medium ${property.is_sold ? 'text-red-700 line-through' : ''}`}>
                              Br {FormatPrice(property.price)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiMapPin className="h-3 w-3" />
                            <span className="truncate">{`${property.location.area}, ${property.location.state}`}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 ml-4">
                        <Link
                          href={`/admin/properties/edit-property/${property.id}`}
                          className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                        >
                          <FiEdit className="h-3 w-3" />
                          Edit
                        </Link>
                        
                        {!property.is_sold && (
                          <button
                            onClick={() => handleMarkAsSold(property.id)}
                            disabled={markingSoldPropertyId === property.id}
                            className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-all duration-300 ${
                              markingSoldPropertyId === property.id
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'text-gray-600 border-gray-200 hover:bg-gray-50'
                            } border`}
                          >
                            {markingSoldPropertyId === property.id ? (
                              <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <FiCheckCircle className="h-3 w-3" />
                                Sold
                              </>
                            )}
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleDeleteClick(property.id, property.title,property.location.area,property.location.subcity,property.location.state)}
                          disabled={deletingPropertyId === property.id}
                          className={`px-2 py-1 text-xs rounded transition-all duration-300 ${
                            deletingPropertyId === property.id
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                              : 'text-red-600 border-red-200 hover:bg-red-50'
                          } border`}
                        >
                          {deletingPropertyId === property.id ? (
                            <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <FiTrash2 className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiPlus className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">Please add a new property to get started.</p>
            <Link
            href={'/admin/properties/add-properties'}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FiPlus className="h-4 w-4" />
              Add Property
            </Link>
          </div>
        )}
          {/* Results Count */}
        {filteredProperties.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-600">
          Showing {filteredProperties.length} of {agent_properties.length} properties
        </div>
      )}
        </>
      {/* Global Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {deletingPropertyId ? 'Deleting Property' : markingSoldPropertyId ? 'Marking as Sold' : 'Processing'}
              </h3>
              <p className="text-gray-600">Please wait while we process your request...</p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      <ConfirmationPopup
        isOpen={showDeleteConfirmation}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Property"
        message={`Are you sure you want to delete "${propertyToDelete?.title}"? This action cannot be undone and will permanently remove the property and all associated images.`}
        confirmText="Delete Property"
        cancelText="Cancel"
        type="danger"
      />
    </>
  )
}
