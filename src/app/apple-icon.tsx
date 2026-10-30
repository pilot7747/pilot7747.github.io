import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fbf9f5",
          position: "relative",
        }}
      >
        <svg width="112" height="112" viewBox="0 0 64 64">
          <path
            fill="#2a2420"
            d="M17 46V23.5h5.2l.4 3.7c1.9-2.8 4.9-4.3 8.6-4.3 5.8 0 9.3 3.7 9.3 10.2V46h-5.8V33.9c0-4-1.8-6-5.2-6-3.7 0-6.7 2.6-6.7 7.4V46Z"
          />
          <circle fill="#d9572b" cx="49" cy="18" r="5" />
        </svg>
      </div>
    ),
    size,
  );
}
