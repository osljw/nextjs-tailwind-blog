;(function () {
  const global = window.tinymce.util.Tools.resolve('tinymce.PluginManager')
  const base64ToFile = (dataurl, filename = 'wps_office') => {
    const arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, { type: mime })
  }
  const hexToBase64 = (hexString) => {
    return btoa(
      hexString
        .match(/\w{2}/g)
        .map((char) => {
          return String.fromCharCode(parseInt(char, 16))
        })
        .join('')
    )
  }
  function extractImageDataFromRtf(rtfData) {
    if (!rtfData) {
      return []
    }
    let regexPictureHeader =
      /{\\pict[\s\S]+?\\bliptag-?\d+(\\blipupi-?\d+)?({\\\*\\blipuid\s?[\da-fA-F]+)?[\s}]*?/
    let regexPicture = new RegExp(`(?:(${regexPictureHeader.source}))([\\da-fA-F\\s]+)\\}`, 'g')
    let images = rtfData.match(regexPicture)
    const result = []
    if (!images) {
      regexPictureHeader =
        /{\\pict[\s\S]+?(\\pngblip-?\d+)?(\\wmetafile8-?\d+)?{\\\*\\blipuid\s?[\da-fA-F]+[\s}]*?/
      regexPicture = new RegExp(`(?:(${regexPictureHeader.source}))([\\da-fA-F\\s]+)\\}`, 'g')
      images = rtfData.match(regexPicture)
    }
    if (images) {
      for (const image of images) {
        let imageType = false
        if (image.includes('\\pngblip')) {
          imageType = 'image/png'
        } else if (image.includes('\\jpegblip')) {
          imageType = 'image/jpeg'
        }
        if (imageType) {
          const hex = image.replace(regexPictureHeader, '').replace(/[^\da-fA-F]/g, '')
          const base64 = `data:${imageType};base64,${hexToBase64(hex)}`
          result.push({ base64, file: base64ToFile(base64) })
        }
      }
    }
    return result
  }
  const getImgFiles = (e) => {
    if (e.clipboardData || e.originalEvent) {
      var clipboardData = e.clipboardData || e.originalEvent.clipboardData
      if (clipboardData.items) {
        var items = clipboardData.items,
          len = items.length
        for (var i = 0; i < len; i++) {
          if (items[i].type.indexOf('text/rtf') !== -1) {
            return extractImageDataFromRtf(clipboardData.getData('text/rtf'))
          }
        }
      }
    }
  }
  const Plugin = () => {
    global.add('pastewordimage', (editor) => {
      let imgs = [],
        index = 0
      editor.on('paste', (e) => {
        imgs = []
        index = 0
        const blobInfo = getImgFiles(e)
        if (blobInfo && blobInfo.length) {
          imgs = blobInfo
        }
      })
      editor.on('init', () => {
        editor.parser.addNodeFilter('img', (nodes) => {
          if (!nodes.some((node) => node.attr('src').indexOf('file://') === 0)) {
            return
          }
          for (let i = 0, l = nodes.length; i < l; i++) {
            const node = nodes[i]
            if (node.attr('src').indexOf('file://') === 0) {
              if (imgs[index]?.base64) {
                node.attr('src', imgs[index]?.base64)
                index++
              } else {
                node.remove()
              }
            }
            if (i + 1 === nodes.length) {
              imgs = []
              index = 0
            }
          }
        })
      })
    })
  }
  Plugin()
})()
