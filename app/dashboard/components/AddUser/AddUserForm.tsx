import { useGetDefaultProjectIdQuery } from "@/app/state/ProjectsApiSlice";
import { useAddUserToProjectMutation } from "@/app/state/UsersApiSlice";
import { AddUserResponseDTO } from "@/app/types/AddUserResponseDTO";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

export type AddUserFormData = {
  invitedEmail: string;
  projectRole: "MEMBER" | "ADMIN" | "VIEWER";
};

export default function AddUserForm({ onClose }: { onClose: () => void }) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<AddUserFormData>();

  const { data } = useGetDefaultProjectIdQuery();
  const projectId = data?.projectId;

  const [addUserToProject] = useAddUserToProjectMutation();

  const onSubmit: SubmitHandler<AddUserFormData> = async (data) => {
    try {
      const addUserRequestDTO = {
        userEmail: data.invitedEmail,
        projectRole: data.projectRole,
      };

      const addUserResponseDTO = (await addUserToProject({
        projectId,
        userData: addUserRequestDTO,
      }).unwrap()) as AddUserResponseDTO;

      toast.success(
        `User ${addUserResponseDTO.userEmail} was added to project as ${addUserResponseDTO.projectRole}.`
      );
      onClose();
    } catch (err) {
      toast.error(`There was an error while adding the user to the project.`);
    }
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-4">
      {/* invitedEmail */}
      <div>
        <label className="block text-sm font-medium">Invite user:</label>
        <input
          type="text"
          placeholder="Type user email here"
          {...register("invitedEmail", { required: "User email is required" })}
          className="border border-primary p-2 rounded w-full"
        />
        {errors.invitedEmail && (
          <p className="text-red-600 text-sm mt-0 mb-2">
            {" "}
            {errors.invitedEmail.message}
          </p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium mt-3">Project role:</label>
        <select
          {...register("projectRole", { required: "Project role is required" })}
          className="border border-primary p-2 rounded w-full mt-2"
        >
          <option value="">-- Select project role --</option>
          <option value="MEMBER">member</option>
          <option value="VIEWER">viewer</option>
          <option value="ADMIN">admin</option>
        </select>
        {errors.projectRole && (
          <p className="text-red-600 text-sm mt-0 mb-2">
            {errors.projectRole.message}
          </p>
        )}
      </div>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-azure-600 self-end"
      >
        Add member
      </button>
    </form>
  );
}
