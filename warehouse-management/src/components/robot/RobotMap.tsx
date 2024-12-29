import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Robot } from '@/types/robot';

interface RobotMapProps {
  robots: Robot[];
  warehouseWidth: number;
  warehouseHeight: number;
  onRobotSelect?: (robot: Robot) => void;
}

export function RobotMap({ robots, warehouseWidth, warehouseHeight, onRobotSelect }: RobotMapProps) {
  // Custom icon for robot markers
  const robotIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <div className="h-full min-h-[32rem] w-full rounded-lg overflow-hidden border">
      <MapContainer
        center={[warehouseHeight / 2, warehouseWidth / 2]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {robots.map((robot) => (
          <Marker
            key={robot.id}
            position={[robot.location.y, robot.location.x]}
            icon={robotIcon}
            eventHandlers={{
              click: () => onRobotSelect?.(robot)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold">{robot.name}</h3>
                <p>Status: {robot.status}</p>
                <p>Battery: {robot.battery}%</p>
                {robot.currentTask && (
                  <p>Current Task: {robot.currentTask.type}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
