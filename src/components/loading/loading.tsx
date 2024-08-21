import ReactLoading from "react-loading";
export default function FullPageLoading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#fff",
      }}
    >
      <ReactLoading delay={0} type="bubbles" color="#2c3e50" />
    </div>
  );
}
