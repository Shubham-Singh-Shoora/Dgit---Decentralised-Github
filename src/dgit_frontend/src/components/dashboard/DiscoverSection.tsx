import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  TrendingUp, 
  Users, 
  Star, 
  ExternalLink,
  Flame,
  Sparkles,
  Globe,
  Vote
} from 'lucide-react';

const DiscoverSection = () => {
  const trendingDapps = [
    {
      id: 1,
      name: 'Lido Finance',
      description: 'Liquid staking for Ethereum 2.0',
      category: 'DeFi',
      logo: '/placeholder.svg',
      metrics: {
        tvl: '$8.2B',
        users: '245K',
        apy: '4.2%'
      },
      tags: ['Staking', 'ETH2'],
      trending: true,
      new: false
    },
    {
      id: 2,
      name: 'Arbitrum One',
      description: 'Layer 2 scaling solution',
      category: 'Infrastructure',
      logo: '/placeholder.svg',
      metrics: {
        tvl: '$2.1B',
        users: '890K',
        tps: '4,000'
      },
      tags: ['Layer 2', 'Scaling'],
      trending: true,
      new: false
    },
    {
      id: 3,
      name: 'Friend.tech',
      description: 'Social trading platform',
      category: 'Social',
      logo: '/placeholder.svg',
      metrics: {
        volume: '$12.5M',
        users: '156K',
        growth: '+234%'
      },
      tags: ['Social', 'Trading'],
      trending: true,
      new: true
    }
  ];

  const daoProposals = [
    {
      id: 1,
      dao: 'Uniswap DAO',
      title: 'Proposal to increase fee tier options',
      description: 'Add new 0.01% fee tier for stablecoin pairs',
      votingEnds: '2 days',
      forVotes: '12.5M UNI',
      againstVotes: '2.1M UNI',
      status: 'active',
      logo: '/placeholder.svg'
    },
    {
      id: 2,
      dao: 'Compound DAO',
      title: 'Add support for new collateral',
      description: 'Enable MATIC as collateral asset',
      votingEnds: '5 days',
      forVotes: '890K COMP',
      againstVotes: '124K COMP',
      status: 'active',
      logo: '/placeholder.svg'
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'DeFi': return <TrendingUp className="h-4 w-4" />;
      case 'Infrastructure': return <Globe className="h-4 w-4" />;
      case 'Social': return <Users className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Trending dApps */}
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Trending dApps
            </CardTitle>
            <Button variant="outline" size="sm" className="card-elevated">
              Explore All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {trendingDapps.map((dapp) => (
              <div key={dapp.id} className="card-interactive p-4 group">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={dapp.logo} alt={dapp.name} />
                      <AvatarFallback className="bg-primary/10">
                        {getCategoryIcon(dapp.category)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-foreground">{dapp.name}</h4>
                        {dapp.new && (
                          <Badge className="bg-green-500/10 text-green-500">
                            <Sparkles className="h-3 w-3 mr-1" />
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{dapp.description}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Badge variant="secondary" className="mb-2">
                    {dapp.category}
                  </Badge>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(dapp.metrics).map(([key, value]) => (
                      <div key={key} className="text-center p-2 card-elevated">
                        <div className="font-semibold text-foreground">{value}</div>
                        <div className="text-muted-foreground uppercase">{key}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {dapp.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full mt-3 btn-primary">
                  Connect & Explore
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* DAO Governance */}
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <Vote className="h-5 w-5 text-blue-500" />
              Active DAO Proposals
            </CardTitle>
            <Button variant="outline" size="sm" className="card-elevated">
              View All DAOs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {daoProposals.map((proposal) => (
              <div key={proposal.id} className="card-interactive p-4 group">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={proposal.logo} alt={proposal.dao} />
                    <AvatarFallback className="bg-primary/10">
                      <Vote className="h-5 w-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-foreground">{proposal.title}</h4>
                        <p className="text-sm text-muted-foreground">{proposal.dao}</p>
                      </div>
                      <Badge className="bg-blue-500/10 text-blue-500">
                        {proposal.votingEnds} left
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {proposal.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="text-center p-2 card-elevated">
                        <div className="text-green-500 font-semibold">{proposal.forVotes}</div>
                        <div className="text-xs text-muted-foreground">For</div>
                      </div>
                      <div className="text-center p-2 card-elevated">
                        <div className="text-red-500 font-semibold">{proposal.againstVotes}</div>
                        <div className="text-xs text-muted-foreground">Against</div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="btn-primary flex-1">
                        Vote For
                      </Button>
                      <Button size="sm" variant="outline" className="card-elevated flex-1">
                        Vote Against
                      </Button>
                      <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiscoverSection;