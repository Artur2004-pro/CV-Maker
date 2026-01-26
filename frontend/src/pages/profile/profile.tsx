import { useForm } from "react-hook-form";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

type ProfileFormData = {
  firstName: string;
  lastName: string;
  email: string;
};

export default function Profile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>();

  const onSubmit = (data: ProfileFormData) => {
    console.log(data);
  };

  return (
    <Card className="max-w-xl p-6 space-y-4">
      <h1 className="text-xl font-semibold">Profile</h1>

      <div>
        <Input
          placeholder="First name"
          {...register("firstName", { required: "Required" })}
        />
        {errors.firstName && (
          <p className="text-sm text-red-500">{errors.firstName.message}</p>
        )}
      </div>

      <div>
        <Input
          placeholder="Last name"
          {...register("lastName", { required: "Required" })}
        />
        {errors.lastName && (
          <p className="text-sm text-red-500">{errors.lastName.message}</p>
        )}
      </div>

      <div>
        <Input
          type="email"
          placeholder="Email"
          {...register("email", { required: "Required" })}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <Button onClick={handleSubmit(onSubmit)}>Save</Button>
    </Card>
  );
}
