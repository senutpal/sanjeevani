
import React, { useState } from 'react';
import { useInventory } from '@/hooks/useInventory';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SearchIcon, PlusCircle, RefreshCw } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import InventoryItemCard from '@/components/InventoryItemCard';

const InventoryPage: React.FC = () => {
  const { inventoryItems, isLoading, error, refetchInventory } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Extract unique categories from inventory items
  const categories = ['all', ...new Set(inventoryItems.map(item => item.category))];
  
  // Apply filters
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  // Group items by category
  const itemsByCategory = filteredItems.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof inventoryItems>);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Manage hospital supplies and medications</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => refetchInventory()} 
            disabled={isLoading} 
            variant="outline" 
            size="sm"
            className="gap-2"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh
          </Button>
          <Button size="sm" className="gap-2">
            <PlusCircle size={16} />
            Add Item
          </Button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or category..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Display inventory */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="rounded-lg border p-4 space-y-4">
                <div className="h-5 bg-muted rounded w-2/3"></div>
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded"></div>
                </div>
                <div className="pt-2 flex justify-between">
                  <div className="h-8 bg-muted rounded w-20"></div>
                  <div className="h-8 bg-muted rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <EmptyState
          title="Error loading inventory"
          description={error.message}
          action={
            <Button onClick={() => refetchInventory()} variant="outline">
              Try Again
            </Button>
          }
        />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="No items found"
          description={
            searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
              ? "Try adjusting your search or filters"
              : "Your inventory is empty"
          }
          action={
            (searchTerm || categoryFilter !== 'all' || statusFilter !== 'all') ? (
              <Button onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setStatusFilter('all');
              }} variant="outline">
                Clear Filters
              </Button>
            ) : (
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add First Item
              </Button>
            )
          }
        />
      ) : (
        <Tabs defaultValue="grid" className="w-full">
          <div className="flex justify-end mb-4">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="category">Category View</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="grid" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredItems.map(item => (
                <InventoryItemCard 
                  key={item.id} 
                  item={item} 
                  onUpdate={refetchInventory}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="category" className="mt-0 space-y-8">
            {Object.entries(itemsByCategory).map(([category, items]) => (
              <div key={category}>
                <h2 className="text-xl font-medium mb-4">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map(item => (
                    <InventoryItemCard 
                      key={item.id} 
                      item={item} 
                      onUpdate={refetchInventory}
                    />
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default InventoryPage;
