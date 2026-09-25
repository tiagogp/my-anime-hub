import { ImageResponse } from "next/og"

export const runtime = "edge"

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#0d0d0d",
          color: "#f1eee7",
        }}
      >
        <div style={{ display: "flex", fontSize: 30 }}>MyAnimeHub</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 76, lineHeight: 1.1, maxWidth: 980 }}>
            Your next favorite story starts here.
          </div>
          <div style={{ fontSize: 28, color: "#a8a5a0" }}>
            Anime · Manga · Rankings · Weekly schedule
          </div>
        </div>
        <div
          style={{
            display: "flex",
            borderTop: "1px solid #353535",
            paddingTop: 24,
            fontSize: 22,
            color: "#a8a5a0",
          }}
        >
          myanimehub.tiagogp.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
