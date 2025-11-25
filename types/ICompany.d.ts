export { }
declare global {
  namespace Models {
    export interface Company {
      name: string
      shortName?: string
      address?: string
      phone?: string
      fax?: string
      email?: string
      hotline?: string
      taxCode?: string
      logo?: Common.IFileAttach
      banner?: Common.IFileAttach
      images?: Common.IFileAttach[]
      mapEmbed?: string
      social?: Common.ISocialData
      openingHours?: string
      seo?: Common.ISeoData
      created?: any
      updated?: any
    }
    export interface ICompany extends Company {
      _id?: string
    }
  }
}
