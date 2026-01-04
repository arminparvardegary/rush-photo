"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { sendEmail } from "@/lib/aws-ses";
import { deliveryNotificationEmail } from "@/lib/email-templates";

interface OrderDetail {
    id: string;
    trackingNumber: string;
    status: string;
    email: string;
    name: string;
    productName: string;
    package: string;
    totals: { total: number };
    cart: any[];
    deliveryUrl?: string;
    shippingTracking?: string;
}

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Form State
    const [status, setStatus] = useState("");
    const [shippingTracking, setShippingTracking] = useState("");
    const [deliveryUrl, setDeliveryUrl] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/orders/${params.id}`);
                if (!res.ok) throw new Error("Failed to load order");
                const data = await res.json();
                setOrder(data.order);
                setStatus(data.order.status);
                setShippingTracking(data.order.trackingNumber || "");
                setDeliveryUrl(data.order.deliveryUrl || "");
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchOrder();
    }, [params.id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/orders/${params.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status,
                    deliveryUrl,
                    // shippingTracking to be added to API if supported
                }),
            });
            if (!res.ok) throw new Error("Failed to save");
            router.refresh();
            alert("Saved successfully");
        } catch (err) {
            alert("Error saving");
        } finally {
            setSaving(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setIsUploading(true);
        try {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append("file", file);
            formData.append("bucket", "deliverables"); // Use specific bucket for deliveries

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");
            const data = await res.json();
            setDeliveryUrl(data.url);
        } catch (err) {
            alert("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const sendDeliveryEmail = async () => {
        if (!confirm("Send delivery notification email to customer?")) return;
        try {
            // Find a way to trigger server action or API call for this
            // For now, simpler to just allow status Update to 'completed' trigger it?
            // Or adding a specific endpoint for actions.
            alert("Email sending logic to be implemented via API action");
        } catch (err) {
            alert("Failed");
        }
    }

    if (loading) return <div className="p-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-gray-400" /></div>;
    if (!order) return <div className="p-12 text-center">Order not found</div>;

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">{order.productName}</h1>
                        <p className="text-gray-500 font-mono text-sm">{order.trackingNumber}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-rush-dark text-white rounded-xl font-bold hover:bg-black transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-6">Order Details</h3>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Package</label>
                                <div className="font-medium capitalize">{order.package}</div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Total</label>
                                <div className="font-medium">${order.totals.total}</div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cart Items</label>
                                <div className="text-sm space-y-1">
                                    {order.cart.map((item: any, i: number) => (
                                        <div key={i}>{item.style} <span className="text-gray-400">({item.angles.length} angles)</span></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-6">Deliverables</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Delivery URL</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={deliveryUrl}
                                        onChange={(e) => setDeliveryUrl(e.target.value)}
                                        placeholder="https://..."
                                        className="flex-1 p-3 rounded-xl border border-gray-200 text-sm font-medium"
                                    />
                                    {deliveryUrl && (
                                        <a href={deliveryUrl} target="_blank" rel="noreferrer" className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                                            <ExternalLink className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Upload File</label>
                                <label className={`flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-gray-400 transition-colors ${isUploading ? 'opacity-50' : ''}`}>
                                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5 text-gray-400" />}
                                    <span className="text-sm font-bold text-gray-500">{isUploading ? 'Uploading...' : 'Click to Upload'}</span>
                                    <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-6">Status</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Current Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-gray-200 font-bold text-sm bg-white"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="pending_payment">Pending Payment</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Changing status to <strong>Completed</strong> will trigger delivery email if URL is present.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-6">Customer</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500">
                                    {order.name.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900">{order.name}</div>
                                    <div className="text-gray-500">{order.email}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
