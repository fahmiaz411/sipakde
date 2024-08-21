"use client";
import { useState, useCallback, useEffect } from "react";
import styles from "./page.module.css";
import { useGlobalContext } from "@/context/global";
import {
  FaDownload,
  FaCheck,
  FaTimes,
  FaEdit,
  FaArchive,
  FaArrowLeft,
} from "react-icons/fa"; // Import FaArrowLeft for the back arrow icon
import { useSearchParams, useRouter } from "next/navigation"; // Import useRouter
import PDFView from "@/components/pdfview/pdfview";
import { formatDistanceToNow, format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { BaseResponse } from "@/lib/interface";

interface Comment {
  id: number;
  document_id: string;
  sender_id: number;
  sender_name: string;
  original_sender_name: string;
  date: string;
  comment: string;
}

export default function ViewPdf() {
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams(); // Use this to get the query parameters
  const router = useRouter(); // Initialize the router for navigation

  useEffect(() => {
    setIsClient(true);
  }, []);

  const pdfDetails = {
    id: searchParams.get("id") || 0,
    project_id: searchParams.get("project_id") || 0,
    title: searchParams.get("title") || "-",
    project: searchParams.get("project") || "-",
    author: searchParams.get("author") || "-",
    date: searchParams.get("date") || new Date().toLocaleDateString(),
    description: searchParams.get("description") || "-",
    link: searchParams.get("link") || "",
  };

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const { innerWidth, userData } = useGlobalContext();
  const [username, setUsername] = useState<string>(userData?.name || "");

  const handleAddComment = useCallback(async () => {
    if (newComment.trim() !== "" && username.trim() !== "") {
      const newCommentObj = {
        document_id: pdfDetails.id,
        sender_id: userData?.id,
        sender_name: username.trim(),
        comment: newComment.trim(),
      };

      const res = await fetch("/api/comments", {
        method: "POST",
        body: JSON.stringify(newCommentObj),
      });

      const result = await res.json();
      if (res.ok) {
        console.log(`Add comment successful: ${result.fileName}`);
        fetchComments();
        setNewComment("");
      } else {
        console.error(`Add comment failed: ${result.error}`);
      }
    }
  }, [newComment, username]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfDetails.link; // URL of the PDF file
    link.download =
      [pdfDetails.project, pdfDetails.author, pdfDetails.title].join(" - ") +
      ".pdf"; // Name of the downloaded file
    link.click();
  };

  const handleBack = () => {
    router.back(); // Navigate back to the previous page
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const formatted = format(date, "iiii, dd MMMM yyyy hh:mm", {
      locale: localeId,
    });

    return formatted[0].toUpperCase() + formatted.substring(1);
  };

  const formatDateComment = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const formatted = formatDistanceToNow(date, {
      includeSeconds: true,
      locale: localeId,
      addSuffix: true,
    });

    return formatted[0].toUpperCase() + formatted.substring(1);
  };

  const fetchComments = async () => {
    try {
      const query = new URLSearchParams();

      query.append("document_id", String(pdfDetails.id));

      const res = await fetch(`/api/comments?${query.toString()}`);
      if (res.status >= 400) {
        console.error("Error fetching comments:", res.status);
        return;
      }

      const json: BaseResponse<Comment[]> = await res.json();
      const c = json.data;
      setComments(c);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    isClient && (
      <div className={styles.container}>
        {/* Back button */}
        {innerWidth < 768 && (
          <button onClick={handleBack} className={styles.backButton}>
            <FaArrowLeft />
            <span style={{ marginLeft: 5 }}>Kembali</span>
          </button>
        )}

        <div className={styles.pdfContainer}>
          <PDFView
            url={pdfDetails.link}
            width={innerWidth > 768 ? 700 : (innerWidth / 100) * 70}
          />
        </div>
        <div className={styles.detailsContainer}>
          <h2 className={styles.title}>{pdfDetails.title}</h2>
          <p className={styles.detailText}>
            <strong>Pengirim:</strong> {pdfDetails.author}
          </p>
          <p className={styles.detailText}>
            <strong>Tanggal:</strong> {formatDate(pdfDetails.date)}
          </p>
          <p className={styles.detailText}>
            <strong>Project:</strong> {pdfDetails.project}
          </p>
          <p className={styles.description}>{pdfDetails.description}</p>

          {/* Comment Section */}
          <div className={styles.commentSection}>
            <h3 className={styles.commentTitle}>Tambahkan Komentar</h3>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nama Anda"
              className={styles.input}
            />
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Masukkan komentar mu..."
              className={styles.textarea}
            />
            <button onClick={handleAddComment} className={styles.button}>
              Kirim
            </button>
            <div className={styles.commentsListContainer}>
              {comments.length > 0 ? (
                <ul className={styles.commentList}>
                  {comments.map((comment, index) => (
                    <li key={index} className={styles.commentItem}>
                      <p className={styles.commentUser}>
                        <strong>{comment.sender_name}</strong>{" "}
                        <span className={styles.commentDate}>
                          {formatDateComment(comment.date)}
                        </span>
                      </p>
                      <p className={styles.commentText}>{comment.comment}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className={styles.commentList}>
                  <li className={styles.commentItem}>
                    <p className={styles.commentText}>Belum ada komentar ...</p>
                  </li>
                </ul>
              )}
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className={styles.actionsContainer}>
            <button className={styles.actionButton} onClick={handleDownload}>
              <FaDownload /> Unduh PDF
            </button>
            <button className={styles.actionButton}>
              <FaEdit /> Edit
            </button>
          </div>
        </div>
      </div>
    )
  );
}
