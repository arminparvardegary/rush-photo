import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getOrdersByEmail } from "@/lib/server/orders";
import { Package, Calendar, ArrowRight, ExternalLink, Camera, Download, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function UserOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login?redirect=/dashboard/orders");
  }

  const orders = await getOrdersByEmail(session.user.email);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'shipped':
        return 'bg-emerald-100 text-emerald-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'pending_payment':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-amber-100 text-amber-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'shipped':
        return CheckCircle2;
      case 'processing':
        return Camera;
      default:
        return Clock;
    }
  };

  const getPackageLabel = (pkg: string) => {
    switch (pkg) {
      case 'fullpackage':
        return 'Full Package';
      case 'lifestyle':
        return 'Lifestyle';
      case 'ecommerce':
        return 'E-commerce';
      default:
        return pkg;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">My Orders</h1>
          <p className="text-gray-500 font-medium mt-1">View and track all your orders.</p>
        </div>
        <Link
          href="/order"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#E63946] text-white font-bold rounded-xl hover:bg-[#D62839] transition-colors shadow-lg shadow-[#E63946]/20"
        >
          <Camera className="w-4 h-4" />
          New Order
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">Start your first photography project with us and see your orders here!</p>
          <Link
            href="/order"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E63946] text-white font-bold rounded-xl hover:bg-[#D62839] transition-colors shadow-lg shadow-[#E63946]/20"
          >
            <Camera className="w-4 h-4" />
            Start New Order
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const StatusIcon = getStatusIcon(order.status);
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-gray-200 transition-all">
                <div className="p-4 sm:p-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${getStatusColor(order.status).replace('text-', 'bg-').split(' ')[0]}`}>
                        <StatusIcon className={`w-5 h-5 sm:w-6 sm:h-6 ${getStatusColor(order.status).split(' ')[1]}`} />
                      </div>
                      <div>
                        <p className="font-mono font-bold text-base sm:text-lg text-gray-900">{order.trackingNumber}</p>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-14 sm:ml-0">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold capitalize ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                      <span className="text-lg sm:text-xl font-black text-gray-900">${order.totals.total}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div className="px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-gray-500">Package:</span>{' '}
                      <span className="font-bold text-gray-900">{getPackageLabel(order.package)}</span>
                    </div>
                    <div className="px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-gray-500">Product:</span>{' '}
                      <span className="font-bold text-gray-900">{order.productName}</span>
                    </div>
                    {order.styles.length > 0 && (
                      <div className="px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="text-gray-500">Styles:</span>{' '}
                        <span className="font-bold text-gray-900">{order.styles.length}</span>
                      </div>
                    )}
                    <div className="px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-gray-500">Delivery:</span>{' '}
                      <span className="font-bold text-gray-900">{order.estimatedDelivery}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-3">
                    {order.status === 'pending_payment' && (
                      <Link
                        href={`/checkout?order=${order.id}`}
                        className="px-4 py-2.5 bg-[#E63946] text-white text-sm font-bold rounded-xl hover:bg-[#D62839] transition-colors shadow-sm"
                      >
                        Complete Payment
                      </Link>
                    )}
                    {order.deliveryUrl && (order.status === 'completed' || order.status === 'shipped') && (
                      <a
                        href={order.deliveryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm"
                      >
                        <Download className="w-4 h-4" />
                        Download Photos
                      </a>
                    )}
                    {order.status === 'processing' && (
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-xl">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        Photos being prepared...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
