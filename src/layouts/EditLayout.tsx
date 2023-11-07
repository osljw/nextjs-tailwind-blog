import React from 'react'

import { ReactNode } from 'react'
import { PostFrontMatter } from 'types/PostFrontMatter'
import { AuthorFrontMatter } from 'types/AuthorFrontMatter'
import { Toc } from 'types/Toc'

interface Props {
  toc: Toc
  frontMatter: PostFrontMatter
  authorDetails: AuthorFrontMatter[]
  next?: { slug: string; title: string }
  prev?: { slug: string; title: string }
  children: ReactNode
}

export default function EditLayout(props: Props) {
  return (
    <>
      <h1> 标题 </h1>
    </>
  )
}
