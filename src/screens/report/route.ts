import { createRoute } from "@granite-js/react-native";
import { z } from "zod";
import ReportScreen from "./ReportScreen";
import UploadGuideScreen from "./UploadGuideScreen";

export const Route = createRoute('/report', {
    component: ReportScreen,
    validateParams: z.object({
        latitude: z.number(),
        longitude: z.number(),
        address: z.string(),
    }),
});

export const UploadGuideRoute = createRoute('/upload-guide', {
    component: UploadGuideScreen,
});
