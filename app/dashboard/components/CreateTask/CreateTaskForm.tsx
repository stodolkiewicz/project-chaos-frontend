import { useForm } from "react-hook-form";

type FormData = {
  title: string;
};

export default function CreateTaskForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("FormData: " + JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div className="bg-testRed">
        <label className="block text-sm font-medium">Task title</label>
        <input
          type="text"
          {...register("title", { required: "Title is required" })}
          className="border border-primary p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-azure-100 font-stretch-100% text-white px-4 py-2 rounded hover:bg-azure-600"
        >
          Create task
        </button>
        <div className="bg-azure-radiance-500 p-4">Test azure-500</div>
      </div>
    </form>
  );
}
