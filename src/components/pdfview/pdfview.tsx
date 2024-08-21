import { Document, Page, pdfjs } from "react-pdf";
import { useState, useEffect, useRef } from "react";
import { useGesture } from "@use-gesture/react";
import styles from "./pdfview.module.css";

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PdfViewerProps {
  width?: number;
  pdfUrl: string;
  containerStyle?: React.CSSProperties;
  pageWrapperStyle?: React.CSSProperties;
}

const PdfViewer = ({
  width = 700,
  pdfUrl,
  containerStyle,
  pageWrapperStyle,
}: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1);
  const pageWrapperRef = useRef<HTMLDivElement>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  useEffect(() => {
    if (pageWrapperRef.current) {
      const containerWidth = pageWrapperRef.current.clientWidth;
      const pageWidth = width; // Assuming width is the desired page width
      setScale(containerWidth / pageWidth);
    }
  }, [width, pageNumber]);

  // Gesture handling
  const bind = useGesture({
    onPinch: (state) => {
      const zoomSensitivity = 0.05; // Adjust sensitivity here
      setScale((prevScale) => {
        const newScale = prevScale * (1 + state.delta[0] * zoomSensitivity);
        return Math.max(1, Math.min(newScale, 3)); // Restrict scale between 1x and 3x
      });
    },
    onDrag: (state) => {
      if (state.active) {
        const dragSensitivity = 0.5; // Adjust sensitivity here
        const x = state.offset[0] * dragSensitivity;
        const y = state.offset[1] * dragSensitivity;
        // Apply translation during drag
        (
          state.target as HTMLDivElement
        ).style.transform = `scale(${scale}) translate(${x}px, ${y}px)`;
      }
    },
  });

  return (
    <div style={{ ...defaultContainerStyle, ...containerStyle }}>
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <div
          ref={pageWrapperRef}
          style={{
            ...defaultPageWrapperStyle,
            ...pageWrapperStyle,
            overflow: "auto", // Enable scrolling
          }}
        >
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "center",
            }}
            {...bind()}
          >
            <Page
              width={width}
              pageNumber={pageNumber}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </div>
        </div>
      </Document>
      <div className={styles.customControlsStyle}>
        <button
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber(pageNumber - 1)}
          className={styles.buttonStyle}
        >
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          Page {pageNumber} of {numPages || "--"}
        </span>
        <button
          disabled={pageNumber >= (numPages || 1)}
          onClick={() => setPageNumber(pageNumber + 1)}
          className={styles.buttonStyle}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const defaultContainerStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "800px",
  margin: "auto",
  padding: "10px",
  backgroundColor: "#f4f6f9",
};

const defaultPageWrapperStyle: React.CSSProperties = {
  overflow: "auto", // Enable scrolling
  textAlign: "center",
  marginBottom: "10px",
  position: "relative", // Ensure proper positioning for scroll and transform
  touchAction: "none", // Disable default touch actions to enable custom gestures
};

const PDFView = ({ url: pdfUrl, width }: { url: string; width: number }) => {
  const customContainerStyle = {
    backgroundColor: "#ffffff",
    border: "2px solid #3498db",
    borderRadius: "8px",
    padding: "20px",
  };

  const customPageWrapperStyle = {
    border: "1px solid #ddd",
    borderRadius: "4px",
    padding: "10px",
    backgroundColor: "#fafafa",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // Hide overflow
  };

  return (
    <div style={{ padding: "5vw", backgroundColor: "#f4f6f9" }}>
      <PdfViewer
        width={width}
        pdfUrl={pdfUrl}
        containerStyle={customContainerStyle}
        pageWrapperStyle={customPageWrapperStyle}
      />
    </div>
  );
};

export default PDFView;
