import { authClient } from "./auth-client";

export const uploadImageToImgBB = async (file) => {
  const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
  if (!apiKey) {
    throw new Error("ImgBB API key is missing from environment variables.");
  }

  const { data: session } = await authClient.getSession();
  if (!session?.user) {
    throw new Error("Please sign in before uploading images.");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: formData,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.success) {
    throw new Error(data.error?.message || "Failed to upload image to ImgBB");
  }

  return data.data.url;
};
