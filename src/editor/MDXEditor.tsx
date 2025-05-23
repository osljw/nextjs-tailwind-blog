import 'katex/dist/katex.css'

import { useRef } from 'react'
import { useEffect, useState } from 'react'
// @ts-expect-error: the automatic react runtime is untyped.
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
//import ReactDom from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'

import { compile, nodeTypes, run } from '@mdx-js/mdx'
// import { createStarryNight } from '@wooorm/starry-night'
// import sourceCss from '@wooorm/starry-night/source.css'
// import sourceJs from '@wooorm/starry-night/source.js'
// import sourceJson from '@wooorm/starry-night/source.json'
// import sourceMdx from '@wooorm/starry-night/source.mdx'
// import sourceTs from '@wooorm/starry-night/source.ts'
// import sourceTsx from '@wooorm/starry-night/source.tsx'
// import textHtmlBasic from '@wooorm/starry-night/text.html.basic'
// import textMd from '@wooorm/starry-night/text.md'
import { visit as visitEstree } from 'estree-util-visit'
// import { toJsxRuntime } from 'hast-util-to-jsx-runtime'

import remarkDirective from 'remark-directive'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'

import rehypeRaw from 'rehype-raw'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypeKatex from 'rehype-katex'
// import rehypeMathjax from 'rehype-mathjax'

import { removePosition } from 'unist-util-remove-position'
import { visit } from 'unist-util-visit'
import { VFile } from 'vfile'

import remarkCodeTitles from '@/lib/remark-code-title'
import { Button } from 'antd'

const runtime = { Fragment, jsx, jsxs }

// const editor = document.querySelector('#js-editor')

// if (window.location.pathname === '/playground/' && editor) {
//   const root = document.createElement('div')
//   root.classList.add('playground')
//   editor.after(root)
//   init(root)
// }

const Editor = ({ value, onChange, onScroll }) => {
  return (
    <div className="h-full w-full border-l p-4">
      <textarea
        className="h-full w-full bg-gray-100 p-4"
        style={{ height: '60vh' }}
        value={value}
        onChange={onChange}
        onScroll={onScroll}
      ></textarea>
    </div>
  )
}

const Preview = ({ children, onScroll }) => {
  return (
    <div className="h-full w-full border-l p-4">
      <div
        className="prose max-w-none break-words pb-8 pt-10 dark:prose-dark"
        style={{
          backgroundColor: 'dark',
          height: '60vh',
          overflow: 'auto',
        }}
        onScroll={onScroll}
      >
        {children}
      </div>
    </div>
  )
}

const MyHeading = ({ children }) => <h3>{children}</h3>
const MyLink = ({ href, children }) => (
  <a href={href} target="_blank">
    {children}
  </a>
)

export default function MDXEditor({ initialValue, setContent, readOnly }) {
  const [text, setText] = useState(initialValue)

  const [directive, setDirective] = useState(false)
  const [development, setDevelopment] = useState(false)
  const [frontmatter, setFrontmatter] = useState(false)
  const [gfm, setGfm] = useState(false)
  const [formatMarkdown, setFormatMarkdown] = useState(false)
  const [jsx, setJsx] = useState(false)
  const [math, setMath] = useState(false)
  const [outputFormatFunctionBody, setOutputFormatFunctionBody] = useState(false)
  const [positions, setPositions] = useState(false)
  const [raw, setRaw] = useState(false)
  const [show, setShow] = useState('result')
  const [value, setValue] = useState(initialValue)
  const [evalResult, setEvalResult] = useState(undefined)

  const editorRef = useRef()
  const previewRef = useRef()

  useEffect(() => {
    setValue(initialValue)
    setText(initialValue)
  }, [initialValue])

  const handleScroll = () => {
    console.log('========handleScroll', editorRef.current, previewRef.current)
    if (editorRef.current && previewRef.current) {
      const editorElement = editorRef.current
      const previewElement = previewRef.current

      console.log('editorElement.scrollTop: ', editorElement.scrollTop)

      if (editorElement.scrollTop !== previewElement.scrollTop) {
        previewElement.scrollTop = editorElement.scrollTop
      }
    }
  }

  useEffect(
    function () {
      async function go() {
        console.log('=========go ==========')
        /** @type {PluggableList} */
        const recmaPlugins = []
        /** @type {PluggableList} */
        const rehypePlugins = []
        /** @type {PluggableList} */
        const remarkPlugins = []

        if (directive) remarkPlugins.unshift(remarkDirective)
        if (frontmatter) remarkPlugins.unshift(remarkFrontmatter)
        // if (gfm) remarkPlugins.unshift(remarkGfm)
        // if (math) remarkPlugins.unshift(remarkMath)
        if (raw) rehypePlugins.unshift([rehypeRaw, { passThrough: nodeTypes }])

        const file = new VFile({
          basename: formatMarkdown ? 'example.md' : 'example.mdx',
          value,
        })

        /** @type {UnistNode | undefined} */
        let ast

        await compile(file, {
          // baseUrl: '/',
          development: show === 'result' ? false : development,
          jsx: show === 'code' || show === 'esast' ? jsx : false,
          outputFormat: show === 'result' || outputFormatFunctionBody ? 'function-body' : 'program',
          recmaPlugins,
          remarkPlugins: [
            remarkGfm,
            // remarkCodeTitles,
            remarkMath,
          ],
          rehypePlugins: [
            [rehypePrismPlus, { ignoreMissing: true }],
            rehypeKatex,
            // rehypeMathjax,
          ],
          // providerImportSource: './mdx-components.jsx'
        })

        // console.log('after compile String(file):', String(file))

        if (show === 'result') {
          /** @type {MDXModule} */
          const mod = await run(String(file), {
            ...runtime,
            // baseUrl: window.location.href,
            useMDXComponents: () => {
              return {
                // h1: MyHeading,
                a: MyLink,
                h1(props) {
                  return <h2 {...props} />
                },
              }
            },
          })
          const MDXContent = mod.default
          // console.log('after run String(file):', String(file))

          return (
            <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[value]}>
              {/* <div className="playground-result">{mod.default({})}</div> */}
              <MDXContent
                components={{
                  // h1(props) {
                  //   return <h2 {...props} />
                  // },
                  Button,
                }}
              />
            </ErrorBoundary>
          )
        }
      }

      go().then(
        function (ok) {
          setEvalResult({ ok: true, value: ok })
        },
        /**
         * @param {Error} error
         *   Error.
         * @returns {undefined}
         *   Nothing.
         */
        function (error) {
          setEvalResult({ ok: false, value: error })
        }
      )
    },

    [
      development,
      directive,
      frontmatter,
      gfm,
      jsx,
      formatMarkdown,
      math,
      outputFormatFunctionBody,
      positions,
      raw,
      show,
      value,
    ]
  )

  const scope = formatMarkdown ? 'text.md' : 'source.mdx'
  // Cast to actual value.
  const compiledResult = /** @type {EvalResult | undefined} */ evalResult
  /** @type {JSX.Element | undefined} */
  let display

  if (compiledResult) {
    if (compiledResult.ok) {
      display = compiledResult.value
    } else {
      display = (
        <div>
          <p>Could not compile code:</p>
          <DisplayError error={compiledResult.value} />
        </div>
      )
    }
  }

  if (readOnly) {
    return (
      <>
        {/* <Preview>{display}</Preview> */}

        <div className="h-full w-full p-4">
          <div className="prose max-w-none break-words pb-8 pt-10 dark:prose-dark">{display}</div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="flex">
        <div className="w-1/2">
          <div className="h-full w-full border-l p-4">
            <textarea
              ref={editorRef}
              className="h-full w-full bg-gray-100 p-4"
              style={{ height: '60vh' }}
              value={value}
              onChange={(event) => {
                setValue(event.target.value)
                if (setContent) setContent(event.target.value)
              }}
              // onScroll={handleScroll}
            ></textarea>
          </div>
        </div>

        <div className="w-1/2">
          <div
            ref={previewRef}
            // className="prose max-w-none break-words pb-8 pt-10 dark:prose-dark"
            className="prose h-full w-full max-w-none break-words border-l p-4 pb-8 pt-10 dark:prose-dark"
            style={{
              // backgroundColor: 'dark',
              height: '60vh',
              overflow: 'auto',
            }}
            // onScroll={handleScroll}
          >
            {display}
          </div>
        </div>
      </div>
    </>
  )
}

/**
 *
 * @param {Readonly<FallbackProps>} props
 *   Props.
 * @returns {JSX.Element}
 *   Element.
 */
function ErrorFallback(props) {
  // type-coverage:ignore-next-line
  const error = /** @type {Error} */ props.error
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <DisplayError error={error} />
      <button type="button" onClick={props.resetErrorBoundary}>
        Try again
      </button>
    </div>
  )
}

/**
 * @param {DisplayProps} props
 *   Props.
 * @returns {JSX.Element}
 *   Element.
 */
function DisplayError(props) {
  return (
    <pre>
      <code>
        {String(props.error.stack ? props.error.message + '\n' + props.error.stack : props.error)}
      </code>
    </pre>
  )
}

/**
 * @param {HastRoot | MdastRoot} node
 *   mdast or hast root.
 * @returns {undefined}
 *   Nothing.
 */
function cleanUnistTree(node) {
  removePosition(node, { force: true })
  visit(node, cleanUnistNode)
}

/**
 * @param {HastNodes | MdastNodes | MdxJsxAttribute | MdxJsxAttributeValueExpression | MdxJsxExpressionAttribute} node
 *   Node.
 * @returns {undefined}
 *   Nothing.
 */
function cleanUnistNode(node) {
  if (
    node.type === 'mdxJsxAttribute' &&
    'value' in node &&
    node.value &&
    typeof node.value === 'object'
  ) {
    cleanUnistNode(node.value)
  }

  if ('attributes' in node && node.attributes && Array.isArray(node.attributes)) {
    for (const attr of node.attributes) {
      cleanUnistNode(attr)
    }
  }

  if (node.data && 'estree' in node.data && node.data.estree) {
    visitEstree(node.data.estree, removeFromEstree)
  }
}

/**
 * @param {EstreeNode} node
 *   estree node.
 * @returns {undefined}
 *   Nothing.
 */
function removeFromEstree(node) {
  delete node.loc
  // @ts-expect-error: this field is added by acorn.
  delete node.start
  // @ts-expect-error: this field is added by acorn.
  delete node.end
  delete node.range
}
