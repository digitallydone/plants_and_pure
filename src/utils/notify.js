import toast, { Toaster } from "react-hot-toast";

const notify = (msg, type) => {
  if (!msg) {
    msg = "something went wrong";
  }

  switch (type) {
    case "success":
      toast.success(msg);
      break;
    case "error":
      toast.error(msg);
      break;
    case "loading":
      toast.loading(msg);
      break;

    default:
      toast(msg);
      break;
  }
};
export default notify;
