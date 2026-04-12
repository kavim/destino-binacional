import React from "react";
import Lottie from "lottie-react";
import home_location from "@/Shared/lotties/home_location.json";

export default function LottiePlayer() {
    return (
        <Lottie
            animationData={home_location}
            className="mx-auto w-full max-w-[min(22rem,90vw)] sm:max-w-sm"
            aria-hidden
        />
    );
}
