import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";

function LocationPicker({ onLocationSelect, selectedPosition }) {
  useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect(e.latlng);
      }
    },
  });

  return selectedPosition ? <Marker position={selectedPosition} /> : null;
}

export default function Map({ onLocationSelect, selectedPosition, showCoordinates = true, shops = [], showAllShops = false }) {
  const getMapCenter = () => {
    if (selectedPosition) {
      return [selectedPosition.lat, selectedPosition.lng];
    }
    if (showAllShops && shops.length > 0) {
      const avgLat = shops.reduce((sum, shop) => sum + parseFloat(shop.lat), 0) / shops.length;
      const avgLng = shops.reduce((sum, shop) => sum + parseFloat(shop.lon), 0) / shops.length;
      return [avgLat, avgLng];
    }
    return [20.5937, 78.9629];
  };

  const getMapZoom = () => {
    if (selectedPosition) return 10;
    if (showAllShops && shops.length > 0) return 8;
    return 6;
  };

  return (
    <div>
      <MapContainer
        center={getMapCenter()}
        zoom={getMapZoom()}
        className="h-96 w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {!showAllShops && (
          <LocationPicker onLocationSelect={onLocationSelect} selectedPosition={selectedPosition} />
        )}
        {showAllShops && shops.map((shop, index) => (
          shop.lat && shop.lon && (
            <Marker key={index} position={[parseFloat(shop.lat), parseFloat(shop.lon)]}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg">{shop.name}</h3>
                  <p className="text-gray-600">Category: {shop.category}</p>
                  <p className="text-gray-600">Address: {shop.address}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Lat: {shop.lat}, Lng: {shop.lon}
                  </p>
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
      {showCoordinates && selectedPosition && (
        <div className="mt-2 p-2 bg-gray-100 rounded">
          <p><strong>Latitude:</strong> {selectedPosition.lat}</p>
          <p><strong>Longitude:</strong> {selectedPosition.lng}</p>
        </div>
      )}
    </div>
  );
}
