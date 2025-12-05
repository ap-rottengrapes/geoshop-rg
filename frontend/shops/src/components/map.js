import { MapContainer, TileLayer, useMapEvents, Marker } from "react-leaflet";

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

export default function Map({ onLocationSelect, selectedPosition, showCoordinates = true }) {
  return (
    <div>
      <MapContainer
        center={selectedPosition ? [selectedPosition.lat, selectedPosition.lng] : [20.5937, 78.9629]}
        zoom={selectedPosition ? 10 : 6}
        className="h-96 w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LocationPicker onLocationSelect={onLocationSelect} selectedPosition={selectedPosition} />
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
