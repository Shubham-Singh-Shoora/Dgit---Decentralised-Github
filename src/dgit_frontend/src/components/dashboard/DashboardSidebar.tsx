import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  GitBranch,
  Star,
  File,
  Users,
  Globe,
  Settings,
  ChevronDown,
  ChevronRight,
  Compass,
  User,
  Search,
  Home,
  Clock,
  BookOpen,
  MessageSquare,
  Code2,
  Package
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const DashboardSidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [openSections, setOpenSections] = useState(['repositories']);
  const [currentUser] = useState('decentralized_dev');

  // Quick navigation items (GitHub-inspired)
  const quickNavItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', href: '/dashboard' },
    { id: 'issues', icon: MessageSquare, label: 'Issues', href: '/issues' },
    { id: 'pull-requests', icon: Code2, label: 'Pull requests', href: '/pulls' },
    { id: 'discussions', icon: BookOpen, label: 'Discussions', href: '/discussions' }
  ];

  const menuItems = [
    {
      id: 'repositories',
      title: 'Repositories',
      items: [
        { id: 'my-repos', icon: GitBranch, label: 'Your dRepositories', href: '/repositories' },
        { id: 'starred', icon: Star, label: 'Your stars', href: '/starred' },
        { id: 'organizations', icon: Users, label: 'Your dOrganizations', href: '/organizations' },
        { id: 'projects', icon: Package, label: 'Your dProjects', href: '/projects' }
      ]
    },
    {
      id: 'recent',
      title: 'Recent Activity',
      items: [
        { id: 'recent-repos', icon: Clock, label: 'Recent dRepositories', href: '/recent' },
        { id: 'gists', icon: File, label: 'Your dGists', href: '/gists' }
      ]
    },
    {
      id: 'explore',
      title: 'Explore',
      items: [
        { id: 'explore-repos', icon: Compass, label: 'Explore dRepositories', href: '/explore' },
        { id: 'topics', icon: Search, label: 'Topics', href: '/topics' },
        { id: 'trending', icon: Globe, label: 'Trending', href: '/trending' }
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  return (
    <aside className="h-full bg-card/30 backdrop-blur-md web3-shadow">
        <div className="flex flex-col h-full">
          {/* User Profile Section */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt={currentUser} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {currentUser.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
                 <div className="flex-1 min-w-0">
                   <p className="text-sm font-medium text-foreground truncate">
                     {currentUser}
                   </p>
                   <p className="text-xs text-muted-foreground truncate">
                     @{currentUser}
                   </p>
                 </div>
            </div>
          </div>

          {/* Navigation content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6">
            {/* Quick Navigation */}
            <div className="space-y-1">
              {quickNavItems.map(item => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "secondary" : "ghost"}
                  className={`
                    w-full justify-start p-3 h-auto transition-all duration-200
                    ${activeSection === item.id 
                      ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                      : 'hover:bg-accent/50 text-foreground'
                    }
                  `}
                  onClick={() => setActiveSection(item.id)}
                >
                  <item.icon className="h-4 w-4 mr-3" />
                         <span className="flex-1 text-left truncate">{item.label}</span>
                </Button>
              ))}
            </div>

            <Separator />

            {/* Collapsible Menu Sections */}
            {menuItems.map(section => (
              <div key={section.id}>
                <Collapsible 
                  open={openSections.includes(section.id)}
                  onOpenChange={() => toggleSection(section.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between text-muted-foreground hover:text-foreground p-2"
                    >
                      <span className="font-medium text-sm">{section.title}</span>
                      {openSections.includes(section.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1 mt-2">
                    {section.items.map(item => (
                      <Button
                        key={item.id}
                        variant={activeSection === item.id ? "secondary" : "ghost"}
                        className={`
                          w-full justify-start p-3 h-auto transition-all duration-200
                          ${activeSection === item.id 
                            ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                            : 'hover:bg-accent/50 text-foreground'
                          }
                        `}
                        onClick={() => setActiveSection(item.id)}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        <span className="flex-1 text-left truncate">{item.label}</span>
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}

            <Separator />

            {/* Settings Section */}
            <div className="space-y-1">
              <Button
                variant={activeSection === 'settings' ? "secondary" : "ghost"}
                className={`
                  w-full justify-start p-3 h-auto transition-all duration-200
                  ${activeSection === 'settings' 
                    ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                    : 'hover:bg-accent/50 text-foreground'
                  }
                `}
                onClick={() => setActiveSection('settings')}
              >
                <Settings className="h-4 w-4 mr-3" />
                <span className="flex-1 text-left truncate">Settings</span>
              </Button>
            </div>
          </div>

          {/* Bottom section - User stats */}
          <div className="p-4 border-t border-border">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Your dGit Activity
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 rounded-md bg-card/50 hover:bg-card/70 transition-colors cursor-pointer">
                  <div className="text-lg font-bold text-foreground">12</div>
                  <div className="text-xs text-muted-foreground">dRepos</div>
                </div>
                <div className="text-center p-2 rounded-md bg-card/50 hover:bg-card/70 transition-colors cursor-pointer">
                  <div className="text-lg font-bold text-foreground">34</div>
                  <div className="text-xs text-muted-foreground">Stars</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 rounded-md bg-card/50 hover:bg-card/70 transition-colors cursor-pointer">
                  <div className="text-lg font-bold text-foreground">89</div>
                  <div className="text-xs text-muted-foreground">Following</div>
                </div>
                <div className="text-center p-2 rounded-md bg-card/50 hover:bg-card/70 transition-colors cursor-pointer">
                  <div className="text-lg font-bold text-foreground">156</div>
                  <div className="text-xs text-muted-foreground">Followers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </aside>
  );
};

export default DashboardSidebar;