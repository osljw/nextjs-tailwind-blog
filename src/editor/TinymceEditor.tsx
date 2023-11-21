import { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

export default function TinymceEditor({ initialValue, setContent, readOnly }) {
  console.log('TinymceEditor content:', initialValue)
  // tinymce
  const editorRef = useRef(null)
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent())
    }
  }

  // 处理保存内容到后端的函数
  const handleSave = async () => {}

  if (readOnly) {
    return (
      <>
        <Editor
          // tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
          tinymceScriptSrc={'/tinymce/tinymce.min.js'}
          onInit={(evt, editor) => (editorRef.current = editor)}
          initialValue={initialValue}
          onChange={() => {
            if (editorRef.current) setContent(editorRef.current.getContent())
          }}
          init={{
            // height: 500,

            plugins: [
              'advlist',
              'autolink',
              'lists',
              'link',
              'image',
              'charmap',
              'anchor',
              'searchreplace',
              'visualblocks',
              'code',
              'fullscreen',
              'insertdatetime',
              'media',
              'table',
              'preview',
              'help',
              'wordcount',
            ],
            menubar: false,
            toolbar: false,
            statusbar: false,
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }}
        />
      </>
    )
  }

  return (
    <>
      <Editor
        // tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
        tinymceScriptSrc={'/tinymce/tinymce.min.js'}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={initialValue}
        onChange={() => {
          if (editorRef.current) setContent(editorRef.current.getContent())
        }}
        init={{
          // height: 500,
          // menubar: false,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'preview',
            'help',
            'wordcount',
          ],
          toolbar:
            'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
      />
      {/* <div className="container mx-auto">
        <button
          className="m-2 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={log}
        >
          Log editor content
        </button>
        <button
          className="m-2 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
          onClick={handleSave}
        >
          Save content
        </button>
      </div> */}
    </>
  )
}
