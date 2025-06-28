
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Search, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminUser {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  email?: string;
  full_name?: string;
}

interface UserManagerProps {
  adminRole: string | null;
}

const UserManager: React.FC<UserManagerProps> = ({ adminRole }) => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("moderator");
  const { toast } = useToast();

  const canManageUsers = adminRole === 'super_admin';

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      
      // First get admin users
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (adminError) throw adminError;

      // Then get profile information for each admin user
      const adminUsersWithProfiles = await Promise.all(
        (adminData || []).map(async (adminUser) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', adminUser.user_id)
            .single();

          return {
            ...adminUser,
            email: profile?.email,
            full_name: profile?.full_name
          };
        })
      );

      setAdminUsers(adminUsersWithProfiles);
    } catch (error) {
      console.error('Error fetching admin users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch admin users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addAdminUser = async () => {
    if (!newUserEmail || !canManageUsers) return;

    try {
      // First, find the user by email
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newUserEmail)
        .single();

      if (profileError || !profiles) {
        toast({
          title: "Error",
          description: "User not found. Make sure they have registered first.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('admin_users')
        .insert([{
          user_id: profiles.id,
          role: newUserRole
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin user added successfully",
      });

      setNewUserEmail("");
      setNewUserRole("moderator");
      fetchAdminUsers();
    } catch (error) {
      console.error('Error adding admin user:', error);
      toast({
        title: "Error",
        description: "Failed to add admin user",
        variant: "destructive",
      });
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    if (!canManageUsers) return;

    try {
      const { error } = await supabase
        .from('admin_users')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User role updated successfully",
      });
      fetchAdminUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const removeAdminUser = async (id: string) => {
    if (!canManageUsers || !confirm('Are you sure you want to remove this admin user?')) return;

    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Admin user removed successfully",
      });
      fetchAdminUsers();
    } catch (error) {
      console.error('Error removing admin user:', error);
      toast({
        title: "Error",
        description: "Failed to remove admin user",
        variant: "destructive",
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800';
      case 'content_admin': return 'bg-blue-100 text-blue-800';
      case 'moderator': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = adminUsers.filter(user => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Admin User Management
          </CardTitle>
          <p className="text-sm text-gray-600">
            Manage admin users and their permissions
          </p>
        </CardHeader>
        <CardContent>
          {canManageUsers && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Add New Admin User
              </h3>
              <div className="flex gap-2">
                <Input
                  placeholder="User email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="flex-1"
                />
                <Select value={newUserRole} onValueChange={setNewUserRole}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="content_admin">Content Admin</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addAdminUser}>Add User</Button>
              </div>
            </div>
          )}

          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search admin users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {loading ? (
              <div className="text-center py-8">Loading admin users...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No admin users found</div>
            ) : (
              filteredUsers.map((user) => (
                <Card key={user.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">
                            {user.full_name || 'No name'}
                          </h3>
                          <Badge className={getRoleColor(user.role)}>
                            {user.role.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Added: {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      {canManageUsers && (
                        <div className="flex items-center gap-2">
                          <Select 
                            value={user.role} 
                            onValueChange={(value) => updateUserRole(user.user_id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="moderator">Moderator</SelectItem>
                              <SelectItem value="content_admin">Content Admin</SelectItem>
                              <SelectItem value="super_admin">Super Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeAdminUser(user.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManager;
