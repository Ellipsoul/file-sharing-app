import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import { FileUploader } from "react-drag-drop-files";
import { Button } from "@mui/material";
import { BallTriangle } from "react-loader-spinner";

interface UploadFileSectionProps {
  file: File | null;
  setFile: (file: File | null) => void;
  clearFile: () => void;
  checkBeforeUploadFile: () => Promise<void>;
  uploadingFile: boolean;
  theme: string | undefined;
  uploadFileProgress: number;
}

// Left side for uploading a file
export default function UploadFileSection({
  file, setFile, clearFile, checkBeforeUploadFile, uploadingFile, theme, uploadFileProgress,
}: UploadFileSectionProps) {
  // Runs whenever a file is uploaded
  const handleFileDrop = (file: File) => setFile(file);

  // Convert bytes number to a nicer string
  function niceBytes(n: number): string {
    const units = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let l = 0;
    while (n >= 1024 && ++l) {
      n = n/1024;
    }
    return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + units[l]);
  }

  return (
    <section className="
          bg-neutral-100 dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-600
          flex flex-col justify-start items-stretch gap-y-2 md:gap-y-4 w-full md:w-9/20
          p-2 md:p-4 drop-shadow-xl"
    >
      {/* Header */}
      <header className="
          font-heading font-semibold text-3xl md:text-4xl text-black dark:text-white text-center">
          Upload File
      </header>
      {/* Show a loader while file is uploading */}
      { uploadingFile ?
        <div className="w-full h-full flex flex-col justify-center items-center gap-y-10">
          <BallTriangle
            height="100"
            width="100"
            ariaLabel="Loading Files"
            color={theme === "dark" ? "white" : "black"}
          />
          <span className="font-slogan text-4xl">{uploadFileProgress}%</span>
        </div> :
        <FileUploader
          name="file"
          label={file?.name || "No file selected"}
          file={file}
          handleChange={handleFileDrop}
          classes={
            `file-uploader ${file ?
              "border-green-400 dark:border-green-700":
              "border-zinc-300 dark:border-zinc-500" }`}
          hoverTitle=" "
        >
          { file ?
            <div className="
              flex flex-col h-full justify-evenly items-center p-3 sm:p-6 md:p-12
              text-lg md:text-xl lg:text-2xl text-center font-slogan font-light
              text-black dark:text-white">
              <span className="text-7xl">
                <InsertDriveFileRoundedIcon fontSize="inherit" />
              </span>
              <div className="w-full break-all">{file.name}</div>
              <div className="w-full">{`Size: ${niceBytes(file.size)}`}</div>
            </div> :
            <div className="
            flex flex-col h-full justify-evenly items-center p-6 sm:p-12
            text-2xl md:text-3xl lg:text-4xl text-center font-slogan font-light
            text-black dark:text-white">
              <div className="">Drag&apos;n&apos;Drop File Here</div>
              <div className="">Max Size: 100MB</div>
            </div>
          }
        </FileUploader>
      }
      {/* Clear and Upload File Buttons */}
      <div className="flex flex-row justify-evenly items-center px-2 gap-4">
        {/* Clear */}
        <Button className="
            h-16 md:h-24 px-4 py-2 rounded-xl flex flex-row grow
          bg-red-600 hover:bg-red-500"
        variant="contained"
        onClick={clearFile}
        disabled={!file}>
          <span
            className={ `${file ? "text-white" :
              "text-neutral-100"} text-2xl md:text-3xl block`}
          >
              Clear
          </span>
        </Button>
        {/* Upload */}
        <Button
          className="
              h-16 md:h-24 px-4 py-2 rounded-xl
              flex flex-row grow-2 bg-green-500 hover:bg-green-400"
          variant="contained"
          disabled={!file}
          onClick={checkBeforeUploadFile}
        >
          <span
            className={`${file ? "text-white" :
              "text-neutral-100"} text-2xl md:text-3xl block`}
          >
              Upload
          </span>
        </Button>
      </div>
    </section>
  );
};
