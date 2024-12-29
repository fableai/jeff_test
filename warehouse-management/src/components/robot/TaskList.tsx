import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RobotTask } from '@/types/robot';

interface TaskListProps {
  tasks: RobotTask[];
  onConfirmTask: (taskId: number) => void;
  onStartTask: (taskId: number) => void;
  onCancelTask: (taskId: number) => void;
}

export function TaskList({ tasks, onConfirmTask, onStartTask, onCancelTask }: TaskListProps) {
  const getStatusColor = (status: RobotTask['status']) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500';
      case 'In Progress':
        return 'bg-blue-500';
      case 'Completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.id}</TableCell>
              <TableCell>{task.type}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(task.status)}>
                  {task.status}
                </Badge>
              </TableCell>
              <TableCell>Zone {task.location.zone}</TableCell>
              <TableCell className="space-x-2">
                {task.status === 'Pending' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onConfirmTask(task.id)}
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCancelTask(task.id)}
                    >
                      Cancel
                    </Button>
                  </>
                )}
                {task.status === 'Pending' && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => onStartTask(task.id)}
                  >
                    Start
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
