"use client";

import {
  useEditor,
  EditorContent,
  BubbleMenu,
  Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { useState, useEffect, useRef } from "react";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Underline as UnderlineIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  Check,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  readOnly,
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [isAddingImage, setIsAddingImage] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [isPickingColor, setIsPickingColor] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-md max-w-full",
        },
      }),
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: placeholder || "Write content here...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      if (!readOnly) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[200px] p-4",
      },
    },
    editable: !readOnly,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  useEffect(() => {
    if (isEditingLink && linkInputRef.current) {
      linkInputRef.current.focus();
    }
    if (isAddingImage && imageInputRef.current) {
      imageInputRef.current.focus();
    }
  }, [isEditingLink, isAddingImage]);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  const addImage = () => {
    if (imageUrl && !readOnly) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setIsAddingImage(false);
    }
  };

  const setLink = () => {
    if (linkUrl && !readOnly) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
      setLinkUrl("");
      setIsEditingLink(false);
    } else if (editor.isActive("link") && !readOnly) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setIsEditingLink(false);
    }
  };

  const setColor = (color: string) => {
    if (!readOnly) {
      editor.chain().focus().setColor(color).run();
      setSelectedColor(color);
      setIsPickingColor(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;

    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        editor.chain().focus().setImage({ src: result }).run();
        setIsAddingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const colorPresets = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
    "#800080",
    "#008000",
  ];

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-muted p-2 flex flex-wrap items-center gap-1 border-b">
        <TooltipProvider>
          {/* Text Formatting */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`p-2 rounded ${
                  editor.isActive("bold") ? "bg-muted-foreground/20" : "hover:bg-muted-foreground/10"
                }`}
                disabled={readOnly}
              >
                <Bold className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`p-2 rounded ${
                  editor.isActive("italic") ? "bg-muted-foreground/20" : "hover:bg-muted-foreground/10"
                }`}
                disabled={readOnly}
              >
                <Italic className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded ${
                  editor.isActive("underline") ? "bg-muted-foreground/20" : "hover:bg-muted-foreground/10"
                }`}
                disabled={readOnly}
              >
                <UnderlineIcon className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Underline</TooltipContent>
          </Tooltip>

          {/* Color Picker */}
          <Dialog open={isPickingColor} onOpenChange={setIsPickingColor}>
            <DialogTrigger asChild>
              <button
                type="button"
                onClick={() => setIsPickingColor(true)}
                className="p-2 rounded hover:bg-muted-foreground/10 relative"
                disabled={readOnly}
              >
                <Palette className="h-4 w-4" />
                <div
                  className="absolute bottom-0 right-0 w-2 h-2 rounded-full"
                  style={{ backgroundColor: selectedColor }}
                />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Pick a color</DialogTitle>
                <DialogDescription>
                  Choose a color for the text.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <div className="font-medium">Text Color</div>
                <div className="grid grid-cols-5 gap-2">
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="w-full h-8 rounded-md border border-input cursor-pointer"
                      style={{ backgroundColor: color }}
                      onClick={() => setColor(color)}
                      disabled={readOnly}
                    />
                  ))}
                </div>
                <div className="pt-2 space-y-1">
                  <Label htmlFor="custom-color">Custom Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="custom-color"
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="h-8 w-12 p-1"
                      disabled={readOnly}
                    />
                    <Button
                      onClick={() => setColor(selectedColor)}
                      size="sm"
                      className="flex-grow"
                      disabled={readOnly}
                    >
                      Apply Color
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <span className="w-px h-6 bg-border mx-1"></span>

          {/* Headings */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded ${
                  editor.isActive("heading", { level: 1 })
                    ? "bg-muted-foreground/20"
                    : "hover:bg-muted-foreground/10"
                }`}
                disabled={readOnly}
              >
                <Heading1 className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Heading 1</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded ${
                  editor.isActive("heading", { level: 2 })
                    ? "bg-muted-foreground/20"
                    : "hover:bg-muted-foreground/10"
                }`}
                disabled={readOnly}
              >
                <Heading2 className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Heading 2</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded ${
                  editor.isActive("heading", { level: 3 })
                    ? "bg-muted-foreground/20"
                    : "hover:bg-muted-foreground/10"
                }`}
                disabled={readOnly}
              >
                <Heading3 className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Heading 3</TooltipContent>
          </Tooltip>

          <span className="w-px h-6 bg-border mx-1"></span>

          {/* Lists */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded ${
                  editor.isActive("bulletList")
                    ? "bg-muted-foreground/20"
                    : "hover:bg-muted-foreground/10"
                }`}
                disabled={readOnly}
              >
                <List className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded ${
                  editor.isActive("orderedList")
                    ? "bg-muted-foreground/20"
                    : "hover:bg-muted-foreground/10"
                }`}
                disabled={readOnly}
              >
                <ListOrdered className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Numbered List</TooltipContent>
          </Tooltip>

          <span className="w-px h-6 bg-border mx-1"></span>

          {/* Alignment */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                className={`p-2 rounded ${
                  editor.isActive({ textAlign: "left" })
                    ? "bg-muted-foreground/20"
                    : "hover:bg-muted-foreground/10"
                }`}
                disabled={readOnly}
              >
                <AlignLeft className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Align Left</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                className={`p-2 rounded ${
                  editor.isActive({ textAlign: "center" })
                    ? "bg-muted-foreground/20"
                    : "hover:bg-muted-foreground/10"
                }`}
                disabled={readOnly}
              >
                <AlignCenter className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Align Center</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                className={`p-2 rounded ${
                  editor.isActive({ textAlign: "right" })
                    ? "bg-muted-foreground/20"
                    : "hover:bg-muted-foreground/10"
                }`}
                disabled={readOnly}
              >
                <AlignRight className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Align Right</TooltipContent>
          </Tooltip>

          <span className="w-px h-6 bg-border mx-1"></span>

          {/* Link */}
          <Dialog open={isEditingLink} onOpenChange={setIsEditingLink}>
            <DialogTrigger asChild>
              <button
                type="button"
                onClick={() => {
                  if (!readOnly) {
                    setIsEditingLink(true);
                    setLinkUrl(editor.getAttributes("link").href || "");
                  }
                }}
                className={`p-2 rounded ${
                  editor.isActive("link") ? "bg-muted-foreground/20" : "hover:bg-muted-foreground/10"
                }`}
                disabled={readOnly}
              >
                <LinkIcon className="h-4 w-4" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Insert Link</DialogTitle>
                <DialogDescription>Enter the URL for the link.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="link">URL</Label>
                  <Input
                    ref={linkInputRef}
                    id="link"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={setLink} disabled={readOnly}>
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Image */}
          <Dialog open={isAddingImage} onOpenChange={setIsAddingImage}>
            <DialogTrigger asChild>
              <button
                type="button"
                onClick={() => {
                  if (!readOnly) {
                    setIsAddingImage(true);
                  }
                }}
                className="p-2 rounded hover:bg-muted-foreground/10"
                disabled={readOnly}
              >
                <ImageIcon className="h-4 w-4" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Insert Image</DialogTitle>
                <DialogDescription>Enter the URL or upload an image.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image-url">Image URL</Label>
                  <Input
                    ref={imageInputRef}
                    id="image-url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div>
                  <div className="text-sm mb-2">Or upload from your device</div>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={readOnly}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={addImage} disabled={readOnly}>
                  Add Image
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TooltipProvider>
      </div>

      {/* BubbleMenu and EditorContent */}
      {editor && !readOnly && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="bg-background rounded-md shadow-md border p-1 flex items-center gap-1"
        >
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-1.5 rounded ${
              editor.isActive("bold") ? "bg-muted-foreground/20" : "hover:bg-muted-foreground/10"
            }`}
          >
            <Bold className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-1.5 rounded ${
              editor.isActive("italic") ? "bg-muted-foreground/20" : "hover:bg-muted-foreground/10"
            }`}
          >
            <Italic className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => {
              setIsEditingLink(true);
              setLinkUrl(editor.getAttributes("link").href || "");
            }}
            className={`p-1.5 rounded ${
              editor.isActive("link") ? "bg-muted-foreground/20" : "hover:bg-muted-foreground/10"
            }`}
          >
            <LinkIcon className="h-3.5 w-3.5" />
          </button>
        </BubbleMenu>
      )}

      <style jsx global>{`
        /* These classes ensure the editor content displays properly */
        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
        }
        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
        }
        .ProseMirror h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 1em;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5em;
          margin: 1em 0;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5em;
          margin: 1em 0;
        }
        .ProseMirror p {
          margin: 1em 0;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
        }
      `}</style>
      <EditorContent editor={editor} />
    </div>
  );
}