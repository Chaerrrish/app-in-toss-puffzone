import { createRoute } from "@granite-js/react-native";
import { z } from "zod";
import ReportScreen from "./ReportScreen";

export const Route = createRoute('/report', {
    component: ReportScreen,
    validateParams: z.object({
        latitude: z.number(),
        longitude: z.number(),
        address: z.string(),
    }),
});
