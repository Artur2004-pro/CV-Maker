import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
import Axios from "../../lib/axios.config";

type FormData = {
  email: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const handleLogin = async (data: FormData) => {
    try {
      const { data: d } = await Axios.post("/auth/login", data);
      localStorage.setItem("token", d.payload);
      navigate("/profile/form");
    } catch (err) {
      console.error("Login error:", err);
    }
  };
  const onSubmit = (data: FormData) => {
    handleLogin(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <Card className="w-[360px] space-y-4 p-6">
        <h1 className="text-xl font-semibold">Login</h1>
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
            {...register("password", { required: "Password is required" })}
            placeholder="Password"
            type="password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <Button onClick={handleSubmit(onSubmit)} className="w-full">
          Login
        </Button>

        <div className="flex justify-between text-sm mt-2">
          <button
            className="text-blue-500"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </button>
          <button
            className="text-blue-500"
            onClick={() => navigate("/register")}
          >
            Sign up
          </button>
        </div>
      </Card>
    </div>
  );
}
