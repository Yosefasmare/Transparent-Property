interface Property {
        id: string;
        image_paths: string[];
        price: number;
        title: string;
         location: {
            area: string;
            state: string;
            };
        type: string;
        status: string;
        beds: number;
        baths: number;
        size: number;
        created_at?: string;
        views?: number;
}

interface SearchParams {
    status?: string;
    type?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    minSqFt?: number;
    maxSqFt?: number;
    bedroomCount?: number;
    bathroomCount?: number;
    condition?: string;
    area?:string;
    state?:string;
    subcity?:string;
    furnishing?: string
}

type AgentData = {
    id:string
    name:string
    email:string
    phone_no:number
    isManager: boolean
    profilePic_path:string
    sold_properties: number
    is_active: boolean
    created_at: string
}

type Feature = {
  icon: string; 
  name: string;
  available: boolean;
};

interface AgentProperties {
   id: string;
   created_at:string;
   image_paths: string[];
   price: number;
   price_per:string;
   title: string;
    location: {
       area: string;
       state: string;
       subcity:string;
       country:string;
       };
   type: string;
   status: string;
   condition:string;
   description:string;
   features: string[];
   amenities: Amenities
   beds: number;
   baths: number;
   size: number;
   parking: number;
   views:number;
   furnishing:string;
   year_built: number;
   is_sold:boolean;
   agent_id: string;
}

type Inquiries = {
  id:string;
  created_at:string;
  name:string;
  phone:number;
  email?: string;
  message: string;
  property_id: string
}

interface AmenityItem {
  icon: string;
  name: string;
  available: boolean
}

interface Amenities {
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
}


interface NewProperty  {
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
  location: {
    area: string
    state: string;
    country: string;
    subcity: string;
  };
  agent_id: string;
  features: string[]
  amenities: Amenities
  furnishing: string
  year_built:number | null
}

interface location {
  id: string,
  loc_name:string,
  loc_pic:string,
  num_property: number,
  loc_city:string
  loc_subcity:string
}