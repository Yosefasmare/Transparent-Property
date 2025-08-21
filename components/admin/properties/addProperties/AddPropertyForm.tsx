'use client';

import React, { useState, useEffect } from 'react';
import { 
  PiSwimmingPool 
} from 'react-icons/pi';
import { 
  FaBicycle, 
  FaFireExtinguisher, 
  FaDog,
  FaCar,
  FaSnowflake,
  FaShieldAlt,
  FaUpload,
  FaTimes
} from 'react-icons/fa';
import Image from 'next/image';
import { addNewProperties, uploadPropertyImages } from '@/lib/supabaseClient';
import useStore from '@/lib/store';

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
  files: File[];
  image_urls: string[];
  address: {
    area: string;
    state: string;
    subcity: string;
    country: string;
  };
  features: string;
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

const AddPropertyForm: React.FC = () => {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    type: '',
    status: '',
    condition: '',
    description: '',
    price: 0,
    price_per: 'full price',
    size: 0,
    beds: 0,
    baths: 0,
    parking: 0,
    files: [],
    image_urls: [],
    address: {
      area: '',
      state: '',
      subcity: '',
      country: 'Ethiopia',
    },
    features: '',
    amenities: {
      outdoor: {
        swimming_pool: false,
        garden: false,
        fire_safety: false,
        pet_friendly: false,
      },
      essential: {
        garage: false,
        air_conditioning: false,
        parking_space: false,
        security_system: false,
      },
    },
    furnishing: '',
    year_built: 0,
  });
  const [loading, setLoading] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const {agentData,setAgent_properties,agent_properties} = useStore()

  // Auto-dismiss submit message after 5 seconds
  useEffect(() => {
    if (submitMessage) {
      const timer = setTimeout(() => {
        setSubmitMessage(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [submitMessage])

  const [errors, setErrors] = useState<FormErrors>({});

  if(!agentData){
    return(
      <div className='w-full h-screen justify-center items-center'>
         <p className=' capitalize font-extrabold text-5xl'>No agent Data Found!</p>
      </div>
    )
  }

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
      const currentCount = formData.image_urls.length;
      const MAX_IMAGES = 8;
      const remainingSlots = MAX_IMAGES - currentCount;

      if (remainingSlots <= 0) {
        setErrors(prev => ({ ...prev, files: `You can upload up to ${MAX_IMAGES} images only.` }));
        return;
      }

      const selectedFiles = Array.from(files).slice(0, remainingSlots);
      const ignoredCount = files.length - selectedFiles.length;

      const imageUrls = selectedFiles.map(file => URL.createObjectURL(file));
      const fileArray = selectedFiles.map(file => file);

      setFormData(prev => ({ ...prev, files: [...prev.files, ...fileArray] }));
      setFormData(prev => ({ ...prev, image_urls: [...prev.image_urls, ...imageUrls] }));

      // Clear file-related errors if we're within limits
      setErrors(prev => ({ ...prev, files: ignoredCount > 0 ? `Only ${MAX_IMAGES} images allowed. Ignored ${ignoredCount} extra ${ignoredCount === 1 ? 'file' : 'files'}.` : undefined }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      image_urls: prev.image_urls.filter((_, i) => i !== index),
      files: prev.files.filter((_, i) => i !== index)
    }));

    // Clear any file count errors after removal
    setErrors(prev => ({ ...prev, files: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.type) newErrors.type = 'Type is required';
    if (!formData.status) newErrors.status = 'Status is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (formData.size <= 0) newErrors.size = 'Size must be greater than 0';
    if (formData.beds < 0) newErrors.beds = 'Beds cannot be negative';
    if (formData.baths < 0) newErrors.baths = 'Baths cannot be negative';
    if (formData.parking < 0) newErrors.parking = 'Parking cannot be negative';
    if(formData.files.length === 0) newErrors.files = 'Upload Atleast 1 image'
    if(formData.files.length > 8) newErrors.files = 'Maximum 8 images are allowed';
    
    // Initialize address errors object
    newErrors.address = {};
    if (!formData.address.area.trim()) newErrors.address.area = 'Area/Street is required';
    if (!formData.address.state.trim()) newErrors.address.state = 'City/State is required';
    if (!formData.address.subcity.trim()) newErrors.address.subcity = 'Subcity is required';
    if (!formData.address.country.trim()) newErrors.address.country = 'Country is required';
    
    // Remove address errors if no errors exist
    if (Object.keys(newErrors.address).length === 0) {
      delete newErrors.address;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: '',
      status: '',
      condition: '',
      description: '',
      price: 0,
      price_per: 'full price',
      size: 0,
      beds: 0,
      baths: 0,
      parking: 0,
      files: [],
      image_urls: [],
      address: {
        area: '',
        state: '',
        subcity: '',
        country: 'Ethiopia',
      },
      features: '',
      amenities: {
        outdoor: {
          swimming_pool: false,
          garden: false,
          fire_safety: false,
          pet_friendly: false,
        },
        essential: {
          garage: false,
          air_conditioning: false,
          parking_space: false,
          security_system: false,
        },
      },
      furnishing: '',
      year_built: 0,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)
    
    try {
      if (validateForm()) {
        const property_image_path: string[] = []
        for(const file of formData.files) {
          const {filePath} = await uploadPropertyImages(file)
          if(!filePath){
            const newErrors: FormErrors = {}
            newErrors.files = 'Failed to upload images'
            setErrors(newErrors)
            setLoading(false)
            return
          }

          property_image_path.push(filePath)
        }

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
     }
    
   const newFeatures = formData.features
  .split(',')
  .map(feature => feature.trim());

     const propertyData = {
       title: formData.title,
       type: formData.type,
       status: formData.status,
       condition: formData.condition,
       description: formData.description,
       price: formData.price,
       price_per: formData.price_per,
       size: formData.size,
       beds: formData.beds,
       baths: formData.baths,
       parking: formData.parking,
       image_paths: property_image_path,
       location: formData.address,
       agent_id: agentData.id,
       features: newFeatures,
       amenities: newAmenities,
       furnishing: formData.furnishing,
       year_built: formData.year_built
     }

     const {newProperty} = await addNewProperties(propertyData)
     
     if(newProperty){
       setAgent_properties([...agent_properties,newProperty])
       setSubmitMessage({ message: 'Property added successfully!', type: 'success' })
       
       // Reset form on success
       resetForm()
     } else {
       setSubmitMessage({ message: 'Failed to add property', type: 'error' })
     }
      }
    } catch (error) {
      console.error('Error adding property:', error)
      setSubmitMessage({ message: 'An error occurred while adding the property', type: 'error' })
    } finally {
      setLoading(false)
    }
  };



  const handleCancel = () => {
    setFormData({
          title: '',
    type: '',
    status: '',
    condition: '',
    description: '',
    price: 0,
    price_per: 'full price',
    size: 0,
    beds: 0,
    baths: 0,
    parking: 0,
    files: [],
    image_urls: [],
    address: {
      area: '',
      state: '',
      subcity: '',
      country: 'Ethiopia',
    },
    features: '',
    amenities: {
      outdoor: {
        swimming_pool: false,
        garden: false,
        fire_safety: false,
        pet_friendly: false,
      },
      essential: {
        garage: false,
        air_conditioning: false,
        parking_space: false,
        security_system: false,
      },
    },
    furnishing: '',
    year_built: 0,
    })
  };

    return (
    <div className="max-w-6xl mx-auto p-3 sm:p-4 md:p-6 bg-white rounded-lg shadow-sm overflow-x-hidden">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Add New Property</h1>
        <p className="text-sm sm:text-base text-gray-600">Fill in the details below to add a new property to your portfolio.</p>
      </div>

      {/* Submit Message Display */}
      {submitMessage && (
        <div className={`fixed left-4 top-4 z-50 p-4 rounded-xl border-l-4 shadow-lg max-w-md ${
          submitMessage.type === 'success' 
            ? 'bg-green-50 border-green-400 text-green-800' 
            : 'bg-red-50 border-red-400 text-red-800'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
              submitMessage.type === 'success' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              {submitMessage.type === 'success' ? (
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
                submitMessage.type === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {submitMessage.type === 'success' ? 'Success!' : 'Error'}
              </p>
              <p className={`mt-1 ${
                submitMessage.type === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {submitMessage.message}
              </p>
            </div>
            <button
              onClick={() => setSubmitMessage(null)}
              className={`flex-shrink-0 p-1 rounded-full hover:bg-opacity-80 transition-colors ${
                submitMessage.type === 'success' 
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

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Basic Info Section */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Title <span className='text-red-500'>*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter property title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type <span className='text-red-500'>*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.type ? 'border-red-500' : 'border-gray-300'
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
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className='text-red-500'>*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.status ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select status</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
              {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition <span className='text-red-500'>*</span>
              </label>
              <select
                value={formData.condition}
                onChange={(e) => handleInputChange('condition', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.condition ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select condition</option>
                <option value="New">New</option>
                <option value="Used">Used</option>
                <option value="Renovated">Renovated</option>
                <option value="Under Construction">Under Construction</option>
              </select>
              {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
            </div>
          </div>

          <div className="mt-4 sm:mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className='text-red-500'>*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe the property in detail..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Property Details 
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price <span className='text-red-500'>*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  className={`flex-1 px-3 py-2 border sm:border-r-0 border-gray-300 rounded-md sm:rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  min="0"
                  step="0.01"
                />
                <select
                  value={formData.price_per}
                  onChange={(e) => handleInputChange('price_per', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md sm:rounded-l-md  focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="full price">full price</option>
                  <option value="month">per month</option>
                  <option value="year">per year</option>
                </select>
              </div>
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size (sqm) <span className='text-red-500'>*</span>
              </label>
              <input
                type="number"
                value={formData.size}
                onChange={(e) => handleInputChange('size', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.size ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
                step="0.01"
              />
              {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms <span className='text-red-500'>*</span>
              </label>
              <input
                type="number"
                value={formData.beds}
                onChange={(e) => handleInputChange('beds', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.beds ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
              />
              {errors.beds && <p className="text-red-500 text-sm mt-1">{errors.beds}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms <span className='text-red-500'>*</span>
              </label>
              <input
                type="number"
                value={formData.baths}
                onChange={(e) => handleInputChange('baths', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.baths ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
                step="0.5"
              />
              {errors.baths && <p className="text-red-500 text-sm mt-1">{errors.baths}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parking Spaces 
              </label>
              <input
                type="number"
                value={formData.parking}
                onChange={(e) => handleInputChange('parking', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.parking ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
              />
              {errors.parking && <p className="text-red-500 text-sm mt-1">{errors.parking}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year Built
              </label>
              <input
                type="number"
                value={formData.year_built}
                onChange={(e) => handleInputChange('year_built', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2024"
                min="1800"
                max="2024"
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Furnishing <span className='text-red-500'>*</span>
              </label>
              <select
                value={formData.furnishing}
                onChange={(e) => handleInputChange('furnishing', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select furnishing</option>
                <option value="Furnished">Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
                <option value="Semi-furnished">Semi-furnished</option>
              </select>
            </div>

          </div>
        </div>

        {/* Amenities Section */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Amenities
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            {/* Outdoor Amenities */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Outdoor</h3>
              <div className="space-y-3">
                <AmenityToggle
                  icon={<PiSwimmingPool className="w-5 h-5" />}
                  label="Swimming Pool"
                  checked={formData.amenities.outdoor.swimming_pool}
                  onChange={(checked) => handleAmenityChange('outdoor', 'swimming_pool', checked)}
                />
                <AmenityToggle
                  icon={<FaBicycle className="w-5 h-5" />}
                  label="Garden"
                  checked={formData.amenities.outdoor.garden}
                  onChange={(checked) => handleAmenityChange('outdoor', 'garden', checked)}
                />
                <AmenityToggle
                  icon={<FaFireExtinguisher className="w-5 h-5" />}
                  label="Fire Safety"
                  checked={formData.amenities.outdoor.fire_safety}
                  onChange={(checked) => handleAmenityChange('outdoor', 'fire_safety', checked)}
                />
                <AmenityToggle
                  icon={<FaDog className="w-5 h-5" />}
                  label="Pet Friendly"
                  checked={formData.amenities.outdoor.pet_friendly}
                  onChange={(checked) => handleAmenityChange('outdoor', 'pet_friendly', checked)}
                />
              </div>
            </div>

            {/* Essential Amenities */}
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">Essential</h3>
              <div className="space-y-3">
                <AmenityToggle
                  icon={<FaCar className="w-5 h-5" />}
                  label="Garage"
                  checked={formData.amenities.essential.garage}
                  onChange={(checked) => handleAmenityChange('essential', 'garage', checked)}
                />
                <AmenityToggle
                  icon={<FaSnowflake className="w-5 h-5" />}
                  label="Air Conditioning"
                  checked={formData.amenities.essential.air_conditioning}
                  onChange={(checked) => handleAmenityChange('essential', 'air_conditioning', checked)}
                />
                <AmenityToggle
                  icon={<FaCar className="w-5 h-5" />}
                  label="Parking Space"
                  checked={formData.amenities.essential.parking_space}
                  onChange={(checked) => handleAmenityChange('essential', 'parking_space', checked)}
                />
                <AmenityToggle
                  icon={<FaShieldAlt className="w-5 h-5" />}
                  label="Security System"
                  checked={formData.amenities.essential.security_system}
                  onChange={(checked) => handleAmenityChange('essential', 'security_system', checked)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Media Section */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Media
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Images <span className='text-red-500'>*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-blue-400 transition-colors">
                <FaUpload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-3 sm:mb-4" />
                <div className="text-sm text-gray-600 mb-2">
                  <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload images</span>
                    <input
                      id="image-upload"
                      name="image-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={formData.image_urls.length >= 8}
                    />
                  </label>
                  <span className="text-gray-500"> or drag and drop</span>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each • Max 8 images</p>
                {errors.files && (
                  <p className="text-red-500 text-sm mt-2">{errors.files}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Selected: {formData.image_urls.length}/8</p>
              </div>
            </div>

            {/* Image Previews */}
            {formData.image_urls.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Uploaded Images</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                  {formData.image_urls.map((url, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={url}
                        alt={`Property ${index + 1}`}
                        width={200}
                        height={350}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Location
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area/Street <span className='text-red-500'>*</span>
              </label>
              <input
                type="text"
                value={formData.address.area}
                onChange={(e) => handleAddressChange('area', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.address?.area ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter area or street name"
              />
              {errors.address?.area && <p className="text-red-500 text-sm mt-1">{errors.address.area}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcity <span className='text-red-500'>*</span>
              </label>
              <input
                type="text"
                value={formData.address.subcity}
                onChange={(e) => handleAddressChange('subcity', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.address?.subcity ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter subcity"
              />
              {errors.address?.subcity && <p className="text-red-500 text-sm mt-1">{errors.address.subcity}</p>}
            </div> 

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City/State <span className='text-red-500'>*</span>
              </label>
              <input
                type="text"
                value={formData.address.state}
                onChange={(e) => handleAddressChange('state', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.address?.state ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter city or state"
              />
              {errors.address?.state && <p className="text-red-500 text-sm mt-1">{errors.address.state}</p>}
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country <span className='text-red-500'>*</span>
              </label>
              <input
                type="text"
                value={formData.address.country}
                onChange={(e) => handleAddressChange('country', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.address?.country ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter country"
              />
              {errors.address?.country && <p className="text-red-500 text-sm mt-1">{errors.address.country}</p>}
            </div>
          </div>

        </div>

        {/* Additional Info Section */}
        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            Additional Information
          </h2>
          
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
            <p className="text-sm text-gray-500 mt-1">Separate multiple features with commas</p>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 py-2.5 sm:py-3 px-4 sm:px-6 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 text-sm sm:text-base flex items-center justify-center gap-2 ${
              loading
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
                Adding Property...
              </>
            ) : (
              'Add Property'
            )}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-300 text-gray-700 py-2.5 sm:py-3 px-4 sm:px-6 rounded-md font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm sm:text-base"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Global Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Adding Property</h3>
              <p className="text-gray-600">Please wait while we process your request...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Amenity Toggle Component
interface AmenityToggleProps {
  icon: React.ReactNode;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const AmenityToggle: React.FC<AmenityToggleProps> = ({ icon, label, checked, onChange }) => {
  return (
    <label className="flex items-center space-x-2 sm:space-x-3 cursor-pointer p-2 sm:p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={`w-8 h-5 sm:w-10 sm:h-6 rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-300'
        }`}>
          <div className={`w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full transition-transform transform ${
            checked ? 'translate-x-4 sm:translate-x-5' : 'translate-x-0.5 sm:translate-x-1'
          } mt-1`} />
        </div>
      </div>
      <div className="flex items-center space-x-2 flex-1">
        <div className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600">
          {icon}
        </div>
        <span className="text-xs sm:text-sm font-medium text-gray-700">{label}</span>
      </div>
    </label>
  );
};

export default AddPropertyForm;
