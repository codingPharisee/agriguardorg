import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, BookOpen, Users, Target, CheckCircle, XCircle } from "lucide-react";

const AgriculturalMisinformation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Misinformation in Agriculture
            </h1>
            <p className="text-xl text-gray-700 leading-relaxed">
              Separating fact from fiction in agricultural information
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-4xl space-y-12">
          
          {/* Introduction */}
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
                The Challenge of Agricultural Misinformation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Social media is a hotbed of fake news and false claims about a huge range of topics, 
                and agriculture is no exception. Is organic farming better than non-organic farming? 
                Should farmers feed antibiotics and steroids to their animals? Such debates about food 
                and agriculture can result in false information being spread as people try to convince 
                others of the "right" point of view.
              </p>
              <p>
                <strong>What is misinformation?</strong> Misinformation is fake or misleading information 
                which is shared without the intent to deceive.
              </p>
            </CardContent>
          </Card>

          {/* Agricultural Terms */}
          <Card className="border-2 border-gray-200 bg-gradient-to-r from-orange-50 to-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <BookOpen className="h-6 w-6 text-orange-500" />
                Talk Like an Agricultural Scientist
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-2">Agri-food</h4>
                  <p className="text-gray-700">
                    The sector that includes the primary production of food (e.g., crops, livestock), 
                    and the processing, distribution and consumption of food (e.g., rice, bread, milk) 
                    and non-food (e.g., leather, wax) agricultural products.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-2">Agronomist</h4>
                  <p className="text-gray-700">An expert in crop production.</p>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-2">Disinformation</h4>
                  <p className="text-gray-700">
                    False information deliberately shared with the intent to cause harm.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-2">Genetically Modified Crop</h4>
                  <p className="text-gray-700">
                    A plant with DNA that has been scientifically altered.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold text-gray-900 mb-2">Misinformation</h4>
                  <p className="text-gray-700">
                    False information that is believed to be true, shared without the intent to cause harm.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consequences */}
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Users className="h-6 w-6 text-red-500" />
                Consequences of Agri-Food Misinformation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                While misinformation is not intentionally harmful, it can have severe consequences. 
                "Misinformation can create division among people," explains Ataharul. "Polarisation 
                on topics such as climate change and vaccines has damaged public trust in science, 
                which makes it harder for scientists to serve society."
              </p>
              <p>
                "Agri-food misinformation creates anxiety, uncertainty and confusion among farmers 
                and consumers," explains Ataharul. It reduces their ability to make science-based 
                decisions on issues such as the effects of agriculture on the environment and the 
                effects of food on health, which can lead to economic and health losses.
              </p>
              <p>
                Controversial topics such as genetically modified crops, organic farming and animal 
                welfare are commonly surrounded by misinformation. While there are legitimate scientific 
                debates on these topics, both sides use information that they believe to be true to 
                promote their own personal, financial or political interests. However, this information 
                may be false. Misinformation can affect everyone, from farmers who are sold poor quality 
                seeds and fertilisers, to consumers who are led to buy unhealthy or unsustainable foods.
              </p>
            </CardContent>
          </Card>

          {/* Historical Examples */}
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Target className="h-6 w-6 text-purple-500" />
                Examples of Agri-Food Misinformation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-semibold text-gray-900 mb-3">Historical Case: Lysenkoism (1928)</h4>
                <p className="text-gray-700 leading-relaxed">
                  Soviet agronomist Trofim Lysenko claimed that crop yields could be increased by applying 
                  his theory of Lysenkoism, which rejected biological ideas of genetics and evolution. 
                  He believed that plants could be 'educated' to adapt to their environment. The Soviet 
                  Union forcibly promoted Lysenkoism as it aligned with the country's political ideology, 
                  but it had devastating consequences for agriculture. By forcing farmers to plant crops 
                  in unsuitable conditions, crop yields dramatically decreased, leading to a famine that 
                  cost millions of lives.
                </p>
              </div>
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-semibold text-gray-900 mb-3">Historical Case: Chinese Sparrow Campaign (1958)</h4>
                <p className="text-gray-700 leading-relaxed">
                  Chinese farmers were ordered to kill sparrows in the belief that they were eating grain. 
                  However, with the sparrow population decimated, insects had far fewer predators and swarms 
                  of locusts devastated the fields, leading to one of the largest famines in human history.
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-3">Modern Example: Canadian Butter Scandal (2021)</h4>
                <p className="text-gray-700 leading-relaxed">
                  A food blogger claimed that Canadian butter had become harder to spread, suggesting this 
                  was because dairy farmers were adding palm oil supplements to their cow feed. This idea 
                  took off on social media, leading to the 'buttergate' scandal and decreased sales of 
                  Canadian butter, highlighting how easily misinformation can spread in the modern world 
                  and have a significant economic impact.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recognition Guide */}
          <Card className="border-2 border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <CheckCircle className="h-6 w-6 text-green-500" />
                How to Recognize Mis- and Disinformation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                With so much information available online, how can you separate fact from fiction? 
                "The most important thing is to develop a critical mind when consuming information 
                online," advises Ataharul. "In today's digital world, having critical media literacy 
                skills is essential." He suggests the following techniques for evaluating the credibility 
                of online information:
              </p>
              <div className="grid gap-4 mt-6">
                <div className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Who wrote the information?</h4>
                    <p className="text-gray-700">
                      Research the author. Note that anonymous articles may be untrustworthy.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Why did they write it?</h4>
                    <p className="text-gray-700">
                      Think about the author's motives for sharing the information.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">How does it make you feel?</h4>
                    <p className="text-gray-700">
                      If you read something that makes you angry, dig deeper. Disinformation often 
                      deliberately generates strong emotions and divisive opinions.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Who is sharing the information?</h4>
                    <p className="text-gray-700">
                      Genuine stories should be reported by multiple sources. Research the website 
                      where you found the information. Beware of websites with odd domain names.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">What are the other perspectives?</h4>
                    <p className="text-gray-700">
                      Read multiple sources to get different points of view on the topic. Do not 
                      just read articles that agree with your opinion.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mt-6">
                <p className="text-gray-700 font-medium">
                  <strong>Important:</strong> If you suspect that something you read may be mis- or 
                  disinformation, do not engage with it online. If you do, you are only contributing 
                  to spreading fake news.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* About Agricultural Science */}
          <Card className="border-2 border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <BookOpen className="h-6 w-6 text-green-500" />
                About Agricultural Science
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Agricultural scientists are interested in the question of how to improve agriculture, 
                such as how to produce more food for the world's growing population while ensuring 
                environmental sustainability and improving the livelihood of farmers. By incorporating 
                ideas from biology, chemistry, economics, engineering and social science, agricultural 
                scientists are developing better crop varieties, machinery, agricultural methods and 
                food processing techniques. Those who work in agricultural advisory services (also 
                known as agricultural extension) help farmers apply these new developments in real-world 
                farming situations.
              </p>
              <p>
                Agriculture faces many challenges in the 21st century, and agricultural scientists are 
                leading the way in addressing them. Climate change is creating new and increasing 
                difficulties for farmers, such as higher temperatures, increased flooding and changing 
                soil conditions. At the same time, there are major problems around inequality. Small 
                and medium sized farmers, particularly those in developing countries, find it increasingly 
                difficult to compete with large corporations which control access to the latest technological 
                developments.
              </p>
              <p>
                New technology-driven approaches to agriculture could help to address environmental 
                sustainability, but they could also exacerbate the problems of inequality, something 
                which Ataharul is working to prevent. Millions of people around the world rely on 
                agriculture for their livelihoods, and the next generation of agricultural scientists 
                will play a role in helping to alleviate rural poverty and ensure global food security.
              </p>
            </CardContent>
          </Card>

        </div>
      </section>
    </div>
  );
};

export default AgriculturalMisinformation;