import { useMutation } from "@tanstack/react-query";
import mediaApiRequest from "../apiRequests/media";

export const useUploadFileMediaMutation = () => {
    return useMutation({
        mutationFn: mediaApiRequest.upload,
    })
}
