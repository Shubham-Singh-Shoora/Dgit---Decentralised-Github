import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Coins, 
  Vote, 
  Star,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'transfer',
      action: 'Sent',
      amount: '0.5 ETH',
      to: '0x123...456',
      timestamp: '2 hours ago',
      status: 'confirmed',
      hash: '0xabc...def',
      icon: ArrowUpRight,
      dapp: null
    },
    {
      id: 2,
      type: 'approve',
      action: 'Approved',
      amount: 'USDC spending',
      to: 'Uniswap V3',
      timestamp: '4 hours ago',
      status: 'confirmed',
      hash: '0xdef...ghi',
      icon: CheckCircle,
      dapp: {
        name: 'Uniswap',
        logo: '/placeholder.svg'
      }
    },
    {
      id: 3,
      type: 'swap',
      action: 'Swapped',
      amount: '100 USDC → 0.032 ETH',
      to: 'Uniswap V3',
      timestamp: '6 hours ago',
      status: 'confirmed',
      hash: '0xghi...jkl',
      icon: Coins,
      dapp: {
        name: 'Uniswap',
        logo: '/placeholder.svg'
      }
    },
    {
      id: 4,
      type: 'governance',
      action: 'Voted',
      amount: 'Proposal #42',
      to: 'Compound DAO',
      timestamp: '1 day ago',
      status: 'confirmed',
      hash: '0xjkl...mno',
      icon: Vote,
      dapp: {
        name: 'Compound',
        logo: '/placeholder.svg'
      }
    },
    {
      id: 5,
      type: 'mint',
      action: 'Minted',
      amount: 'NFT #1234',
      to: 'OpenSea',
      timestamp: '2 days ago',
      status: 'pending',
      hash: '0xmno...pqr',
      icon: Star,
      dapp: {
        name: 'OpenSea',
        logo: '/placeholder.svg'
      }
    },
    {
      id: 6,
      type: 'receive',
      action: 'Received',
      amount: '1,000 USDC',
      to: '0x789...abc',
      timestamp: '3 days ago',
      status: 'confirmed',
      hash: '0xpqr...stu',
      icon: ArrowDownLeft,
      dapp: null
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Loader2 className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500/10 text-green-500">Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/10 text-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/10 text-red-500">Failed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const openInExplorer = (hash: string) => {
    window.open(`https://etherscan.io/tx/${hash}`, '_blank');
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-foreground">
            Recent On-chain Activity
          </CardTitle>
          <Button variant="outline" size="sm" className="card-elevated">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="card-interactive p-4 group hover:border-primary/30"
            >
              <div className="flex items-center gap-4">
                {/* Activity Icon */}
                <div className="flex-shrink-0">
                  {activity.dapp ? (
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={activity.dapp.logo} alt={activity.dapp.name} />
                      <AvatarFallback className="bg-primary/10">
                        <activity.icon className="h-5 w-5 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <activity.icon className="h-5 w-5 text-primary" />
                    </div>
                  )}
                </div>

                {/* Activity Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">
                      {activity.action}
                    </span>
                    <span className="font-semibold text-primary">
                      {activity.amount}
                    </span>
                    {activity.to && (
                      <>
                        <span className="text-muted-foreground">to</span>
                        <span className="text-foreground font-medium">
                          {activity.to}
                        </span>
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">{activity.timestamp}</span>
                    {getStatusIcon(activity.status)}
                    {getStatusBadge(activity.status)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => openInExplorer(activity.hash)}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Transaction Hash */}
              <div className="mt-2 ml-14">
                <button
                  onClick={() => openInExplorer(activity.hash)}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors font-mono"
                >
                  {activity.hash}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-6 text-center">
          <Button variant="outline" className="card-elevated">
            Load More Activity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;