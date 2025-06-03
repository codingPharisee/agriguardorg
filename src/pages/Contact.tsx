
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
                Contact AgriGuard Company
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed">
                Get in touch with our team for GMO information, agricultural guidance, 
                or partnership opportunities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-lg p-8 border border-amber-200">
                <h2 className="text-2xl font-bold text-amber-900 mb-6">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-600">info@agriguard.com</p>
                      <p className="text-gray-600">support@agriguard.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                      <p className="text-gray-600">+1 (555) 123-AGRI</p>
                      <p className="text-gray-600">+1 (555) 123-2474</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                      <p className="text-gray-600">
                        123 Agricultural Innovation Drive<br />
                        Farm City, FC 12345<br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                      <p className="text-gray-600">
                        Monday - Friday: 8:00 AM - 6:00 PM<br />
                        Saturday: 9:00 AM - 4:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg shadow-lg p-8 border border-amber-200">
                <h2 className="text-2xl font-bold text-amber-900 mb-6">Our Mission</h2>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  AgriGuard Company is dedicated to providing accurate, science-based information 
                  about GMOs and modern agricultural practices. We work to combat misinformation 
                  and support farmers with reliable knowledge.
                </p>
                
                <h3 className="font-semibold text-amber-800 mb-3">Services Include:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                    GMO fact-checking and verification
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                    Agricultural misinformation monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                    Educational content creation
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                    Farmer support and consultation
                  </li>
                </ul>

                <div className="mt-6 p-4 bg-white rounded-lg border border-amber-300">
                  <p className="text-sm text-amber-800 font-medium">
                    📞 For urgent agricultural misinformation alerts, 
                    call our 24/7 hotline: +1 (555) FACT-NOW
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
