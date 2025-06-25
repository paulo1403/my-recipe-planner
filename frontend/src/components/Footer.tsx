import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Github, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">RP</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Recipe Planner</span>
            </div>
            <p className="text-gray-600 text-sm max-w-md">
              Simplify your meal planning with our intuitive recipe management system. 
              Plan, cook, and enjoy delicious meals with ease.
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@recipeplanner.com"
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Features
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/recipes" className="text-gray-600 hover:text-gray-900 text-sm">
                  Recipe Management
                </Link>
              </li>
              <li>
                <Link to="/meal-plans" className="text-gray-600 hover:text-gray-900 text-sm">
                  Meal Planning
                </Link>
              </li>
              <li>
                <Link to="/shopping-list" className="text-gray-600 hover:text-gray-900 text-sm">
                  Shopping Lists
                </Link>
              </li>
              <li>
                <span className="text-gray-600 text-sm">Nutrition Tracking</span>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm flex items-center">
              © {currentYear} Recipe Planner. Made with 
              <Heart className="w-4 h-4 text-red-500 mx-1" /> 
              for food lovers.
            </p>
            <p className="text-gray-500 text-sm mt-2 md:mt-0">
              Version 1.0.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
