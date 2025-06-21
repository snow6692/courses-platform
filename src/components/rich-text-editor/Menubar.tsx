import React from "react";
import { type Editor } from "@tiptap/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Toggle } from "../ui/toggle";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";
import { Button } from "../ui/button";
interface MenubarProps {
  editor: Editor | null;
}

function Menubar({ editor }: MenubarProps) {
  if (!editor) return null;

  return (
    <div className="border-input bg-card flex flex-wrap items-center gap-1 rounded-t-lg border border-x-0 border-t-0 p-2">
      {/* Formatting */}
      <TooltipProvider>
        <div className="flex flex-wrap gap-1">
          {/* Bold */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("bold")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBold().run()
                }
                disabled={!editor.can().chain().focus().toggleBold().run()}
                aria-label="Toggle bold"
                aria-pressed={editor.isActive("bold")}
                className={
                  "aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                }
              >
                <Bold className="size-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bold</p>
            </TooltipContent>
          </Tooltip>
          {/* Italic */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("italic")}
                onPressedChange={() =>
                  editor.chain().focus().toggleItalic().run()
                }
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                aria-label="Toggle bold"
                aria-pressed={editor.isActive("italic")}
                className={
                  "aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                }
              >
                <Italic className="size-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Italic</p>
            </TooltipContent>
          </Tooltip>
          {/* strike */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("strike")}
                onPressedChange={() =>
                  editor.chain().focus().toggleStrike().run()
                }
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                aria-label="Toggle bold"
                aria-pressed={editor.isActive("strike")}
                className={
                  "aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                }
              >
                <Strikethrough className="size-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Strike</p>
            </TooltipContent>
          </Tooltip>

          {/* h1 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("heading", { level: 1 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                aria-label="Toggle bold"
                aria-pressed={editor.isActive("heading", { level: 1 })}
                className={
                  "aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                }
              >
                <Heading1 className="size-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>H1</p>
            </TooltipContent>
          </Tooltip>
          {/* H2 */}

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("heading", { level: 2 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                aria-label="Toggle bold"
                aria-pressed={editor.isActive("heading", { level: 2 })}
                className={
                  "aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                }
              >
                <Heading2 className="size-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>H2</p>
            </TooltipContent>
          </Tooltip>

          {/* H3 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("heading", { level: 3 })}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                aria-label="Toggle bold"
                aria-pressed={editor.isActive("heading", { level: 3 })}
                className={
                  "aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                }
              >
                <Heading3 className="size-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>H3</p>
            </TooltipContent>
          </Tooltip>

          {/* Bullet List */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("bulletList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBulletList().run()
                }
                aria-label="Toggle bold"
                aria-pressed={editor.isActive("bulletList")}
                className={
                  "aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                }
              >
                <List className="size-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bullet List</p>
            </TooltipContent>
          </Tooltip>

          {/* Ordered List */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive("orderedList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleOrderedList().run()
                }
                aria-label="Toggle bold"
                aria-pressed={editor.isActive("orderedList")}
                className={
                  "aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                }
              >
                <ListOrdered className="size-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ordered List</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="bg-border mx-2 h-6 w-px" />

        {/* Alignment */}
        <div className="flex flex-wrap gap-1">
          {/* alignment left */}

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive({ textAlign: "left" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                aria-label="Toggle bold"
                aria-pressed={editor.isActive({ textAlign: "left" })}
                className={
                  "aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                }
              >
                <AlignLeft className="size-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p> Align Left</p>
            </TooltipContent>
          </Tooltip>

          {/* alignment center */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive({ textAlign: "center" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                aria-label="Toggle bold"
                aria-pressed={editor.isActive({ textAlign: "center" })}
                className={
                  "aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                }
              >
                <AlignCenter className="size-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p> Align Center</p>
            </TooltipContent>
          </Tooltip>

          {/* alignment right */}

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size={"sm"}
                pressed={editor.isActive({ textAlign: "right" })}
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                aria-label="Toggle bold"
                aria-pressed={editor.isActive({ textAlign: "right" })}
                className={
                  "aria-pressed:bg-primary aria-pressed:text-primary-foreground"
                }
              >
                <AlignRight className="size-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p> Align Right</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="bg-border mx-2 h-6 w-px" />

        <div className="flex flex-wrap gap-1">
          {/* Undo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"sm"}
                variant={"ghost"}
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
              >
                <Undo className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p> Undo</p>
            </TooltipContent>
          </Tooltip>
          {/* Redo */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size={"sm"}
                variant={"ghost"}
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
              >
                <Redo className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p> Redo</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}

export default Menubar;
