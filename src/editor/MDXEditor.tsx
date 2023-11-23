import { useRef } from 'react'
import { compile, nodeTypes, run } from '@mdx-js/mdx'
import { createStarryNight } from '@wooorm/starry-night'
import sourceCss from '@wooorm/starry-night/source.css'
import sourceJs from '@wooorm/starry-night/source.js'
import sourceJson from '@wooorm/starry-night/source.json'
import sourceMdx from '@wooorm/starry-night/source.mdx'
import sourceTs from '@wooorm/starry-night/source.ts'
import sourceTsx from '@wooorm/starry-night/source.tsx'
import textHtmlBasic from '@wooorm/starry-night/text.html.basic'
import textMd from '@wooorm/starry-night/text.md'
import { visit as visitEstree } from 'estree-util-visit'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { useEffect, useState } from 'react'
// @ts-expect-error: the automatic react runtime is untyped.
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'
//import ReactDom from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import rehypeRaw from 'rehype-raw'
import remarkDirective from 'remark-directive'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { removePosition } from 'unist-util-remove-position'
import { visit } from 'unist-util-visit'
import { VFile } from 'vfile'

const runtime = { Fragment, jsx, jsxs }

// const editor = document.querySelector('#js-editor')

// if (window.location.pathname === '/playground/' && editor) {
//   const root = document.createElement('div')
//   root.classList.add('playground')
//   editor.after(root)
//   init(root)
// }

export default function MDXEditor({ initialValue }) {
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
  const [evalResult, setEvalResult] = useState(
    // Cast to more easily use actual value.
    /** @type {unknown} */ undefined
  )

  const editorRef = useRef(null)

  useEffect(() => {
    // const editor = document.querySelector('#js-editor')
    // // if (window.location.pathname === '/playground/' && editor) {
    // if (editor) {
    //   const root = document.createElement('div')
    //   root.classList.add('playground')
    //   editor.after(root)
    //   init(root)
    // }
  }, [])

  useEffect(
    function () {
      async function go() {
        /** @type {PluggableList} */
        const recmaPlugins = []
        /** @type {PluggableList} */
        const rehypePlugins = []
        /** @type {PluggableList} */
        const remarkPlugins = []

        if (directive) remarkPlugins.unshift(remarkDirective)
        if (frontmatter) remarkPlugins.unshift(remarkFrontmatter)
        if (gfm) remarkPlugins.unshift(remarkGfm)
        if (math) remarkPlugins.unshift(remarkMath)
        if (raw) rehypePlugins.unshift([rehypeRaw, { passThrough: nodeTypes }])

        const file = new VFile({
          basename: formatMarkdown ? 'example.md' : 'example.mdx',
          value,
        })

        if (show === 'esast') recmaPlugins.push([captureEsast])
        if (show === 'hast') rehypePlugins.push([captureHast])
        if (show === 'mdast') remarkPlugins.push([captureMdast])
        /** @type {UnistNode | undefined} */
        let ast

        await compile(file, {
          development: show === 'result' ? false : development,
          jsx: show === 'code' || show === 'esast' ? jsx : false,
          outputFormat: show === 'result' || outputFormatFunctionBody ? 'function-body' : 'program',
          recmaPlugins,
          rehypePlugins,
          remarkPlugins,
        })

        if (show === 'result') {
          /** @type {MDXModule} */
          const mod = await run(String(file), {
            ...runtime,
            baseUrl: window.location.href,
          })

          return (
            <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[value]}>
              <div className="playground-result">{mod.default({})}</div>
            </ErrorBoundary>
          )
        }

        function captureMdast() {
          /**
           * @param {MdastRoot} tree
           *   Tree.
           * @returns {undefined}
           *   Nothing.
           */
          return function (tree) {
            const clone = structuredClone(tree)
            if (!positions) cleanUnistTree(clone)
            ast = clone
          }
        }

        function captureHast() {
          /**
           * @param {HastRoot} tree
           *   Tree.
           * @returns {undefined}
           *   Nothing.
           */
          return function (tree) {
            const clone = structuredClone(tree)
            if (!positions) cleanUnistTree(clone)
            ast = clone
          }
        }

        function captureEsast() {
          /**
           * @param {Program} tree
           *   Tree.
           * @returns {undefined}
           *   Nothing.
           */
          return function (tree) {
            const clone = structuredClone(tree)
            if (!positions) visitEstree(clone, removeFromEstree)
            ast = clone
          }
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

  return (
    <>
      {/* <textarea
        spellCheck="false"
        className="playground-write"
        value={value}
        rows={value.split('\n').length + 1}
        onChange={function (event) {
          setValue(event.target.value)
        }}
      /> */}

      {display}
      {/* {compiledResult.ok ? compiledResult.value : (
        <div>
          <p>Could not compile code:</p>
          <DisplayError error={compiledResult.value} />
        </div>
      )} */}
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
