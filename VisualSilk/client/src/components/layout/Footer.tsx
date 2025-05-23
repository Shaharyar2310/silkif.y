import { Link } from "wouter";
import { Github, Twitter, Instagram, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 px-6 mt-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">Silkify</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Transform your images with the power of AI. Create stunning artwork in seconds.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-3 text-gray-900 dark:text-white">Features</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/style-transfer" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
                  Style Transfer
                </Link>
              </li>
              <li>
                <Link href="/image-enhancer" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
                  Image Enhancer
                </Link>
              </li>
              <li>
                <Link href="/prompt-generator" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
                  Prompt Generator
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-3 text-gray-900 dark:text-white">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-base font-medium mb-3 text-gray-900 dark:text-white">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            © {currentYear} Silkify. All rights reserved.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 sm:mt-0 flex items-center">
            Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> by Silkify Team
          </p>
        </div>
      </div>
    </footer>
  );
}