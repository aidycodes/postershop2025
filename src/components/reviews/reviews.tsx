import { Star } from "lucide-react"

const Reviews = () => {
    return (
        <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold mb-4">What Our Customers Say</h3>
            <p className="text-gray-600">Join thousands of satisfied customers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                rating: 5,
                comment: "Excellent quality prints and fast shipping. The colors are vibrant and exactly as shown online.",
                location: "New York, USA"
              },
              {
                name: "James L.",
                rating: 5,
                comment: "Great selection of unique designs. Customer service was incredibly helpful when I needed to exchange sizes.",
                location: "London, UK"
              },
              {
                name: "Maria R.",
                rating: 5,
                comment: "Beautiful posters that transformed my living room. The paper quality is outstanding.",
                location: "Toronto, Canada"
              }
            ].map((review) => (
              <div key={review.name} className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">"{review.comment}"</p>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{review.name}</span>
                  <span className="text-sm text-gray-500">{review.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
}

export default Reviews;
