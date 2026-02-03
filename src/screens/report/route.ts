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
        newPhotos: zod.array(zod.union([zod.string(), zod.object({ uri: zod.string() })])).optional(),
    }),
});

export const UploadGuideRoute = createRoute('/upload-guide', {
    component: UploadGuideScreen,
    validateParams: zod.object({
        latitude: zod.number().optional(),
        longitude: zod.number().optional(),
        address: zod.string().optional(),
    }),
});
