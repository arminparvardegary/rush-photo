"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Building, MapPin, Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function ProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            // Map database fields to frontend fields
            const p = data.profile;
            setProfile(prev => ({
              ...prev,
              name: p.name || prev.name,
              phone: p.phone || "",
              company: p.company || "",
              address: p.address || "",
              apartment: p.apartment || "",
              city: p.city || "",
              state: p.state || "",
              zipCode: p.zip_code || "", // Map from snake_case
              country: p.country || "United States",
            }));
          }
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      setProfile(prev => ({
        ...prev,
        name: session.user?.name || "",
        email: session.user?.email || "",
      }));
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleSave = async () => {
    setSaving(true);
    setSaveStatus("idle");

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        // Reload profile from database to confirm save worked
        const reloadRes = await fetch("/api/profile");
        if (reloadRes.ok) {
          const data = await reloadRes.json();
          if (data.profile) {
            const p = data.profile;
            setProfile(prev => ({
              ...prev,
              name: p.name || prev.name,
              phone: p.phone || "",
              company: p.company || "",
              address: p.address || "",
              apartment: p.apartment || "",
              city: p.city || "",
              state: p.state || "",
              zipCode: p.zip_code || "",
              country: p.country || "United States",
            }));
          }
        }
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 4000);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 4000);
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#E63946] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Profile Settings</h1>
          <p className="text-gray-500 font-medium mt-1">Update your personal info and shipping address for faster checkout.</p>
        </div>
      </div>

      {/* Success/Error Toast */}
      <AnimatePresence>
        {saveStatus !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`flex items-center gap-3 p-4 rounded-xl ${
              saveStatus === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}
          >
            {saveStatus === "success" ? (
              <>
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="font-medium">Profile saved successfully!</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="font-medium">Failed to save. Please try again.</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Cards */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#E63946]/5 to-transparent px-5 sm:px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#E63946] rounded-lg flex items-center justify-center">
                <User className="w-4.5 h-4.5 text-white" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Personal Information</h2>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20 outline-none transition-all text-gray-900"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20 outline-none transition-all text-gray-900"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Company <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="text"
                  value={profile.company}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20 outline-none transition-all text-gray-900"
                  placeholder="Your Company Name"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Shipping Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="bg-gradient-to-r from-emerald-500/5 to-transparent px-5 sm:px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900">Shipping Address</h2>
                <p className="text-xs text-gray-500">Auto-fills at checkout</p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Street Address</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20 outline-none transition-all text-gray-900"
                placeholder="123 Main Street"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Apartment, Suite, etc. <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={profile.apartment}
                onChange={(e) => handleChange("apartment", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20 outline-none transition-all text-gray-900"
                placeholder="Apt 4B"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20 outline-none transition-all text-gray-900"
                  placeholder="New York"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">State</label>
                <input
                  type="text"
                  value={profile.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20 outline-none transition-all text-gray-900"
                  placeholder="NY"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">ZIP Code</label>
                <input
                  type="text"
                  value={profile.zipCode}
                  onChange={(e) => handleChange("zipCode", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20 outline-none transition-all text-gray-900"
                  placeholder="10001"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Country</label>
                <select
                  value={profile.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20 outline-none transition-all text-gray-900 bg-white"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Save Button - Fixed at bottom on mobile */}
      <div className="sticky bottom-4 z-10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#E63946] text-white font-bold rounded-xl hover:bg-[#D62839] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#E63946]/25"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}
