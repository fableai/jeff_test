import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Warehouse, Route as RouteIcon, UserPlus, Pencil, Trash, Plus, LogOut } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';

interface User {
  id: number;
  name: string;
  role: string;
  department: string;
}

interface StorageLocation {
  id: number;
  zone: string;
  aisle: string;
  shelf: string;
  capacity: number;
  occupied: number;
  status: 'available' | 'full' | 'maintenance';
}

interface RouteData {
  id: number;
  userId: number;
  date: string;
  steps: number;
  distance: number;
  locations: string[];
  timeSpent: number;
}

function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Doe', role: 'Warehouse Manager', department: 'Operations' },
    { id: 2, name: 'Jane Smith', role: 'Picker', department: 'Fulfillment' },
    { id: 3, name: 'Mike Johnson', role: 'Forklift Operator', department: 'Operations' },
  ]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);

  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUser = {
      id: users.length + 1,
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      department: formData.get('department') as string,
    };
    setUsers([...users, newUser]);
    setIsAddingUser(false);
  };

  const handleEditUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;
    const formData = new FormData(e.currentTarget);
    const updatedUser = {
      ...editingUser,
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      department: formData.get('department') as string,
    };
    setUsers(users.map(user => user.id === editingUser.id ? updatedUser : user));
    setEditingUser(null);
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Management</CardTitle>
        <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddUser}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" name="role" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" name="department" required />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Add User</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog open={editingUser?.id === user.id} onOpenChange={(open) => setEditingUser(open ? user : null)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Pencil className="size-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit User</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditUser}>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-name">Name</Label>
                              <Input id="edit-name" name="name" defaultValue={user.name} required />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-role">Role</Label>
                              <Input id="edit-role" name="role" defaultValue={user.role} required />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-department">Department</Label>
                              <Input id="edit-department" name="department" defaultValue={user.department} required />
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save Changes</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash className="size-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete User</DialogTitle>
                        </DialogHeader>
                        <p>Are you sure you want to delete {user.name}?</p>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button variant="destructive" onClick={() => handleDeleteUser(user.id)}>
                              Delete
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function StoragePage() {
  const [storageLocations, setStorageLocations] = useState<StorageLocation[]>([
    { id: 1, zone: 'A', aisle: '01', shelf: '01', capacity: 100, occupied: 75, status: 'available' },
    { id: 2, zone: 'A', aisle: '01', shelf: '02', capacity: 100, occupied: 100, status: 'full' },
    { id: 3, zone: 'B', aisle: '02', shelf: '01', capacity: 150, occupied: 0, status: 'maintenance' },
  ]);
  const [editingLocation, setEditingLocation] = useState<StorageLocation | null>(null);
  const [isAddingLocation, setIsAddingLocation] = useState(false);

  const handleAddLocation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newLocation = {
      id: storageLocations.length + 1,
      zone: formData.get('zone') as string,
      aisle: formData.get('aisle') as string,
      shelf: formData.get('shelf') as string,
      capacity: parseInt(formData.get('capacity') as string),
      occupied: 0,
      status: 'available' as const,
    };
    setStorageLocations([...storageLocations, newLocation]);
    setIsAddingLocation(false);
  };

  const handleEditLocation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingLocation) return;
    const formData = new FormData(e.currentTarget);
    const updatedLocation = {
      ...editingLocation,
      zone: formData.get('zone') as string,
      aisle: formData.get('aisle') as string,
      shelf: formData.get('shelf') as string,
      capacity: parseInt(formData.get('capacity') as string),
      occupied: parseInt(formData.get('occupied') as string),
      status: formData.get('status') as StorageLocation['status'],
    };
    setStorageLocations(locations =>
      locations.map(location =>
        location.id === editingLocation.id ? updatedLocation : location
      )
    );
    setEditingLocation(null);
  };

  const handleDeleteLocation = (id: number) => {
    setStorageLocations(locations => locations.filter(location => location.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Storage Locations</CardTitle>
        <Dialog open={isAddingLocation} onOpenChange={setIsAddingLocation}>
          <DialogTrigger asChild>
            <Button>
              <Plus /> Add Location
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Storage Location</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddLocation}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="zone">Zone</Label>
                  <Input id="zone" name="zone" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="aisle">Aisle</Label>
                  <Input id="aisle" name="aisle" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="shelf">Shelf</Label>
                  <Input id="shelf" name="shelf" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input id="capacity" name="capacity" type="number" min="0" required />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Add Location</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Zone</TableHead>
              <TableHead>Aisle</TableHead>
              <TableHead>Shelf</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Occupied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {storageLocations.map(location => (
              <TableRow key={location.id}>
                <TableCell>{location.zone}</TableCell>
                <TableCell>{location.aisle}</TableCell>
                <TableCell>{location.shelf}</TableCell>
                <TableCell>{location.capacity}</TableCell>
                <TableCell>{location.occupied}</TableCell>
                <TableCell>
                  <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    location.status === 'available' ? 'bg-green-100 text-green-700' :
                    location.status === 'full' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {location.status}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog open={editingLocation?.id === location.id} onOpenChange={(open) => setEditingLocation(open ? location : null)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Pencil className="size-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Storage Location</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleEditLocation}>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="edit-zone">Zone</Label>
                              <Input id="edit-zone" name="zone" defaultValue={location.zone} required />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-aisle">Aisle</Label>
                              <Input id="edit-aisle" name="aisle" defaultValue={location.aisle} required />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-shelf">Shelf</Label>
                              <Input id="edit-shelf" name="shelf" defaultValue={location.shelf} required />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-capacity">Capacity</Label>
                              <Input id="edit-capacity" name="capacity" type="number" min="0" defaultValue={location.capacity} required />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-occupied">Occupied Space</Label>
                              <Input id="edit-occupied" name="occupied" type="number" min="0" defaultValue={location.occupied} required />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="edit-status">Status</Label>
                              <Select name="status" defaultValue={location.status}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="available">Available</SelectItem>
                                  <SelectItem value="full">Full</SelectItem>
                                  <SelectItem value="maintenance">Maintenance</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save Changes</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash className="size-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Storage Location</DialogTitle>
                        </DialogHeader>
                        <p>Are you sure you want to delete this storage location?</p>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button variant="destructive" onClick={() => handleDeleteLocation(location.id)}>
                              Delete
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function RoutesPage() {
  const routes: RouteData[] = [
    { id: 1, userId: 1, date: '2024-01-15', steps: 5420, distance: 4.2, locations: ['A-01-01', 'B-02-01', 'A-01-02'], timeSpent: 185 },
    { id: 2, userId: 2, date: '2024-01-15', steps: 7850, distance: 6.1, locations: ['B-02-01', 'A-01-01'], timeSpent: 245 },
    { id: 3, userId: 1, date: '2024-01-16', steps: 4980, distance: 3.9, locations: ['A-01-02', 'B-02-01'], timeSpent: 165 },
  ];

  const users = [
    { id: 1, name: 'John Doe', role: 'Warehouse Manager', department: 'Operations' },
    { id: 2, name: 'Jane Smith', role: 'Picker', department: 'Fulfillment' },
    { id: 3, name: 'Mike Johnson', role: 'Forklift Operator', department: 'Operations' },
  ];

  const routeAnalytics = users.map(user => ({
    name: user.name,
    averageSteps: Math.round(
      routes
        .filter(route => route.userId === user.id)
        .reduce((acc, route) => acc + route.steps, 0) /
        Math.max(routes.filter(route => route.userId === user.id).length, 1)
    ),
    averageDistance: parseFloat(
      (routes
        .filter(route => route.userId === user.id)
        .reduce((acc, route) => acc + route.distance, 0) /
        Math.max(
          routes.filter(route => route.userId === user.id).length, 1
        )).toFixed(1)
    ),
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personnel Route Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={routeAnalytics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="averageSteps" stroke="#8884d8" name="Avg Steps" />
                <Line yAxisId="right" type="monotone" dataKey="averageDistance" stroke="#82ca9d" name="Avg Distance (km)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily Routes Detail</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Personnel</TableHead>
                <TableHead>Steps</TableHead>
                <TableHead>Distance (km)</TableHead>
                <TableHead>Time Spent (min)</TableHead>
                <TableHead>Visited Locations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map(route => {
                const user = users.find(u => u.id === route.userId);
                return (
                  <TableRow key={route.id}>
                    <TableCell>{route.date}</TableCell>
                    <TableCell>{user?.name}</TableCell>
                    <TableCell>{route.steps.toLocaleString()}</TableCell>
                    <TableCell>{route.distance}</TableCell>
                    <TableCell>{route.timeSpent}</TableCell>
                    <TableCell>{route.locations.join(', ')}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function MainLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-zinc-50 p-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-zinc-900">Warehouse Management System</h1>
          <Button variant="outline" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
        <div className="mt-4 flex gap-4">
          <Button
            variant={location.pathname === '/users' ? 'default' : 'outline'}
            onClick={() => navigate('/users')}
          >
            <Users className="mr-2 h-4 w-4" /> User Management
          </Button>
          <Button
            variant={location.pathname === '/storage' ? 'default' : 'outline'}
            onClick={() => navigate('/storage')}
          >
            <Warehouse className="mr-2 h-4 w-4" /> Storage Locations
          </Button>
          <Button
            variant={location.pathname === '/routes' ? 'default' : 'outline'}
            onClick={() => navigate('/routes')}
          >
            <RouteIcon className="mr-2 h-4 w-4" /> Personnel Routes
          </Button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/users" replace />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="storage" element={<StoragePage />} />
            <Route path="routes" element={<RoutesPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
