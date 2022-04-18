import { ServiceResponse } from "@protego/sdk/core/AuthService";
import { AxiosRequestConfig } from "axios";
import FileSaver from "file-saver";
import { AttachmentDtoRes } from "types/typings-api";
import ApiService from "./ApiService";

const FileUploaderService = {
  async download(id: string | number, filename?: string): Promise<void> {
    const { data } = await ApiService.get(`/note/attachment/download/${id}`, {
      responseType: "blob"
    });
    return FileSaver.saveAs(data, filename);
  },
  post(
    files: File | File[] | FormData,
    config: AxiosRequestConfig
  ): ServiceResponse<AttachmentDtoRes> {
    const res = ApiService.post("/note/attachment/upload", files, config);
    // return ApiService.post("/note/attachment/upload", files, config);
    return res;
  }
};

export default FileUploaderService;
