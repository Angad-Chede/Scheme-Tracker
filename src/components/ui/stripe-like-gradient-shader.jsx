import { cn } from "@/lib/utils";
import { GradFlow } from "gradflow";

export const StripeGradientShader = ({ className }) => {
  return (
    <div
      className={cn("pointer-events-none", className)}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        transform: "scale(1)",
        transformOrigin: "top center",
      }}
    >
      <GradFlow
        config={{
          color1: { r: 165, g: 56, b: 96},
          color2: { r: 103, g: 13, b: 47 },
          color3: { r: 255, g: 255, b: 255 },
          speed: 2,
          scale: 1,
          type: "stripe",
          noise: 0.02,
        }}
      />
    </div>
  );
};