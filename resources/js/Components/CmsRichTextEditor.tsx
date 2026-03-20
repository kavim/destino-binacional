import * as React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Redo,
  Underline as UnderlineIcon,
  Undo,
} from "lucide-react";

export type CmsRichTextEditorProps = {
  id?: string;
  name: string;
  value: string;
  onChange: (e: { target: { name: string; value: string } }) => void;
  placeholder?: string;
  className?: string;
  invalid?: boolean;
};

function isEffectivelyEmpty(html: string): boolean {
  if (!html || html === "<p></p>") return true;
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (doc.body.textContent || "").trim().length === 0;
}

function normalizeOutgoing(html: string): string {
  return isEffectivelyEmpty(html) ? "" : html;
}

const tiptapContentClass = cn(
  "tiptap min-h-[220px] w-full px-3 py-2 text-sm text-foreground",
  "focus:outline-none",
  "[&_p]:my-2 first:[&_p]:mt-0",
  "[&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5",
  "[&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5",
  "[&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-semibold first:[&_h2]:mt-0",
  "[&_h3]:mb-2 [&_h3]:mt-3 [&_h3]:text-lg [&_h3]:font-semibold first:[&_h3]:mt-0",
  "[&_blockquote]:my-2 [&_blockquote]:border-l-4 [&_blockquote]:border-muted-foreground/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
  "[&_a]:text-primary [&_a]:underline"
);

export default function CmsRichTextEditor({
  id,
  name,
  value,
  onChange,
  placeholder = "Escreva o conteúdo…",
  className,
  invalid,
}: CmsRichTextEditorProps) {
  const initial = React.useRef(value ?? "");
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: initial.current || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        id: id ?? name,
        "aria-invalid": invalid ? true : undefined,
        class: tiptapContentClass,
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange({
        target: { name, value: normalizeOutgoing(ed.getHTML()) },
      });
    },
  });

  const setLink = React.useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const next = window.prompt("URL do link", previous ?? "https://");
    if (next === null) return;
    const trimmed = next.trim();
    if (trimmed === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: trimmed }).run();
  }, [editor]);

  return (
    <div
      className={cn(
        "cms-rich-text-editor overflow-hidden rounded-md border border-input/90 bg-background shadow-sm shadow-black/[0.04] ring-1 ring-black/[0.03] dark:border-input dark:shadow-black/20 dark:ring-white/[0.05]",
        "ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        invalid && "border-destructive focus-within:ring-destructive",
        className
      )}
    >
      {editor && (
        <div
          className="flex flex-wrap items-center gap-0.5 border-b border-border/80 bg-gradient-to-b from-muted/70 to-muted/50 px-1.5 py-1 dark:from-muted/50 dark:to-muted/30"
          role="toolbar"
          aria-label="Formatação"
        >
          <Button
            type="button"
            variant={editor.isActive("heading", { level: 2 }) ? "secondary" : "ghost"}
            size="sm"
            className="h-8 px-2"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            aria-pressed={editor.isActive("heading", { level: 2 })}
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("heading", { level: 3 }) ? "secondary" : "ghost"}
            size="sm"
            className="h-8 px-2"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            aria-pressed={editor.isActive("heading", { level: 3 })}
          >
            <Heading3 className="h-4 w-4" />
          </Button>
          <span className="mx-0.5 h-6 w-px bg-border" />
          <Button
            type="button"
            variant={editor.isActive("bold") ? "secondary" : "ghost"}
            size="sm"
            className="h-8 px-2"
            onClick={() => editor.chain().focus().toggleBold().run()}
            aria-pressed={editor.isActive("bold")}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("italic") ? "secondary" : "ghost"}
            size="sm"
            className="h-8 px-2"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            aria-pressed={editor.isActive("italic")}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("underline") ? "secondary" : "ghost"}
            size="sm"
            className="h-8 px-2"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            aria-pressed={editor.isActive("underline")}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <span className="mx-0.5 h-6 w-px bg-border" />
          <Button
            type="button"
            variant={editor.isActive("bulletList") ? "secondary" : "ghost"}
            size="sm"
            className="h-8 px-2"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            aria-pressed={editor.isActive("bulletList")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("orderedList") ? "secondary" : "ghost"}
            size="sm"
            className="h-8 px-2"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            aria-pressed={editor.isActive("orderedList")}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={editor.isActive("blockquote") ? "secondary" : "ghost"}
            size="sm"
            className="h-8 px-2"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            aria-pressed={editor.isActive("blockquote")}
          >
            <Quote className="h-4 w-4" />
          </Button>
          <span className="mx-0.5 h-6 w-px bg-border" />
          <Button
            type="button"
            variant={editor.isActive("link") ? "secondary" : "ghost"}
            size="sm"
            className="h-8 px-2"
            onClick={setLink}
            aria-pressed={editor.isActive("link")}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <span className="mx-0.5 h-6 w-px bg-border" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      )}
      {editor ? (
        <EditorContent editor={editor} className="bg-background" />
      ) : (
        <div
          className="min-h-[220px] animate-pulse bg-muted/50"
          aria-hidden
        />
      )}
    </div>
  );
}
