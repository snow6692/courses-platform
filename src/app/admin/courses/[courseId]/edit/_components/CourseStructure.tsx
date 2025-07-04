"use client";

import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

import {
  DndContext,
  DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDown,
  ChevronRight,
  FileTextIcon,
  GripVertical,
  PlusIcon,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react";

interface IProps {
  data: AdminCourseSingularType;
}
interface SortableItemProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => ReactNode;
  className?: string;
  data?: {
    type: "chapter" | "lesson";
    chapterId?: string;
  };
}
function CourseStructure({ data }: IProps) {
  const initialItems =
    data.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: true,
      lessons: chapter.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
        isOpen: true,
        description: lesson.description,
      })),
    })) || [];
  const [items, setItems] = useState(initialItems);

  function SortableItem({ id, children, className, data }: SortableItemProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id, data });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn(isDragging ? "z-10" : "", className)}
      >
        {children(listeners)}
      </div>
    );
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;

    // Arrangement has changed, so we need to update the items
    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function toggleChapter(chapterId: string) {
    setItems(
      items.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, isOpen: !chapter.isOpen }
          : chapter,
      ),
    );
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  //We use rectIntersection to detect collisions between the items and the sensors (It's an algorithm that checks if the items are intersecting with the sensors)
  return (
    // Remove evert gray color
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
    >
      <Card className="w-full">
        <CardHeader className="border-b p-4">
          <CardTitle className="text-lg font-semibold">
            B Course Chapters
          </CardTitle>
        </CardHeader>

        <CardContent className="flex w-full flex-col gap-4 overflow-y-auto">
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                data={{ type: "chapter" }}
                className="rounded-md transition-colors"
              >
                {(listeners) => (
                  <Card className="mb-4 w-full border">
                    <Collapsible
                      open={item.isOpen}
                      onOpenChange={() => toggleChapter(item.id)}
                      className="w-full"
                    >
                      <div className="flex items-center justify-between rounded-t-md p-3">
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="flex-shrink-0 cursor-grab active:cursor-grabbing"
                            {...listeners}
                            aria-label={`Drag to reorder chapter ${item.title}`}
                          >
                            <GripVertical className="h-4 w-4" />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="flex-shrink-0"
                              aria-label={
                                item.isOpen
                                  ? `Collapse chapter ${item.title}`
                                  : `Expand chapter ${item.title}`
                              }
                            >
                              {item.isOpen ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <span className="truncate text-sm font-medium">
                            {item.title}
                          </span>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="flex-shrink-0 text-red-500 hover:text-red-600"
                          aria-label={`Delete chapter ${item.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <CollapsibleContent className="space-y-2 rounded-b-md px-3 py-2">
                        <SortableContext
                          items={item.lessons.map((lesson) => lesson.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          {item.lessons.map((lesson) => (
                            <SortableItem
                              key={lesson.id}
                              id={lesson.id}
                              data={{ type: "lesson", chapterId: item.id }}
                              className="w-full rounded-md transition-colors"
                            >
                              {(lessonListeners) => (
                                <div className="flex w-full items-center justify-between rounded-md border p-2">
                                  <div className="flex min-w-0 flex-1 items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="flex-shrink-0 cursor-grab active:cursor-grabbing"
                                      {...lessonListeners}
                                      aria-label={`Drag to reorder lesson ${lesson.title}`}
                                    >
                                      <GripVertical className="h-4 w-4" />
                                    </Button>
                                    <FileTextIcon className="h-4 w-4 flex-shrink-0" />
                                    <Link
                                      href={`/admin/courses/${data.id}/${item.id}/${lesson.id}/lesson`}
                                      className="truncate text-sm font-medium hover:text-blue-600"
                                    >
                                      {lesson.title}
                                    </Link>
                                  </div>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="flex-shrink-0 text-red-500 hover:text-red-600"
                                    aria-label={`Delete lesson ${lesson.title}`}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </SortableItem>
                          ))}
                        </SortableContext>
                        <Button
                          variant="outline"
                          className="mt-2 w-full text-sm"
                          aria-label={`Create new lesson in chapter ${item.title}`}
                        >
                          <PlusIcon className="mr-2 h-4 w-4" />
                          Add New Lesson
                        </Button>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
}

export default CourseStructure;
