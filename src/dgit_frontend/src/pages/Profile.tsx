import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GitBranch } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [handle, setHandle] = useState('username');
  const [bio, setBio] = useState('Passionate developer working on decentralized technologies and building the future of code collaboration.');
  const [tempHandle, setTempHandle] = useState(handle);
  const [tempBio, setTempBio] = useState(bio);
  const { toast } = useToast();

  // Mock principal ID
  const principalId = 'rdmx6-jaaaa-aaaah-qcaaw-cai-example-principal-id';

  const handleSave = () => {
    setHandle(tempHandle);
    setBio(tempBio);
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Profile updated successfully!"
    });
  };

  const handleCancel = () => {
    setTempHandle(handle);
    setTempBio(bio);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="h-6 w-6 text-primary" />
            <Link to="/dashboard" className="text-xl font-bold text-foreground hover:text-primary">
              dGit
            </Link>
          </div>
          
          <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">User Profile</h1>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Profile Information
                {!isEditing && (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar and Handle */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback className="text-lg">{handle.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label htmlFor="handle">Handle</Label>
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-1">@</span>
                        <Input
                          id="handle"
                          value={tempHandle}
                          onChange={(e) => setTempHandle(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">@{handle}</h2>
                      <p className="text-sm text-muted-foreground">User Handle</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Principal ID */}
              <div className="space-y-2">
                <Label>Principal ID</Label>
                <div className="p-3 bg-muted rounded-md">
                  <code className="text-sm font-mono break-all">{principalId}</code>
                </div>
                <p className="text-xs text-muted-foreground">
                  This is your unique identifier on the Internet Computer network
                </p>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <div className="p-3 bg-muted rounded-md min-h-[100px]">
                    <p className="text-sm">{bio || 'No bio provided'}</p>
                  </div>
                )}
              </div>

              {/* Edit Actions */}
              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave} className="flex-1">
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;