import { createRoute } from "@granite-js/react-native";
import LocationScreen from "./LocationScreen";

export const Route = createRoute('/location', {
    component: LocationScreen,
});
