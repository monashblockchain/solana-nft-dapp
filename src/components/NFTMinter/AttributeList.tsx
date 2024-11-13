import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

interface Attribute {
  trait_type: string;
  value: string;
}

interface AttributeListProps {
  attributes: Attribute[];
  setAttributes: (attributes: Attribute[]) => void;
}

export default function AttributeList({
  attributes,
  setAttributes,
}: AttributeListProps) {
  const handleAttributeChange = (
    index: number,
    key: keyof Attribute,
    value: string
  ) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index][key] = value;
    setAttributes(updatedAttributes);
  };

  const handleAddAttribute = () => {
    setAttributes([...attributes, { trait_type: "", value: "" }]);
  };

  const handleRemoveAttribute = (index: number) => {
    const updatedAttributes = attributes.filter((_, i) => i !== index);
    setAttributes(updatedAttributes);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="attributes">Attributes</Label>
      {attributes.map((attribute, index) => (
        <div key={index} className="flex space-x-2 items-center">
          <Input
            placeholder="Trait Type"
            value={attribute.trait_type}
            onChange={(e) =>
              handleAttributeChange(index, "trait_type", e.target.value)
            }
            required
            className="border-none shadow-md bg-secondary text-secondary-foreground"
          />
          <Input
            placeholder="Value"
            value={attribute.value}
            onChange={(e) =>
              handleAttributeChange(index, "value", e.target.value)
            }
            required
            className="border-none shadow-md bg-secondary text-secondary-foreground"
          />
          <Button
            variant="destructive"
            onClick={() => handleRemoveAttribute(index)}
          >
            <Trash2 />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        onClick={handleAddAttribute}
        className="w-full shadow border-dashed bg-transparent hover:bg-muted/20"
      >
        Add Attribute
      </Button>
    </div>
  );
}
