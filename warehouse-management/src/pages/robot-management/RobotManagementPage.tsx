import { useState } from 'react';
import { TaskList } from '@/components/robot/TaskList';
import { RobotMap } from '@/components/robot/RobotMap';
import { RobotInfo } from '@/components/robot/RobotInfo';
import { Robot, RobotTask } from '@/types/robot';

// Mock data for initial development
const mockTasks: RobotTask[] = [
  {
    id: 1,
    robotId: 1,
    status: 'Pending',
    type: 'Inspection',
    location: { x: 10, y: 20, zone: 'A1' },
    startTime: new Date().toISOString(),
    battery: 85,
    taskLoad: 30,
  },
  // Add more mock tasks as needed
];

const mockRobots: Robot[] = [
  {
    id: 1,
    name: 'Robot-01',
    status: 'Active',
    battery: 85,
    location: { x: 10, y: 20, zone: 'A1' },
    lastMaintenance: new Date().toISOString(),
    totalTasks: 150,
  },
  // Add more mock robots as needed
];

export function RobotManagementPage() {
  const [tasks, setTasks] = useState<RobotTask[]>(mockTasks);
  const [selectedRobot, setSelectedRobot] = useState<Robot | null>(mockRobots[0]);

  const handleConfirmTask = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: 'In Progress' as const } : task
    ));
  };

  const handleStartTask = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: 'In Progress' as const } : task
    ));
  };

  const handleCancelTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleRobotSelect = (robot: Robot) => {
    setSelectedRobot(robot);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Robot Task Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Robot Location</h2>
              <RobotMap
                robots={mockRobots}
                warehouseWidth={100}
                warehouseHeight={100}
                onRobotSelect={handleRobotSelect}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Task List</h2>
              <TaskList
                tasks={tasks}
                onConfirmTask={handleConfirmTask}
                onStartTask={handleStartTask}
                onCancelTask={handleCancelTask}
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Robot Information</h2>
          {selectedRobot && <RobotInfo robot={selectedRobot} />}
        </div>
      </div>
    </div>
  );
}
