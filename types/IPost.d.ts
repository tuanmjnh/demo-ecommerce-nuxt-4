// export { }
// declare global {
declare namespace Models {
  export interface Post {
    /** Identifier & grouping */
    key: string
    code: string
    groups: string[] // post group: ['promotion', 'event', 'blog']
    slug: string // SEO-friendly link
    slugFull?: string | null, // SEO + Rewrite -> example: /tin-tuc/cong-nghe/dien-thoai-iphone-17
    title: string
    desc?: string | null
    content?: string | null
    bottomContent?: string | null// bottom content
    relatedLinks?: string[] | null // external or internal links

    /** Images & attachments */
    image?: Common.IFileAttach | null // main image
    images?: Common.IFileAttach[] | null  // photo album
    attaches?: Common.IFileAttach[] | null // attachments

    /** Author & manager */
    author?: string | null
    authorId?: string | null
    editorId?: string | null

    /** Time */
    date?: number | null // original date (e.g., creation timestamp) post)
    publishedAt?: number | null // official publication time
    expiredAt?: number | null // display duration (if any)
    time?: Common.ITimeEvent | null// extended information about the event time

    /** Meta & SEO */
    attributes?: Common.IMeta[] | null// custom secondary data
    meta?: Common.IMeta[] | null// private meta
    seo?: Common.ISeoData | null// SEO configuration

    /** Classification & tagging */
    pins?: string[] | null// featured pin
    tags?: string[] | null// post tag
    lang?: string | null// language code (e.g., 'vi', 'en')
    translations?: string[] | null// link posts with content in other languages

    /** Visibility & status */
    sort: number // optional sorting
    flag: number // special status (e.g., 1 = visible, 0 = hidden)
    status?: Common.TypeStatus
    isHighlight?: boolean // highlights / top Post

    /** Interaction Statistics */
    stats: Common.IPostStatsData

    /** Change History */
    created: Common.IChangeData | null
    updated?: Common.IChangeData | null
    // createdAt?: number
    // updatedAt?: number
  }
  export interface IPost extends Post {
    _id?: string
  }
}
// }
