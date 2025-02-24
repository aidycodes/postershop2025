const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
   
      <div className="relative h-64 md:h-96">
        <img 
          src="/general/posterstore.webp" 
          alt="Poster shop workspace" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-900 via-red-800 to-pink-800 opacity-70 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl text-white font-bold">About PrintPerfect</h1>
        </div>
      </div>

   
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
  
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
          <div className="h-64 md:h-auto">
            <img 
              src="/general/posters1.webp" 
              alt="Printing process" 
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Quality First</h3>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Sustainable Practices</h3>
            <p className="text-gray-600">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Service</h3>
            <p className="text-gray-600">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
        </div>


        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Meet Our Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((member) => (
              <div key={member} className="space-y-4">
                <img 
                  src={`/general/avatar.jpg`} 
                  alt={`Team member ${member}`}
                  className="w-full rounded-full"
                />
                <h3 className="font-medium text-gray-900">Team Member {member}</h3>
                <p className="text-gray-600 text-sm">Position {member}</p>
              </div>
            ))}
          </div>
        </div>


        <div className="bg-gradient-to-r from-white to-slate-50 from-30% p-8 rounded-lg shadow-md mx-auto flex flex-col">
  <h2 className="text-3xl font-bold text-gray-600 mb-8 text-left">Visit Our Studio</h2>
  
  <div className="flex">
    <div className="w-full md:w-1/3 flex items-center justify-center">
      <div className="space-y-6 md:text-lg">
        <p className="text-gray-600">
          123 Poster Street<br />
          Design District<br />
          Creative City, CC 12345
        </p>
        <p className="text-gray-600">
          Monday - Friday: 9am - 6pm<br />
          Saturday: 10am - 4pm<br />
          Sunday: Closed
        </p>
        <p className="text-gray-600">
          Phone: 019283 838478<br />
          Email: hello@printperfect.com
        </p>
      </div>
    </div>
    
    <div className="   md:block aspect-video w-full md:w-2/3">
      <img 
        src="/general/posterstore.webp" 
        alt="Our studio" 
        className="w-full h-full object-cover rounded-lg"
      />
    </div>
  </div>
</div>
      </div>
    </div>
  );
};

export default AboutPage;