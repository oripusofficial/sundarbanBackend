import {
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Images,
  IndianRupee,
  MapPinned,
  MessageSquare,
  Plane,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import StatCard from '../components/StatCard'

const stats = [
  {
    change: '+12%',
    icon: CalendarCheck,
    label: 'Total Bookings',
    tone: 'emerald',
    value: '128',
  },
  {
    change: '+4',
    icon: MapPinned,
    label: 'Active Tours',
    tone: 'cyan',
    value: '16',
  },
  {
    change: 'Needs reply',
    icon: MessageSquare,
    label: 'Pending Enquiries',
    tone: 'amber',
    value: '23',
  },
  {
    change: '+18%',
    icon: IndianRupee,
    label: 'Monthly Revenue',
    tone: 'slate',
    value: '18.4L',
  },
]

const bookingRows = [
  ['Rahul Sen', 'Mangrove Trail', '08 Jun 2026', 'Confirmed', '₹18,500'],
  ['Ananya Roy', 'Weekend Cruise', '12 Jun 2026', 'Pending', '₹24,000'],
  ['David Miller', 'Birding Tour', '18 Jun 2026', 'Confirmed', '₹31,200'],
  ['Meera Kapoor', 'Luxury Houseboat', '21 Jun 2026', 'Review', '₹42,800'],
]

const pipeline = [
  { label: 'New enquiries', value: 23, width: '72%' },
  { label: 'Quotes sent', value: 18, width: '58%' },
  { label: 'Payment pending', value: 9, width: '34%' },
  { label: 'Trips confirmed', value: 16, width: '64%' },
]

function DashboardPage() {
  return (
    <section className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950 text-white shadow-xl">
        <div className="grid gap-8 p-6 lg:grid-cols-[1fr_360px] lg:p-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              <Plane aria-hidden="true" className="h-3.5 w-3.5" />
              Sundarban operations
            </div>
            <h1 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              Premium dashboard for tours, bookings, and content.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              Monitor tour demand, keep the gallery fresh, and respond to guests from a
              focused workspace built for daily operations.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
                to="/gallery"
              >
                Manage Gallery
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/15"
                to="/docs"
              >
                View API Docs
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Season performance</p>
                <strong className="mt-2 block text-3xl font-semibold">86%</strong>
              </div>
              <span className="rounded-lg bg-emerald-400/15 p-3 text-emerald-300">
                <TrendingUp aria-hidden="true" className="h-6 w-6" />
              </span>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[86%] rounded-full bg-emerald-400" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-white/5 p-3">
                <div className="text-slate-400">Guests</div>
                <div className="mt-1 font-semibold">342</div>
              </div>
              <div className="rounded-lg bg-white/5 p-3">
                <div className="text-slate-400">Packages</div>
                <div className="mt-1 font-semibold">12 live</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard {...stat} key={stat.label} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.9fr]">
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-950">Recent Bookings</h2>
              <p className="mt-1 text-sm text-slate-500">Latest customer activity</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Live
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[740px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Guest</th>
                  <th className="px-5 py-3 font-medium">Package</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookingRows.map(([guest, pack, date, status, value]) => (
                  <tr className="hover:bg-slate-50/80" key={`${guest}-${date}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-700">
                          {guest
                            .split(' ')
                            .map((name) => name[0])
                            .join('')}
                        </div>
                        <span className="font-medium text-slate-900">{guest}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{pack}</td>
                    <td className="px-5 py-4 text-slate-600">{date}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : status === 'Pending'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-cyan-50 text-cyan-700'
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-slate-950">Sales Pipeline</h2>
              <p className="mt-1 text-sm text-slate-500">Conversion by stage</p>
            </div>
            <span className="rounded-lg bg-cyan-50 p-2 text-cyan-700">
              <Users aria-hidden="true" className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-6 space-y-5">
            {pipeline.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-600">{item.label}</span>
                  <span className="font-semibold text-slate-950">{item.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-slate-950" style={{ width: item.width }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-950">Content Tasks</h2>
            <Images aria-hidden="true" className="h-5 w-5 text-emerald-700" />
          </div>
          <div className="mt-5 space-y-3">
            {[
              ['Refresh homepage gallery', 'Add latest tour photos', 'Gallery'],
              ['Review package copy', 'Update weekend cruise details', 'Packages'],
              ['Publish web docs', 'Share API usage with frontend', 'Docs'],
            ].map(([title, description, tag]) => (
              <div
                className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3"
                key={title}
              >
                <CheckCircle2 aria-hidden="true" className="mt-0.5 h-5 w-5 text-emerald-600" />
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-slate-950">{title}</div>
                  <div className="mt-1 text-sm text-slate-500">{description}</div>
                </div>
                <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-600">
                  {tag}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-950">API & System Status</h2>
              <p className="mt-1 text-sm text-slate-500">Local services health</p>
            </div>
            <Clock aria-hidden="true" className="h-5 w-5 text-slate-500" />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ['Web API', 'http://localhost:5500/api/web', 'Ready'],
              ['Admin API', 'http://localhost:5500/api/admin', 'Ready'],
              ['ImageKit', 'Upload storage', 'Connected'],
              ['MongoDB', 'Gallery database', 'Connected'],
            ].map(([name, detail, status]) => (
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-4" key={name}>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-slate-950">{name}</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="mt-2 truncate text-sm text-slate-500">{detail}</div>
                <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  {status}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}

export default DashboardPage
