import { useRef } from 'react'

import { apiUrl } from '@/lib/api/config'
import { Editor } from '@tinymce/tinymce-react'

// const uploadImage = ()

export default function TinymceEditor({ initialValue, setContent, readOnly }) {
  // console.log('TinymceEditor content:', initialValue)
  // tinymce
  const editorRef = useRef(null)
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent())
    }
  }

  const example_image_upload_handler = (blobInfo, progress) =>
    new Promise((resolve, reject) => {
      console.log('example_image_upload_handler:', blobInfo)
    })
  const paste_preprocess = (editor, args) => {
    // console.log("paste_preprocess:", args);
  }

  const paste_postprocess = (editor, args) => {
    // console.log("paste_postprocess", args);
    // args.node.setAttribute('id', '42');

    // Select all img tags
    var images = editor.dom.select('img', args.node)

    for (var i = 0; i < images.length; i++) {
      var node = images[i]
      console.log('img:', node)
      var imageUrl = node.getAttribute('src') // Get the original image URL
      console.log('img url:', node)

      var newImageUrl = '' // Your custom image URL replacement logic to get the new image URL

      if (newImageUrl) {
        node.setAttribute('src', newImageUrl) // Replace with the new image URL
      }
    }
  }

  if (readOnly) {
    return (
      <>
        <Editor
          tinymceScriptSrc={'/tinymce/tinymce.min.js'}
          onInit={(evt, editor) => {
            editorRef.current = editor
          }}
          initialValue={initialValue}
          init={{
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
              'autoresize',
            ],
            menubar: false,
            toolbar: false,
            statusbar: false,
            branding: false,
            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          }}
          disabled={true}
        />
      </>
    )
  }

  return (
    <>
      <Editor
        // tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
        tinymceScriptSrc={'/tinymce/tinymce.min.js'}
        onInit={(evt, editor) => {
          editor.on('paste', function (e) {
            console.log('paste=========', e)
            var clipboardData = e.clipboardData || window.clipboardData
            if (clipboardData && clipboardData.files && clipboardData.files.length) {
              e.preventDefault() // 阻止默认粘贴行为

              var file = clipboardData.files[0]
              var reader = new FileReader()

              reader.onload = function (event) {
                var dataUrl = event.target.result

                // 在这里可以使用 dataUrl 进行进一步处理，比如上传到服务器、显示预览等
                console.log('Pasted image data:', dataUrl)
              }

              reader.readAsDataURL(file)
            }
          })

          editorRef.current = editor
        }}
        initialValue={initialValue}
        onChange={() => {
          if (editorRef.current) setContent(editorRef.current.getContent())
        }}
        init={{
          branding: false,
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
            'pastewordimage',
          ],
          toolbar:
            'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | image | help',
          images_upload_url: `${apiUrl}/upload`,
          // images_upload_handler: example_image_upload_handler,
          // paste_preprocess: paste_preprocess,
          // paste_postprocess: paste_postprocess,
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
