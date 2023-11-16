import { useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'

export default function TinymceEditor() {
  // tinymce
  const editorRef = useRef(null)
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent())
    }
  }

  // 处理保存内容到后端的函数
  const handleSave = async () => {
    try {
      // 发送 POST 请求到后端保存内容的 API 端点
      const response = await fetch('/api/save-content', {
        method: 'POST',
        body: JSON.stringify({ content }), // 将编辑器内容作为请求体发送
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        console.log('内容保存成功！')
      } else {
        console.error('内容保存失败！')
      }
    } catch (error) {
      console.error('发生错误：', error)
    }
  }

  return (
    <>
      <Editor
        // tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
        tinymceScriptSrc={'/tinymce/tinymce.min.js'}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue="<p>This is the initial content of the editor.</p>"
        init={{
          height: 500,
          menubar: false,
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
      <div className="container mx-auto">
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
      </div>
    </>
  )
}
