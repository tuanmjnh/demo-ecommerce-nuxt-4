import { PostModel } from '../../models/post.model'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rs: Common.IResponseItems = { type: 'home-get', message: 'success', status: true, data: null }

  try {
    // 1. Connect to MongoDB
    await connectToMongoDB(config.mongodbUri, config.mongodbName)

    // 2. Fetch hero slider images (from posts with specific group 'hero-slider')
    const heroSlides = await PostModel.find({
      flag: 1,
      groups: { $in: ['hero-slider'] }
    })
      .select('image images')
      .sort({ sort: 1 })
      .limit(5)
      .lean<Models.IPost[]>()

    // Extract images from hero posts - properly access IFileAttach structure
    const heroImages: string[] = []
    heroSlides.forEach(post => {
      // Main image
      if (post.image?.url) {
        heroImages.push(post.image.url)
      }
      // Additional images
      if (post.images && Array.isArray(post.images)) {
        post.images.forEach(img => {
          if (img?.url) {
            heroImages.push(img.url)
          }
        })
      }
    })

    // 3. Fetch about section data (from a specific page with key 'about-home')
    const aboutPage = await PostModel.findOne({
      flag: 1,
      key: 'about-home',
      type: 'page'
    })
      .select('title desc content image images')
      .lean<Models.IPost>()

    const aboutData = aboutPage ? {
      title: aboutPage.title || 'Về chúng tôi',
      description: aboutPage.desc || aboutPage.content || '',
      images: [
        aboutPage.image?.url,
        ...(aboutPage.images?.map(img => img?.url).filter(Boolean) || [])
      ].filter(Boolean).slice(0, 3) as string[]
    } : {
      title: 'Về LuxeDesign',
      description: 'Chúng tôi tin rằng mỗi công trình không chỉ là một tài sản, mà còn là nơi vun đắp hạnh phúc và phản ánh dấu ấn cá nhân của gia chủ.',
      images: [
        'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=800',
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800'
      ]
    }

    // 4. Fetch featured projects (highlighted posts with type 'post' or 'project')
    const projects = await PostModel.find({
      flag: 1,
      isHighlight: true,
      type: { $in: ['post', 'project'] }
    })
      .select('_id title desc slug image groups')
      .sort({ sort: 1, createdAt: -1 })
      .limit(6)
      .lean<Models.IPost[]>()

    const projectsData = {
      title: 'Mẫu thiết kế mới nhất',
      items: projects.map(project => ({
        title: project.title,
        description: project.desc || '',
        to: `/${project.slug}`,
        image: project.image?.url || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600',
        category: project.groups && project.groups.length > 0 ? project.groups[0] : 'Dự án'
      }))
    }

    // 5. Fetch blog/news items (recent posts with groups 'blog', 'news', or 'tips')
    const blogPosts = await PostModel.find({
      flag: 1,
      type: 'post',
      groups: { $in: ['blog', 'news', 'tips'] }
    })
      .select('title desc slug')
      .sort({ createdAt: -1 })
      .limit(3)
      .lean<Models.IPost[]>()

    const blogIcons = ['i-lucide-lightbulb', 'i-lucide-moon', 'i-lucide-sun']
    const blogData = {
      title: 'Tin tức & Kinh nghiệm',
      items: blogPosts.map((post, index) => ({
        title: post.title,
        description: post.desc || '',
        to: `/${post.slug}`,
        icon: blogIcons[index] || 'i-lucide-lightbulb'
      }))
    }

    // 6. Combine all data
    rs.data = {
      hero: {
        images: heroImages.length > 0 ? heroImages.slice(0, 5) : [
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop'
        ]
      },
      about: aboutData,
      projects: projectsData,
      blog: blogData
    } as any

    return rs

  } catch (error: any) {
    // console.error('Error fetching home data:', error)
    throw createError({ statusCode: 500, statusMessage: 'error', message: error.message })
  }
})
