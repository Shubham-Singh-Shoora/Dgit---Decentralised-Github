import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Star, 
  Clock, 
  Users, 
  TrendingUp, 
  ExternalLink, 
  Plus,
  MoreHorizontal 
} from 'lucide-react';

const PinnedItems = () => {
  const pinnedItems = [
    {
      id: 1,
      type: 'dapp',
      title: 'Uniswap V3',
      description: 'DEX for token swapping',
      icon: '/placeholder.svg',
      stats: {
        label: 'Last interaction',
        value: '2 hours ago'
      },
      metrics: {
        tvl: '$4.2B',
        users: '125K'
      },
      status: 'connected'
    },
    {
      id: 2,
      type: 'token',
      title: 'ETH/USDC',
      description: 'Liquidity pool position',
      icon: '/placeholder.svg',
      stats: {
        label: 'APY',
        value: '12.5%'
      },
      metrics: {
        value: '$1,234',
        change: '+5.2%'
      },
      status: 'earning'
    },
    {
      id: 3,
      type: 'nft',
      title: 'Bored Ape #1234',
      description: 'NFT Collection',
      icon: '/placeholder.svg',
      stats: {
        label: 'Floor price',
        value: '45.2 ETH'
      },
      metrics: {
        collection: 'BAYC',
        rarity: 'Top 5%'
      },
      status: 'owned'
    },
    {
      id: 4,
      type: 'contract',
      title: 'MakerDAO',
      description: 'CDP Management',
      icon: '/placeholder.svg',
      stats: {
        label: 'Collateral ratio',
        value: '185%'
      },
      metrics: {
        borrowed: '5,000 DAI',
        health: 'Safe'
      },
      status: 'active'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500/10 text-green-500';
      case 'earning': return 'bg-blue-500/10 text-blue-500';
      case 'owned': return 'bg-purple-500/10 text-purple-500';
      case 'active': return 'bg-orange-500/10 text-orange-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'dapp': return <Star className="h-4 w-4" />;
      case 'token': return <TrendingUp className="h-4 w-4" />;
      case 'nft': return <Star className="h-4 w-4" />;
      case 'contract': return <Users className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  return (
    <Card className="card-elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-foreground">
            Pinned & Favorites
          </CardTitle>
          <Button variant="outline" size="sm" className="card-elevated">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pinnedItems.map((item) => (
            <div key={item.id} className="card-interactive p-4 group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={item.icon} alt={item.title} />
                    <AvatarFallback className="bg-primary/10">
                      {getTypeIcon(item.type)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-foreground">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.stats.label}:</span>
                  <span className="text-sm font-medium text-foreground">{item.stats.value}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(item.status)} variant="secondary">
                      {item.status}
                    </Badge>
                    <Clock className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 px-2">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                  {Object.entries(item.metrics).map(([key, value]) => (
                    <span key={key}>
                      {key}: <span className="text-foreground">{value}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add more items prompt */}
        <div className="mt-6 p-4 border-2 border-dashed border-border rounded-lg text-center">
          <p className="text-muted-foreground mb-2">Pin your favorite dApps, tokens, and contracts for quick access</p>
          <Button variant="outline" size="sm" className="card-elevated">
            <Plus className="h-4 w-4 mr-2" />
            Browse & Pin Items
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PinnedItems;