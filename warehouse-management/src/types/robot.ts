export interface Location {
  x: number;
  y: number;
  zone: string;
}

export interface RobotTask {
  id: number;
  robotId: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  type: string;
  location: Location;
  startTime: string;
  endTime?: string;
  battery: number;
  taskLoad: number;
}

export interface Robot {
  id: number;
  name: string;
  status: 'Active' | 'Charging' | 'Maintenance';
  battery: number;
  currentTask?: RobotTask;
  location: Location;
  lastMaintenance: string;
  totalTasks: number;
}
