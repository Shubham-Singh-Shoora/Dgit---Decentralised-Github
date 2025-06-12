import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Lock, Globe, Check, Info, HelpCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const CreateRepository = () => {
  const [repoName, setRepoName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [isLoading, setIsLoading] = useState(false);
  const [owner, setOwner] = useState('decentralized_dev');
  const [initializeReadme, setInitializeReadme] = useState(true);
  const [addGitignore, setAddGitignore] = useState('none');
  const [addLicense, setAddLicense] = useState('none');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!repoName.trim()) {
      toast({
        title: "Error",
        description: "Repository name is required",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate repository creation
    setTimeout(() => {
      const newRepoId = `repo-${Date.now()}`;
      toast({
        title: "Success",
        description: `Repository "${repoName}" created successfully!`
      });
      navigate(`/repo/${newRepoId}/main`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between max-w-full">
          <div className="flex items-center gap-2 min-w-0">
            <GitBranch className="h-6 w-6 text-primary flex-shrink-0" />
            <Link to="/dashboard" className="text-lg sm:text-xl font-bold text-foreground hover:text-primary truncate">
              dGit
            </Link>
          </div>
          
          <Link to="/dashboard" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground whitespace-nowrap">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 break-words">Create a new dRepository</h1>
            <p className="text-muted-foreground text-sm md:text-base break-words">
              A dRepository contains all project files, including the revision history. Already have a project dRepository elsewhere?{' '}
              <a href="#" className="text-primary hover:underline">Import a dRepository</a>.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 w-full">
            {/* Main Form */}
            <div className="lg:col-span-2 w-full min-w-0">
              <Card className="card-elevated w-full">
                <CardContent className="p-4 sm:p-6">
                  <form onSubmit={handleSubmit} className="space-y-6 w-full">
                    {/* Owner / Repository name */}
                    <div className="space-y-2">
                      <Label>Owner / dRepository name *</Label>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
                        <Select value={owner} onValueChange={setOwner}>
                          <SelectTrigger className="w-full sm:w-48 min-w-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="decentralized_dev">decentralized_dev</SelectItem>
                            <SelectItem value="dao-collective">dao-collective</SelectItem>
                            <SelectItem value="web3-builders">web3-builders</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-muted-foreground text-center sm:text-left">/</span>
                        <Input
                          value={repoName}
                          onChange={(e) => setRepoName(e.target.value)}
                          placeholder="dRepository-name"
                          className="flex-1 min-w-0"
                          required
                        />
                      </div>
                      {repoName && (
                        <div className="flex items-center gap-2 text-sm break-all">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-muted-foreground break-all">
                            {owner}/{repoName} is available
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description (optional)</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="A brief description of your dRepository"
                        rows={3}
                      />
                    </div>

                    <Separator />

                    {/* Visibility */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Label className="text-base font-semibold">Visibility</Label>
                        <Badge variant="secondary" className="text-xs">Choose wisely</Badge>
                      </div>
                      <RadioGroup value={visibility} onValueChange={setVisibility}>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                            <RadioGroupItem value="public" id="public" className="mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Globe className="h-4 w-4" />
                                <Label htmlFor="public" className="font-medium cursor-pointer">
                                  Public
                                </Label>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Anyone on the internet can see this dRepository. You choose who can commit.
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                            <RadioGroupItem value="private" id="private" className="mt-1" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Lock className="h-4 w-4" />
                                <Label htmlFor="private" className="font-medium cursor-pointer">
                                  Private
                                </Label>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                You choose who can see and commit to this dRepository.
                              </p>
                            </div>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <Separator />

                    {/* Initialize Repository */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Label className="text-base font-semibold">Initialize this dRepository with:</Label>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </div>
                      
                      <div className="space-y-3">
                         <div className="flex items-center space-x-2">
                           <Checkbox 
                             id="readme"
                             checked={initializeReadme}
                             onCheckedChange={(checked) => setInitializeReadme(checked === true)}
                           />
                           <Label htmlFor="readme" className="cursor-pointer">
                             Add a README file
                           </Label>
                         </div>
                        <p className="text-sm text-muted-foreground ml-6">
                          This is where you can write a long description for your project.
                        </p>

                        <div className="space-y-2">
                          <Label>Add .gitignore</Label>
                          <Select value={addGitignore} onValueChange={setAddGitignore}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a .gitignore template" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="Node">Node</SelectItem>
                              <SelectItem value="Python">Python</SelectItem>
                              <SelectItem value="Solidity">Solidity</SelectItem>
                              <SelectItem value="React">React</SelectItem>
                              <SelectItem value="Rust">Rust</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Choose a license</Label>
                          <Select value={addLicense} onValueChange={setAddLicense}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a license" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="MIT">MIT License</SelectItem>
                              <SelectItem value="Apache-2.0">Apache License 2.0</SelectItem>
                              <SelectItem value="GPL-3.0">GNU General Public License v3.0</SelectItem>
                              <SelectItem value="BSD-3-Clause">BSD 3-Clause License</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-sm text-muted-foreground">
                            A license tells others what they can and can't do with your code.{' '}
                            <a href="#" className="text-primary hover:underline">Learn more</a>.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-6 w-full">
                      <Button type="submit" disabled={isLoading} className="btn-primary flex-1 sm:flex-none whitespace-nowrap">
                        {isLoading ? 'Creating dRepository...' : 'Create dRepository'}
                      </Button>
                      <Button type="button" variant="outline" asChild className="flex-1 sm:flex-none">
                        <Link to="/dashboard">Cancel</Link>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6 w-full min-w-0">
              <Card className="card-elevated w-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg break-words">Pro tip!</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium break-words">Great dRepository names are short and memorable.</p>
                        <p className="text-muted-foreground mt-1 break-words">
                          Need inspiration? How about <span className="font-mono bg-muted px-1 rounded break-all">
                            {owner.split('_')[0]}-dao-contracts</span>?
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-elevated w-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg break-words">dRepository visibility</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-medium break-words">Public dRepositories</h4>
                      <p className="text-muted-foreground break-words">
                        Accessible to everyone on the internet and indexed by search engines.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium break-words">Private dRepositories</h4>
                      <p className="text-muted-foreground break-words">
                        Only accessible to you and people you share it with.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRepository;