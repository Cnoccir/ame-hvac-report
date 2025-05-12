import dynamic from 'next/dynamic';

// Dynamically import EnhancedMapView with no SSR
const EnhancedMapView = dynamic(
  () => import('./EnhancedMapView'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-64 md:h-96 lg:h-[500px] flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red mb-2 mx-auto"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    ) 
  }
);

export default EnhancedMapView;
