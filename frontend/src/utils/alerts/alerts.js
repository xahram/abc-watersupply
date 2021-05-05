import { toast } from "react-hot-toast";

export const successNotify = (message) => {
  toast.success(message, {
    style: {
      border: "1px solid #7f5eff",
      padding: "16px",
      color: "#7f5eff",
    },
    iconTheme: {
      primary: "#7f5eff",
      secondary: "#1ae4ff",
    },
  });
};

export const errorNotify = (message) => {
  toast.error(message, {
    style: {
      border: "1px solid #FF6347",
      padding: "16px",
      color: "#FF6347",
    },

  });
};
