import { BusFront, ShieldCheck, Clock, CreditCard, ArrowRight, QrCode } from 'lucide-react'

export default function Home(){
  return (
    <div className="space-y-12">
      {/* Hero (no images) */}
      <section className="relative overflow-hidden rounded-2xl border shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500" />
        {/* Decorative icon cluster */}
        <div className="absolute -right-10 -top-10 opacity-20">
          <div className="grid grid-cols-3 gap-6 p-10">
            {[BusFront, QrCode, CreditCard, ShieldCheck, Clock, ArrowRight, BusFront, QrCode, ShieldCheck].map((Icon, i)=>(
              <div key={i} className="h-16 w-16 rounded-xl bg-white/10 flex items-center justify-center">
                <Icon className="h-8 w-8 text-white" />
              </div>
            ))}
          </div>
        </div>

        <div className="relative p-6 sm:p-10">
          <h1 className="text-white text-3xl sm:text-5xl font-semibold leading-tight drop-shadow">
            Your Digital Bus Pass,<br className="hidden sm:block" /> Fast, Secure & Paperless
          </h1>
          <p className="text-white/90 mt-3 sm:mt-4 max-w-2xl">
            Apply, pay, renew and access your pass anytime. Streamlined for students and admins.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/busregister" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-white text-gray-900 font-medium shadow hover:shadow-md">
              <QrCode className="h-4 w-4" /> Get Your Pass
            </a>
            <a href="/pass" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-black/20 text-white font-medium hover:bg-black/30">
              <BusFront className="h-4 w-4" /> View / Download
            </a>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="grid md:grid-cols-3 gap-6">
        {[
          {title:'Apply Online',desc:'Fill a short form and submit in minutes. No queues.', icon: BusFront},
          {title:'Admin Approval',desc:'Admins verify details and approve securely.', icon: ShieldCheck},
          {title:'Renew in 1 Click',desc:'Preview validity and renew without paperwork.', icon: Clock},
        ].map((c,i)=>(
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition">
            <div className="h-10 w-10 rounded-lg bg-blue-600/10 flex items-center justify-center mb-3">
              <c.icon className="h-5 w-5 text-blue-700" />
            </div>
            <h3 className="text-lg font-semibold mb-1.5">{c.title}</h3>
            <p className="text-gray-600">{c.desc}</p>
          </div>
        ))}
      </section>

      {/* Callout card instead of banner image */}
      <section className="rounded-xl overflow-hidden border shadow-sm bg-gradient-to-r from-slate-50 to-white">
        <div className="p-6 sm:p-8 flex items-center gap-5">
          <div className="h-12 w-12 rounded-xl bg-blue-600/10 flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-blue-700" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">Seamless Online Payments</h2>
            <p className="text-gray-600">
              Pay securely with integrated checkout. Get a confirmation instantly.
            </p>
          </div>
          <a href="/payment/checkout" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 inline-flex items-center gap-2">
            Proceed <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </div>
  )
}
