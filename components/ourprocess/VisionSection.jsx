"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';

function VisionSection({ data }) {
  const { title, description, photo, alt, imgTitle } = data;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'No content available',
      }),
    ],
    content: description || '',
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl text-gray-600 focus:outline-none',
      },
    },
  });

  return (
    <section className="py-5">
      <div className="md:mx-12 md:px-4 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
          {description && (
            <EditorContent editor={editor} />
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {photo?.[0] && (
            <img
              src={`/api/image/download/${photo[0]}`}
              alt={alt?.[0] || ''}
              title={imgTitle?.[0]}
              className="w-full h-64 object-cover rounded-lg shadow-sm"
            />
          )}
          {photo?.[1] && (
            <img
              src={`/api/image/download/${photo[1]}`}
              alt={alt?.[1] || ''}
              title={imgTitle?.[1]}
              className="w-full h-64 object-cover rounded-lg shadow-sm"
            />
          )}
        </div>
      </div>
    </section>
  );
}

export default VisionSection;