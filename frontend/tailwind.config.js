export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF385C",
        "primary-hover": "#E63555",
        text: "#111111",
        subtext: "#717171",
        muted: "#F7F7F7",
        border: "#E5E5E5",
        bg: "#FFFFFF",
      },
      borderRadius: {
        card: "16px",
        button: "12px",
        input: "10px",
      },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.08)",
        soft: "0 2px 8px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
}
