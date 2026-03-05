import Footer from '@/components/home/footer'
import Navbar from '@/components/home/navbar'
import TopBar from '@/components/home/top-header'
import { Head } from '@inertiajs/react'

export default function MainLayout({children}:any) {
  return (
    <>
      <Head title="Shopella — Shop Smart, Live Better">
                <meta name="description" content="Discover the best deals on fashion, electronics, home & living, and more at Shopella. Premium products at unbeatable prices." />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
            </Head>

            <div className="font-[Inter,sans-serif] bg-white min-h-screen">
                <TopBar />
                <Navbar />
                <main>
                    {children}
                </main>
                <Footer />
            </div>
        </>
  )
}
