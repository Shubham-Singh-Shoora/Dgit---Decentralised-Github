import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for repositories
const userRepositories = [
  {
    id: 'repo-1',
    name: 'my-awesome-project',
    description: 'A revolutionary decentralized application',
    visibility: 'Public'
  },
  {
    id: 'repo-2',
    name: 'private-research',
    description: 'Confidential research project',
    visibility: 'Private'
  },
  {
    id: 'repo-3',
    name: 'web3-tools',
    description: 'Collection of useful Web3 utilities',
    visibility: 'Public'
  }
];

const sharedRepositories = [
  {
    id: 'shared-1',
    name: 'team-collaboration',
    description: 'Shared team project for internal tools',
    visibility: 'Private',
    owner: 'alice'
  },
  {
    id: 'shared-2',
    name: 'open-source-lib',
    description: 'Community-driven open source library',
    visibility: 'Public',
    owner: 'bob'
  }
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">dGit</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <Link to="/profile" className="text-sm text-foreground hover:text-primary">
              @username
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Your Repositories Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Your Repositories</h2>
            <Button asChild>
              <Link to="/create">
                <Plus className="h-4 w-4 mr-2" />
                New Repository
              </Link>
            </Button>
          </div>
          
          <div className="grid gap-4">
            {userRepositories.map((repo) => (
              <Card key={repo.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Link 
                          to={`/repo/${repo.id}/main`}
                          className="text-lg font-semibold text-primary hover:underline"
                        >
                          {repo.name}
                        </Link>
                        <Badge variant={repo.visibility === 'Public' ? 'default' : 'secondary'}>
                          {repo.visibility}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{repo.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Shared With You Section */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">Shared With You</h2>
          
          <div className="grid gap-4">
            {sharedRepositories.map((repo) => (
              <Card key={repo.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Link 
                          to={`/repo/${repo.id}/main`}
                          className="text-lg font-semibold text-primary hover:underline"
                        >
                          {repo.owner}/{repo.name}
                        </Link>
                        <Badge variant={repo.visibility === 'Public' ? 'default' : 'secondary'}>
                          {repo.visibility}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{repo.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;