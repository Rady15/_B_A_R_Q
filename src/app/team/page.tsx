'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Linkedin, 
  Twitter, 
  Github, 
  Mail, 
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Coffee,
  Lightbulb
} from 'lucide-react'

export default function TeamPage() {
  const { t, dir } = useLanguage()
  const [selectedMember, setSelectedMember] = useState<string | null>(null)

  const teamMembers = [
    {
      id: 'ahmed-hassan',
      name: t.language === 'en' ? 'Ahmed Hassan' : 'أحمد حسن',
      position: t.language === 'en' ? 'CEO & Founder' : 'الرئيس التنفيذي والمؤسس',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      bio: t.language === 'en'
        ? 'Visionary leader with 15+ years of experience in AI and technology innovation. Passionate about transforming businesses through cutting-edge solutions.'
        : 'قائد رؤيدي بخبرة 15+ عاماً في الذكاء الاصطناعي وابتكار التكنولوجيا. شغوف بتحويل الشركات من خلال الحلول المتطورة.',
      expertise: [
        t.language === 'en' ? 'AI Strategy' : 'استراتيجية الذكاء الاصطناعي',
        t.language === 'en' ? 'Business Transformation' : 'تحويل الأعمال',
        t.language === 'en' ? 'Innovation Management' : 'إدارة الابتكار'
      ],
      education: t.language === 'en' 
        ? 'MBA, Stanford University' 
        : 'ماجستير إدارة الأعمال، جامعة ستانفورد',
      experience: t.language === 'en'
        ? 'Former CTO at TechCorp, AI Research Lead at GlobalTech'
        : 'رئيس تقني سابق في TechCorp، رئيس أبحاث الذكاء الاصطناعي في GlobalTech',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#',
        email: 'ahmed@barqtech.com'
      }
    },
    {
      id: 'sarah-mohamed',
      name: t.language === 'en' ? 'Sarah Mohamed' : 'سارة محمد',
      position: t.language === 'en' ? 'CTO & Co-Founder' : 'الرئيسة التقنية والمؤسسة المشاركة',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      bio: t.language === 'en'
        ? 'Tech architect specializing in scalable cloud solutions and machine learning systems. Committed to building robust, innovative technology infrastructure.'
        : 'مهندسة معمارية تقنية متخصصة في الحلول السحابية القابلة للتطوير وأنظمة تعلم الآلة. ملتزمة ببناء بنية تحتية تقنية قوية ومبتكرة.',
      expertise: [
        t.language === 'en' ? 'Cloud Architecture' : 'البنية التحتية السحابية',
        t.language === 'en' ? 'Machine Learning' : 'تعلم الآلة',
        t.language === 'en' ? 'System Design' : 'تصميم الأنظمة'
      ],
      education: t.language === 'en'
        ? 'MSc Computer Science, MIT'
        : 'ماجستير علوم الحاسب، معهد ماساتشوستس للتكنولوجيا',
      experience: t.language === 'en'
        ? 'Former Senior Cloud Architect at AWS, ML Engineer at Google'
        : 'مهندسة معمارية سحابية أولى سابقة في AWS، مهندسة تعلم الآلة في جوجل',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#',
        email: 'sarah@barqtech.com'
      }
    },
    {
      id: 'khalid-ali',
      name: t.language === 'en' ? 'Khalid Ali' : 'خالد علي',
      position: t.language === 'en' ? 'Head of AI Research' : 'رئيس أبحاث الذكاء الاصطناعي',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      bio: t.language === 'en'
        ? 'AI researcher with expertise in deep learning and natural language processing. Published author with numerous papers in top-tier conferences.'
        : 'باحث في الذكاء الاصطناعي بخبرة في التعلم العميق ومعالجة اللغات الطبيعية. مؤلف منشور مع العديد من الأوراق في المؤتمرات المرموقة.',
      expertise: [
        t.language === 'en' ? 'Deep Learning' : 'التعلم العميق',
        t.language === 'en' ? 'NLP' : 'معالجة اللغات الطبيعية',
        t.language === 'en' ? 'Computer Vision' : 'الرؤية الحاسوبية'
      ],
      education: t.language === 'en'
        ? 'PhD AI, Carnegie Mellon University'
        : 'دكتوراه في الذكاء الاصطناعي، جامعة كارنيجي ميلون',
      experience: t.language === 'en'
        ? 'Former Research Scientist at OpenAI, AI Lead at Microsoft Research'
        : 'عالم أبحاث سابق في OpenAI، رئيس الذكاء الاصطناعي في Microsoft Research',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#',
        email: 'khalid@barqtech.com'
      }
    },
    {
      id: 'mona-ahmed',
      name: t.language === 'en' ? 'Mona Ahmed' : 'منى أحمد',
      position: t.language === 'en' ? 'Head of Design' : 'رئيسة قسم التصميم',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      bio: t.language === 'en'
        ? 'Creative designer passionate about user experience and interface design. Expert in creating intuitive, beautiful digital experiences.'
        : 'مصممة مبدعة شغوفة بتجربة المستخدم وتصميم الواجهات. خبيرة في خلق تجارب رقمية بديهية وجميلة.',
      expertise: [
        t.language === 'en' ? 'UX/UI Design' : 'تصميم تجربة وواجهة المستخدم',
        t.language === 'en' ? 'Product Design' : 'تصميم المنتجات',
        t.language === 'en' ? 'Design Systems' : 'أنظمة التصميم'
      ],
      education: t.language === 'en'
        ? 'BFA Design, Parsons School of Design'
        : 'بكالوريوس الفنون الجميلة في التصميم، كلية بارسون للتصميم',
      experience: t.language === 'en'
        ? 'Former Lead Designer at Adobe, Senior UX Designer at Apple'
        : 'مصممة رئيسية سابقة في Adobe، مصممة تجربة مستخدم أولى في Apple',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#',
        email: 'mona@barqtech.com'
      }
    },
    {
      id: 'omar-khaled',
      name: t.language === 'en' ? 'Omar Khaled' : 'عمر خالد',
      position: t.language === 'en' ? 'Head of Engineering' : 'رئيس قسم الهندسة',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      bio: t.language === 'en'
        ? 'Full-stack engineer with expertise in building scalable web applications. Passionate about clean code and agile methodologies.'
        : 'مهندس full-stack بخبرة في بناء تطبيقات الويب القابلة للتطوير. شغوف بالكود النظيف ومنهجيات Agile.',
      expertise: [
        t.language === 'en' ? 'Full-Stack Development' : 'تطوير Full-Stack',
        t.language === 'en' ? 'DevOps' : 'DevOps',
        t.language === 'en' ? 'Agile Methodologies' : 'منهجيات Agile'
      ],
      education: t.language === 'en'
        ? 'BSc Computer Engineering, University of Cambridge'
        : 'بكالوريوس هندسة الحاسب، جامعة كامبريدج',
      experience: t.language === 'en'
        ? 'Former Senior Engineer at Facebook, Tech Lead at Netflix'
        : 'مهندس أول سابق في Facebook، قائد تقني في Netflix',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#',
        email: 'omar@barqtech.com'
      }
    },
    {
      id: 'fatima-youssef',
      name: t.language === 'en' ? 'Fatima Youssef' : 'فاطمة يوسف',
      position: t.language === 'en' ? 'Head of Marketing' : 'رئيسة قسم التسويق',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      bio: t.language === 'en'
        ? 'Marketing strategist with expertise in digital marketing and brand development. Expert in creating compelling brand stories and growth strategies.'
        : 'استراتيجية تسويق بخبرة في التسويق الرقمي وتطوير العلامات التجارية. خبيرة في خلق قصص علامات تجارية مقنعة واستراتيجيات النمو.',
      expertise: [
        t.language === 'en' ? 'Digital Marketing' : 'التسويق الرقمي',
        t.language === 'en' ? 'Brand Strategy' : 'استراتيجية العلامة التجارية',
        t.language === 'en' ? 'Growth Hacking' : 'Growth Hacking'
      ],
      education: t.language === 'en'
        ? 'MBA Marketing, Harvard Business School'
        : 'ماجستير إدارة الأعمال في التسويق، كلية هارفارد للأعمال',
      experience: t.language === 'en'
        ? 'Former CMO at StartupHub, Marketing Director at TechCorp'
        : 'رئيسة تسويق سابقة في StartupHub، مديرة تسويق في TechCorp',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#',
        email: 'fatima@barqtech.com'
      }
    }
  ]

  const departments = [
    {
      name: t.language === 'en' ? 'Leadership' : 'القيادة',
      members: teamMembers.filter(m => ['ahmed-hassan', 'sarah-mohamed'].includes(m.id))
    },
    {
      name: t.language === 'en' ? 'Technology' : 'التكنولوجيا',
      members: teamMembers.filter(m => ['khalid-ali', 'omar-khaled'].includes(m.id))
    },
    {
      name: t.language === 'en' ? 'Creative & Marketing' : 'الإبداع والتسويق',
      members: teamMembers.filter(m => ['mona-ahmed', 'fatima-youssef'].includes(m.id))
    }
  ]

  return (
    <div className="min-h-screen py-20 px-4" dir={dir}>
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {t.language === 'en' ? 'Meet Our Team' : 'تعرف على فريقنا'}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t.language === 'en'
              ? 'The brilliant minds behind Barq Tech\'s innovation and success.'
              : 'العقول المبدعة وراء ابتكار نجاح بارق تك.'}
          </p>
        </section>

        {/* Team Stats */}
        <section className="mb-16">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-muted-foreground">
                  {t.language === 'en' ? 'Team Members' : 'أعضاء الفريق'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">15+</div>
                <div className="text-muted-foreground">
                  {t.language === 'en' ? 'Nationalities' : 'جنسيات'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">100+</div>
                <div className="text-muted-foreground">
                  {t.language === 'en' ? 'Projects Completed' : 'مشاريع مكتملة'}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">10+</div>
                <div className="text-muted-foreground">
                  {t.language === 'en' ? 'Years Experience' : 'سنوات خبرة'}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Team Tabs */}
        <section className="mb-16">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                {t.language === 'en' ? 'All Members' : 'جميع الأعضاء'}
              </TabsTrigger>
              {departments.map((dept) => (
                <TabsTrigger key={dept.name} value={dept.name}>
                  {dept.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="mt-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {teamMembers.map((member) => (
                  <TeamMemberCard 
                    key={member.id} 
                    member={member} 
                    isSelected={selectedMember === member.id}
                    onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
                  />
                ))}
              </div>
            </TabsContent>

            {departments.map((dept) => (
              <TabsContent key={dept.name} value={dept.name} className="mt-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {dept.members.map((member) => (
                    <TeamMemberCard 
                      key={member.id} 
                      member={member} 
                      isSelected={selectedMember === member.id}
                      onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Culture Section */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold text-center mb-8">
                {t.language === 'en' ? 'Our Culture' : 'ثقافتنا'}
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Coffee className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {t.language === 'en' ? 'Collaboration' : 'التعاون'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t.language === 'en'
                      ? 'We believe in the power of teamwork and open communication.'
                      : 'نؤمن بقوة العمل الجماعي والتواصل المفتوح.'}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {t.language === 'en' ? 'Innovation' : 'الابتكار'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t.language === 'en'
                      ? 'We encourage creative thinking and bold ideas.'
                      : 'نشجع التفكير الإبداعي والأفكار الجريئة.'}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {t.language === 'en' ? 'Excellence' : 'التميز'}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t.language === 'en'
                      ? 'We strive for excellence in everything we do.'
                      : 'نسعى للتميز في كل ما نقوم به.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Join Us Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            {t.language === 'en' ? 'Join Our Team' : 'انضم إلى فريقنا'}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {t.language === 'en'
              ? 'We\'re always looking for talented individuals to join our growing team.'
              : 'نحن دائماً نبحث عن المواهب المتميزة للانضمام إلى فريقنا المتنامي.'}
          </p>
          <Button size="lg" className="px-8">
            {t.language === 'en' ? 'View Open Positions' : 'عرض الوظائف الشاغرة'}
          </Button>
        </section>
      </div>
    </div>
  )
}

function TeamMemberCard({ member, isSelected, onClick }: { 
  member: any, 
  isSelected: boolean, 
  onClick: () => void 
}) {
  const { t, dir } = useLanguage()

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
        isSelected ? 'ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
    >
      <CardHeader className="text-center">
        <div className="relative mx-auto w-32 h-32 mb-4">
          <img 
            src={member.image} 
            alt={member.name}
            className="w-full h-full rounded-full object-cover"
          />
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-white" />
          </div>
        </div>
        <CardTitle className="text-xl">{member.name}</CardTitle>
        <p className="text-primary font-medium">{member.position}</p>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {member.bio}
        </p>
        
        {isSelected && (
          <div className="space-y-4 animate-in slide-in-from-top-2">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Award className="h-4 w-4" />
                {t.language === 'en' ? 'Expertise:' : 'الخبرة:'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {member.expertise.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                {t.language === 'en' ? 'Education:' : 'التعليم:'}
              </h4>
              <p className="text-sm text-muted-foreground">{member.education}</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                {t.language === 'en' ? 'Experience:' : 'الخبرة:'}
              </h4>
              <p className="text-sm text-muted-foreground">{member.experience}</p>
            </div>
            
            <div className="flex justify-center gap-2 pt-2">
              <a href={member.social.linkedin} className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href={member.social.twitter} className="text-muted-foreground hover:text-primary">
                <Twitter className="h-4 w-4" />
              </a>
              <a href={member.social.github} className="text-muted-foreground hover:text-primary">
                <Github className="h-4 w-4" />
              </a>
              <a href={`mailto:${member.social.email}`} className="text-muted-foreground hover:text-primary">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}
        
        {!isSelected && (
          <div className="flex justify-center gap-2 pt-2">
            <a href={member.social.linkedin} className="text-muted-foreground hover:text-primary">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href={member.social.twitter} className="text-muted-foreground hover:text-primary">
              <Twitter className="h-4 w-4" />
            </a>
            <a href={member.social.github} className="text-muted-foreground hover:text-primary">
              <Github className="h-4 w-4" />
            </a>
            <a href={`mailto:${member.social.email}`} className="text-muted-foreground hover:text-primary">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  )
}