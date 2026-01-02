"use client";

import { useState } from "react";
import { type PricingSettings, type PricingStyle } from "@/lib/shared/pricing";
import { Loader2, Plus, Save, Trash, Camera } from "lucide-react";

export default function PricingEditor({ initialPricing }: { initialPricing: PricingSettings }) {
    const [pricing, setPricing] = useState<PricingSettings>(initialPricing);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const save = async () => {
        setIsSaving(true);
        setMessage(null);
        try {
            const res = await fetch("/api/pricing", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pricing }),
            });
            if (!res.ok) throw new Error("Failed to save");
            setMessage({ type: 'success', text: "Pricing updated successfully" });
        } catch (e) {
            setMessage({ type: 'error', text: "Failed to update pricing" });
        } finally {
            setIsSaving(false);
        }
    };

    const updateEcommerce = (field: keyof PricingSettings['ecommerce'], val: any) => {
        setPricing(p => ({ ...p, ecommerce: { ...p.ecommerce, [field]: val } }));
    };

    const updateStyle = (idx: number, field: keyof PricingStyle, val: any) => {
        const newStyles = [...pricing.ecommerce.styles];
        newStyles[idx] = { ...newStyles[idx], [field]: val };
        updateEcommerce('styles', newStyles);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex items-center justify-between sticky top-6 z-10">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Global Pricing</h2>
                    <p className="text-sm text-gray-500">Update rates and discount logic.</p>
                </div>
                <div className="flex items-center gap-4">
                    {message && (
                        <span className={`text-sm font-bold ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {message.text}
                        </span>
                    )}
                    <button
                        onClick={save}
                        disabled={isSaving}
                        className="bg-rush-dark text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-[#E63946] transition-colors disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Main Settings */}
            <div className="grid md:grid-cols-2 gap-8">

                {/* General Rates */}
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                        <DollarSignIcon className="w-5 h-5 text-green-600" />
                        Base Rates
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">E-Commerce Base Price (Per Angle)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                                <input
                                    type="number"
                                    value={pricing.ecommerce.perAngle}
                                    onChange={e => updateEcommerce('perAngle', Number(e.target.value))}
                                    className="w-full pl-8 p-3 rounded-xl border border-gray-200 font-bold text-gray-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Lifestyle Flat Rate</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                                <input
                                    type="number"
                                    value={pricing.lifestyle.flatRate}
                                    onChange={e => setPricing(p => ({ ...p, lifestyle: { flatRate: Number(e.target.value) } }))}
                                    className="w-full pl-8 p-3 rounded-xl border border-gray-200 font-bold text-gray-900"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Package Discount (%)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={pricing.fullPackageDiscount}
                                    onChange={e => setPricing(p => ({ ...p, fullPackageDiscount: Number(e.target.value) }))}
                                    className="w-full p-3 rounded-xl border border-gray-200 font-bold text-gray-900"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* E-commerce Styles */}
                <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6 md:col-span-2">
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                        <Camera className="w-5 h-5 text-blue-600" />
                        E-Commerce Styles
                    </h3>
                    <p className="text-sm text-gray-500">Define available photo styles and their pricing overrides.</p>

                    <div className="grid gap-6">
                        {pricing.ecommerce.styles.map((style, idx) => (
                            <div key={style.id} className="p-4 border border-gray-200 rounded-2xl bg-gray-50/50 grid md:grid-cols-12 gap-4 items-start">
                                <div className="md:col-span-1">
                                    <img src={style.image} className="w-12 h-12 rounded-lg object-cover bg-gray-200" />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={style.name}
                                        onChange={e => updateStyle(idx, 'name', e.target.value)}
                                        className="w-full p-2 rounded-lg border border-gray-200 text-sm font-bold"
                                    />
                                </div>
                                <div className="md:col-span-6">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Description</label>
                                    <input
                                        type="text"
                                        value={style.description}
                                        onChange={e => updateStyle(idx, 'description', e.target.value)}
                                        className="w-full p-2 rounded-lg border border-gray-200 text-sm"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Price/Angle</label>
                                    <div className="relative">
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-xs">$</span>
                                        <input
                                            type="number"
                                            value={style.pricePerAngle}
                                            onChange={e => updateStyle(idx, 'pricePerAngle', Number(e.target.value))}
                                            className="w-full pl-5 p-2 rounded-lg border border-gray-200 text-sm font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

function DollarSignIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="12" x2="12" y1="2" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    )
}
