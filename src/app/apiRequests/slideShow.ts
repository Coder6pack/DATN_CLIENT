import http from "@/lib/http";
import {
  CreateSlideShowBodyType,
  GetListSlideShowType,
  GetSlideShowType,
  UpdateSlideShowBodyType,
} from "@/schemaValidations/slide-show.model";

const slideShowApiRequest = {
  listSlideShow: () => http.get<GetListSlideShowType>("/slideShows"),
  getSlideShow: (id: number) => http.get<GetSlideShowType>(`/slideShows/${id}`),
  createSlideShow: (body: CreateSlideShowBodyType) =>
    http.post<GetSlideShowType>("/slideShows", body),
  updateSlideShow: (id: number, body: UpdateSlideShowBodyType) =>
    http.put<GetSlideShowType>(`/slideShows/${id}`, body),
  deleteSlideShow: (id: number) => http.delete(`/slideShows/${id}`),
};

export default slideShowApiRequest;
