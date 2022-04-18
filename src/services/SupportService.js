import ApiService from "./ApiService";

export const SupportServiceSubmit = async (body) => {
  const form = new FormData();
  Object.keys(body).forEach((key) => {
    if (key !== undefined && key !== "files") {
      form.append(key, body[key]);
    }
  });

  if (body.files) {
    for (let index = 0; index < body.files.length; index++) {
      const file = body.files[index];
      form.append("files", file);
    }
  }

  return await ApiService.post("/support/submit-with-attachments", form);
};
