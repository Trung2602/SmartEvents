"use client";

import { useState } from "react";
import { Modal } from "../common/Modal"; 
import { Button } from "@/components/ui/button";
import api, { endpoints } from "@/lib/APIs";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ForgotPasswordModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState<"EMAIL" | "OTP" | "RESET">("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // STEP 1: gửi OTP
  const sendOtp = async () => {
    try {
      setLoading(true);
      await api.post(endpoints["forgot-password"], null, {
        params: { email },
      });
      toast.success("OTP đã gửi qua email");
      setStep("OTP");
    } catch (err: any) {
      toast.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: verify OTP
  const verifyOtp = async () => {
    try {
      setLoading(true);
      const res = await api.post(endpoints["account-verify-forgot-password"], null, {
        params: { email, otp },
      });
      setResetToken(res.data.resetToken);
      toast.success("Xác thực OTP thành công");
      setStep("RESET");
    } catch (err: any) {
      toast.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: reset password
  const resetPassword = async () => {
    try {
      setLoading(true);
      await api.patch(endpoints["reset-password"], null, {
        params: {
          resetToken,
          password,
        },
      });
      toast.success("Đổi mật khẩu thành công");
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-6 space-y-4 text-zinc-900 dark:text-white">
        <h3 className="text-xl font-semibold text-center">
          Quên mật khẩu
        </h3>

        {/* STEP 1 */}
        {step === "EMAIL" && (
          <>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
              className="w-full px-4 py-2 rounded-lg border dark:bg-black"
            />
            <Button
              className="w-full"
              disabled={!email || loading}
              onClick={sendOtp}
            >
              Gửi OTP
            </Button>
          </>
        )}

        {/* STEP 2 */}
        {step === "OTP" && (
          <>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Nhập mã OTP"
              className="w-full px-4 py-2 rounded-lg border dark:bg-black"
            />
            <Button
              className="w-full"
              disabled={!otp || loading}
              onClick={verifyOtp}
            >
              Xác thực OTP
            </Button>
          </>
        )}

        {/* STEP 3 */}
        {step === "RESET" && (
          <>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu mới"
              className="w-full px-4 py-2 rounded-lg border dark:bg-black"
            />
            <Button
              className="w-full"
              disabled={!password || loading}
              onClick={resetPassword}
            >
              Đổi mật khẩu
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}
