export { }
declare global {
  namespace Models {
    export interface PostInteraction {
      /** Link to article */
      postId: string // article ID (post._id)
      postSlug?: string // slug for quick query if needed

      /** User information */
      userId?: string // user (if logged in)
      sessionId?: string // session/guest code (if not logged in)
      ip?: string // user IP (anti-spam)
      userAgent?: string // device / browser
      author?: string // display name (optional)

      /** Action type */
      type: 'view' | 'like' | 'share' | 'comment' | 'rate'
      action?: 'add' | 'remove' // used for like/share (toggle)

      /** Interaction content (if any) */
      comment?: string // comment text
      rating?: number // rating score (1–5 stars)
      meta?: Common.IMeta[] // auxiliary data (e.g. device, location...)

      /** Time & status */
      flag?: number // 1=active, 0=deleted/spam
      status?: 'active' | 'pending' | 'hidden' | 'spam'
      createdAt: number
      updatedAt?: number
    }
    export interface IPostInteraction extends PostInteraction {
      _id?: string
    }
  }
}
