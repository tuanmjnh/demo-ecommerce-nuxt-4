export const useProjects = () => {
  const projects = [
    {
      id: 'the-river',
      title: 'Căn hộ The River Thủ Thiêm',
      category: 'Chung cư',
      area: '120m²',
      style: 'Scandinavian',
      year: '2023',
      owner: 'Anh Minh',
      cost: 'Liên hệ',
      description: 'Dự án The River là câu chuyện về việc kiến tạo một không gian sống hiện đại...',
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800', // Ảnh thumb
      cover: [
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2000',
        'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ], // Ảnh bìa to
      gallery: [
        'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800',
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800',
        'https://plus.unsplash.com/premium_photo-1670360414946-e33a828d1d52?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ]
    },
    {
      id: 'vinhomes-riverside',
      title: 'Biệt thự Vinhomes Riverside',
      category: 'Biệt thự',
      area: '350m²',
      style: 'Indochine',
      year: '2024',
      owner: 'Chị Lan',
      cost: 'Liên hệ',
      description: 'Không gian sang trọng mang đậm nét Đông Dương...',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      cover: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=2000',
        'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      gallery: [
        'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800',
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800',
        'https://plus.unsplash.com/premium_photo-1670360414946-e33a828d1d52?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ]
    },
    {
      id: 'techx-office',
      title: 'Văn phòng Công ty TechX',
      category: 'Văn phòng',
      area: '500m²',
      style: 'Industrial',
      year: '2023',
      owner: 'TechX Corp',
      cost: 'Liên hệ',
      description: 'Văn phòng mở khơi nguồn sáng tạo...',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      cover: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=2000',
        'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ],
      gallery: [
        'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800',
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800',
        'https://plus.unsplash.com/premium_photo-1670360414946-e33a828d1d52?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      ]
    },
    // Thêm các dự án khác tương tự...
  ]

  return { projects }
}