"use client";

import { LevelBadge, TreeStageBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
  Calendar,
  Clock,
  Coins,
  Edit,
  Loader2,
  Mail,
  MapPin,
  Save,
  Scale,
  Shield,
  TreeDeciduous,
  User,
  X,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  image: string | null;
  location: string | null;
  points: number;
  level: string;
  totalWaste: number;
  treesGrown: number;
  ecoXp: number;
  treeStage: string;
  streak: number;
  role: string;
  createdAt: string;
  rank: number;
}

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", location: "" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setEditForm({ name: data.name, location: data.location || "" });
        } else {
          setError("Failed to load profile");
        }
      } catch (err) {
        setError("Database connection error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (res.ok) {
        const updated = await res.json();
        setProfile((prev) => (prev ? { ...prev, ...updated.user } : null));
        setIsEditing(false);
        await updateSession({ name: editForm.name });
      }
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center glass-card p-8">
          <p className="text-foreground/60 mb-4">
            {error || "No profile data"}
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={() => window.location.reload()}
              variant="secondary"
            >
              Refresh Page
            </Button>
            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
              variant="danger"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const userLevel = profile.level as "BRONZE" | "SILVER" | "GOLD";
  const treeStage = profile.treeStage as any;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      {/* Profile Header */}
      <div className="relative">
        <div className="h-48 rounded-3xl bg-gradient-to-r from-primary-600 to-teal-600 shadow-lg overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
        </div>

        <div className="px-6 md:px-10 pb-6 -mt-20 relative z-10">
          <div className="flex flex-col md:flex-row items-end md:items-center gap-6">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl bg-white flex items-center justify-center overflow-hidden">
              {profile.image ? (
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-100 to-teal-100 flex items-center justify-center text-4xl font-bold text-primary-600">
                  {profile.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>

            <div className="flex-1 w-full md:w-auto text-center md:text-left pt-4 md:pt-20">
              {isEditing ? (
                <div className="glass-card p-6 animate-fade-in max-w-lg mx-auto md:mx-0">
                  <h3 className="font-bold text-lg mb-4">Edit Profil</h3>
                  <div className="space-y-4">
                    <Input
                      label="Nama Lengkap"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      leftIcon={<User size={18} />}
                      placeholder="Nama lengkap"
                    />
                    <Input
                      label="Lokasi"
                      value={editForm.location}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: e.target.value })
                      }
                      leftIcon={<MapPin size={18} />}
                      placeholder="Contoh: Jakarta, Indonesia"
                    />
                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={handleSave}
                        isLoading={saving}
                        className="flex-1"
                      >
                        <Save size={16} /> Simpan
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setIsEditing(false)}
                        className="flex-1"
                      >
                        <X size={16} /> Batal
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">
                      {profile.name}
                    </h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2 text-foreground/60">
                      <span className="flex items-center gap-1.5 bg-white/50 px-3 py-1 rounded-full text-sm border border-white/40 shadow-sm">
                        <Mail size={14} /> {profile.email}
                      </span>
                      {profile.location && (
                        <span className="flex items-center gap-1.5 bg-white/50 px-3 py-1 rounded-full text-sm border border-white/40 shadow-sm">
                          <MapPin size={14} /> {profile.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 bg-white/50 px-3 py-1 rounded-full text-sm border border-white/40 shadow-sm">
                        <Shield size={14} /> {profile.role}
                      </span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-3 mt-4">
                      <LevelBadge level={userLevel} />
                      <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-bold border border-amber-200">
                        Rank #{profile.rank}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="shadow-sm border-primary-200 hover:border-primary-300 hover:bg-white"
                  >
                    <Edit size={16} /> Edit Profil
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <Card className="p-6 text-center hover:scale-105 transition-transform duration-300 border-primary-100 bg-gradient-to-b from-white to-primary-50/30">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-primary-100 flex items-center justify-center mb-3 shadow-inner">
            <Coins className="w-6 h-6 text-primary-600" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-foreground">
            {profile.points.toLocaleString()}
          </p>
          <p className="text-sm font-medium text-foreground/50 uppercase tracking-wide mt-1">
            Total Poin
          </p>
        </Card>

        <Card className="p-6 text-center hover:scale-105 transition-transform duration-300 border-blue-100 bg-gradient-to-b from-white to-blue-50/30">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-100 flex items-center justify-center mb-3 shadow-inner">
            <Scale className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-foreground">
            {profile.totalWaste.toFixed(1)}
          </p>
          <p className="text-sm font-medium text-foreground/50 uppercase tracking-wide mt-1">
            kg Sampah
          </p>
        </Card>

        <Card className="p-6 text-center hover:scale-105 transition-transform duration-300 border-green-100 bg-gradient-to-b from-white to-green-50/30">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-green-100 flex items-center justify-center mb-3 shadow-inner">
            <TreeDeciduous className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-foreground">
            {profile.treesGrown}
          </p>
          <p className="text-sm font-medium text-foreground/50 uppercase tracking-wide mt-1">
            Pohon Ditanam
          </p>
        </Card>

        <Card className="p-6 text-center hover:scale-105 transition-transform duration-300 border-orange-100 bg-gradient-to-b from-white to-orange-50/30">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-100 flex items-center justify-center mb-3 shadow-inner">
            <Calendar className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-2xl md:text-3xl font-bold text-foreground">
            {profile.streak}
          </p>
          <p className="text-sm font-medium text-foreground/50 uppercase tracking-wide mt-1">
            Hari Streak
          </p>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Level Progress */}
        <Card padding="lg" className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-500" />
              Level Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4 mb-6">
              <div className="mt-1">
                <LevelBadge
                  level={userLevel}
                  className="scale-125 origin-top-left"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-foreground/60">
                    Menuju level berikutnya
                  </span>
                  <span className="font-bold text-primary-600">
                    {profile.points.toLocaleString()} /{" "}
                    {userLevel === "BRONZE"
                      ? "1,000"
                      : userLevel === "SILVER"
                      ? "5,000"
                      : "10,000"}
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-1000"
                    style={{
                      width: `${Math.min(
                        100,
                        (profile.points /
                          (userLevel === "BRONZE"
                            ? 1000
                            : userLevel === "SILVER"
                            ? 5000
                            : 10000)) *
                          100
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-foreground/40 mt-2">
                  Kumpulkan lebih banyak poin dengan menyetor sampah untuk naik
                  level!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eco Tree Progress */}
        <Card padding="lg" className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TreeDeciduous className="w-5 h-5 text-green-500" />
              Eco Tree Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <TreeStageBadge
                  stage={treeStage}
                  className="scale-125 origin-top-left"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-foreground/60">Eco XP</span>
                  <span className="font-bold text-green-600">
                    {profile.ecoXp} / 1000
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-teal-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(profile.ecoXp / 1000) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-foreground/40 mt-2">
                  Penuhkan bar XP untuk menanam pohon baru dan dapatkan bonus
                  poin.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Member Since */}
      <div className="text-center pb-8">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 text-foreground/40 text-sm font-medium border border-white/20">
          <Clock size={14} />
          Bergabung sejak{" "}
          {new Date(profile.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
