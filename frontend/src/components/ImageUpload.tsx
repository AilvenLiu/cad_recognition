import { useState, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import ScreenRecorder from "./recording/ScreenRecorder";
import { ScreenRecorderState } from "../types";

const baseStyle = {
  flex: 1,
  width: "80%",
  margin: "0 auto",
  minHeight: "400px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

function fileToDataURL(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

type FileWithPreview = {
  preview: string;
} & File;

interface Props {
  setReferenceImages: (
    referenceImages: string[],
    inputMode: "image" | "pdf" 
  ) => void;
}

function ImageUpload({ setReferenceImages }: Props) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [screenRecorderState, setScreenRecorderState] = useState<ScreenRecorderState>(
    ScreenRecorderState.INITIAL
  );

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } =
    useDropzone({
      maxFiles: 10,
      maxSize: 1024 * 1024 * 200,
      accept: {
        "image/png": [".png"],
        "image/jpeg": [".jpeg", ".jpg"],
        "application/pdf": [".pdf"]
      },
      onDrop: (acceptedFiles) => {
        setFiles(
          acceptedFiles.map((file: File) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          ) as FileWithPreview[]
        );

        Promise.all(acceptedFiles.map((file) => fileToDataURL(file)))
          .then((dataUrls) => {
            if (dataUrls.length > 0) {
              setReferenceImages(
                dataUrls.map((dataUrl) => dataUrl as string),
                (dataUrls[0] as string).indexOf("application/pdf") >= 0
                  ? "pdf"
                  : "image"
              );
            }
          })
          .catch((error) => {
            toast.error("Error reading files: " + error);
            console.error("Error reading files:", error);
          });
      },
      onDropRejected: (rejectedFiles) => {
        toast.error(rejectedFiles[0].errors[0].message);
      },
    });

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? {} : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragAccept, isDragReject]
  );

  return (
    <section className="container mx-auto max-w-2xl">
      {screenRecorderState === ScreenRecorderState.INITIAL && (
        <div
          {...getRootProps({ style: style as any })}
          className="bg-gradient-to-br from-blue-100 to-blue-200 border-4 border-dashed border-blue-300 rounded-lg p-8 text-center transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <svg
              className="w-16 h-16 text-blue-500"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-blue-700 text-xl font-semibold">
              将CAD文件拖拽到此处，<br />或点击上传
            </p>
            <p className="text-blue-600 text-sm">
              支持的格式: PNG, JPG, JPEG, PDF
            </p>
          </div>
        </div>
      )}
      <ScreenRecorder
        screenRecorderState={screenRecorderState}
        setScreenRecorderState={setScreenRecorderState}
        generateCode={setReferenceImages}
      />
    </section>
  );
}

export default ImageUpload;