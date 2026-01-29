import { createRoute } from "@granite-js/react-native";
import { z as zod } from "zod";
import ReportScreen from "./ReportScreen";
import UploadGuideScreen from "./UploadGuideScreen";

export const Route = createRoute('/report', {
    component: ReportScreen,
    validateParams: zod.object({
        latitude: zod.number(),
        longitude: zod.number(),
        address: zod.string(),
    }),
});

export const UploadGuideRoute = createRoute('/upload-guide', {
    component: UploadGuideScreen,
    validateParams: zod.object({
        onPhotosSelected: zod.custom<(photos: string[]) => void>(),
    }),
});
