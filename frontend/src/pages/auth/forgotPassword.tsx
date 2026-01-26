import { useForm } from "react-hook-form";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import Axios from "../../lib/axios.config";
import { useState } from "react";

type FormData = { email: string; code?: string; newPassword?: string };

export default function ForgotPassword() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [code, setCode] = useState<boolean>(false);
  const onSubmit = async (data: FormData) => {
    try {
      if (!code) {
        const { data: d } = await Axios.post("/auth/forgot-password", data);
        if (d.success) setCode(true);
      } else {
        const { data: d } = await Axios.post("/auth/reset-password", data);
        localStorage.setItem("token", d.payload);
        navigate("/profile/");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <Card className="w-[360px] space-y-4 p-6">
        <h1 className="text-xl font-semibold">Forgot Password</h1>

        <Input
          {...register("email", { required: "Email is required" })}
          placeholder="Enter your email"
          type="email"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
        {code && (
          <>
            <Input
              {...register("code", {
                required: "Code is required",
                minLength: {
                  value: 6,
                  message: "Code must be at least 6 digits",
                },
              })}
              placeholder="Enter the code sent to your email"
            />
            {errors.code && (
              <p className="text-red-500 text-sm">{errors.code.message}</p>
            )}
            <Input
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="Enter your new password"
              type="password"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm">
                {errors.newPassword.message}
              </p>
            )}
          </>
        )}
        <button
          className="text-blue-500 text-sm mt-2"
          onClick={() => navigate("/login")}
        >
          Back to Login
        </button>
        <Button onClick={handleSubmit(onSubmit)}>Send</Button>
      </Card>
    </div>
  );
}
