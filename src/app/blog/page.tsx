'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Calendar, Clock, User, Search, ArrowRight, Heart, MessageCircle, Share2 } from 'lucide-react'

export default function BlogPage() {
  const { t, dir } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: t.language === 'en' ? 'All Posts' : 'جميع المقالات' },
    { id: 'ai', name: t.language === 'en' ? 'AI & ML' : 'الذكاء الاصطناعي' },
    { id: 'tech', name: t.language === 'en' ? 'Technology' : 'التكنولوجيا' },
    { id: 'business', name: t.language === 'en' ? 'Business' : 'الأعمال' },
    { id: 'tutorials', name: t.language === 'en' ? 'Tutorials' : 'الدروس'}
  ]

  const blogPosts = [
    {
      id: 1,
      title: t.language === 'en' 
        ? 'The Future of AI in Business: Trends to Watch in 2024' 
        : 'مستقبل الذكاء الاصطناعي في الأعمال: اتجاهات يجب مراقبتها في 2024',
      excerpt: t.language === 'en'
        ? 'Explore the latest AI trends that are reshaping industries and creating new opportunities for businesses worldwide.'
        : 'استكشف أحدث اتجاهات الذكاء الاصطناعي التي تعيد تشكيل الصناعات وتخلق فرصاً جديدة للشركات في جميع أنحاء العالم.',
      content: t.language === 'en'
        ? 'Artificial Intelligence is no longer a futuristic concept but a present reality that\'s transforming how businesses operate...'
        : 'الذكاء الاصطناعي لم يعد مفهوماً مستقبلياً بل هو حاضر حقيقي يحول طريقة عمل الشركات...',
      category: 'ai',
      author: t.language === 'en' ? 'Ahmed Hassan' : 'أحمد حسن',
      date: t.language === 'en' ? 'March 15, 2024' : '15 مارس، 2024',
      readTime: t.language === 'en' ? '5 min read' : '5 دقائق قراءة',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      likes: 42,
      comments: 8
    },
    {
      id: 2,
      title: t.language === 'en'
        ? 'Building Scalable Cloud Architecture: Best Practices'
        : 'بناء بنية تحتية سحابية قابلة للتطوير: أفضل الممارسات',
      excerpt: t.language === 'en'
        ? 'Learn how to design and implement cloud architectures that can grow with your business needs.'
        : 'تعلم كيفية تصميم وتنفيذ البنى التحتية السحابية التي يمكن أن تنمو مع احتياجات عملك.',
      content: t.language === 'en'
        ? 'Cloud architecture is the foundation of modern digital infrastructure...'
        : 'البنية التحتية السحابية هي أساس البنية التحتية الرقمية الحديثة...',
      category: 'tech',
      author: t.language === 'en' ? 'Sarah Mohamed' : 'سارة محمد',
      date: t.language === 'en' ? 'March 12, 2024' : '12 مارس، 2024',
      readTime: t.language === 'en' ? '8 min read' : '8 دقائق قراءة',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      likes: 35,
      comments: 12
    },
    {
      id: 3,
      title: t.language === 'en'
        ? 'Digital Transformation: A Complete Guide for SMEs'
        : 'التحول الرقمي: دليل شامل للشركات الصغيرة والمتوسطة',
      excerpt: t.language === 'en'
        ? 'A comprehensive guide to help small and medium enterprises navigate their digital transformation journey.'
        : 'دليل شامل لمساعدة الشركات الصغيرة والمتوسطة على التنقل في رحلة التحول الرقمي.',
      content: t.language === 'en'
        ? 'Digital transformation is no longer optional for businesses that want to stay competitive...'
        : 'التحول الرقمي لم يعد خياراً للشركات التي تريد البقاء تنافسية...',
      category: 'business',
      author: t.language === 'en' ? 'Khalid Ali' : 'خالد علي',
      date: t.language === 'en' ? 'March 10, 2024' : '10 مارس، 2024',
      readTime: t.language === 'en' ? '6 min read' : '6 دقائق قراءة',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      likes: 28,
      comments: 5
    },
    {
      id: 4,
      title: t.language === 'en'
        ? 'Getting Started with Machine Learning: A Beginner\'s Guide'
        : 'البدء في تعلم الآلة: دليل المبتدئين',
      excerpt: t.language === 'en'
        ? 'Everything you need to know to start your journey into machine learning and AI.'
        : 'كل ما تحتاج لمعرفته لبدء رحلتك في تعلم الآلة والذكاء الاصطناعي.',
      content: t.language === 'en'
        ? 'Machine learning can seem intimidating, but with the right approach, anyone can get started...'
        : 'قد يبدو تعلم الآلة مربكاً، ولكن مع النهج الصحيح، يمكن لأي شخص البدء...',
      category: 'tutorials',
      author: t.language === 'en' ? 'Mona Ahmed' : 'منى أحمد',
      date: t.language === 'en' ? 'March 8, 2024' : '8 مارس، 2024',
      readTime: t.language === 'en' ? '10 min read' : '10 دقائق قراءة',
      image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      likes: 56,
      comments: 18
    },
    {
      id: 5,
      title: t.language === 'en'
        ? 'Cybersecurity Best Practices for Modern Businesses'
        : 'أفضل ممارسات الأمن السيبراني للشركات الحديثة',
      excerpt: t.language === 'en'
        ? 'Essential cybersecurity measures every business should implement to protect their digital assets.'
        : 'إجراءات الأمن السيبراني الأساسية التي يجب على كل شركة تنفيذها لحماية أصولها الرقمية.',
      content: t.language === 'en'
        ? 'In today\'s digital landscape, cybersecurity is more important than ever...'
        : 'في المشهد الرقمي اليوم، أصبح الأمن السيبراني أكثر أهمية من أي وقت مضى...',
      category: 'tech',
      author: t.language === 'en' ? 'Omar Khaled' : 'عمر خالد',
      date: t.language === 'en' ? 'March 5, 2024' : '5 مارس، 2024',
      readTime: t.language === 'en' ? '7 min read' : '7 دقائق قراءة',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      likes: 31,
      comments: 9
    },
    {
      id: 6,
      title: t.language === 'en'
        ? 'The Impact of IoT on Smart Cities Development'
        : 'تأثير إنترنت الأشياء على تطوير المدن الذكية',
      excerpt: t.language === 'en'
        ? 'How IoT technologies are revolutionizing urban infrastructure and creating smarter cities.'
        : 'كيف تُحدث تقنيات إنترنت الأشياء ثورة في البنية التحتية الحضرية وتخلق مدناً أكثر ذكاءً.',
      content: t.language === 'en'
        ? 'The Internet of Things is transforming how cities operate and serve their citizens...'
        : 'إنترنت الأشياء يحول طريقة عمل المدن وخدمتها لمواطنيها...',
      category: 'tech',
      author: t.language === 'en' ? 'Fatima Youssef' : 'فاطمة يوسف',
      date: t.language === 'en' ? 'March 3, 2024' : '3 مارس، 2024',
      readTime: t.language === 'en' ? '9 min read' : '9 دقائق قراءة',
      image: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      likes: 38,
      comments: 11
    }
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredPost = blogPosts[0]

  return (
    <div className="min-h-screen py-20 px-4" dir={dir}>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t.language === 'en' ? 'Our Blog' : 'مدونتنا'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t.language === 'en'
              ? 'Insights, tutorials, and industry news from our team of experts.'
              : 'رؤى، دروس، وأخبار الصناعة من فريق الخبراء لدينا.'}
          </p>
        </section>

        {/* Search and Filter */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder={t.language === 'en' ? 'Search articles...' : 'ابحث في المقالات...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {selectedCategory === 'all' && !searchTerm && (
          <section className="mb-16">
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <Badge variant="secondary" className="mb-4">
                    {t.language === 'en' ? 'Featured' : 'مميز'}
                  </Badge>
                  <h2 className="text-3xl font-bold mb-4">{featuredPost.title}</h2>
                  <p className="text-muted-foreground mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {featuredPost.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  <Button className="group">
                    {t.language === 'en' ? 'Read More' : 'اقرأ المزيد'}
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Blog Posts Grid */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="relative overflow-hidden h-48">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary">
                      {categories.find(cat => cat.id === post.category)?.name}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {post.excerpt}
                  </p>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {post.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </div>
                    </div>
                    
                    <Button size="sm" variant="ghost" className="group">
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">
                {t.language === 'en' ? 'Subscribe to Our Newsletter' : 'اشترك في نشرتنا الإخبارية'}
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                {t.language === 'en'
                  ? 'Get the latest insights and industry news delivered straight to your inbox.'
                  : 'احصل على أحدث الرؤى وأخبار الصناعة مباشرة في صندوق الوارد الخاص بك.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder={t.language === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'}
                  className="flex-1"
                />
                <Button>
                  {t.language === 'en' ? 'Subscribe' : 'اشترك'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Load More */}
        {filteredPosts.length > 6 && (
          <section className="text-center">
            <Button variant="outline" size="lg">
              {t.language === 'en' ? 'Load More Articles' : 'تحميل المزيد من المقالات'}
            </Button>
          </section>
        )}
      </div>
    </div>
  )
}