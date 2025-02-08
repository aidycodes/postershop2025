const Services = () => {
    return (
        <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <h4 className="text-xl font-semibold mb-2">Fast delivery</h4>
              <p className="text-gray-600 mb-4">At your door in a few days</p>
              <div className="flex justify-center space-x-4">
                <img src="/svgs/dhl-express.svg" alt="DHL" className="h-8" />
                <img src="/svgs/ups-united-parcel-service.svg" alt="UPS" className="h-8" />
                <img src="/svgs/fedex-express-6.svg" alt="FedEx" className="h-8" />
              </div>
            </div>
            <div className="text-center p-6">
              <h4 className="text-xl font-semibold mb-2">Secure payments</h4>
              <p className="text-gray-600 mb-4">100% Secure payment with 256-bit SSL Encryption</p>
              <div className="flex justify-center items-center flex-wrap gap-2">
                <img src="/svgs/visa-10.svg" alt="Payment methods" className="h-8" />
                <img src="/svgs/mastercard-4.svg" alt="Payment methods" className="h-16" />
                <img src="/svgs/discover-2.svg" alt="Payment methods" className="h-18" />
                
              </div>
            </div>
            <div className="text-center p-6">
              <h4 className="text-xl font-semibold mb-2">100 days for return</h4>
              <p className="text-gray-600 mb-4">Easy return, no questions asked</p>
              <div className="flex justify-center">
                <img src="/svgs/delivery-logo.svg" alt="Return policy" className="h-18" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
}   

export default Services