import PropertyDetails from '@/components/properties/PropertyDetails'
import PropertyGallery from '@/components/properties/PropertyGallery'
import PropertyAmenities from '@/components/properties/PropertyAmenities'
import PropertyContact from '@/components/properties/PropertyContact'
import PropertyMap from '@/components/properties/PropertyMap'
import SimilarProperties from '@/components/properties/SimilarProperties'
import ViewCounter from '@/components/properties/ViewCounter'
import { getPosted_by, getPropertyById } from '@/lib/supabaseClient'
import ViewTracker from '@/components/properties/ViewTracker'

type Props = {
  params: Promise<{ id: string }>;
};



const PropertyPage = async ({ params }: Props) => {
  const {id:paramsId} = await params
  const property = await getPropertyById(paramsId);
  const posted_by = await getPosted_by(property.agent_id)

  const PropertyInfos = {
    id: property?.id,
    title: property?.title,
    price: property?.price,
    price_per: property.price_per,
    status: property?.status,
    type: property?.type,
    location: `${property?.location.area}, ${property?.location.state}`,
    listedDate: property?.created_at,
    parking: property?.parking,
    bedrooms: property?.beds,
    bathrooms: property?.baths,
    size: property?.size,
    description: property?.description,
    features: property?.features,
    views: property?.views || 0,
  }

  const AdditionalInfo = {
    type: property?.type,
    condition: property?.condition,
    year_built: property?.year_built,
    furnishing: property?.furnishing
  }
  const CurrentProperty = {
    id: paramsId,
    type: property?.type,
    price: property?.price,
    location : {
      area: property?.location.area,
      state: property?.location.state
    }
  }

  return (
    <div className="min-h-screen mt-10  bg-gray-50">
      {/* Hero Section with Gallery */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <PropertyGallery propertyImagePaths={property.image_paths} />
            {/* View Counter positioned over the gallery */}
            <div className="absolute top-4 right-4 z-10">
              <ViewCounter views={property?.views} />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Details */}
            <PropertyDetails PropertyInfo={PropertyInfos} />

            {/* Amenities */}
            <PropertyAmenities PropertyAmenities={property?.amenities} AdditionalInfo={AdditionalInfo} />

            {/* Map need NOTICE: implementation*/}

            <PropertyMap location={property?.location} />
          </div>

          {/* Right Column - Contact & Sidebar */}
          <div className="space-y-6">
            {/* Contact Form */}
            <PropertyContact postedBy={posted_by} propertyId={paramsId} />
          </div>
        </div>
      </section>

      {/* Similar Properties */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <SimilarProperties CurrentProperty={CurrentProperty} />
        </div>
      </section>
      <ViewTracker propertyId={paramsId} />
    </div>
  )
}

export default PropertyPage