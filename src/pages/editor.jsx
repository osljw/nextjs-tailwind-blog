import TinymceEditor from '@/editor/TinymceEditor'
import MDXEditor from '@/editor/MDXEditor'

export default function Editor() {
  const initialValue = `# Hello, world!

Below is an example of markdown in JSX.

<div style={{backgroundColor: 'violet', padding: '1rem'}}>
  Try and change the background color to \`tomato\`.
</div>`

  return (
    <>
      {/* <TinymceEditor></TinymceEditor> */}
      <MDXEditor initialValue={initialValue} />
    </>
  )
}
