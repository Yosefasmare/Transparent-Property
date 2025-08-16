import { createClient } from "@supabase/supabase-js";
import type { AuthResponse } from "@supabase/supabase-js";

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables");
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default supabase;



export async function getProperties(limit = 100, {status, type, location, minPrice, maxPrice, minSqFt, maxSqFt, bedroomCount, bathroomCount, condition,area,state,subcity,furnishing}: SearchParams = {}) {
  let query = supabase
    .from('properties')
    .select('*')
    .eq('is_sold',false)
    .limit(limit)
    .order('created_at', { ascending: false });

    

  if (status) {
    query = query.eq('status', status)
  }
  if (type) {
    query = query.eq('type', type)
  }
  if (location) {
     query = query.or(`location->>area.eq.${location},location->>state.eq.${location},location->>subcity.eq.${location},location->>country.eq.${location}`);
  }
  if(area && subcity && state){
    query = query
    .eq('location->>area', area)
    .eq('location->>subcity', subcity)
    .eq('location->>state', state);
  }
  if(furnishing){
    query = query.eq('furnishing',furnishing)
  }
  if (minPrice) {
    query = query.gte('price', minPrice)
  }
  if (maxPrice) {
    query = query.lte('price', maxPrice)
  }
  if (minSqFt) {
    query = query.gte('size', minSqFt)
  }
  if (maxSqFt) {
    query = query.lte('size', maxSqFt)
  }
  if (bedroomCount) {
    query = query.eq('beds', bedroomCount)
  }
  if (bathroomCount) {
    query = query.eq('baths', bathroomCount)
  }
  if (condition) {
    query = query.eq('condition', condition)
  }

  const { data, error } = await query;


  if (error) {
    throw new Error(`Error fetching properties: ${error.message}`)
  }

  return data
}

export const getSavedProperties = async (savedIds:string[]) => {
  console.log(savedIds)
  const {data,error} = await supabase
  .from('properties')
  .select('*')
  .eq('id',savedIds)

  if(error){
    console.log(error)
    return null
  }

  return data
}

export const getLocations = async (limit = 100) => {
  try {
    const { data, error } = await supabase
    .from('locations')
    .select('*')
    .neq('num_property',0)
    .limit(limit)
    .order('num_property',{ascending: false})
    if(error){
     console.log("error while geting location count:",error)
     return null
    }
 
    return data
    
  } catch (error) {
    console.log(error)
    return null
  }
}

export const getPropertyById = async (id: string) => {
  try {
     const { data, error } = await supabase
       .from('properties')
       .select('*')
       .eq('id', id)
       .eq('is_sold',false)
       .single();

     if (error) {
       throw new Error(`Error fetching property by ID: ${error.message}`);
     }

     return data;
  } catch (error) {
    console.error("Error fetching property by ID:", error);
  }
}

export const sendInquiry = async (propertyId: string,agent_id:string, formData: { name: string; email: string; phone: string; message: string }) => {
  try {
    const {  error } = await supabase
      .from('inquiries')
      .insert([{ property_id: propertyId, ...formData,agent_id }]);

    if (error) {
       console.log(`Error sending inquiry: ${error.message}`);
       return {
        message: 'Failed to Send Inquiry!',
        type: 'error'
       }
    }

    return {
      message: 'Inquiry sent successfully!',
      type: 'success'
    };
  } catch (error) {
    console.error("Error sending inquiry:", error);
     return {
        message: 'Failed to Send Inquiry!',
        type: 'error'
      }
  }
}

export const updatePropertyViews = async (propertyId: string) => {
  try {
   const { error } = await supabase.rpc('increment_views', {
  property_id: propertyId
   })

    if (error) {
      throw new Error(`Error updating property views: ${error.message}`);
    }
  } catch (error) {
    console.error("Error updating property views:", error);
    throw new Error("Failed to update property views. Please try again later.");
  }
}

type similarPropertyProps = {
    id: string;
    type: string;
    price: number;
    location : {
      area: string;
      state: string;
    }
}

export const fetchSimilarProperties = async (CurrentProperty:similarPropertyProps) => {
  try {

    const minPrice = CurrentProperty.price * 0.7
    const maxPrice = CurrentProperty.price * 1.3
    
    const { data, error } = await supabase
    .from("properties")
    .select("*")
    .neq('id',CurrentProperty.id)
    .eq('type',CurrentProperty.type)
    .eq('location->>area',CurrentProperty.location.area)
    .eq('location->>state',CurrentProperty.location.state)
    .gte('price',minPrice)
    .eq('is_sold',false)
    .lte('price',maxPrice)
    .limit(6)

    if(error){
      throw new Error("Error While Fetching Similar Properties:", error)
    }

    return data
  } catch (error) {
    console.error("Failed o Fetch similar properies:",error)
    throw new Error("Failed o Fetch similar properies At the Moment. Please try again later.")
  }
}


export const  signInWithEmail = async (email:string,password:string) => {
  try {
      const { data, error } : AuthResponse = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if(error){
      console.error("Supabase sign-in error:", error.message); 

     if (error.message === "Invalid login credentials") {
        return {
          error: 'Invalid email or password.',
          agentID: null,
      };
  }
} 


  if (data && data.user) {
    return {
      error: null,
      agentID: data.user.id
    };
  } else {
    console.error("No user data returned from Supabase sign-in.");
    return {
        error: 'No user Found!',
        agentID: null
      } ;
  }
  } catch (err) {
    console.error("Unexpected error during sign-in:", err);
    return {
      error: 'Unexpected error occurred',
      agentID: null,
    };
  }
}

export const getCurrentSession = async () => {
  const {data: {session},error} = await supabase
  .auth
  .getSession()
 
  if(error){
    console.error(error)
    return null
  }

  if(!session?.user) {
    return null
  }

  return session.user.id
}

export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      return { success: false, error: error.message }
    }
    return { success: true }
  } catch (error) {
    console.error('Error during logout:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}


export const getAgent = async (agentId: string) => {
  const {data,error} = await supabase
  .from('agents')
  .select('*')
  .eq('id',agentId)
  .single()

  if(error) throw error.message

  return data

}


export const fetchPropertiesby_agent = async (agent_id:string) => {
   const { data, error } = await supabase
   .from('properties')
   .select('*')
   .eq('agent_id',agent_id)

   if(error){
    console.error("Failed to fetch properties by agent:",error)
    return []
   }

   return data 
}

export const fetchInquriesby_agent = async (agent_id:string) => {
    const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .eq('agent_id',agent_id)

    if(error){
      console.error("Failed to fetch inquries:",error)
      return []
    }

   return data 
}

export const changePassword = async (email:string,currentPassword:string,newPassword:string) => {
    const {error:signInError} = await supabase
    .auth
    .signInWithPassword({
      email,
      password: currentPassword
    })

    if(signInError){
      return {
        message: 'CurrentPassword Incorrect',
        type: 'error'
      }
    }

    const {error:passwordChangeError} = await supabase
    .auth
    .updateUser({
      password:newPassword
    })

    if(passwordChangeError){
      return {
        message: 'Failed to change password',
        type: 'error'
      }
    }

    return {
      message: 'Successfully Changed Password',
      type: 'success'
    }
}


export const uploadProfileImage = async ( file: File,agent_id:string ) => {
    try {

    const { data: oldAgent, error: fetchError } = await supabase
      .from('agents')
      .select('profilePic_path')
      .eq('id', agent_id)
      .single();

      if(fetchError){
         return {
          data: null,
          message: 'Failed to Upload Pic',
          type: 'error'
        }
      }

      if(oldAgent?.profilePic_path){
         const { error: deleteError } = await supabase.storage
        .from('agent-avater')
        .remove([oldAgent.profilePic_path]);

      if (deleteError) {
        console.log('Error deleting old image:', deleteError);
        return {
          data: null,
          message: 'Failed to Remove Existing pic',
          type: 'error'
        }
      }
      }

      const fileName = `avater_${agent_id}_${Date.now()}`

      const {error} = await supabase
      .storage
      .from('agent-avater')
      .upload(fileName,file,{ upsert: true })

      if(error){
        console.log('Failed to upload pic:',error)
        return {
          data: null,
          message: 'Failed to Upload Pic',
          type: 'error'
        }
      }

        const { error: updateError } = await supabase
         .from('agents')
         .update({ profilePic_path: fileName })
         .eq('id', agent_id)

      if (updateError) {
        console.log(updateError)
        return {
          data: null,
          message: 'Falied to update Propfile pic',
          type: 'error'
        }
      }

      return {
        data: fileName,
        message: 'successfully updated profile pic',
        type: 'success'
      }



    } catch (error) {
      console.log(error)
      return {
        data: null,
        message: 'Failed to Update Image',
        type: 'error'
      }
    }
}

export const updateProfile = async (agent_id: string, profileData: { name?: string; email?: string; phone_no?: number }) => {
  try {
    const { error } = await supabase
      .from('agents')
      .update(profileData)
      .eq('id', agent_id)

      if(profileData.email){
        const {error} = await supabase
        .auth
        .updateUser({
           email: profileData.email
        })

        if(error){
          console.error(error)
           return {
             message: 'Failed to update profile information',
             type: 'error' as const
           }
        }

      }


    if (error) {
      console.error('Failed to update profile:', error)
      return {
        message: 'Failed to update profile information',
        type: 'error' as const
      }
    }

    return {
      message: 'Profile updated successfully',
      type: 'success' as const
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    return {
      message: 'An unexpected error occurred',
      type: 'error' as const
    }
  }
}

export const fetchAgents = async (agent_id:string) => {
    try {


        const {data,error} = await supabase
        .from('agents')
        .select('*')
        .neq('id',agent_id)

       
       if(error){
        console.log(error)
        return null
       }

       return data

    } catch (error) {
      console.log(error)
      return null
    }
}

export const addAgent = async (name:string,email:string,password:string,phone_no:number,isManager: boolean) => {
    try {
       const {data,error} = await supabase
       .auth
       .signUp({
        email,
        password,
       })

       if(error || !data){
        console.log(error)
        return{
          message: 'Failed to create new agent!',
          type: 'error'
        }
       }

       const {error: AddUserInfoError} = await supabase
       .from('agents')
       .insert({
        id: data.user?.id,
        name,
        email,
        isManager,
        profilePic_url: '',
        phone_no
       })

       if(AddUserInfoError){
        console.log(AddUserInfoError)
        return {
          messsage: 'failed to save agent data!',
          type: 'error'
        }
       }

       return {
        message: 'Successfully created new agent!',
        type: 'success'
       }

    } catch (error) {
      console.log(error)
      return {
        message: 'Failed to create user',
        type: 'error'
      }
    }
}

export const makeAgentInviteCode = async (email:string,tempPass:string) => {

  const code = Math.floor(100000 + Math.random() * 900000).toString();
   const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();


   const {data,error: emailVarError} = await supabase
   .from('agents')
   .select('*')
   .eq('email',email)

   if(emailVarError){
    console.error(emailVarError)
     return {
      code: null,
      expires_at: null,
      message: 'failed to create an invite',
      type: 'error'
    } 
   }

   if(data && data.length > 0){
     return {
      code: null,
      expires_at: null,
      message: 'email already exists!',
      type: 'error'
     }
   }

  const {error} = await supabase
  .from('agent_invites')
  .insert({
    email,
    temp_password: tempPass,
    code,
    expires_at: expiresAt
  })

  if(error){
    console.error(error)
    return {
      code: null,
      expires_at: null,
      message: 'failed to create an invite',
      type: 'error'
    }
  }

    return {
      code,
      expires_at: expiresAt,
      message: 'Successfully created an invite',
      type: 'success'
    }
  

}


export const validateInvitedCode = async (email:string,temp_password:string,code:string) => {

    email = String(email || '').trim().toLowerCase().replace(/\s+/g, '');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return {
      authEmail: null,
      authId: null,
      hasSignedUp: false,
      message: 'Invalid email format',
      type: 'error',
    };
  }

   const {data,error}  = await supabase
   .from('agent_invites')
   .select('*')
   .eq('email',email)
   .eq('temp_password',temp_password)
   .eq('code',code)

   if(error){
    console.error(error)
    return {
      authEmail:null,
      authId:null,
      hasSignedUp: false,
      message: 'failed to validate the code!',
      type: 'error'
    }
   }

   if(!data || data.length === 0){
    return {
      authEmail:null,
      authId:null,
      hasSignedUp: false,
      message: 'code not found!',
      type: 'error'
    }
    }
    const {error: authError} = await supabase
    .auth
    .signUp({
      email,
      password: temp_password
    })

    if(authError){
      console.error(authError)
        return {
           authEmail:null,
           authId:null,
           hasSignedUp: false,
           message: 'Failed to sign up agent!',
           type: 'error'
         }
    }

    const {data: authData,error: loginError} = await supabase
    .auth
    .signInWithPassword({
      email,
      password: temp_password
    })

    if(loginError){
         return {
           authEmail:null,
           authId:null,
           hasSignedUp: false,
           message: 'Failed to Login agent! Contact administrator',
           type: 'error'
         }
    }

    const authEmail = authData.user?.email
    const authId = authData?.user.id
     if(!authEmail || !authId){
         return {
             authEmail:null,
             authId:null,
             hasSignedUp: false,
             message: 'Failed to sign up agent!',
             type: 'error'
           }
     }

   return {
    authEmail,
    authId,
    hasSignedUp: true,
    message: 'successfully signed up agent!',
    type: 'success'
   }

   }


export const saveAgentInfo = async (agent_id:string,name:string,email:string,phone_no:number) => {

  

     const {error} = await supabase
     .from('agents')
     .insert({
        id:agent_id,
        name,
        email,
        isManager: false,
        phone_no
     })

     if(error){
      console.error(error)
      return {
        message: 'failed to save user info',
        type: 'error'
      }
     }

     return {
      message: 'successfully created and saved agent!',
      type: 'success'
     }
}  


export const uploadPropertyImages = async (file:File) => {

    const fileName = `property_image_${Date.now()}`

    const {error} = await supabase
    .storage
    .from('property-images')
    .upload(fileName,file,{upsert: true})

    if(error){
      console.log(error.message)
      return {
        filePath: null,
        message: 'Failed to upload images',
        type: 'error'
      }
    }

 return {
  filePath: fileName,
  message: 'successfully uploaded images',
  type: 'success'
 }
}


export const addNewProperties = async ( formData: NewProperty ) => {

 
  const {data,error} = await supabase
  .from('properties')
  .insert({
    title: formData.title.toLowerCase(),
    type: formData.type.toLowerCase(),
    status: formData.status.toLowerCase(),
    condition: formData.condition.toLowerCase(),
    description: formData.description.toLowerCase(),
    price: formData.price,
    price_per: formData.price_per,
    size: formData.size,
    beds: formData.beds,
    baths: formData.baths,
    parking: formData.parking,
    image_paths: formData.image_paths,
    location: formData.location,
    agent_id: formData.agent_id,
    features: formData.features,
    amenities: formData.amenities,
    furnishing: formData.furnishing.toLowerCase(),
    year_built: formData.year_built
  }).select('*')
  .single()
  
  
  if(error){
    console.error("Error while inserting new property:",error.message)
    return {
      newProperty: null,
      message: 'Error while inserting new property',
      type: 'error'
    }
  }
  
    const {data:locationData,error:locationError} = await supabase
    .from('locations')
    .select('*')
    .eq('loc_name',formData.location.area.toLowerCase())
    .eq('loc_subcity',formData.location.subcity.toLowerCase())
    .eq('loc_city',formData.location.state.toLowerCase())
    .single()

    if(locationError){
      console.log("Error while Accessing Error:",locationError)
      return {
        newProperty: data as AgentProperties,
        message:  'something went wrong while accessing locations',
        type: 'error'
      }
    }

    const loaction_pics = [
      "https://images.unsplash.com/photo-1571946080923-a81668948f52?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1624314138470-5a2f24623f10?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWRkaXMlMjBhYmFiYXxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1647316703389-e114712500e5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YWRkaXMlMjBhYmFiYXxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1594663872347-2bea8329cd94?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8YWRkaXMlMjBhYmFiYXxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1642505367898-cab7a3542cb3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGFkZGlzJTIwYWJhYmF8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1565609539422-bed46a9c6088?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGxvY2F0aW9ucyUyMGluJTIwZXRoaW9waWF8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1552666133-d86646236366?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGxvY2F0aW9ucyUyMGluJTIwZXRoaW9waWF8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1653537877663-aaecf68a85f9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGxvY2F0aW9ucyUyMGluJTIwZXRoaW9waWF8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fG5hdHVyZXxlbnwwfHwwfHx8MA%3D%3D"
    ]


    if(!locationData){
      const currentLoc_pic = loaction_pics[Math.floor(Math.random() * 9)]
      const  {error:add_loc_error} = await supabase
      .from('locations')
      .insert({
        loc_name: formData.location.area.toLowerCase(),
        loc_pic: currentLoc_pic,
        loc_city: formData.location.state.toLowerCase(),
        loc_subcity:formData.location.subcity.toLowerCase()
      })

      if(add_loc_error){
        console.log("error while add location",add_loc_error)
         return {
         newProperty: data as AgentProperties,
         message:  'something went wrong while adding locations',
         type: 'error'
       }
      }
    }else{
       const {error:UpdatelocationError} = await supabase
       .from('locations')
       .update({
        num_property: locationData.num_property + 1
       })
       .eq('loc_name',formData.location.area.toLowerCase())
       .eq('loc_subcity',formData.location.subcity.toLowerCase())
       .eq('loc_city',formData.location.state.toLowerCase())
       .single() 

       if(UpdatelocationError){
         console.log("error while add location",UpdatelocationError)
         return {
         newProperty: data as AgentProperties,
         message:  'something went wrong while updating locations',
         type: 'error'
       }
       }
    }

  return {
      newProperty: data as AgentProperties,
      message: 'successfully added new property',
      type: 'success'
  }

}


export const getPosted_by = async (agent_id: string) => {
  
  const {data,error} = await supabase
  .from('agents')
  .select('*')
  .eq('id',agent_id)
  .single()

  if(error){
    console.log(error.message)
    return null
  }

  return data
}

export const deletPropertyImages = async (property_image_path:string) => {
      const {error} = await supabase
      .storage
      .from('property-images')
      .remove([property_image_path])

     
     if(error){
      console.log('failed to delate property images:',error.message)
      return {
        message: 'failed to delete property images',
        type: 'error'
      }
     } 
   return {
    message: 'Success Fully delated Property  Images',
    type: 'success'
   }  
}

export const deleteProperty = async (property_id:string,loc_name:string,loc_subcity:string,loc_city:string) => {
    const {error} = await supabase
    .from('properties')
    .delete()
    .eq('id',property_id)

   


    if(error){
      console.log("Error While Deleting Property")
      return {
        message: 'Failed To Delete Property',
        type: 'error'
      }
    }

     const {data,error:locationError} = await supabase
    .from('locations')
    .select('num_property')
    .eq('loc_name',loc_name.toLowerCase())
    .eq('loc_subcity',loc_subcity.toLowerCase())
    .eq('loc_city',loc_city.toLowerCase())
    .single() 

    if(locationError){
      console.log(locationError)
      return {
        message: 'successfully dleted property, but could not get locations',
        type: 'error'
      }
    }

    const {error: location_updateError} = await supabase
    .from('locations')
    .update({
      num_property: data.num_property - 1
    }).eq('loc_name',loc_name.toLowerCase())
    .eq('loc_subcity',loc_subcity.toLowerCase())
    .eq('loc_city',loc_city.toLowerCase())
    .single() 

    if(location_updateError){
      console.log(location_updateError)
      return {
        message: 'successfully dleted property, but could not update locations',
        type: 'error'
      }
    }

   return {
    message: 'Successfully Deleted Property!',
    type: 'success'
   } 
}

export const removeDeletedImagePath = async (property_id:string,path:string) => {
  const { data: property, error: fetchError } = await supabase
    .from('properties')
    .select('image_paths')
    .eq('id', property_id)
    .single();

  if (fetchError) {
    console.error('Error fetching property:', fetchError.message);
    return {
      message: 'Failed to fetch property data.',
      type: 'error'
    };
  }

  if (!property) {
    return {
      message: 'Property not found.',
      type: 'error'
    };
  }

  const updatedImagePaths = (property.image_paths || []).filter((p: string) => p !== path);

  const { error: updateError } = await supabase
    .from('properties')
    .update({ image_paths: updatedImagePaths })
    .eq('id', property_id);

  if (updateError) {
    console.error('Error removing image path:', updateError.message);
    return {
      message: 'Failed to remove image.',
      type: 'error'
    };
  }

  return {
    message: 'Image removed successfully.',
    type: 'success'
  };
}


export const setSoldProperties = async (property_id:string,agent_id:string) => {

     const {data,error:getCountError} = await supabase
     .from('agents')
     .select('sold_properties')
     .eq('id',agent_id)
     .single()

     if(getCountError){
      console.log(getCountError)
      return{
        message: 'Error While Getting current sold property number',
        type: 'error'
      }
     }


     const new_no_sold_properties = data.sold_properties || 0

     const {error} = await supabase
     .from('properties')
     .update({
      is_sold: true
     }).eq('id',property_id)

     if(error){
      console.log(error)
      return{
        message: 'failed to set property as sold',
        type: 'error'
      }
     }

     const {error:agentUpadteError} = await supabase
     .from('agents')
     .update({
        sold_properties: new_no_sold_properties + 1
     }).eq('id',agent_id)

     if(agentUpadteError){
      console.log("error while upadting user sold property number:",agentUpadteError)
       return{
        message: 'failed to upadate user sold property number',
        type: 'error'
      }
     }
    
    return {
      message: 'successfully set Property as Sold',
      type: 'success'
    } 
}


export const updatePropertyData = async (updatedData: Partial<NewProperty>,property_id:string,newAmenities:any,newImage_paths: string[]) => {

  const {error} = await supabase
  .from('properties')
  .update({
    ...updatedData,
    image_paths: newImage_paths,
    amenities: newAmenities
  })
  .eq('id',property_id)

  if(error){
    console.log("Error while updating property:",error.message)
    return {
      message: 'Error while updating property',
      type:'error'
    }
  }
 
  return {
    message: 'successfully updated property',
    type: 'success'
  }
}

export const deleteInquiry = async (inquiry_id:string)=> {
  const {error} = await supabase
  .from('inquiries')
  .delete()
  .eq('id',inquiry_id)

  if(error){
    console.log(error)
    return {
      message: 'Failed TO delete inquiry',
      type: 'error'
    }
  }

  return {
    message: 'successfully delated inquiry!',
    type: 'success'
  }
}

export const deactivateOrActivateAccount = async (agent_id:string,prevStat: boolean,image_path: string, current_user_id: string) => {
  try {
    // If we're deactivating a manager, check if the current user is older
    if (prevStat) {
      // Get both agents' data to check if they're managers and compare creation dates
      const { data: targetAgent, error: targetError } = await supabase
        .from('agents')
        .select('isManager, created_at')
        .eq('id', agent_id)
        .single()

      const { data: currentAgent, error: currentError } = await supabase
        .from('agents')
        .select('isManager, created_at')
        .eq('id', current_user_id)
        .single()

      if (targetError || currentError) {
        console.log('Error fetching agent data:', targetError || currentError)
        return {
          message: 'Failed to verify agent permissions',
          type: 'error'
        }
      }

      // Check if target agent is a manager and if current user is trying to deactivate an older manager
      if (targetAgent?.isManager && currentAgent?.isManager && targetAgent.created_at && currentAgent.created_at) {
        const targetDate = new Date(targetAgent.created_at)
        const currentDate = new Date(currentAgent.created_at)
        
        if (targetDate < currentDate) {
          return {
            message: 'Cannot deactivate a manager who was created before you',
            type: 'error'
          }
        }
      }
    }

    if(prevStat && image_path){
      const {error:image_delete_error} = await supabase
      .storage
      .from('agent-avater')
      .remove([image_path])

      const {error:updating_user_error} = await supabase
      .from('agents')
      .update({
        profilePic_path: null
      }).eq('id',agent_id)

      if(image_delete_error || updating_user_error){
       console.log(image_delete_error?.message,updating_user_error?.message)
       return {
         message: 'Failed to Remove Profile Image',
         type: 'error'
       }
      }
      console.log('delei')
    }

    
    const {error} = await supabase
    .from('agents')
    .update({
      is_active: !prevStat,
      deactivated_at: prevStat ? new Date().toISOString()  : null
    }).eq('id',agent_id)

    if(error){
      console.log(error)
      return {
        message: `Failed to ${prevStat ? 'Deactivate' : 'Activate'} account!`,
        type: 'error'
      }
    }

    return {
      message: `successfull ${prevStat ? 'Deactivated' : 'Activated'} account!`,
      type: 'success'
    }
  } catch (error) {
    console.log(error)
    return {
      message: 'An unexpected error occurred',
      type: 'error'
    }
  }
}

export const updateManagerStatus = async (agent_id: string, isManager: boolean, current_user_id: string) => {
  try {
    // If we're removing a manager, check if the current user is older
    if (isManager) {
      // Get both agents' creation dates to compare
      const { data: targetAgent, error: targetError } = await supabase
        .from('agents')
        .select('created_at')
        .eq('id', agent_id)
        .single()

      const { data: currentAgent, error: currentError } = await supabase
        .from('agents')
        .select('created_at')
        .eq('id', current_user_id)
        .single()

      if (targetError || currentError) {
        console.log('Error fetching agent data:', targetError || currentError)
        return {
          message: 'Failed to verify agent permissions',
          type: 'error'
        }
      }

      // Check if target agent is older than current user
      if (targetAgent && currentAgent) {
        const targetDate = new Date(targetAgent.created_at)
        const currentDate = new Date(currentAgent.created_at)
        
        if (targetDate < currentDate) {
          return {
            message: 'Cannot remove a manager who was created before you',
            type: 'error'
          }
        }
      }
    }

    const { error } = await supabase
      .from('agents')
      .update({
        isManager: !isManager
      })
      .eq('id', agent_id)

    if (error) {
      console.log(error)
      return {
        message: `Failed to ${isManager ? 'remove' : 'make'} manager!`,
        type: 'error'
      }
    }

    return {
      message: `Successfully ${isManager ? 'removed' : 'made'} manager!`,
      type: 'success'
    }
  } catch (error) {
    console.log(error)
    return {
      message: 'An unexpected error occurred',
      type: 'error'
    }
  }
}


export const resetPassword = async (email:string) => {
  try {
     const {error} = await supabase
     .auth
     .resetPasswordForEmail(email)

     if(error){
      console.log(error)
      return {
      message: 'An unexpected error occurred',
      type: 'error'
    }
     }

    return {
      message: 'Reset link Sent via email',
      type: 'success'
    } 
  } catch (error) {
    console.log(error)
    return {
      message: 'An unexpected error occurred',
      type: 'error'
    }
  }
}


export const setTheNewPassword = async (password:string) => {
  try {
    const { error } = await supabase.auth.updateUser({ password });
    if(error){
      console.log(error)
    return {
      message: 'An unexpected error occurred',
      type: 'error'
    }
    }

    return {
      message: 'Successfully updated user password!',
      type: 'success'
    }
    
  } catch (error) {
    console.log(error)
    return {
      message: 'An unexpected error occurred',
      type: 'error'
    }
  }

}