import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Robot } from '@/types/robot';

interface RobotInfoProps {
  robot: Robot;
}

export function RobotInfo({ robot }: RobotInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{robot.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span>Battery Status</span>
            <span>{robot.battery}%</span>
          </div>
          <Progress value={robot.battery} className="w-full" />
        </div>

        <div>
          <h4 className="font-semibold mb-2">Status</h4>
          <p className="text-sm">{robot.status}</p>
        </div>

        {robot.currentTask && (
          <div>
            <h4 className="font-semibold mb-2">Current Task</h4>
            <div className="text-sm space-y-1">
              <p>Type: {robot.currentTask.type}</p>
              <p>Status: {robot.currentTask.status}</p>
              <div className="flex justify-between">
                <span>Task Load</span>
                <span>{robot.currentTask.taskLoad}%</span>
              </div>
              <Progress value={robot.currentTask.taskLoad} className="w-full" />
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold mb-2">Recent Activity</h4>
          <div className="text-sm space-y-1">
            <p>Total Tasks: {robot.totalTasks}</p>
            <p>Last Maintenance: {new Date(robot.lastMaintenance).toLocaleDateString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
