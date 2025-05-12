
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Leaf, MessageSquare, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="inline-flex items-center justify-center bg-primary/10 p-5 rounded-full mb-6">
              <Info className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About AgriGuard</h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Protecting agricultural information integrity through fact-checking and misinformation detection.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  AgriGuard is dedicated to promoting accuracy in agricultural information. We fight misinformation through a combination of expert analysis, technological tools, and community engagement. Our goal is to ensure farmers, policymakers, and the public have access to reliable agricultural information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Our Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li><strong>Fact Check:</strong> Verify agricultural claims and information accuracy.</li>
                  <li><strong>ViralFarm:</strong> Track and analyze trending agricultural content.</li>
                  <li><strong>MythBuster Ag:</strong> Debunk common agricultural myths and misconceptions.</li>
                  <li><strong>Integrated Ecosystem:</strong> Connect with reliable agricultural information sources.</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-12">
            <CardHeader>
              <CardTitle>How We Work</CardTitle>
              <CardDescription>Our approach to maintaining information integrity</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                AgriGuard employs a rigorous verification process that combines human expertise with advanced technology:
              </p>
              <ol className="list-decimal pl-5 space-y-3 text-gray-700">
                <li>
                  <strong>Content Monitoring:</strong> We continuously scan agricultural news, social media, and information sources to identify trending topics and potential misinformation.
                </li>
                <li>
                  <strong>Expert Analysis:</strong> Our team of agricultural specialists reviews questionable content and conducts thorough research to verify claims.
                </li>
                <li>
                  <strong>Community Input:</strong> We encourage user submissions of content for fact-checking, creating a collaborative environment for information verification.
                </li>
                <li>
                  <strong>Educational Resources:</strong> We provide guides and resources to help the agricultural community identify reliable information sources.
                </li>
              </ol>
            </CardContent>
          </Card>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Join Our Mission</h2>
            <p className="max-w-2xl mx-auto text-gray-700 mb-6">
              Whether you're a farmer, researcher, policymaker, or concerned citizen, you can help promote agricultural information integrity. Submit content for fact-checking, share our verified information, or partner with us in our mission.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
