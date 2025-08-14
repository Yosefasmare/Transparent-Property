'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaTimes,
  FaEdit,
  FaSave
} from 'react-icons/fa';
import Image from 'next/image';
import { deletPropertyImages, removeDeletedImagePath, updatePropertyData, uploadPropertyImages } from '@/lib/supabaseClient';
import { getUpdatedFields } from './getChangedData';

interface EditPropertyFormProps {
  propertyData: AgentProperties;
}

interface PropertyFormData {
  title: string;
  type: string;
  status: string;
  condition: string;
  description: string;
  price: number;
  price_per: string;
  size: number;
  beds: number;
  baths: number;
  parking: number;
  image_paths: string[];
  address: {
    area: string;
    state: string;
    subcity: string;
    country: string;
  };
  features: string[];
  amenities: {
    outdoor: {
      swimming_pool: boolean;
      garden: boolean;
      fire_safety: boolean;
      pet_friendly: boolean;
    };
    essential: {
      garage: boolean;
      air_conditioning: boolean;
      parking_space: boolean;
      security_system: boolean;
    };
  };
  furnishing: string;
  year_built: number;
}

// Type for form errors including nested address errors
type FormErrors = {
  [K in keyof PropertyFormData]?: K extends 'address' 
    ? { [A in keyof PropertyFormData['address']]?: string }
    : string;
};

const EditPropertyForm: React.FC<EditPropertyFormProps> = ({ propertyData }) => {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: propertyData.title,
    type: propertyData.type,
    status: propertyData.status,
    condition: propertyData.condition,
    description: propertyData.description,
    price: propertyData.price,
    price_per: propertyData.price_per,
    size: propertyData.size,
    beds: propertyData.beds,
    baths: propertyData.baths,
    parking: propertyData.parking,
    image_paths: propertyData.image_paths,
    address: {
      area: propertyData.location.area,
      state: propertyData.location.state,
      subcity: propertyData.location.subcity,
      country: propertyData.location.country,
    },
    features: propertyData.features,
    amenities: {
      outdoor: {
        swimming_pool: propertyData.amenities.outdoor.swimming_pool || false,
        garden: propertyData.amenities.outdoor.garden || false,
        fire_safety: propertyData.amenities.outdoor.fire_safety || false,
        pet_friendly: propertyData.amenities.outdoor.pet_friendly || false,
      },
      essential: {
        garage: propertyData.amenities.essential.garage || false,
        air_conditioning: propertyData.amenities.essential.air_conditioning || false,
        parking_space: propertyData.amenities.essential.parking_space || false,
        security_system: propertyData.amenities.essential.security_system || false,
      },
    },
    furnishing: propertyData.furnishing,
    year_built: propertyData.year_built,
  });

  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<{ index: number; path: string } | null>(null);
  const [imagePreview,setImagePreview] = useState<string[]>([])
  const [fileUploaded,setFileUploaded] = useState<File[]>([])

  // Auto-dismiss submit message after 5 seconds
  useEffect(() => {
    if (submitMessage) {
      const timer = setTimeout(() => {
        setSubmitMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [submitMessage]);

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAddressChange = (field: keyof PropertyFormData['address'], value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
    
    // Clear error for this field
    if (errors.address?.[field]) {
      setErrors(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: undefined
        }
      }));
    }
  };

  const handleAmenityChange = (category: 'outdoor' | 'essential', amenity: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [category]: {
          ...prev.amenities[category],
          [amenity]: value,
        },
      },
    }));
  };



  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setFileUploaded(prev => [...prev,...files]);
      setImagePreview(prev=> [...prev,...imageUrls])
    }
  };

  const confirmDeleteImage = (index: number, path: string) => {
    setImageToDelete({ index, path });
    setShowDeleteConfirm(true);
  };

  const removeImage = async () => {
    if (!imageToDelete) return;

    try {
      const {message:pathDeleteMessgae,type:pathDeleteType} = await removeDeletedImagePath(propertyData.id,imageToDelete.path)
      if(pathDeleteType === 'error'){
          setSubmitMessage({
            message: pathDeleteMessgae || 'Failed to remove Image',
            type: (pathDeleteType === 'error' ? 'error' : 'success') as 'success' | 'error'
       });
       return
      }
      
      const { message, type } = await deletPropertyImages(imageToDelete.path);
      // Show success/error message from API response
      setSubmitMessage({
        message: message || 'Image deleted successfully',
        type: (type === 'error' ? 'error' : 'success') as 'success' | 'error'
      });

      // Remove image from form data
      setFormData(prev => ({
        ...prev,
        image_paths: prev.image_paths.filter((_: string, i: number) => i !== imageToDelete.index)
      }));

      // Close modal and reset
      setShowDeleteConfirm(false);
      setImageToDelete(null);
    } catch (error) {
      console.log(error)
      setSubmitMessage({
        message: 'Failed to delete image. Please try again.',
        type: 'error'
      });
    }
  };

  const cancelDeleteImage = () => {
    setShowDeleteConfirm(false);
    setImageToDelete(null);
  };

  const handleRemovePreview = (index:number) => {
  setFileUploaded(prev => prev.filter((_, i) => i !== index));
  setImagePreview(prev => prev.filter((_, i) => i !== index));
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.size <= 0) newErrors.size = 'Size must be greater than 0';
    if (formData.beds <= 0) newErrors.beds = 'Bedrooms must be greater than 0';
    if (formData.baths <= 0) newErrors.baths = 'Bathrooms must be greater than 0';
    if (formData.parking < 0) newErrors.parking = 'Parking spaces cannot be negative';
    if (formData.year_built <= 0) newErrors.year_built = 'Year built must be greater than 0';
    
    // Address validation
    if (!formData.address.area.trim()) {
      newErrors.address = { ...newErrors.address, area: 'Area is required' };
    }
    if (!formData.address.state.trim()) {
      newErrors.address = { ...newErrors.address, state: 'State is required' };
    }
    if (!formData.address.subcity.trim()) {
      newErrors.address = { ...newErrors.address, subcity: 'Subcity is required' };
    }
    if (!formData.address.country.trim()) {
      newErrors.address = { ...newErrors.address, country: 'Country is required' };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const property_image_path: string[] = []

      if(fileUploaded.length > 0){
        for(const file of fileUploaded) {
          const {filePath,message,type} = await uploadPropertyImages(file)
          if(!filePath){
            setSubmitMessage({
              message: message,
              type: type === 'success' ? 'success' : 'error'
            })
            return
          }
          property_image_path.push(filePath)
         }

         setFormData(prev =>({
          ...prev,
          image_paths: [...prev.image_paths,...property_image_path]
         }))
      }




       // Create amenities in the correct format for the API
       const newAmenities = {
         "outdoor": {
           swimming_pool: formData.amenities.outdoor.swimming_pool,
           garden: formData.amenities.outdoor.garden,
           fire_safety: formData.amenities.outdoor.fire_safety,
           pet_friendly: formData.amenities.outdoor.pet_friendly
         },
         "essential": {
           garage: formData.amenities.essential.garage,
           air_conditioning: formData.amenities.essential.air_conditioning,
           parking_space: formData.amenities.essential.parking_space,
           security_system: formData.amenities.essential.security_system
         }
       };

    

    
       const updatedFields = getUpdatedFields(
         {
           title: propertyData.title,
           type: propertyData.type,
           status: propertyData.status,
           condition: propertyData.condition,
           description: propertyData.description,
           price: propertyData.price,
           price_per: propertyData.price_per,
           size: propertyData.size,
           beds: propertyData.beds,
           baths: propertyData.baths,
           parking: propertyData.parking,
           image_paths: formData.image_paths,
           address: {
             area: propertyData.location.area,
             state: propertyData.location.state,
             subcity: propertyData.location.subcity,
             country: propertyData.location.country,
           },
           features: propertyData.features,
           amenities: newAmenities,
           furnishing: propertyData.furnishing,
           year_built: propertyData.year_built,
         },
         formData
       );

       const newImage_paths = [...propertyData.image_paths, ...property_image_path]
       if(property_image_path.length === 0 && Object.keys(updatedFields).length === 0){
        setSubmitMessage({
          message: 'No Changed Data!',
          type: 'error'
        })
        return
       }
       const {message,type} = await updatePropertyData(updatedFields, propertyData.id,newAmenities,newImage_paths);
      
      setSubmitMessage({
        message: message,
        type: type === 'success' ? 'success' : 'error'
      });
      
      // Reset form or redirect
    } catch (error) {
      console.log(error)
      setSubmitMessage({
        message: 'Failed to update property. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <FaEdit className="text-blue-600" />
          Edit Property Details
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Update the property information below. All fields marked with * are required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Submit Message */}
        {submitMessage && (
          <div className={`fixed top-20 right-6 p-4 capitalize rounded-md shadow-lg z-50 max-w-sm ${
            submitMessage.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {submitMessage.type === 'success' ? (
                  <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">
                  {submitMessage.message}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  type="button"
                  onClick={() => setSubmitMessage(null)}
                  className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter property title"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.type ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                   <option value="">Select type</option>
                   <option value="House">House</option>
                   <option value="Apartment">Apartment</option>
                   <option value="Condo">Condo</option>
                   <option value="Townhouse">Townhouse</option>
                   <option value="Villa">Villa</option>
                   <option value="Duplex">Duplex</option>
                   <option value="Penthouse">Penthouse</option>
                   <option value="Bungalow">Bungalow</option>
                   <option value="Studio">Studio</option>
                   <option value="Cottage">Cottage</option>
                   <option value="Loft">Loft</option>
                   <option value="Farmhouse">Farmhouse</option>
                   <option value="Mansion">Mansion</option>
                   <option value="Land">Land</option>
                   <option value="Commercial">Commercial</option>
                   <option value="Industrial">Industrial</option>
                   <option value="Mixed Use">Mixed Use</option>
              </select>
              {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.status ? 'border-red-300' : 'border-red-300'
                }`}
              >
                <option value="">Select status</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
              {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition *
              </label>
              <select
                value={formData.condition}
                onChange={(e) => handleInputChange('condition', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.condition ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                 <option value="">Select condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Renovated">Renovated</option>
                <option value="Under Construction">Under Construction</option>
              </select>
              {errors.condition && <p className="mt-1 text-sm text-red-600">{errors.condition}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe the property in detail"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>
        </div>

        {/* Pricing and Details */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Pricing & Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Per
              </label>
              <select
                value={formData.price_per}
                onChange={(e) => handleInputChange('price_per', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="full price">full price</option>
                <option value="month">per month</option>
                <option value="year">per year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size (sq ft) *
              </label>
              <input
                type="number"
                value={formData.size}
                onChange={(e) => handleInputChange('size', parseFloat(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.size ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.size && <p className="mt-1 text-sm text-red-600">{errors.size}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms *
              </label>
              <input
                type="number"
                value={formData.beds}
                onChange={(e) => handleInputChange('beds', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.beds ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.beds && <p className="mt-1 text-sm text-red-600">{errors.beds}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms *
              </label>
              <input
                type="number"
                value={formData.baths}
                onChange={(e) => handleInputChange('baths', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.baths ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.baths && <p className="mt-1 text-sm text-red-600">{errors.baths}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parking Spaces
              </label>
              <input
                type="number"
                value={formData.parking}
                onChange={(e) => handleInputChange('parking', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.parking ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.parking && <p className="mt-1 text-sm text-red-600">{errors.parking}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year Built *
              </label>
              <input
                type="number"
                value={formData.year_built}
                onChange={(e) => handleInputChange('year_built', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.year_built ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {errors.year_built && <p className="mt-1 text-sm text-red-600">{errors.year_built}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Furnishing
              </label>
              <select
                value={formData.furnishing}
                onChange={(e) => handleInputChange('furnishing', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select furnishing</option>
                <option value="Furnished">Furnished</option>
                <option value="Semi-furnished">Semi-furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              <input
                type="text"
                value={formData.features}
                onChange={(e) => handleInputChange('features', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter features separated by commas"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Location & Address
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area *
              </label>
              <input
                type="text"
                value={formData.address.area}
                onChange={(e) => handleAddressChange('area', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.address?.area ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter area"
              />
              {errors.address?.area && <p className="mt-1 text-sm text-red-600">{errors.address.area}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                value={formData.address.state}
                onChange={(e) => handleAddressChange('state', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.address?.state ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter state"
              />
              {errors.address?.state && <p className="mt-1 text-sm text-red-600">{errors.address.state}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcity *
              </label>
              <input
                type="text"
                value={formData.address.subcity}
                onChange={(e) => handleAddressChange('subcity', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.address?.subcity ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter subcity"
              />
              {errors.address?.subcity && <p className="mt-1 text-sm text-red-600">{errors.address.subcity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <input
                type="text"
                value={formData.address.country}
                onChange={(e) => handleAddressChange('country', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.address?.country ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter country"
              />
              {errors.address?.country && <p className="mt-1 text-sm text-red-600">{errors.address.country}</p>}
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Amenities & Features
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Outdoor Amenities */}
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-4">Outdoor Amenities</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.amenities.outdoor.swimming_pool}
                    onChange={(e) => handleAmenityChange('outdoor', 'swimming_pool', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Swimming Pool</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.amenities.outdoor.garden}
                    onChange={(e) => handleAmenityChange('outdoor', 'garden', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Garden</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.amenities.outdoor.fire_safety}
                    onChange={(e) => handleAmenityChange('outdoor', 'fire_safety', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Fire Safety</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.amenities.outdoor.pet_friendly}
                    onChange={(e) => handleAmenityChange('outdoor', 'pet_friendly', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Pet Friendly</span>
                </label>
              </div>
            </div>

            {/* Essential Amenities */}
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-4">Essential Amenities</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.amenities.essential.garage}
                    onChange={(e) => handleAmenityChange('essential', 'garage', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Garage</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.amenities.essential.air_conditioning}
                    onChange={(e) => handleAmenityChange('essential', 'air_conditioning', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Air Conditioning</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.amenities.essential.parking_space}
                    onChange={(e) => handleAmenityChange('essential', 'parking_space', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Parking Space</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.amenities.essential.security_system}
                    onChange={(e) => handleAmenityChange('essential', 'security_system', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Security System</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Property Images
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload New Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Current Images */}
          {formData.image_paths.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Images
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.image_paths.map((path, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_PIC_URL}/property-images/${path}`}
                      alt={`Property image ${index + 1}`}
                      width={200}
                      height={150}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                                          <button
                        type="button"
                        onClick={() => confirmDeleteImage(index, path)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-100 lg:opacity-0  group-hover:opacity-100 transition-opacity"
                      >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
              {imagePreview.length > 0 && (
                <div className='mt-4'>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Selected image/s Preview
                   </label>
                <div className='w-full flex flex-wrap m-5 gap-3'>
                  { imagePreview.map((url,index)=>(
                    <div key={index} className="relative group">
                       <Image
                         src={url}
                         alt={`Property image ${index + 1}`}
                         width={200}
                         height={150}
                         className="w-full h-32 object-cover rounded-lg"
                       />
                         <button
                           type="button"
                           onClick={() => handleRemovePreview(index)}
                           className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity"
                         >
                         <FaTimes className="w-3 h-3" />
                       </button>
                     </div>
                   ))}
                </div>

                </div>
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </>
            ) : (
              <>
                <FaSave className="w-4 h-4" />
                Update Property
              </>
            )}
          </button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FaTimes className="w-5 h-5 text-red-600" />
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Delete Image</h3>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this image? This action is not reversible.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelDeleteImage}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={removeImage}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPropertyForm;
