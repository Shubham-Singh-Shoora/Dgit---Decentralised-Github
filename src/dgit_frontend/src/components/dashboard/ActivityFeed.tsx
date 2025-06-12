import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  GitBranch, 
  Star, 
  Users, 
  MessageSquare, 
  GitCommit, 
  GitPullRequest,
  Clock,
  Filter
} from 'lucide-react';

const ActivityFeed = () => {
  const activities = [
    {
      id: 1,
      user: 'alice_dev',
      avatar: '/placeholder.svg',
      action: 'pushed 3 commits to',
      target: 'alice_dev/defi-protocol',
      branch: 'main',
      timestamp: '2 hours ago',
      type: 'commit',
      details: 'Added new lending pool functionality'
    },
    {
      id: 2,
      user: 'bob_crypto',
      avatar: '/placeholder.svg',
      action: 'starred',
      target: 'ethereum/solidity',
      timestamp: '4 hours ago',
      type: 'star'
    },
    {
      id: 3,
      user: 'carol_dao',
      avatar: '/placeholder.svg',
      action: 'opened issue #15 in',
      target: 'governance/dao-voting',
      timestamp: '6 hours ago',
      type: 'issue',
      details: 'Proposal validation bug in smart contract'
    },
    {
      id: 4,
      user: 'dave_degen',
      avatar: '/placeholder.svg',
      action: 'created a new dRepository',
      target: 'dave_degen/nft-marketplace',
      timestamp: '8 hours ago',
      type: 'repo'
    },
    {
      id: 5,
      user: 'eve_validator',
      avatar: '/placeholder.svg',
      action: 'commented on pull request #8 in',
      target: 'consensus/pos-client',
      timestamp: '12 hours ago',
      type: 'comment',
      details: 'LGTM! Great improvements to validator efficiency'
    },
    {
      id: 6,
      user: 'frank_defi',
      avatar: '/placeholder.svg',
      action: 'forked',
      target: 'uniswap/v4-core',
      timestamp: '1 day ago',
      type: 'fork'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'commit': return <GitCommit className="h-4 w-4 text-green-500" />;
      case 'star': return <Star className="h-4 w-4 text-yellow-500" />;
      case 'issue': return <MessageSquare className="h-4 w-4 text-red-500" />;
      case 'repo': return <GitBranch className="h-4 w-4 text-blue-500" />;
      case 'comment': return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'fork': return <GitBranch className="h-4 w-4 text-orange-500" />;
      default: return <GitCommit className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'commit': return <Badge variant="secondary" className="bg-green-500/10 text-green-500">Commit</Badge>;
      case 'star': return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500">Star</Badge>;
      case 'issue': return <Badge variant="secondary" className="bg-red-500/10 text-red-500">Issue</Badge>;
      case 'repo': return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">Repository</Badge>;
      case 'comment': return <Badge variant="secondary" className="bg-purple-500/10 text-purple-500">Comment</Badge>;
      case 'fork': return <Badge variant="secondary" className="bg-orange-500/10 text-orange-500">Fork</Badge>;
      default: return <Badge variant="secondary">Activity</Badge>;
    }
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Latest Activity Feed
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="card-elevated">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 w-full overflow-hidden">
          {activities.map((activity) => (
            <div key={activity.id} className="card-interactive p-4 group w-full overflow-hidden">
              <div className="flex items-start gap-3 w-full overflow-hidden">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={activity.avatar} alt={activity.user} />
                  <AvatarFallback className="text-xs bg-primary/10">
                    {activity.user.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-2 min-w-0 overflow-hidden">
                  <div className="flex items-start gap-2 flex-wrap">
                    {getActivityIcon(activity.type)}
                    <span className="text-sm text-foreground min-w-0 break-words">
                      <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                      <span className="font-medium text-primary break-all">{activity.target}</span>
                      {activity.branch && (
                        <span className="text-muted-foreground"> on {activity.branch}</span>
                      )}
                    </span>
                  </div>
                  
                  {activity.details && (
                    <p className="text-sm text-muted-foreground pl-6 break-words">
                      {activity.details}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between pl-6 flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {getActivityBadge(activity.type)}
                      <span className="text-xs text-muted-foreground flex items-center gap-1 whitespace-nowrap">
                        <Clock className="h-3 w-3" />
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        <div className="mt-6 text-center">
          <Button variant="outline" className="card-elevated">
            Load More Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;