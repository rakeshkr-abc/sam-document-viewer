import Logo from '../assets/logo.webp' // Adjust path as needed

const Navbar = () => {
  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50 h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            {/* ⭐ CUSTOM WEBP LOGO */}
            <div className="w-20 h-20 rounded-xl shadow-lg overflow-hidden flex-shrink-0">
              <img 
                src={Logo} 
                alt="ABC Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              
            </span>
          </div>
          
          <div className="flex-1 max-w-xs mx-8">
            <h1 className="text-xl font-semibold text-gray-800 text-center">
              SAM 4.0 Document Viewer
            </h1>
          </div>
          
          <div className="w-24"></div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
