import React, { useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import MapControls from '../../components/map/MapControls';
import MapArea from '../../components/map/MapArea';
import { UserHeader } from '../../components/UserHeader';
import { authService } from '../../services/authServices';

// Define libraries array outside component to prevent re-renders
const libraries: ("places")[] = ['places'];

const Maps: React.FC = () => {
  const navigate = useNavigate();
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_HERE",
    libraries: libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);
  
  // Get user data for header
  const currentUser = authService.getCurrentUser();
  const username = currentUser?.fullName || currentUser?.name || 'User';

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    authService.logout();
    message.success('Logged out successfully');
    navigate('/user/login');
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gray-100">
        <div className="text-xl font-semibold text-gray-600">Loading Google Maps...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-gray-50">
      {/* Header Component */}
      <UserHeader 
        navigate={handleNavigate}
        handleLogout={handleLogout}
        username={username}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 w-full pt-20 pb-2 px-2 gap-2">
        
        <MapControls 
          onDirectionsCalculated={(result) => setDirectionsResponse(result)}
          onClearRoute={() => setDirectionsResponse(null)}
        />

        <MapArea 
          onLoad={(map) => setMap(map)}
          directionsResponse={directionsResponse}
        />
      </div>
    </div>
  );
};

export default Maps;