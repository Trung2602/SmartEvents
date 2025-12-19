"use client";

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { authApis, endpoints } from "@/lib/APIs";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, reloadUser } = useContext(AuthContext);

  const [editMode, setEditMode] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [city, setCity] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [bio, setBio] = useState("");
  const [fullName, setFullName] = useState("");

  // ⭐ Social links state (KHÔNG DÙNG JSON STRING NỮA)
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    github: "",
    website: "",
  });

  useEffect(() => {
    if (!user) return;

    setFirstName(user.firstName || user.name?.split(" ")[0] || "");
    setLastName(user.lastName || user.name?.split(" ").slice(1).join(" ") || "");
    setFullName(user.fullName || user.name || "");
    setDateOfBirth(user.dateOfBirth ? String(user.dateOfBirth).slice(0, 10) : "");
    setCity(user.city || "");
    setCountryCode(user.countryCode || "");
    setBio(user.bio || "");

    // ⭐ Load social links vào form
    setSocialLinks({
      facebook: user.socialLinks?.facebook || "",
      twitter: user.socialLinks?.twitter || "",
      instagram: user.socialLinks?.instagram || "",
      github: user.socialLinks?.github || "",
      website: user.socialLinks?.website || "",
    });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      firstName,
      lastName,
      fullName,
      dateOfBirth: dateOfBirth || null,
      city: city || null,
      countryCode: countryCode || null,
      bio: bio || null,
      socialLinks: socialLinks, // ⭐ Gửi object social links
    };

    try {
      await authApis().put(`/${endpoints["profile-update"]}`, payload);
      toast.success("Profile updated");
      setEditMode(false);
      await reloadUser();
    } catch (err: any) {
      console.error("Profile update failed", err);
      toast.error(err?.response?.data?.message || "Profile update failed");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-foreground bg-zinc-900">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden flex items-center justify-center text-3xl font-bold">
          <span>
            {(firstName || user?.name || user?.email || "U")
              .charAt(0)
              .toUpperCase()}
          </span>
        </div>

        <div>
          <h1 className="text-2xl font-bold">
            {(firstName || user?.name) ?? "Your name"}
          </h1>
          <p className="text-sm text-zinc-500">{user?.email || ""}</p>
          <div className="mt-4">
            <Button variant="outline" onClick={() => setEditMode((s) => !s)}>
              {editMode ? "Cancel" : "Edit profile"}
            </Button>
          </div>
        </div>
      </div>

      {editMode ? (
        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-zinc-900 p-6 rounded-lg border border-zinc-800 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First name
              </label>
              <input
                className="input bg-zinc-800 text-white border-zinc-700"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Last name
              </label>
              <input
                className="input bg-zinc-800 text-white border-zinc-700"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input
              className="input bg-zinc-800 text-white border-zinc-700"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Date of birth
              </label>
              <input
                type="date"
                className="input bg-zinc-800 text-white border-zinc-700"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                className="input bg-zinc-800 text-white border-zinc-700"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Country code
              </label>
              <input
                className="input bg-zinc-800 text-white border-zinc-700"
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                maxLength={3}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              className="textarea bg-zinc-800 text-white border-zinc-700"
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* ⭐ SOCIAL LINKS SECTION */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Social Links
            </label>

            <div className="grid grid-cols-2 gap-4">
              {Object.keys(socialLinks).map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium capitalize mb-1">
                    {key}
                  </label>
                  <input
                    className="input bg-zinc-800 text-white border-zinc-700"
                    value={(socialLinks as any)[key]}
                    onChange={(e) =>
                      setSocialLinks({
                        ...socialLinks,
                        [key]: e.target.value,
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit">Save changes</Button>
            <Button variant="ghost" onClick={() => setEditMode(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="mt-8 bg-zinc-900 p-4 rounded-lg border border-zinc-800">
          <h2 className="font-semibold mb-2">About</h2>
          <p className="text-sm text-zinc-500">
            {bio ||
              "This is your profile page. You can extend it to show additional user data, saved events, preferences, and more."}
          </p>
        </div>
      )}
    </div>
  );
}
