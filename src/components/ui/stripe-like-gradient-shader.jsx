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
        transform: "scale(7)",
        transformOrigin: "top center",
      }}
    >
      <GradFlow
        config={{
          color1: { r: 245, g: 26, b: 84 },
          color2: { r: 255, g: 206, b: 227 },
          color3: { r: 255, g: 255, b: 255 },
          speed: 2,
          scale: 2.5,
          type: "stripe",
          noise: 0.01,
        }}
      />
    </div>
  );
};