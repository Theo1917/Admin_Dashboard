import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Archive, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface BlogStatusManagerProps {
  blogId: string;
  currentStatus: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
  scheduledPublishAt?: string;
  onStatusChange: (newStatus: string) => void;
}

const BlogStatusManager: React.FC<BlogStatusManagerProps> = ({
  blogId,
  currentStatus,
  scheduledPublishAt,
  onStatusChange
}) => {
  const handlePublish = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/blogs/${blogId}/publish`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (response.ok) {
        onStatusChange('PUBLISHED');
        toast.success('Blog published successfully!');
      } else {
        throw new Error('Failed to publish blog');
      }
    } catch (error) {
      console.error('Publish error:', error);
      toast.error('Failed to publish blog. Please try again.');
    }
  };

  const handleSaveAsDraft = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/blogs/${blogId}/draft`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (response.ok) {
        onStatusChange('DRAFT');
        toast.success('Blog saved as draft!');
      } else {
        throw new Error('Failed to save as draft');
      }
    } catch (error) {
      console.error('Save as draft error:', error);
      toast.error('Failed to save as draft. Please try again.');
    }
  };

  const handleArchive = async () => {
    try {
      // For now, we'll just update the status locally
      // You can add an archive endpoint if needed
      onStatusChange('ARCHIVED');
      toast.success('Blog archived!');
    } catch (error) {
      console.error('Archive error:', error);
      toast.error('Failed to archive blog. Please try again.');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; icon: React.ReactNode }> = {
      DRAFT: {
        className: 'bg-yellow-100 text-yellow-800',
        icon: <Pause className="h-3 w-3" />
      },
      PUBLISHED: {
        className: 'bg-green-100 text-green-800',
        icon: <CheckCircle className="h-3 w-3" />
      },
      SCHEDULED: {
        className: 'bg-blue-100 text-blue-800',
        icon: <Clock className="h-3 w-3" />
      },
      ARCHIVED: {
        className: 'bg-slate-100 text-slate-800',
        icon: <Archive className="h-3 w-3" />
      }
    };

    const variant = variants[status] || variants.DRAFT;

    return (
      <Badge className={`flex items-center space-x-1 ${variant.className}`}>
        {variant.icon}
        <span>{status}</span>
      </Badge>
    );
  };

  const renderActionButtons = () => {
    switch (currentStatus) {
      case 'DRAFT':
        return (
          <div className="flex space-x-2">
            <Button
              onClick={handlePublish}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="h-3 w-3 mr-1" />
              Publish
            </Button>
            <Button
              onClick={handleArchive}
              variant="outline"
              size="sm"
              className="text-slate-600"
            >
              <Archive className="h-3 w-3 mr-1" />
              Archive
            </Button>
          </div>
        );

      case 'PUBLISHED':
        return (
          <div className="flex space-x-2">
            <Button
              onClick={handleSaveAsDraft}
              variant="outline"
              size="sm"
              className="text-yellow-600"
            >
              <Pause className="h-3 w-3 mr-1" />
              Save as Draft
            </Button>
            <Button
              onClick={handleArchive}
              variant="outline"
              size="sm"
              className="text-slate-600"
            >
              <Archive className="h-3 w-3 mr-1" />
              Archive
            </Button>
          </div>
        );

      case 'SCHEDULED':
        return (
          <div className="flex space-x-2">
            <Button
              onClick={handleSaveAsDraft}
              variant="outline"
              size="sm"
              className="text-yellow-600"
            >
              <Pause className="h-3 w-3 mr-1" />
              Save as Draft
            </Button>
            <Button
              onClick={handleArchive}
              variant="outline"
              size="sm"
              className="text-slate-600"
            >
              <Archive className="h-3 w-3 mr-1" />
              Archive
            </Button>
          </div>
        );

      case 'ARCHIVED':
        return (
          <div className="flex space-x-2">
            <Button
              onClick={handleSaveAsDraft}
              variant="outline"
              size="sm"
              className="text-yellow-600"
            >
              <Pause className="h-3 w-3 mr-1" />
              Restore as Draft
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getStatusBadge(currentStatus)}
          {scheduledPublishAt && currentStatus === 'SCHEDULED' && (
            <div className="flex items-center space-x-1 text-xs text-blue-600">
              <Calendar className="h-3 w-3" />
              <span>
                {new Date(scheduledPublishAt).toLocaleDateString()} at{' '}
                {new Date(scheduledPublishAt).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
        {renderActionButtons()}
      </div>

      {currentStatus === 'DRAFT' && (
        <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
          <AlertCircle className="h-3 w-3 inline mr-1" />
          This blog is in draft mode and not visible to the public.
        </div>
      )}

      {currentStatus === 'SCHEDULED' && scheduledPublishAt && (
        <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
          <Clock className="h-3 w-3 inline mr-1" />
          This blog will be automatically published at the scheduled time.
        </div>
      )}
    </div>
  );
};

export default BlogStatusManager;
