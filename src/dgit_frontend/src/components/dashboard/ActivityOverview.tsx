import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from 'recharts';

const ActivityOverview = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Mock data for activity chart
  const activityData = [
    { date: 'Jan 1', transactions: 5, gasSpent: 0.12, dapps: 2 },
    { date: 'Jan 2', transactions: 8, gasSpent: 0.18, dapps: 3 },
    { date: 'Jan 3', transactions: 12, gasSpent: 0.25, dapps: 4 },
    { date: 'Jan 4', transactions: 6, gasSpent: 0.15, dapps: 2 },
    { date: 'Jan 5', transactions: 15, gasSpent: 0.32, dapps: 5 },
    { date: 'Jan 6', transactions: 9, gasSpent: 0.21, dapps: 3 },
    { date: 'Jan 7', transactions: 11, gasSpent: 0.28, dapps: 4 }
  ];

  // Mock data for token distribution
  const tokenData = [
    { name: 'ETH', value: 45, color: '#627EEA' },
    { name: 'USDC', value: 25, color: '#2775CA' },
    { name: 'DAI', value: 15, color: '#F5AC37' },
    { name: 'LINK', value: 10, color: '#375BD2' },
    { name: 'Others', value: 5, color: '#8B5CF6' }
  ];

  const periods = [
    { id: '7d', label: '7 days' },
    { id: '30d', label: '30 days' },
    { id: '90d', label: '3 months' },
    { id: '1y', label: '1 year' }
  ];

  return (
    <Card className="card-elevated">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-xl font-bold text-foreground">
            On-chain Activity Overview
          </CardTitle>
          <div className="flex gap-2">
            {periods.map(period => (
              <Button
                key={period.id}
                variant={selectedPeriod === period.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period.id)}
                className={selectedPeriod === period.id ? "bg-primary" : "card-elevated"}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="activity">Transaction Activity</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio Distribution</TabsTrigger>
          </TabsList>
          
          <TabsContent value="activity" className="space-y-6">
            {/* Activity Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card-elevated p-4 text-center">
                <div className="text-2xl font-bold text-primary">142</div>
                <div className="text-sm text-muted-foreground">Total Transactions</div>
                <Badge className="mt-1 bg-green-500/10 text-green-500">+23% vs last month</Badge>
              </div>
              <div className="card-elevated p-4 text-center">
                <div className="text-2xl font-bold text-primary">2.47 ETH</div>
                <div className="text-sm text-muted-foreground">Gas Spent</div>
                <Badge className="mt-1 bg-red-500/10 text-red-500">+12% vs last month</Badge>
              </div>
              <div className="card-elevated p-4 text-center">
                <div className="text-2xl font-bold text-primary">18</div>
                <div className="text-sm text-muted-foreground">dApps Interacted</div>
                <Badge className="mt-1 bg-blue-500/10 text-blue-500">+5 new this month</Badge>
              </div>
            </div>

            {/* Activity Chart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="transactions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Portfolio Pie Chart */}
              <div className="card-elevated p-4">
                <h3 className="font-semibold text-foreground mb-4">Token Distribution</h3>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tokenData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {tokenData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Token List */}
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Portfolio Breakdown</h3>
                {tokenData.map((token, index) => (
                  <div key={index} className="card-elevated p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: token.color }}
                      />
                      <span className="font-medium text-foreground">{token.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">{token.value}%</div>
                      <div className="text-sm text-muted-foreground">
                        ${(1234.56 * token.value / 100).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ActivityOverview;