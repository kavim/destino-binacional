import React from "react";
import Lottie from "lottie-react";
import home_location from "@/Shared/lotties/home_location.json";

export default function LottiePlayer() {
    return (
        <Lottie animationData={home_location} className="w-96" />
    );
}
