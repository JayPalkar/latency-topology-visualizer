import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 relative z-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">Latency Topology Visualizer</h3>
            <p className="text-gray-400 mt-1">
              Real-time monitoring of cryptocurrency exchange infrastructure
            </p>
          </div>

          <div className="flex space-x-6">
            <div>
              <h4 className="font-semibold">Resources</h4>
              <ul className="mt-2 space-y-1 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API Reference
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold">Legal</h4>
              <ul className="mt-2 space-y-1 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Latency Topology Visualizer. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
