
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
  colorClass?: string;
  className?: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  colorClass, 
  className,
  variant = "default" 
}) => {
  return (
    <Badge 
      variant={variant} 
      className={cn(colorClass, className)}
    >
      {status}
    </Badge>
  );
};

export default StatusBadge;
