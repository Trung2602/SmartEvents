"use client";

import { useState } from "react";
import { authApis, endpoints } from "@/lib/APIs";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: Props) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (newPassword !== confirm) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);

      await authApis().post(
        endpoints["change-password"], // map tới /account/change-password
        {
          oldPassword,
          newPassword,
        }
      );

      toast.success("Đổi mật khẩu thành công");
      onClose();
      setOldPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (err: any) {
      toast.error(err.response?.data || "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-[#191919] w-full max-w-md rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold">Change password</h3>

        <input
          type="password"
          placeholder="Current password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="text-sm px-3 py-1.5">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-500 text-white text-sm px-4 py-1.5 rounded"
          >
            {loading ? "Saving..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
