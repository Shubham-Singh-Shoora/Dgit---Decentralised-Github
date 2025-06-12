import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GitBranch, Star, Users, ArrowRight, Plus, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const WelcomeBanner = () => {
  return (
    <Card className="card-elevated web3-gradient">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 w-full overflow-hidden">
          {/* Welcome Section */}
          <div className="space-y-4 flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <Avatar className="h-12 w-12">
                <AvatarImage src="" alt="decentralized_dev" />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  DD
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 break-words">
                  Welcome back, <span className="text-primary">@decentralized_dev</span>
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Here's what's happening in your dGit network today.
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <div className="flex items-center gap-2 card-elevated px-3 py-2 min-w-0">
                <GitBranch className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm text-foreground truncate">12 dRepositories</span>
              </div>
              <div className="flex items-center gap-2 card-elevated px-3 py-2 min-w-0">
                <Star className="h-4 w-4 text-yellow-500 shrink-0" />
                <span className="text-sm text-foreground truncate">891 stars received</span>
              </div>
              <div className="flex items-center gap-2 card-elevated px-3 py-2 min-w-0">
                <Users className="h-4 w-4 text-blue-500 shrink-0" />
                <span className="text-sm text-foreground truncate">45 followers</span>
                <Badge className="ml-1 bg-cta text-cta-foreground shrink-0">+3</Badge>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button className="btn-primary flex items-center gap-2 whitespace-nowrap" asChild>
              <Link to="/create">
                <Plus className="h-4 w-4 shrink-0" />
                <span className="truncate">New dRepository</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
            </Button>
            <Button variant="outline" className="card-elevated flex items-center gap-2 whitespace-nowrap">
              <Compass className="h-4 w-4 shrink-0" />
              <span className="truncate">Explore dGit</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeBanner;