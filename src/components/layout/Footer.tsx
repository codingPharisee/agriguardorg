
import React from "react";
import { Leaf, Mail, Phone, MapPin, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-900 to-green-800 border-t border-green-700 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-500 text-white px-3 py-2 font-bold">
                <div className="flex flex-col items-center">
                  <Leaf className="h-5 w-5 mb-1" />
                  <span className="text-sm">AgriGuard</span>
                </div>
              </div>
            </div>
            <p className="text-green-200 text-sm leading-relaxed mb-4">
              Combating agricultural misinformation with AI technology to build 
              a more informed and prosperous farming community.
            </p>
            <div className="text-green-300 text-xs">
              &copy; {new Date().getFullYear()} AgriGuard Technological Solutions
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-green-100 font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-green-400 mt-1" />
                <div className="text-green-200 text-sm">
                  <p>info@agriguard.com</p>
                  <p>support@agriguard.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-green-400 mt-1" />
                <div className="text-green-200 text-sm">
                  <p>+254 799330345</p>
                  <p>+254 794920532</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-green-100 font-semibold mb-4">Address</h3>
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-green-400 mt-1" />
               <div className="text-green-200 text-sm">
                <p>Agri-Tech Plaza, Westlands</p>
                <p>Nairobi, 00100</p>
                <p>Kenya</p>
               </div>
            </div>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-green-100 font-semibold mb-4">Business Hours</h3>
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-green-400 mt-1" />
              <div className="text-green-200 text-sm space-y-1">
                <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                <p>Saturday: 9:00 AM - 4:00 PM</p>
                <p>Sunday: Closed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="border-t border-green-700 pt-8 mb-8">
          <h3 className="text-green-100 font-semibold mb-4 text-center">Our Services</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="text-green-200 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full mx-auto mb-2"></div>
              GMO fact-checking and verification
            </div>
            <div className="text-green-200 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full mx-auto mb-2"></div>
              Agricultural misinformation monitoring
            </div>
            <div className="text-green-200 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full mx-auto mb-2"></div>
              Educational content creation
            </div>
            <div className="text-green-200 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full mx-auto mb-2"></div>
              Farmer support and consultation
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-green-800/50 rounded-lg p-4 text-center">
          <p className="text-sm text-green-200 font-medium">
            📞 For urgent agricultural misinformation alerts, 
            call our 24/7 hotline: <span className="text-green-300 font-bold">+254 799330345</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
