import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">FS GoGlobal</h3>
            <p className="text-sm text-gray-600">
              Create beautiful email templates with our intuitive design tools.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Templates</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="https://greatleads.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Product Launch</a></li>
              <li><a href="https://greatleads.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Newsletter</a></li>
              <li><a href="https://greatleads.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Onboarding</a></li>
              <li><a href="https://greatleads.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Promotional</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Tools</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="https://greatleads.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Business Canvas</a></li>
              <li><a href="https://greatleads.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Email Builder</a></li>
              <li><a href="https://greatleads.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Analytics</a></li>
              <li><a href="https://greatleads.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">A/B Testing</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="https://greatleads.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Documentation</a></li>
              <li><a href="https://greatleads.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Help Center</a></li>
              <li><a href="https://greatleads.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Contact Us</a></li>
              <li><a href="https://greatleads.io" target="_blank" rel="noopener noreferrer" className="hover:text-amber-700">Community</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-500">
          © 2024 FS GoGlobal. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer; 

