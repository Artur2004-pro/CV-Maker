import { set, useForm } from "react-hook-form";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import Axios from "../../lib/axios.config";
import { useState } from "react";

type FormData = {
  email: string;
  password: string;
  confirmPassword: string;
  code?: string;
};

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const [code, setCode] = useState<boolean>(false);

  const onSubmit = async (data: FormData) => {
    try {
      if (!code) {
        const { data: d } = await Axios.post("/auth/signup", data);
        if (d.success) setCode(true);
      } else {
        const { data: d } = await Axios.post("/auth/verify-email", data);
        localStorage.setItem("token", d.payload);
        navigate("/profile/");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };
  const resendVerification = async () => {
    try {
      await Axios.post("/auth/resend-verification", {
        email: watch("email"),
      });
      alert("Verification email resent!");
    } catch (error) {
      console.error("Resend verification error:", error);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <Card className="w-[360px] space-y-4 p-6">
        <h1 className="text-2xl font-bold text-center">Create account</h1>

        <div>
          <Input
            {...register("email", { required: "Email is required" })}
            placeholder="Email"
            type="email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Input
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Minimum 6 characters" },
            })}
            placeholder="Password"
            type="password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        {code && (
          <div>
            <Input
              {...register("code", {
                required: "Code is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              placeholder="Code"
              type="password"
            />
            {errors.code && (
              <p className="text-red-500 text-sm">{errors.code.message}</p>
            )}
          </div>
        )}
        <div>
          <Input
            {...register("confirmPassword", {
              required: "Confirm your password",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            placeholder="Confirm Password"
            type="password"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          onClick={handleSubmit(onSubmit)}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500"
        >
          Sign Up
        </Button>

        <div className="text-sm text-center">
          Already have an account?{" "}
          <button className="text-blue-500" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
        <div>
          <button onClick={() => resendVerification()}>
            Resend Verification
          </button>
        </div>
      </Card>
    </div>
  );
}
