import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

export interface DescriptionBlock {
  title: string;
  description?: string;
  items?: string[];
}

interface Props {
  value: DescriptionBlock[];
  onChange: (next: DescriptionBlock[]) => void;
}

const DescriptionBlocksEditor: React.FC<Props> = ({ value, onChange }) => {
  const updateBlock = (idx: number, patch: Partial<DescriptionBlock>) => {
    const next = value.slice();
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  };

  const removeBlock = (idx: number) => {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
  };

  const addBlock = () => {
    onChange([...value, { title: '', description: '', items: [] }]);
  };

  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= value.length) return;
    const next = value.slice();
    const [b] = next.splice(idx, 1);
    next.splice(j, 0, b);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {value.map((block, idx) => (
        <Card key={idx}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Block {idx + 1}</Label>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="icon" onClick={() => move(idx, -1)} aria-label="Move up">
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" size="icon" onClick={() => move(idx, 1)} aria-label="Move down">
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" size="icon" onClick={() => removeBlock(idx)} aria-label="Remove">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Title</Label>
              <Input
                value={block.title}
                onChange={(e) => updateBlock(idx, { title: e.target.value })}
                placeholder="e.g. What's Included"
              />
            </div>

            <div>
              <Label>Items (one per line)</Label>
              <Textarea
                value={(block.items || []).join('\n')}
                onChange={(e) => updateBlock(idx, { items: e.target.value.split('\n').map((s) => s).filter((s) => s.trim().length > 0) })}
                rows={4}
                placeholder={"Example:\nFree event t-shirt\nRefreshments & snacks\nParticipation certificate"}
              />
              <p className="text-xs text-gray-500 mt-1">If you provide items, they will render as bullet points. Leave empty to use the description field.</p>
            </div>

            <div>
              <Label>Description (optional)</Label>
              <Textarea
                value={block.description || ''}
                onChange={(e) => updateBlock(idx, { description: e.target.value })}
                rows={3}
                placeholder="Fallback paragraph if no items are provided."
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <Button type="button" variant="outline" onClick={addBlock} className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Add Block
      </Button>
    </div>
  );
};

export default DescriptionBlocksEditor;
