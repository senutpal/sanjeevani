
import React, { useState } from 'react';
import { InventoryItem, InventoryAction } from '@/lib/types/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MinusCircle, PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { manageInventoryItem } from '@/lib/api/fetchData';
import { toast } from 'sonner';

interface InventoryItemCardProps {
  item: InventoryItem;
  onUpdate: () => void;
}

const InventoryItemCard: React.FC<InventoryItemCardProps> = ({ item, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [quantityToChange, setQuantityToChange] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    item.expiryDate ? new Date(item.expiryDate) : undefined
  );
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [isUseOpen, setIsUseOpen] = useState(false);

  const handleRestock = async () => {
    if (quantityToChange <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    setLoading(true);
    try {
      const action: InventoryAction = {
        type: 'restock',
        quantity: quantityToChange,
        itemId: item.id,
        expiryDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined
      };

      await manageInventoryItem(action);
      toast.success(`Successfully restocked ${quantityToChange} units of ${item.name}`);
      setIsRestockOpen(false);
      onUpdate();
    } catch (error) {
      console.error("Error restocking item:", error);
      toast.error("Failed to restock item");
    } finally {
      setLoading(false);
    }
  };

  const handleUse = async () => {
    if (quantityToChange <= 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    if (quantityToChange > item.quantity) {
      toast.error(`Cannot use more than available quantity (${item.quantity})`);
      return;
    }

    setLoading(true);
    try {
      const action: InventoryAction = {
        type: 'use',
        quantity: quantityToChange,
        itemId: item.id
      };

      await manageInventoryItem(action);
      toast.success(`Successfully used ${quantityToChange} units of ${item.name}`);
      setIsUseOpen(false);
      onUpdate();
    } catch (error) {
      console.error("Error using item:", error);
      toast.error("Failed to update inventory");
    } finally {
      setLoading(false);
    }
  };

  // Determine status color
  const getStatusColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800';
      case 'low':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format the expiry date if available
  const formattedExpiryDate = item.expiryDate
    ? format(new Date(item.expiryDate), 'PPP')
    : 'Not specified';

  // Format the last restocked date if available
  const formattedLastRestocked = item.lastRestocked
    ? format(new Date(item.lastRestocked), 'PPP')
    : 'Not recorded';

  // Determine if the item is expired
  const isExpired = item.expiryDate 
    ? new Date(item.expiryDate) < new Date() 
    : false;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{item.name}</CardTitle>
          <Badge className={getStatusColor(item.status)}>
            {item.status === 'in-stock' ? 'In Stock' : 
             item.status === 'low' ? 'Low Stock' : 
             'Out of Stock'}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {item.category}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="grid gap-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Quantity:</span>
            <span className="font-semibold">{item.quantity}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm font-medium">Last Restocked:</span>
            <span className="text-sm">{formattedLastRestocked}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm font-medium">Expiry Date:</span>
            <span className={cn(
              "text-sm",
              isExpired && "text-red-500 font-medium"
            )}>
              {formattedExpiryDate}
              {isExpired && " (Expired)"}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Dialog open={isRestockOpen} onOpenChange={setIsRestockOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <PlusCircle className="h-4 w-4" />
              Restock
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Restock {item.name}</DialogTitle>
              <DialogDescription>
                Add inventory to the current stock. Set a new expiry date if needed.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity to add</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  value={quantityToChange}
                  onChange={(e) => setQuantityToChange(parseInt(e.target.value) || 0)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleRestock} disabled={loading}>
                {loading ? 'Processing...' : 'Restock Item'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isUseOpen} onOpenChange={setIsUseOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="secondary" 
              size="sm" 
              className="gap-1"
              disabled={item.quantity <= 0}
            >
              <MinusCircle className="h-4 w-4" />
              Use
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Use {item.name}</DialogTitle>
              <DialogDescription>
                Record usage of this item from inventory.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-2">
                <Label htmlFor="use-quantity">Quantity to use</Label>
                <Input
                  id="use-quantity"
                  type="number"
                  min={1}
                  max={item.quantity}
                  value={quantityToChange}
                  onChange={(e) => setQuantityToChange(parseInt(e.target.value) || 0)}
                />
                <p className="text-sm text-muted-foreground">
                  {item.quantity} units available
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleUse} 
                disabled={loading || quantityToChange > item.quantity || quantityToChange <= 0}
                variant="default"
              >
                {loading ? 'Processing...' : 'Confirm Usage'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default InventoryItemCard;
