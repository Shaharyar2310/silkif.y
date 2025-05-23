import { Link } from "wouter";

interface MobileHeaderProps {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export default function MobileHeader({ isMenuOpen, toggleMenu }: MobileHeaderProps) {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 text-gray-800 dark:text-white p-4 flex justify-between items-center z-30 md:hidden shadow-md">
        <Link href="/">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Silkify</span>
        </Link>
        <button 
          className="text-2xl text-gray-700 dark:text-gray-200" 
          aria-label="Toggle menu"
          onClick={toggleMenu}
        >
          ☰
        </button>
      </div>
      
      <div
        id="mobileMenu"
        className={`fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg z-20 transition-transform duration-300 md:hidden border-t border-gray-200 dark:border-gray-800 ${
          isMenuOpen ? "transform-none" : "transform translate-y-[-100%]"
        }`}
      >
        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
              Navigation
            </h3>
            <ul className="space-y-1">
              <li>
                <Link href="/">
                  <span className="block py-2 px-3 rounded-md text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <span className="block py-2 px-3 rounded-md text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition">About</span>
                </Link>
              </li>
              <li>
                <Link href="/pricing">
                  <span className="block py-2 px-3 rounded-md text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition">Pricing</span>
                </Link>
              </li>
              <li>
                <Link href="/settings">
                  <span className="block py-2 px-3 rounded-md text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition">Settings</span>
                </Link>
              </li>
              <li>
                <Link href="/login">
                  <span className="block py-2 px-3 rounded-md text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition">Login</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-1 mb-2">
              AI Tools
            </h3>
            <ul className="space-y-1">
              <li>
                <Link href="/style-transfer">
                  <span className="block py-2 px-3 rounded-md text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition">Style Transfer</span>
                </Link>
              </li>
              <li>
                <Link href="/image-enhancer">
                  <span className="block py-2 px-3 rounded-md text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition">Image Enhancer</span>
                </Link>
              </li>
              <li>
                <Link href="/prompt-generator">
                  <span className="block py-2 px-3 rounded-md text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition">AI Image Generator</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
