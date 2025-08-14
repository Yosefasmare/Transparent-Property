import React from 'react';
import EditPropertyForm from '@/components/admin/properties/editProperties/EditPropertyForm';
import { getPropertyById } from '@/lib/supabaseClient';

type Props = {
  params: Promise<{ id: string }>;
};

const EditPropertyPage = async ({params}:Props) => {

  const {id:property_id} = await  params
  const property_tobe_edited = await getPropertyById(property_id)


  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Property</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update property information and details
        </p>
      </div>

      {/* Edit Property Form */}
      <EditPropertyForm propertyData={property_tobe_edited} />
    </div>
  );
};

export default EditPropertyPage;