import type React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

vi.mock("react-easy-crop", () => ({
    default: ({ aspect }: { aspect: number }) => (
        <div data-testid="cropper" data-aspect={String(aspect)} />
    ),
}));

vi.mock("@/Components/PrimaryButton", () => ({
    default: ({
        children,
        onClick,
    }: {
        children: React.ReactNode;
        onClick?: () => void;
    }) => (
        <button type="button" onClick={onClick}>
            {children}
        </button>
    ),
}));

import ImageCropper from "@/Shared/ImageCropper";

const mockImageSize = ({
    width,
    height,
}: {
    width: number;
    height: number;
}) => {
    class MockImage {
        naturalWidth = width;
        naturalHeight = height;
        onload: (() => void) | null = null;

        set src(_value: string) {
            queueMicrotask(() => this.onload?.());
        }
    }

    vi.stubGlobal("Image", MockImage);
};

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("ImageCropper", () => {
    it("usa a proporção original da imagem como padrão", async () => {
        mockImageSize({ width: 1080, height: 1350 });

        render(
            <ImageCropper
                image="data:image/jpeg;base64,instagram"
                onCropDone={vi.fn()}
                onCropCancel={vi.fn()}
            />,
        );

        await waitFor(() => {
            expect(Number(screen.getByTestId("cropper").dataset.aspect)).toBeCloseTo(
                4 / 5,
            );
        });
        expect(screen.getByLabelText("Original")).toBeChecked();
    });

    it("permite selecionar preset vertical 9:16", async () => {
        render(
            <ImageCropper
                image="data:image/jpeg;base64,story"
                onCropDone={vi.fn()}
                onCropCancel={vi.fn()}
            />,
        );

        fireEvent.click(screen.getByLabelText("9:16 Story / Reels"));

        await waitFor(() => {
            expect(Number(screen.getByTestId("cropper").dataset.aspect)).toBeCloseTo(
                9 / 16,
            );
        });
    });
});
