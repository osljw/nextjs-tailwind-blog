import { useRef } from 'react'

import { apiUrl } from '@/lib/api/config'
import { Editor } from '@tinymce/tinymce-react'

const document_base_url = apiUrl.split('/api')[0]

export default function TinymceEditor({ initialValue, setContent, readOnly }) {
  // console.log('TinymceEditor content:', initialValue)
  // tinymce
  const editorRef = useRef(null)
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent())
    }
  }

  // const paste_postprocess = (editor, args) => {
  //   // console.log("paste_postprocess", args);
  //   // args.node.setAttribute('id', '42');

  //   // Select all img tags
  //   var images = editor.dom.select('img', args.node)

  //   for (var i = 0; i < images.length; i++) {
  //     var node = images[i]
  //     console.log('img:', node)
  //     var imageUrl = node.getAttribute('src') // Get the original image URL
  //     console.log('img url:', node)

  //     var newImageUrl = '' // Your custom image URL replacement logic to get the new image URL

  //     if (newImageUrl) {
  //       node.setAttribute('src', newImageUrl) // Replace with the new image URL
  //     }
  //   }
  // }

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

            document_base_url: `${document_base_url}`,
          }}
          disabled={true}
        />
      </>
    )
  }

  const customImageUploadHandler = (blobInfo, progress) =>
    new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.withCredentials = true
      xhr.open('POST', `${apiUrl}/upload`, true)
      xhr.setRequestHeader('Authorization', window.localStorage.getItem('token')) // Replace 'yourToken' with the actual token

      console.log('upload bolb info:', blobInfo)

      xhr.upload.onprogress = (e) => {
        progress((e.loaded / e.total) * 100)
      }

      xhr.onload = () => {
        if (xhr.status === 403) {
          reject({ message: 'HTTP Error: ' + xhr.status, remove: true })
          return
        }

        if (xhr.status < 200 || xhr.status >= 300) {
          reject('HTTP Error: ' + xhr.status)
          return
        }

        const json = JSON.parse(xhr.responseText)

        if (!json || typeof json.location != 'string') {
          reject('Invalid JSON: ' + xhr.responseText)
          return
        }

        resolve(json.location)
      }

      xhr.onerror = () => {
        reject('Image upload failed due to a XHR Transport error. Code: ' + xhr.status)
      }

      const formData = new FormData()
      formData.append('file', blobInfo.blob(), blobInfo.filename())

      xhr.send(formData)
    })

  const paste_preprocess = async (editor: any, args: any) => {
    // 微信图片CORS不可引用， 使用代理服务器下载转换
    //  获取粘贴的内容
    const content = args.content

    //  使用DOMParser解析粘贴的内容
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')

    //  查找所有的图片
    const images = doc.querySelectorAll('img')

    for (const image of images) {
      const imageUrl = image.getAttribute('src')

      if (imageUrl === null || !imageUrl.startsWith('http')) {
        continue // 跳过不符合条件的图片
      }
      // console.log("imageUrl:", imageUrl)
      const response = await fetch(`${apiUrl}/proxy/${imageUrl}`)
      // const response = await fetch(`${imageUrl}`);
      const data = await response.blob()
      const contentType = response.headers.get('Content-Type') || 'image/jpeg' // Fallback to 'image/jpeg' if not available
      const blob = new Blob([data], { type: contentType }) // Assuming the image is PNG format

      //  将Blob转换为base64字符串
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onloadend = function () {
        const base64data = reader.result
        image.setAttribute('src', base64data)
        image.removeAttribute('crossorigin') //  移除 crossorigin  属性

        //  将处理后的内容设置回editor
        // args.content = doc.body.innerHTML;
        console.log('========', doc.body.innerHTML)

        editor.setContent(doc.body.innerHTML)
      }
    }
  }

  return (
    <>
      <Editor
        // tinymceScriptSrc={process.env.PUBLIC_URL + '/tinymce/tinymce.min.js'}
        tinymceScriptSrc={'/tinymce/tinymce.min.js'}
        onInit={(evt, editor) => {
          editor.ui.registry.addButton('SaveButton', {
            text: '上传图片',
            onAction: async () => {
              const content = editor.getContent()
              console.log('Content to save:', content)
              // 在这里添加保存内容的逻辑

              //  获取编辑器中的所有图片节点
              const images = editor.dom.select('img')

              for (const img of images) {
                const src = img.getAttribute('src')
                console.log('img src:', src)
                // if (src && src.startsWith('blob:')) {
                //   try {
                //     const newSrc = await uploadImageFromBlobUrl(src);
                //     console.log("img src:", src, "newSrc:", src)
                //     img.setAttribute('src', newSrc);
                //   } catch (error) {
                //     console.error('Failed to upload image:', error);
                //   }
                // }
              }

              await editor.editorUpload.uploadImages()
            },
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
            'SaveButton | undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | image | help',

          paste_preprocess: paste_preprocess, // 粘贴时预处理, 处理图片链接为blob， 需要开启pastewordimage插件

          // images_upload_url: `${apiUrl}/upload`,

          automatic_uploads: false, // 关闭自动上传图片
          images_upload_credentials: true, // 上传验证账号信息
          images_upload_handler: customImageUploadHandler, // 设置Authorization token

          document_base_url: `${document_base_url}`, // 设置基础URL

          // paste_data_images: true,
          // paste_preprocess: paste_preprocess,
          // paste_postprocess: paste_postprocess,
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
      />
    </>
  )
}
