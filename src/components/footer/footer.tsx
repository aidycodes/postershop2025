import Link from 'next/link';


export const LINKS = [{
  label:"New Arrivals",
  href:"/new-arrivals"
},
{
  label:"Categories",
  href:"/categories"
},
{
  label:"Best Sellers",
  href:"/best-sellers"
},
{
  label:"About",
  href:"/about"
},
]

const Footer = ({blurb, storeName, infoPages}: {blurb: string, storeName: string, infoPages: string[]}) => {
    return (
        <footer className="bg-gray-900 text-white py-12">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">{storeName}</h4>
              <p className="text-gray-400">{blurb}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Customer Service</h4>

              <ul className="space-y-2 text-gray-400 flex flex-col ">
                {infoPages.map((page) => (
                  <Link href={`/${page}`} key={page} className="hover:text-white transition-colors duration-300">{page}</Link>
                ))}
              </ul>
            </div>

            <div>

              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 flex flex-col">
                {LINKS.map((link) => (
                  <Link href={`/${link.label.toLowerCase().replace(" ", "-")}`} key={link.href} className="hover:text-white transition-colors duration-300">{link.label}</Link>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </footer>
    )
}   

export default Footer;
