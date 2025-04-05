import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ResumeTab() {
  return (
    <div className="space-y-8">
      {/* Skills */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Technologies</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-zinc-900">
            JavaScript
          </Badge>
          <Badge variant="outline" className="bg-zinc-900">
            TypeScript
          </Badge>
          <Badge variant="outline" className="bg-zinc-900">
            Java
          </Badge>
          <Badge variant="outline" className="bg-zinc-900">
            Swift
          </Badge>
          <Badge variant="outline" className="bg-zinc-900">
            React Native
          </Badge>
          <Badge variant="outline" className="bg-zinc-900">
            Expo
          </Badge>
          <Badge variant="outline" className="bg-zinc-900">
            Redux
          </Badge>
          <Badge variant="outline" className="bg-zinc-900">
            Firebase
          </Badge>
          <Badge variant="outline" className="bg-zinc-900">
            Git
          </Badge>
          <Badge variant="outline" className="bg-zinc-900">
            React Query
          </Badge>
          <Badge variant="outline" className="bg-zinc-900">
            Zustand
          </Badge>
          <Badge variant="outline" className="bg-zinc-900">
            Jest
          </Badge>
          <Badge variant="outline" className="bg-zinc-900">
            Maestro
          </Badge>
        </div>
      </section>

      {/* Experience */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Experience</h2>
        <div className="space-y-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Software Engineer / Tech Lead</CardTitle>
                  <CardDescription>Optimum Futurist, Thapagaun</CardDescription>
                </div>
                <span className="text-sm text-zinc-400">Jul 2021–Present</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
                <li>Developed household service app with React Native, TypeScript & Maestro testing</li>
                <li>Built influencer app with social media integrations (Facebook, TikTok, LinkedIn, Twitter)</li>
                <li>Led engineering efforts across multiple projects as team lead</li>
                <li>Mentored 10+ interns in frontend, backend, design, and QA</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>React Native Developer</CardTitle>
                  <CardDescription>eDigital Nepal, Tinkune</CardDescription>
                </div>
                <span className="text-sm text-zinc-400">Sep 2020–Mar 2021</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
                <li>Developed school management apps for students, parents, and teachers</li>
                <li>Created online examination modules with Zoom integration</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>React Native Developer</CardTitle>
                  <CardDescription>SRBN Media Pvt Ltd, New Baneshwor</CardDescription>
                </div>
                <span className="text-sm text-zinc-400">Sep 2019–Aug 2020</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-sm text-zinc-300 space-y-1">
                <li>Developed video streaming and quiz game apps including "The Leader Show" and "KBC"</li>
                <li>Integrated payment systems (Esewa, Khalti)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Projects */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>iMartNepal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-300">
                E-commerce platform for Nepali craftsmen to showcase handmade crafts, supporting HelpMyStudy Nepal and
                fostering economic growth.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle>Digital Nepal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-300">
                Education sector digitalization project that successfully transformed 700+ schools/colleges nationwide.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Education */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Education</h2>
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div>
                <p className="font-medium">B.Sc. CSIT</p>
                <p className="text-sm text-zinc-400">Asian School of Management and Technology (T.U Affiliated)</p>
              </div>
              <div>
                <p className="font-medium">+2 Science</p>
                <p className="text-sm text-zinc-400">Global Collegiate School (Pokhara)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

