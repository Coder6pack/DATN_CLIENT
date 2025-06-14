import http from "@/lib/http";
import { UploadFilesResType } from "@/schemaValidations/media.model";

const mediaApiRequest = {
    upload:(formData:FormData)=>http.post<UploadFilesResType>("/media/images/upload",formData)
}

export default mediaApiRequest;

